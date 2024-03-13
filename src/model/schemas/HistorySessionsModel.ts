import { HistorySessionSchema } from "/api/schemas/Common.js";
import { z } from "zod";

export const HistorySessionsModelSchema = z.record(HistorySessionSchema);
