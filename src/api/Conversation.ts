import type { EndpointHandlerContext } from "./types/EndpointHandler.js";
import { QUERY_STATUS } from "/ai/AIStructs.js";
import { ChatAgent } from "/ai/chat-agents/ChatAgent.js";
import type { Message } from "/api/interfaces/Common.js";
import type { PostResponse } from "/api/interfaces/Conversation.js";
import {
  PostRequestSchema,
  PostResponseSchema
} from "/api/schemas/Conversation.js";
import { Session } from "/session/Session.js";
import { HTTP_OK } from "/utilities/Constants.js";
import { parseError } from "/utilities/ErrorParser.js";
import { logger } from "/utilities/Log.js";
import crypto from "crypto";
import { json, Request, Response } from "express";

export function handleConversation({
  app,
  sessionManager
}: EndpointHandlerContext) {
  const loggerContext = "ConversationAPIHandler";
  const endpoint = "/api/conversation";

  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );

  app.post(endpoint, handleConversationPost);
  logger.debug(
    { context: loggerContext },
    "POST handler registered endpoint %s",
    endpoint
  );

  // This function should not throw an error: all errors have to be handled here
  //  and converted to an error response to be sent to the frontend.
  async function handleConversationPost(request: Request, response: Response) {
    const loggerContext = "ConversationPOSTHandler";

    // Set up the response headers
    response.writeHead(HTTP_OK, {
      "Content-Type": "text/event-stream",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache"
    });
    logger.debug({ context: loggerContext }, "SSE header written");

    response.on("close", () => {
      logger.info({ context: loggerContext }, "Client closed SSE connection");
      response.end();
    });

    try {
      const { id, message } = PostRequestSchema.parse(request.body);
      logger.info({ context: loggerContext }, "Request received: %o", {
        id,
        message
      });

      // Get session if ID provided, otherwise create a new session
      const session = await sessionManager.getSession(id);
      logger.debug(
        { context: loggerContext },
        "Session retrieved with ID %s",
        session.id
      );

      for await (const postResponse of query(session, message)) {
        writeSseMessage(response, JSON.stringify(postResponse));
      }
    } catch (error) {
      const { reason } = parseError(error);
      const errorResponseBody = PostResponseSchema.parse({
        status: "fail",
        reason: reason
      });
      writeSseMessage(response, JSON.stringify(errorResponseBody));
    } finally {
      response.end();
    }
  }
}

async function* query(
  session: Session,
  message: Message
): AsyncGenerator<PostResponse> {
  if (!session.chatAgent.isChatEnabled()) {
    yield PostResponseSchema.parse({
      status: "fail",
      reason: "Chat agent is not available"
    });
    // Dummy return: will be ignored by the for-loop
    return {};
  }

  const agentInput = ChatAgent.prepareInput(message.content, session.id);
  // Query the chat agent with the user query and the response handler
  for await (const agentResponse of session.chatAgent.query(agentInput)) {
    switch (agentResponse.status) {
      case QUERY_STATUS.PENDING:
        yield PostResponseSchema.parse({
          status: "success",
          id: session.id,
          type: "control",
          control: {
            signal: "generation-pending"
          }
        });
        break;
      case QUERY_STATUS.STARTED:
        yield PostResponseSchema.parse({
          status: "success",
          id: session.id,
          type: "control",
          control: {
            signal: "generation-started"
          }
        });
        break;
      case QUERY_STATUS.ERROR:
        yield PostResponseSchema.parse({
          status: "fail",
          reason: String(agentResponse.error)
        });
        break;
      case QUERY_STATUS.SUCCESS:
        yield PostResponseSchema.parse({
          status: "success",
          id: session.id,
          type: "message",
          message: {
            id: crypto.randomUUID(),
            content: agentResponse.response,
            author: {
              role: "assistant"
            }
          }
        });
        break;
      case QUERY_STATUS.DONE:
        yield PostResponseSchema.parse({
          status: "success",
          id: session.id,
          type: "control",
          control: {
            signal: "generation-done"
          }
        });
        break;
    }
  }

  // Dummy return: will be ignored by the for-loop
  return {};
}

function writeSseMessage(response: Response, data: string) {
  response.write("event: message\n");
  response.write(`data: ${data}\n`);
  response.write("\n\n");
}
