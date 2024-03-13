import type { HistorySessionModelSchema } from "/model/schemas/HistorySessionModel.js";
import { z } from "zod";

export type HistorySessionModel = z.infer<typeof HistorySessionModelSchema>;
