import { PasswordSchema, UsernameSchema } from "./Common.js";
import { z } from "zod";

/**
 * `POST /api/login`
 *
 * Request payload schema
 */
export const PostUserRequestSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema
});

/**
 * `POST /api/login`
 *
 * Response payload schema
 */
export const PostUserResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    token: z.string().trim().min(1)
  }),
  z.object({
    status: z.literal("fail"),
    // eslint-disable-next-line no-magic-numbers
    reason: z.string().trim().min(1)
  })
]);
