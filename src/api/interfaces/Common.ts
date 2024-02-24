import {
  ControlSchema,
  HistorySessionSchema,
  MessageIdSchema,
  MessageSchema,
  SessionIdSchema
} from "/api/schemas/Common.js";
import { z } from "zod";

export type SessionId = z.infer<typeof SessionIdSchema>;
export type MessageId = z.infer<typeof MessageIdSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Control = z.infer<typeof ControlSchema>;
export type HistorySession = z.infer<typeof HistorySessionSchema>;
