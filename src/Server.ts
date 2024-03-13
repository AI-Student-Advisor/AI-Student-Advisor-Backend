import { handleLogin } from "./api/Login";
import { handleSignUp } from "./api/SignUp";
import { UserManager } from "./api/user/UserManager";
import { handleConversation } from "/api/Conversation.js";
import { AppConfig } from "/config/AppConfig.js";
import { SessionManager } from "/session/SessionManager.js";
import { logger } from "/utilities/Log.js";
import cors from "cors";
import express, { Express } from "express";

const loggerContext = "Server";

logger.debug({ context: loggerContext }, "Setting up Server");

// Create a new Express application
const app: Express = express();
// Get the port from the config file or use 3001 as default
const port = AppConfig.api.port || 3001;
// Session manager
const sessionManager = new SessionManager();
const userManager = new UserManager();

// TODO: enable CORS only for production
// Set up CORS
app.use(cors());
logger.warn({ context: loggerContext }, "CORS middleware enabled globally");

handleConversation({ app, sessionManager });
handleLogin({ app, userManager });
handleSignUp({ app, userManager });

app.listen(port, () => {
  logger.info({ context: loggerContext }, "Server is running at port %d", port);
});
