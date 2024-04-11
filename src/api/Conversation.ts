import type { EndpointHandlerContext } from "./types/EndpointHandler.js";
import { QUERY_STATUS } from "/ai/AIStructs.js";
import { ChatAgent } from "/ai/chat-agents/ChatAgent.js";
import { ChatSession } from "/ai/chat-session/ChatSession.js";
import type { Message } from "/api/interfaces/Common.js";
import type { PostResponse } from "/api/interfaces/Conversation.js";
import {
  PostRequestSchema,
  PostResponseSchema
} from "/api/schemas/Conversation.js";
import { auth } from "/auth/Middleware.js";
import type { AuthorizedRequest } from "/auth/types/AuthorizedRequest.js";
import { HistorySessionModelSchema } from "/model/schemas/HistorySessionModel.js";
import { HistorySessionsModelSchema } from "/model/schemas/HistorySessionsModel.js";
import { HTTP_BAD_REQUEST, HTTP_OK } from "/utilities/Constants.js";
import { parseError } from "/utilities/ErrorParser.js";
import { HTTPError } from "/utilities/HTTPError.js";
import { logger } from "/utilities/Log.js";
import crypto from "crypto";
import { json, Request, Response } from "express";
import { z, ZodError, ZodType } from "zod";

export function handleConversation({
  app,
  chatSessionManager,
  database,
  jwt
}: EndpointHandlerContext) {
  const loggerContext = "ConversationAPIHandler";
  const endpoint = "/api/conversation";

  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );

  app.use(endpoint, auth(jwt));
  logger.debug(
    { context: loggerContext },
    "JWT authorization middleware enabled for endpoint %s",
    endpoint
  );

  app.post(endpoint, handleConversationPost);
  logger.debug(
    { context: loggerContext },
    "POST handler registered for endpoint %s",
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
      const { message, id } = PostRequestSchema.parse(request.body);
      logger.info({ context: loggerContext }, "Request received: %o", {
        id,
        message
      });

      const authorizedRequest = request as AuthorizedRequest;
      const { username } = authorizedRequest.auth;

      // Get record from database
      const historySessionsPath = `/user/${username}/chatHistory/historySessions`;
      const historySessionsRecord = await getRecordFromDatabase(
        historySessionsPath,
        HistorySessionsModelSchema
      );

      const historySessionPath = `/user/${username}/chatHistory/historySession`;
      const historySessionRecord = await getRecordFromDatabase(
        historySessionPath,
        HistorySessionModelSchema
      );

      const sessionIdExist = id
        ? historySessionsRecord[id] !== undefined
        : false;

      if (id && !sessionIdExist) {
        // If chat session ID is specified, and it does not exist in the database
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }
      // else: if chat session ID is not specified, or it exists in the database

      // Get chat session if ID provided, otherwise create a new chat-session
      const session = await chatSessionManager.getSession(id);
      logger.debug(
        { context: loggerContext },
        "Session retrieved with ID %s",
        session.id
      );

      // Create a new record in the database if ID does not exist
      if (!sessionIdExist) {
        historySessionsRecord[session.id] = {
          id: session.id,
          dateTime: new Date().toISOString(),
          title: "New Chat"
        };
        historySessionRecord[session.id] = {
          messages: []
        };
        await database.set(
          historySessionsPath,
          historySessionsRecord,
          HistorySessionsModelSchema
        );
        await database.set(
          historySessionPath,
          historySessionRecord,
          HistorySessionModelSchema
        );
      }

      historySessionRecord[session.id].messages.push(message);
      await database.set(
        historySessionPath,
        historySessionRecord,
        HistorySessionModelSchema
      );

      let finalMessage: Message | null = null;
      for await (const postResponse of query(session, message)) {
        writeSseMessage(response, JSON.stringify(postResponse));
        if (
          postResponse.status === "success" &&
          postResponse.type === "message"
        ) {
          finalMessage = postResponse.message;
        }
      }
      if (finalMessage) {
        historySessionRecord[session.id].messages.push(finalMessage);
        await database.set(
          historySessionPath,
          historySessionRecord,
          HistorySessionModelSchema
        );
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

  async function getRecordFromDatabase<T extends ZodType>(
    path: string,
    schema: T
  ): Promise<z.infer<T>> {
    let records = {};
    try {
      records = await database.get(path, schema);
    } catch (e) {
      if (e instanceof ZodError) {
        records = schema.parse({});
      } else {
        throw e;
      }
    }
    return records;
  }
}

async function* query(
  chatSession: ChatSession,
  message: Message
): AsyncGenerator<PostResponse> {
  if (!chatSession.chatAgent.isChatEnabled()) {
    yield PostResponseSchema.parse({
      status: "fail",
      reason: "Chat agent is not available"
    });
    // Dummy return: will be ignored by the for-loop
    return {};
  }

  const agentInput = ChatAgent.prepareInput(message.content, chatSession.id);
  // Query the chat agent with the user query
  for await (const agentResponse of chatSession.chatAgent.query(agentInput)) {
    switch (agentResponse.status) {
      case QUERY_STATUS.PENDING:
        yield PostResponseSchema.parse({
          status: "success",
          id: chatSession.id,
          type: "control",
          control: {
            signal: "generation-pending"
          }
        });
        break;
      case QUERY_STATUS.STARTED:
        yield PostResponseSchema.parse({
          status: "success",
          id: chatSession.id,
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
          id: chatSession.id,
          type: "message",
          message: {
            id: crypto.randomUUID(),
            username: "",
            content: agentResponse.response.output,
            author: {
              role: "assistant"
            }
          }
        });
        break;
      case QUERY_STATUS.DONE:
        yield PostResponseSchema.parse({
          status: "success",
          id: chatSession.id,
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
