import {
  DeleteRequestSchema,
  DeleteResponseSchema,
  GetRequestSchema,
  GetResponseSchema,
  PatchRequestSchema,
  PatchResponseSchema
} from "./schemas/HistorySession.js";
import type { EndpointHandlerContext } from "/api/types/EndpointHandler.js";
import { HistorySessionModelSchema } from "/model/schemas/HistorySessionModel.js";
import { HistorySessionsModelSchema } from "/model/schemas/HistorySessionsModel.js";
import { HTTP_BAD_REQUEST } from "/utilities/Constants.js";
import { parseError } from "/utilities/ErrorParser.js";
import { HTTPError } from "/utilities/HTTPError.js";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";

export function handleHistorySession({
  app,
  database
}: EndpointHandlerContext) {
  const loggerContext = "HistorySessionAPIHandler";
  const endpoint = "/api/history-session/:id";

  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );

  app.get(endpoint, handleHistorySessionsGet);
  logger.debug(
    { context: loggerContext },
    "GET handler registered for endpoint %s",
    endpoint
  );

  app.patch(endpoint, handleHistorySessionsPatch);
  logger.debug(
    { context: loggerContext },
    "PATCH handler registered for endpoint %s",
    endpoint
  );

  app.delete(endpoint, handleHistorySessionsDelete);
  logger.debug(
    { context: loggerContext },
    "DELETE handler registered for endpoint %s",
    endpoint
  );

  async function handleHistorySessionsGet(
    request: Request,
    response: Response
  ) {
    try {
      const loggerContext = "HistorySessionGETHandler";
      const path = "chatHistory/historySession";

      const parsedRequest = GetRequestSchema.parse(request.params);
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const records = await database.get(path, HistorySessionModelSchema);
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        records
      );

      const session = records[parsedRequest.id];
      if (!session) {
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }

      const parsedResponse = GetResponseSchema.parse({
        status: "success",
        messages: session.messages
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

  async function handleHistorySessionsPatch(
    request: Request,
    response: Response
  ) {
    try {
      const loggerContext = "HistorySessionPATCHHandler";
      const historySessionsPath = "chatHistory/historySessions";

      const parsedRequest = PatchRequestSchema.parse({
        ...request.params,
        ...request.body
      });
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const historySessionsRecords = await database.get(
        historySessionsPath,
        HistorySessionsModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        historySessionsRecords
      );

      if (!historySessionsRecords[parsedRequest.id]) {
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }

      historySessionsRecords[parsedRequest.id].title = parsedRequest.name;
      await database.set(
        historySessionsPath,
        historySessionsRecords,
        HistorySessionsModelSchema
      );

      const parsedResponse = PatchResponseSchema.parse({
        status: "success"
      });
      response.json(parsedResponse);
    } catch (error) {
      const { reason, statusCode } = parseError(error);
      const errorResponseBody = PatchResponseSchema.parse({
        status: "fail",
        reason: reason
      });
      response.status(statusCode);
      response.json(errorResponseBody);
    } finally {
      response.end();
    }
  }

  async function handleHistorySessionsDelete(
    request: Request,
    response: Response
  ) {
    try {
      const loggerContext = "HistorySessionDELETEHandler";
      const historySessionsPath = "chatHistory/historySessions";
      const historySessionPath = "chatHistory/historySession";

      const parsedRequest = DeleteRequestSchema.parse({
        ...request.params,
        ...request.body
      });
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const historySessionsRecords = await database.get(
        historySessionsPath,
        HistorySessionsModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        historySessionsRecords
      );

      if (!historySessionsRecords[parsedRequest.id]) {
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }
      delete historySessionsRecords[parsedRequest.id];
      await database.set(
        historySessionsPath,
        historySessionsRecords,
        HistorySessionsModelSchema
      );

      const historySessionRecords = await database.get(
        historySessionPath,
        HistorySessionModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        historySessionRecords
      );

      if (historySessionRecords[parsedRequest.id]) {
        delete historySessionRecords[parsedRequest.id];
        await database.set(
          historySessionPath,
          historySessionRecords,
          HistorySessionModelSchema
        );
      }

      const parsedResponse = DeleteResponseSchema.parse({
        status: "success"
      });
      response.json(parsedResponse);
    } catch (error) {
      const { reason, statusCode } = parseError(error);
      const errorResponseBody = DeleteResponseSchema.parse({
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
