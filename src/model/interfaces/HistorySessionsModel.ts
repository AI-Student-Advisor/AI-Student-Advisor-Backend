import { HistorySessionsModelSchema } from "/model/schemas/HistorySessionsModel.js";
import { z } from "zod";

export type HistorySessionsModel = z.infer<typeof HistorySessionsModelSchema>;
