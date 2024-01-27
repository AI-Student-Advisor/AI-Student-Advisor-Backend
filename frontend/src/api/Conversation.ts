import {
    PostRequest,
    PostResponseFail,
    PostResponseSuccess
} from "/src/api/interfaces/Conversation.ts";
import { Message } from "/src/api/interfaces/StructMessage.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type SseOnEventCallbackType = (
    response: PostResponseFail | PostResponseSuccess
) => void;

// TODO: Now using the mock server. To be switched to the real backend.
export async function fetchConversation(
    message: Message,
    onPush: SseOnEventCallbackType
) {
    const request: PostRequest = {
        message: message
    };

    await fetchEventSource("http://localhost:5174", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        openWhenHidden: true,
        body: JSON.stringify(request),
        onopen: async (response) => {
            const contentType = response.headers.get("Content-Type");
            if (
                Boolean(contentType) &&
                // eslint-disable-next-line no-magic-numbers
                contentType!.indexOf("application/json") >= 0
            ) {
                throw await response.json();
            }
        },
        onerror: (error) => {
            throw error;
        },
        onmessage: async (event) => {
            const { data } = event;
            if (data) {
                onPush(JSON.parse(data));
            }
        }
    });
}
