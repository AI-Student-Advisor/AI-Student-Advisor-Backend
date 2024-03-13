import { MessageSchema } from "/api/schemas/Common.js";
import { z } from "zod";

export const HistorySessionModelSchema = z.record(
  z.object({
    messages: z.array(MessageSchema)
  })
);
