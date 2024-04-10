import {
  GetRequestSchema,
  GetResponseSchema
} from "./schemas/HistorySessions.js";
import type { EndpointHandlerContext } from "/api/types/EndpointHandler.js";
import { auth } from "/auth/Middleware.js";
import type { AuthorizedRequest } from "/auth/types/AuthorizedRequest.js";
import { HistorySessionsModelSchema } from "/model/schemas/HistorySessionsModel.js";
import { parseError } from "/utilities/ErrorParser.js";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";

const CHAT_HISTORY_SESSION_ENTRY_LIMIT = 50;

export function handleHistorySessions({
  app,
  database,
  jwt
}: EndpointHandlerContext) {
  const loggerContext = "HistorySessionsAPIHandler";
  const endpoint = "/api/history-sessions";

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

  app.get(endpoint, handleHistorySessionsGet);
  logger.debug(
    { context: loggerContext },
    "GET handler registered endpoint %s",
    endpoint
  );

  async function handleHistorySessionsGet(
    request: Request,
    response: Response
  ) {
    const loggerContext = "HistorySessionsGETHandler";

    request = request as AuthorizedRequest;
    // TODO: Add support to user-specific history

    try {
      const path = "chatHistory/historySessions";

      const parsedRequest = GetRequestSchema.parse({
        offset: request.query.offset
          ? parseInt(String(request.query.offset))
          : undefined,
        limit: request.query.limit
          ? parseInt(String(request.query.limit))
          : undefined
      });

      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const offset = parsedRequest.offset ?? 0;
      const limit = parsedRequest.limit ?? CHAT_HISTORY_SESSION_ENTRY_LIMIT;
      logger.debug(
        { context: loggerContext },
        "After filling default values for request: %o",
        { offset, limit }
      );

      const records = await database.get(path, HistorySessionsModelSchema);

      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        records
      );

      const values = Object.values(records);
      const items = values.slice(offset, offset + limit);
      logger.debug(
        { context: loggerContext },
        "Items to be returned: %o",
        items
      );

      const parsedResponse = GetResponseSchema.parse({
        status: "success",
        total: values.length,
        limit: items.length,
        items: items
      });

      response.json(parsedResponse);
    } catch (error) {
      const { reason, statusCode } = parseError(error);
      const errorResponseBody = GetResponseSchema.parse({
        status: "fail",
        reason: reason
      });
      response.status(statusCode);
      response.json(errorResponseBody);
    } finally {
      response.end();
    }
  }
}
