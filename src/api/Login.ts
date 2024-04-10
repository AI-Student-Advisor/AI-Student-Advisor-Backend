import {
  PostUserRequestSchema,
  PostUserResponseSchema
} from "./schemas/Login.js";
import type { EndpointHandlerContext } from "/api/types/EndpointHandler.js";
import { AuthPayloadSchema } from "/auth/schemas/AuthPayload.js";
import { parseError } from "/utilities/ErrorParser.js";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";

const endpoint = "/api/login";

export function handleLogin({ app, userManager, jwt }: EndpointHandlerContext) {
  const loggerContext = "LoginAPIHandler";
  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );
  app.post(endpoint, handleLoginPost);
  logger.debug(
    { context: loggerContext },
    "POST handler registered for endpoint %s",
    endpoint
  );

  async function handleLoginPost(request: Request, response: Response) {
    const loggerContext = "LoginPOSTHandler";
    try {
      const { username, password } = PostUserRequestSchema.parse(request.body);
      logger.info({ context: loggerContext }, "Request received: %o", {
        username,
        password
      });
      await userManager.verify(username, password);

      const token = jwt.encode(
        AuthPayloadSchema.parse({
          username: username
        })
      );
      const responseBody = PostUserResponseSchema.parse({
        status: "success",
        token: token
      });
      response.write(JSON.stringify(responseBody));
      logger.info({ context: loggerContext }, "User %s is logged in", username);
    } catch (error) {
      const { reason } = parseError(error);
      const errorResponseBody = PostUserResponseSchema.parse({
        status: "fail",
        reason: reason
      });
      response.write(JSON.stringify(errorResponseBody));
      logger.warn(
        { context: loggerContext },
        "User login is denied: %s",
        reason
      );
    } finally {
      response.end();
    }
  }
}
