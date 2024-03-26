import { UserManager } from "../user/UserManager";
import {
  ControlSchema,
  HistorySessionSchema,
  MessageIdSchema,
  MessageSchema,
  SessionIdSchema,
  UserSchema
} from "/api/schemas/Common.js";
import { Express } from "express";
import { z } from "zod";

export type SessionId = z.infer<typeof SessionIdSchema>;
export type MessageId = z.infer<typeof MessageIdSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Control = z.infer<typeof ControlSchema>;
export type HistorySession = z.infer<typeof HistorySessionSchema>;
export type User = z.infer<typeof UserSchema>;
export interface UserManagerHandler {
  app: Express;
  userManager: UserManager;
}
