import { HistorySessionSchema } from "./Common.js";
import { z } from "zod";

/**
 * `GET /api/history-sessions?offset={}&limit={}`
 *
 * Request query parameters schema
 */
export const GetRequestSchema = z.object({
  offset: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().optional()
});

/**
 * `GET /api/history-sessions?offset={}&limit={}`
 *
 * Response payload schema
 */
export const GetResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    total: z.number().int().nonnegative(),
    limit: z.number().int().nonnegative(),
    items: z.array(HistorySessionSchema)
  }),
  // eslint-disable-next-line no-magic-numbers
  z.object({ status: z.literal("fail"), reason: z.string().trim().min(1) })
]);
