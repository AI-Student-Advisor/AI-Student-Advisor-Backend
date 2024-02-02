import { fetchEventSource } from "@microsoft/fetch-event-source";
import { AppConfig } from "../../config/AppConfig";
import {
  Control,
  Message,
  PostRequest,
  PostResponseControl,
  PostResponseFail,
  PostResponseSuccess,
  REQUEST_STATUS,
  RESPONSE_TYPE,
} from "../../structs/api/APIStructs";

const port = AppConfig.api.port || 3000;
const apiEndpoint = "/api/conversation";

export function runConversationTest() {
  console.log("ConversationEndpointTest - Running");
  const testQuery =
    "What courses should I take if I am interested in artificial intelligence?";
  sendMessageHandler(testQuery);
}

function sendMessageHandler(text: string) {
  const message: Message = {
    id: crypto.randomUUID(),
    contentType: "text/plain",
    content: text,
    author: {
      role: "user",
    },
  };

  void sendMessage({ message: message }, handleResponse);
}

type SseOnPushCallback = (
  response: PostResponseFail | PostResponseSuccess
) => void;

async function sendMessage(
  request: PostRequest,
  onPush: SseOnPushCallback,
  signal?: AbortSignal
) {
  await fetchEventSource(`${port}${apiEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: signal,
    openWhenHidden: true,
    body: JSON.stringify(request),
    async onopen(response: Response) {
      const contentType = response.headers.get("Content-Type");
      if (
        Boolean(contentType) &&
        // eslint-disable-next-line no-magic-numbers
        contentType!.indexOf("application/json") >= 0
      ) {
        throw await response.json();
      }
    },
    onerror(error: Error) {
      throw error;
    },
    onmessage(event: any) {
      const { data } = event;
      if (data) {
        onPush(JSON.parse(data));
      }
    },
  });
}

function handleResponse(
  response: PostResponseFail | PostResponseSuccess | PostResponseControl
) {
  if (response.type === RESPONSE_TYPE.MESSAGE) {
    switch (response.status) {
      case REQUEST_STATUS.SUCCESS:
        const successResponse = response as PostResponseSuccess;
        handleMessageResponse(successResponse.message?.content);
        break;
      case REQUEST_STATUS.FAIL:
        const failResponse = response as PostResponseFail;
        console.error(`Request failed: ${failResponse.reason}`);
        break;
      default:
        console.error(`Unknown response status ${response.status}`);
    }
  } else if (response.type === RESPONSE_TYPE.CONTROL) {
    const controlResponse = response as PostResponseControl;
    handleControlResponse(controlResponse.control);
  } else {
    console.error(`Unknown response type ${response.type}`);
  }
}

function handleMessageResponse(message?: string) {
  console.log(`Message received: ${message}`);
}

function handleControlResponse(control: Control) {
  switch (control.signal) {
    case "generation-done":
    case "generation-error":
      console.log(`Control received: ${control.signal}`);
      break;
    default:
      console.error(`Unknown control signal: ${control.signal}`);
  }
}
