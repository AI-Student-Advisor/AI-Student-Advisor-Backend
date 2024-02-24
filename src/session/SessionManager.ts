import type { Session } from "./Session.js";
import { SUPPORTED_CHAT_AGENTS } from "/ai/AIStructs.js";
import { setupNewChatAgent } from "/ai/chat-agents/ChatAgents.js";
import type { SessionId } from "/api/interfaces/Common.js";
import { AppConfig } from "/config/AppConfig.js";
import { HTTP_BAD_REQUEST } from "/utilities/Constants.js";
import { HTTPError } from "/utilities/HTTPError.js";
import { logger } from "/utilities/Log.js";
import { Watchdog } from "/utilities/Watchdog.js";
import * as crypto from "crypto";

const loggerContext = "SessionManager";

export class SessionManager {
  private sessions: Map<SessionId, Session> = new Map();
  private watchdog: Watchdog = new Watchdog();

  public async getSession(sessionId?: SessionId) {
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new HTTPError(
          HTTP_BAD_REQUEST,
          `Invalid session ID: ${sessionId}`
        );
      }
      logger.debug(
        { context: loggerContext },
        "Found existing session: feed the dog and reuse",
        { sessionId: sessionId }
      );
      this.watchdog.feed(sessionId);
      return session;
    }

    const newSessionId = crypto.randomUUID();
    const session = {
      id: newSessionId,
      chatAgent: await setupNewChatAgent(SUPPORTED_CHAT_AGENTS.U_OTTAWA)
    };
    logger.info(
      { context: loggerContext },
      "Created new session %s",
      newSessionId
    );
    this.sessions.set(newSessionId, session);

    this.watchdog.registerTimingGroup(newSessionId);
    logger.debug(
      { context: loggerContext },
      "Watchdog timing group registered",
      {
        sessionId: newSessionId
      }
    );

    this.watchdog.registerHandler(newSessionId, async () => {
      logger.debug(
        { context: loggerContext },
        "Watchdog timeout for session %s",
        newSessionId
      );
      this.deleteSession(newSessionId);
    });

    this.watchdog.start(newSessionId, AppConfig.api.session_expiry_time);
    logger.debug(
      { context: loggerContext },
      "Watchdog started for session %s; expires after %d ms",
      newSessionId,
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
