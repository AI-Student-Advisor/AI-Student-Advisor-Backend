import { UserManager } from "./../api/user/UserManager";
import type { Session } from "./Session.js";
import { SUPPORTED_CHAT_AGENTS } from "/ai/AIStructs.js";
import { setupNewChatAgent } from "/ai/chat-agents/ChatAgents.js";
import type { SessionId } from "/api/interfaces/Common.js";
import { AppConfig } from "/config/AppConfig.js";
import { logger } from "/utilities/Log.js";
import { Watchdog } from "/utilities/Watchdog.js";
import * as crypto from "crypto";

const loggerContext = "SessionManager";

export class SessionManager {
  private sessions: Map<SessionId, Session> = new Map();
  private watchdog: Watchdog = new Watchdog();

  public async getSession(
    username: string,
    userManager: UserManager,
    sessionId?: SessionId
  ) {
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        logger.debug(
          { context: loggerContext },
          "Found existing session: feed the dog and reuse",
          { sessionId: sessionId }
        );
        this.watchdog.feed(sessionId);
        return session;
      }
    } else {
      sessionId = crypto.randomUUID();
      await userManager.addSession(username, sessionId);
    }

    logger.debug({ context: loggerContext }, "Creating session", {
      newSessionId: sessionId
    });

    const session = {
      id: sessionId,
      chatAgent: await setupNewChatAgent(SUPPORTED_CHAT_AGENTS.U_OTTAWA)
    };
    logger.info(
      { context: loggerContext },
      "Created new session %s",
      sessionId
    );
    this.sessions.set(sessionId, session);

    this.watchdog.registerTimingGroup(sessionId);
    logger.debug(
      { context: loggerContext },
      "Watchdog timing group registered",
      {
        sessionId: sessionId
      }
    );

    this.watchdog.registerHandler(sessionId, async () => {
      logger.debug(
        { context: loggerContext },
        "Watchdog timeout for session %s",
        sessionId
      );
      this.deleteSession(sessionId);
    });

    this.watchdog.start(sessionId, AppConfig.api.session_expiry_time);
    logger.debug(
      { context: loggerContext },
      "Watchdog started for session %s; expires after %d ms",
      sessionId,
      AppConfig.api.session_expiry_time
    );

    return session;
  }

  public deleteSession(sessionId: SessionId): void {
    // TODO: If the chat agent need to be released, release it here
    logger.info({ context: loggerContext }, "Deleting session %s", sessionId);
    this.sessions.delete(sessionId);
  }
}
