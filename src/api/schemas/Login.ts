import { z } from "zod";

/**
 * `POST /api/login`
 *
 * Request payload schema
 */
export const PostUserRequestSchema = z.object({
  /**
   * Username
   */
  // eslint-disable-next-line no-magic-numbers
  username: z.string().trim().min(1),
  /**
   * Password
   */
  // eslint-disable-next-line no-magic-numbers
  password: z.string().trim().min(6)
});

/**
 * `POST /api/login`
 *
 * Response payload schema
 */
export const PostUserResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success")
  }),
  z.object({
    status: z.literal("fail"),
    // eslint-disable-next-line no-magic-numbers
    reason: z.string().trim().min(1)
  })
]);
