import { z } from "zod";

/**
 * 'POST /api/sign
 *
 * Request payload schema
 */
export const PostUserRequestSchema = z.object({
    /**
     * User id
     */
    // eslint-disable-next-line no-magic-numbers
    username: z.string().trim().min(1),
    /**
     * User password
     */
    // eslint-disable-next-line no-magic-numbers
    password: z.string().trim().min(1)
});
/**
 * 'POST /api/sign
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
