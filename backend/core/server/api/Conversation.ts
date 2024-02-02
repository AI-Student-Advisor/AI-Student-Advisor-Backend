import { Response } from "express";
import { AppConfig } from "../../config/AppConfig";
import {
  getSession,
  sendControlResponse,
  sendErrResponse,
  sendMsgResponse,
} from "../Server";
import { AgentResponse, QUERY_STATUS } from "../../structs/ai/AIStructs";
import {
  AUTHOR_ROLE,
  CONTROL_SIGNAL,
  Message,
  PostRequest,
} from "../../structs/api/APIStructs";

/**
 * Query the chat agent with the user query and return the response to the client
 * Steps:
 * 1. Validate the request message
 * 2. Get session if ID provided, otherwise create a new session
 * 3. Confirm chat agent is available and enabled
 * 4. Prepare input to query the chat agent
 * 5. Create a response handler which which will handle the responses from the chat agent
 * 6. Query the chat agent with the user query and the response handler
 * @param params
 * @param res
 * @returns
 */
export async function query(params: PostRequest, res: Response) {
  // Validate the request message
  const validationResult = validateRequestMessage(params.message);
  if (!validationResult.valid) {
    sendErrResponse(validationResult.err, res);
    res.end(); // end the response
    return;
  }
  // should be true at this point, but needed for type checking
  if (params.message.content === undefined) return;

  // Get session if ID provided, otherwise create a new session
  const session = getSession(params.id, res);
  // confirm we have a valid session
  if (session === undefined) {
    sendErrResponse("Session not found", res);
    res.end();
    return;
  }

  // setup chat agent if not already initialized
  if (session.chatAgent === undefined) await session.setupChatAgent();

  // confirm chat agent is available and enabled
  if (session.chatAgent && session.chatAgent.isChatEnabled()) {
    // prepare input to query the chat agent
    const agentInput = session.chatAgent.prepareInput(params.message.content);
    // create a response handler which which will handle the responses from the chat agent
    const responseHandler = getResponseHandler(res);
    // query the chat agent with the user query and the response handler
    session.chatAgent.query(agentInput, responseHandler);
  } else {
    // if chat agent is not available or chat is not enabled, send a message to the client
    const err = session.chatAgent
      ? "Chat is disabled"
      : "Chat agent is not available";
    sendErrResponse(err, res);
  }
}

// utility method to get a response handler
function getResponseHandler(res: Response) {
  const handler = (res: Response) => (agentResponse: AgentResponse) => {
    // check the status of the response
    switch (agentResponse.status) {
      case QUERY_STATUS.PENDING:
        sendControlResponse(CONTROL_SIGNAL.GENERATION_PENDING, res);
        break;
      case QUERY_STATUS.STARTED:
        sendControlResponse(CONTROL_SIGNAL.GENERATION_STARTED, res);
        break;
      case QUERY_STATUS.ERROR:
        sendErrResponse(agentResponse.response, res);
        break;
      case QUERY_STATUS.SUCCESS:
        sendMsgResponse(agentResponse.response, res);
        break;
      case QUERY_STATUS.DONE:
        sendControlResponse(CONTROL_SIGNAL.GENERATION_DONE, res);
        break;
      default:
        sendErrResponse(
          "Unknown QUERY_STATUS type from the Agent: " + agentResponse.status,
          res
        );
        break;
    }
  };
  return handler(res);
}

function validateRequestMessage(message: Message | undefined): {
  valid: boolean;
  err: string;
} {
  let valid = true;
  if (message === undefined) {
    return { valid: false, err: "Invalid post request. Message is undefined." };
  } else if (
    message.content === undefined ||
    message.content === "" ||
    message.content.trim().length === 0
  ) {
    return { valid: false, err: "Empty message content" };
  } else if (message.content.length > AppConfig.api.message_max_length) {
    return {
      valid: false,
      err: `Message content exceeds the limit of ${AppConfig.api.message_max_length} characters`,
    };
  }
  return { valid, err: "" };
}

function getNewMessage(response: string, message_id: string): Message {
  const message: Message = {
    id: message_id,
    contentType: "text/plain",
    content: response,
    author: { role: AUTHOR_ROLE.ASSISTANT },
  };
  return message;
}
