import { UserManager } from "./../user/UserManager";
import type { Database } from "/database/interfaces/Database.js";
import type { SessionManager } from "/session/SessionManager.js";
import { Express } from "express";

export interface EndpointHandlerContext {
  app: Express;
  sessionManager: SessionManager;
  userManager: UserManager;
  database: Database;
}
