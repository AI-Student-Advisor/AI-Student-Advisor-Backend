import {
  ControlSchema,
  HistorySessionSchema,
  MessageIdSchema,
  MessageSchema,
  PasswordSchema,
  SessionIdSchema,
  UsernameSchema
} from "/api/schemas/Common.js";
import { z } from "zod";

export type SessionId = z.infer<typeof SessionIdSchema>;
export type MessageId = z.infer<typeof MessageIdSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Control = z.infer<typeof ControlSchema>;
export type HistorySession = z.infer<typeof HistorySessionSchema>;

export type Username = z.infer<typeof UsernameSchema>;
export type Password = z.infer<typeof PasswordSchema>;
