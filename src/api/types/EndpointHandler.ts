import type { ChatSessionManager } from "/ai/chat-session/ChatSessionManager.js";
import type { JWT } from "/auth/JWT.js";
import type { Database } from "/database/interfaces/Database.js";
import { UserManager } from "/model/UserManager.js";
import { Express } from "express";

export interface EndpointHandlerContext {
  app: Express;
  chatSessionManager: ChatSessionManager;
  userManager: UserManager;
  database: Database;
  jwt: JWT;
}
