import {
  PostUserRequestSchema,
  PostUserResponseSchema
} from "./schemas/SignUp.js";
import type { EndpointHandlerContext } from "/api/types/EndpointHandler.js";
import { parseError } from "/utilities/ErrorParser.js";
import { logger } from "/utilities/Log.js";
import { json, Request, Response } from "express";

const endpoint = "/api/sign";

export function handleSignUp({ app, userManager }: EndpointHandlerContext) {
  const loggerContext = "SignUpAPIHandler";
  app.use(endpoint, json());
  logger.debug(
    { context: loggerContext },
    "JSON middleware enabled for endpoint %s",
    endpoint
  );
  app.post(endpoint, handleSignUpPost);
  logger.debug(
    { context: loggerContext },
    "POST handler registered for endpoint %s",
    endpoint
  );

  async function handleSignUpPost(request: Request, response: Response) {
    const loggerContext = "SignUpPOSTHandler";
    try {
      const { username, password } = PostUserRequestSchema.parse(request.body);
      logger.info({ context: loggerContext }, "Request received: %o", {
        username,
        password
      });
      const result = await userManager.register(username, password);
      logger.info(
        { context: loggerContext },
        "User %s has been created",
        result
      );
      const responseBody = PostUserResponseSchema.parse({
        status: "success"
      });
      response.write(JSON.stringify(responseBody));
    } catch (error) {
      const { reason } = parseError(error);
      const errorResponseBody = PostUserResponseSchema.parse({
        status: "fail",
        reason: reason
      });
      response.write(JSON.stringify(errorResponseBody));
      logger.warn(
        { context: loggerContext },
        "User sign up is denied: %s",
        reason
      );
    } finally {
      response.end();
    }
  }
}
