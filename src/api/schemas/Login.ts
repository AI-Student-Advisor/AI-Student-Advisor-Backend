import { SessionIdSchema } from "./Common";
import { z } from "zod";

/**
 * 'GET /api/login/{username&password}
 *
 * Request user schema
 */
export const GetUserRequestSchema = z.object({
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
 * 'GET /api/login/{username&password}
 *
 * Response payload schema
 */
export const GetUserResponseSchema = z.discriminatedUnion("status", [
    z.object({
        status: z.literal("success"),
        conversations: z.array(SessionIdSchema)
    }),
    z.object({
        status: z.literal("fail"),
        // eslint-disable-next-line no-magic-numbers
        reason: z.string().trim().min(1)
    })
]);
