import { MessageSchema, SessionIdSchema } from "./Common.js";
import { z } from "zod";

/**
 * `GET /api/history-session/{id}`
 *
 * Request query parameters schema
 */
export const GetRequestSchema = z.object({
  id: SessionIdSchema
});

/**
 * `GET /api/history-session/{id}`
 *
 * Response payload schema
 */
export const GetResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    messages: z.array(MessageSchema)
  }),
  z.object({
    status: z.literal("fail"),
    // eslint-disable-next-line no-magic-numbers
    reason: z.string().trim().min(1)
  })
]);

/**
 * `PATCH /api/history-session/{id}`
 *
 * Request payload schema
 */
export const PatchRequestSchema = z.object({
  id: SessionIdSchema,
  // eslint-disable-next-line no-magic-numbers
  name: z.string().trim().min(1)
});

/**
 * `PATCH /api/history-session/{id}`
 *
 * Response payload schema
 */
export const PatchResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success") }),
  // eslint-disable-next-line no-magic-numbers
  z.object({ status: z.literal("fail"), reason: z.string().trim().min(1) })
]);

/**
 * `DELETE /api/history-session/{id}`
 *
 * Request payload schema
 */
export const DeleteRequestSchema = z.object({
  id: SessionIdSchema
});

/**
 * `DELETE /api/history-session/{id}`
 *
 * Response payload schema
 */
export const DeleteResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success") }),
  // eslint-disable-next-line no-magic-numbers
  z.object({ status: z.literal("fail"), reason: z.string().trim().min(1) })
]);
