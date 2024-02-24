import {
  DeleteRequestSchema,
  DeleteResponseSchema,
  GetRequestSchema,
  GetResponseSchema,
  PatchRequestSchema,
  PatchResponseSchema
} from "/api/schemas/HistorySession.js";
import { z } from "zod";

export type GetRequest = z.infer<typeof GetRequestSchema>;
export type GetResponse = z.infer<typeof GetResponseSchema>;
export type PatchRequest = z.infer<typeof PatchRequestSchema>;
export type PatchResponse = z.infer<typeof PatchResponseSchema>;
export type DeleteRequest = z.infer<typeof DeleteRequestSchema>;
export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;
