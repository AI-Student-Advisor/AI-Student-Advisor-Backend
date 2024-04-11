import { handleLogin } from "./api/LogIn.js";
import { handleSignUp } from "./api/SignUp";
import { ChatSessionManager } from "/ai/chat-session/ChatSessionManager.js";
import { handleConversation } from "/api/Conversation.js";
import { handleHistorySession } from "/api/HistorySession.js";
import { handleHistorySessions } from "/api/HistorySessions.js";
import { JWT } from "/auth/JWT.js";
import { AppConfig } from "/config/AppConfig.js";
import { Firebase } from "/database/Firebase.js";
import { UserManager } from "/model/UserManager";
import { logger } from "/utilities/Log.js";
import cors from "cors";
import express from "express";

const loggerContext = "Server";

logger.debug({ context: loggerContext }, "Setting up Server");

// Create a new Express application
const app = express();
// Get the port from the config file or use 3001 as default
const port = AppConfig.api.port || 3001;
// Chat session manager
const chatSessionManager = new ChatSessionManager();
// Database
const database = new Firebase();
// User manager
const userManager = new UserManager(database);
// JWT
const jwt = new JWT(
  AppConfig.api.jwt.signOptions,
  AppConfig.api.jwt.verifyOptions
);

// TODO: enable CORS only for production
// Set up CORS
app.use(cors());
logger.warn({ context: loggerContext }, "CORS middleware enabled globally");

handleLogin({ app, chatSessionManager, userManager, database, jwt });
handleSignUp({ app, chatSessionManager, userManager, database, jwt });
handleConversation({
  app,
  chatSessionManager: chatSessionManager,
  userManager,
  database,
  jwt
});
handleHistorySessions({
  app,
  chatSessionManager: chatSessionManager,
  userManager,
  database,
  jwt
});
handleHistorySession({
  app,
  chatSessionManager: chatSessionManager,
  userManager,
  database,
  jwt
});

app.listen(port, () => {
  logger.info({ context: loggerContext }, "Server is running at port %d", port);
});
