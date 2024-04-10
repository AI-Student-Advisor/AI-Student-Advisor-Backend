import type { JWT } from "./JWT.js";
import type { AuthorizedRequest } from "/auth/types/AuthorizedRequest.js";
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED } from "/utilities/Constants.js";
import { logger } from "/utilities/Log.js";
import type { Request, Response } from "express";

export function auth(jwt: JWT) {
  const loggerContext = "AuthMiddleware";

  return (request: Request, response: Response, next: (err?: any) => any) => {
    const token = request.headers.authorization;
    if (!token) {
      response.status(HTTP_UNAUTHORIZED);
      response.end();
      return;
    }

    try {
      const authPayload = jwt.decode(token);
      (request as AuthorizedRequest).auth.username = authPayload.username;
      next();
    } catch (error) {
      logger.error({ context: loggerContext }, String(error));
      response.status(HTTP_FORBIDDEN);
    } finally {
      response.end();
    }
  };
}
