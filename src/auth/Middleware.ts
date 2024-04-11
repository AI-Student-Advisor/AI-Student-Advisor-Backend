import type { JWT } from "./JWT.js";
import type { AuthorizedRequest } from "/auth/types/AuthorizedRequest.js";
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED } from "/utilities/Constants.js";
import { logger } from "/utilities/Log.js";
import type { Request, Response } from "express";

export function auth(jwt: JWT) {
  const loggerContext = "AuthMiddleware";

  return (request: Request, response: Response, next: (err?: any) => any) => {
    const { authorization } = request.headers;
    if (!authorization) {
      response.status(HTTP_UNAUTHORIZED);
      response.end();
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      response.status(HTTP_FORBIDDEN);
      response.end();
      return;
    }

    const token = authorization.replace("Bearer ", "");

    try {
      const authPayload = jwt.decode(token);
      const authorizedRequest = request as AuthorizedRequest;
      authorizedRequest.auth = { username: authPayload.username };
      next();
    } catch (error) {
      logger.error({ context: loggerContext }, String(error));
      response.status(HTTP_FORBIDDEN);
      response.end();
    }
  };
}
