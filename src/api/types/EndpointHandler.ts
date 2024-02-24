import type { SessionManager } from "/session/SessionManager.js";
import { Express } from "express";

export interface EndpointHandlerContext {
  app: Express;
  sessionManager: SessionManager;
}
