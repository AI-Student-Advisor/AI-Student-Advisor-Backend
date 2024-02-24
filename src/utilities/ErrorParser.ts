import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR } from "./Constants.js";
import { HTTPError } from "./HTTPError.js";
import { logger } from "./Log.js";
import { ZodError } from "zod";

export function parseError(error: unknown) {
  logger.error({ context: "ErrorHandler" }, (error as Error).message);

  let statusCode = HTTP_INTERNAL_SERVER_ERROR;
  let reason = "Unknown error occurred";

  if (error instanceof ZodError) {
    statusCode = HTTP_BAD_REQUEST;
    reason = error.message;
  }
  if (error instanceof HTTPError) {
    statusCode = error.status;
    reason = error.message;
  } else if (error instanceof Error) {
    reason = error.message;
  }

  return { reason: reason, statusCode: statusCode };
}
