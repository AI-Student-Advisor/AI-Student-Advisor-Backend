import {
  DeleteRequestSchema,
  DeleteResponseSchema,
  GetRequestSchema,
  GetResponseSchema,
  PatchRequestSchema,
  PatchResponseSchema
} from "./schemas/HistorySession.js";
import type { EndpointHandlerContext } from "/api/types/EndpointHandler.js";
import { auth } from "/auth/Middleware.js";
import type { AuthorizedRequest } from "/auth/types/AuthorizedRequest.js";
import { HistorySessionModelSchema } from "/model/schemas/HistorySessionModel.js";
import { HistorySessionsModelSchema } from "/model/schemas/HistorySessionsModel.js";
import { HTTP_BAD_REQUEST } from "/utilities/Constants.js";
import { parseError } from "/utilities/ErrorParser.js";
import { HTTPError } from "/utilities/HTTPError.js";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";
import { z, ZodError, ZodType } from "zod";

export function handleHistorySession({
  app,
  database,
  jwt
}: EndpointHandlerContext) {
  const loggerContext = "HistorySessionAPIHandler";
  const endpoint = "/api/history-session/:id";

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

  app.get(endpoint, handleHistorySessionGet);
  logger.debug(
    { context: loggerContext },
    "GET handler registered for endpoint %s",
    endpoint
  );

  app.patch(endpoint, handleHistorySessionPatch);
  logger.debug(
    { context: loggerContext },
    "PATCH handler registered for endpoint %s",
    endpoint
  );

  app.delete(endpoint, handleHistorySessionDelete);
  logger.debug(
    { context: loggerContext },
    "DELETE handler registered for endpoint %s",
    endpoint
  );

  async function handleHistorySessionGet(request: Request, response: Response) {
    const loggerContext = "HistorySessionGETHandler";

    try {
      const parsedRequest = GetRequestSchema.parse(request.params);
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const authorizedRequest = request as AuthorizedRequest;
      const { username } = authorizedRequest.auth;

      const path = `/user/${username}/chatHistory/historySession`;
      const record = await getRecordFromDatabase(
        path,
        HistorySessionModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        record
      );

      const session = record[parsedRequest.id];
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

  async function handleHistorySessionPatch(
    request: Request,
    response: Response
  ) {
    try {
      const loggerContext = "HistorySessionPATCHHandler";

      const parsedRequest = PatchRequestSchema.parse({
        ...request.params,
        ...request.body
      });
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const authorizedRequest = request as AuthorizedRequest;
      const { username } = authorizedRequest.auth;

      const path = `/user/${username}/chatHistory/historySessions`;
      const record = await getRecordFromDatabase(
        path,
        HistorySessionsModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        record
      );

      if (!record[parsedRequest.id]) {
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }

      record[parsedRequest.id].title = parsedRequest.name;
      await database.set(path, record, HistorySessionsModelSchema);

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

  async function handleHistorySessionDelete(
    request: Request,
    response: Response
  ) {
    try {
      const loggerContext = "HistorySessionDELETEHandler";

      const parsedRequest = DeleteRequestSchema.parse({
        ...request.params,
        ...request.body
      });
      logger.info(
        { context: loggerContext },
        "Request received: %o",
        parsedRequest
      );

      const authorizedRequest = request as AuthorizedRequest;
      const { username } = authorizedRequest.auth;

      const historySessionsPath = `/user/${username}/chatHistory/historySessions`;
      const historySessionsRecord = await getRecordFromDatabase(
        historySessionsPath,
        HistorySessionsModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        historySessionsRecord
      );

      if (!historySessionsRecord[parsedRequest.id]) {
        throw new HTTPError(HTTP_BAD_REQUEST, "Invalid chat session ID");
      }
      delete historySessionsRecord[parsedRequest.id];
      await database.set(
        historySessionsPath,
        historySessionsRecord,
        HistorySessionsModelSchema
      );

      const historySessionPath = `/user/${username}/chatHistory/historySession`;
      const historySessionRecord = await getRecordFromDatabase(
        historySessionPath,
        HistorySessionModelSchema
      );
      logger.debug(
        { context: loggerContext },
        "Retrieved from database: %o",
        historySessionRecord
      );

      if (historySessionRecord[parsedRequest.id]) {
        delete historySessionRecord[parsedRequest.id];
        await database.set(
          historySessionPath,
          historySessionRecord,
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
  async function getRecordFromDatabase<T extends ZodType>(
    path: string,
    schema: T
  ): Promise<z.infer<T>> {
    let records;
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
