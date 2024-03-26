import { UserManagerHandler } from "./interfaces/Common";
import { GetUserResponseSchema, GetUserRequestSchema } from "./schemas/Login";
import { HTTP_OK } from "/utilities/Constants";
import { parseError } from "/utilities/ErrorParser";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";

const endpoint = "/api/login";

export function handleLogin({ app, userManager }: UserManagerHandler) {
  const loggerContext = "LoginAPIHandler";
  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );
  app.get(endpoint, handleLoginGet);
  logger.debug(
    { context: loggerContext },
    "GET handler registered endpoint %s",
    endpoint
  );

  async function handleLoginGet(request: Request, response: Response) {
    const loggerContext = "LoginGETHandler";
    response.writeHead(HTTP_OK, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache"
    });
    try {
      const { username, password } = GetUserRequestSchema.parse(request.query);
      logger.info({ context: loggerContext }, "Request received: %o", {
        username,
        password
      });
      const userSessions = await userManager.getUser(username, password);
      const responseBody = GetUserResponseSchema.parse({
        status: "success",
        conversations: userSessions
      });
      response.write(JSON.stringify(responseBody));
      logger.info({ context: loggerContext }, "User %s is online.", username);
    } catch (error) {
      const { reason } = parseError(error);
      const errorResponseBody = GetUserResponseSchema.parse({
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
