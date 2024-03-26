import { handleLogin } from "./api/Login";
import { handleSignUp } from "./api/SignUp";
import { UserManager } from "./api/user/UserManager";
import { handleConversation } from "/api/Conversation.js";
import { handleHistorySession } from "/api/HistorySession.js";
import { handleHistorySessions } from "/api/HistorySessions.js";
import { AppConfig } from "/config/AppConfig.js";
import { Firebase } from "/database/Firebase.js";
import { SessionManager } from "/session/SessionManager.js";
import { logger } from "/utilities/Log.js";
import cors from "cors";
import express from "express";

const loggerContext = "Server";

logger.debug({ context: loggerContext }, "Setting up Server");

// Create a new Express application
const app = express();
// Get the port from the config file or use 3001 as default
const port = AppConfig.api.port || 3001;
// Session manager
const sessionManager = new SessionManager();

const userManager = new UserManager();
// Database
const database = new Firebase();


// TODO: enable CORS only for production
// Set up CORS
app.use(cors());
logger.warn({ context: loggerContext }, "CORS middleware enabled globally");


handleLogin({ app, userManager });
handleSignUp({ app, userManager });
handleConversation({ app, sessionManager, database });
handleHistorySessions({ app, sessionManager, database });
handleHistorySession({ app, sessionManager, database });


app.listen(port, () => {
  logger.info({ context: loggerContext }, "Server is running at port %d", port);
});
