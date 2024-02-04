import { Response } from "express";
import { AppConfig } from "../../config/AppConfig";
import {
  getSession,
  sendControlResponse,
  sendErrResponse,
  sendMsgResponse,
} from "../../Server";
import { AgentResponse, QUERY_STATUS } from "../../structs/ai/AIStructs";
import {
  AUTHOR_ROLE,
  CONTROL_SIGNAL,
  Message,
  PostRequest,
  REQUEST_STATUS,
  SessionId,
} from "../../structs/api/APIStructs";
import { Session } from "../../server/Sessions";

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
async function query(
  session: Session,
  message: Message,
  res: Response
): Promise<SessionId | Error | void> {
  // Validate the request message
  const validationResult = validateRequestMessage(message);
  if (!validationResult.valid) {
    throw new Error(validationResult.err);
  }
  // should be true at this point, but needed for type checking
  if (message.content === undefined)
    throw new Error("Invalid post request. Message content is undefined.");

  try {
    // setup chat agent if not already initialized
    if (session.chatAgent === undefined) await session.setupChatAgent();

    // confirm chat agent is available and enabled
    if (session.chatAgent && session.chatAgent.isChatEnabled()) {
      // prepare input to query the chat agent
      const agentInput = session.chatAgent.prepareInput(message.content);
      // create a response handler which which will handle the responses from the chat agent
      const responseHandler = getResponseHandler(session.id, res);
      // query the chat agent with the user query and the response handler
      await session.chatAgent.query(agentInput, responseHandler);
    } else {
      // if chat agent is not available or chat is not enabled, send a message to the client
      throw new Error(
        session.chatAgent ? "Chat is disabled" : "Chat agent is not available"
      );
    }
  } catch (err: any) {
    throw err instanceof Error ? err : new Error(err);
  }
}

// utility method to get a response handler
function getResponseHandler(sessionId: SessionId, res: Response) {
  const handler =
    (sessionId: SessionId, res: Response) => (agentResponse: AgentResponse) => {
      // check the status of the response
      switch (agentResponse.status) {
        case QUERY_STATUS.PENDING:
          sendControlResponse(
            CONTROL_SIGNAL.GENERATION_PENDING,
            REQUEST_STATUS.SUCCESS,
            res
          );
          break;
        case QUERY_STATUS.STARTED:
          sendControlResponse(
            CONTROL_SIGNAL.GENERATION_STARTED,
            REQUEST_STATUS.SUCCESS,
            res
          );
          break;
        case QUERY_STATUS.ERROR:
          sendErrResponse(agentResponse.response, res);
          sendControlResponse(
            CONTROL_SIGNAL.GENERATION_ERROR,
            REQUEST_STATUS.FAIL,
            res
          );
          res.end("ERROR");
          break;
        case QUERY_STATUS.SUCCESS:
          const queryResult = agentResponse.response;
          // send the response to the client
          if (queryResult !== undefined && queryResult.output !== undefined) {
            sendMsgResponse(sessionId, getNewMessage(queryResult.output), res);
            // TESTING: until we have streaming
            sendControlResponse(
              CONTROL_SIGNAL.GENERATION_DONE,
              REQUEST_STATUS.SUCCESS,
              res
            );
            // since we don't have stream we end the response after sending the result
            res.end("OK");
          }
          break;
        case QUERY_STATUS.DONE:
          sendControlResponse(
            CONTROL_SIGNAL.GENERATION_DONE,
            REQUEST_STATUS.SUCCESS,
            res
          );
          break;
        default:
          sendErrResponse(
            "Unknown QUERY_STATUS type from the Agent: " + agentResponse.status,
            res
          );
          break;
      }
    };
  return handler(sessionId, res);
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

function getNewMessage(response: string): Message {
  const message: Message = {
    id: crypto.randomUUID(),
    contentType: "text/plain",
    content: response,
    author: { role: AUTHOR_ROLE.ASSISTANT },
  };
  return message;
}

export const ConversationEndpoints = {
  query,
};
