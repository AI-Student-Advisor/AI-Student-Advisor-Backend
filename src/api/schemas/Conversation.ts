import { ControlSchema, MessageSchema, SessionIdSchema } from "./Common.js";
import { z } from "zod";

/**
 * `POST /api/conversation`
 *
 * Request payload schema
 */
export const PostRequestSchema = z.object({
  /**
   * Session ID
   *
   * A unique identifier for a session.
   *
   * Can be `undefined` for creating a new session.
   */
  id: SessionIdSchema.optional(),
  message: MessageSchema
});

/**
 * `POST /api/conversation`
 *
 * Response payload schema
 */
// See https://github.com/colinhacks/zod/issues/1444 for reasons why discriminatedUnion is not used here
export const PostResponseSchema = z.union([
  z.object({
    status: z.literal("success"),
    id: SessionIdSchema,
    type: z.literal("message"),
    message: MessageSchema
  }),
  z.object({
    status: z.literal("success"),
    id: SessionIdSchema,
    type: z.literal("control"),
    control: ControlSchema
  }),
  // eslint-disable-next-line no-magic-numbers
  z.object({ status: z.literal("fail"), reason: z.string().trim().min(1) })
]);
