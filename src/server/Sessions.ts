import { ChatAgent } from "/ai/chat-agents/ChatAgent.js";
import { setupNewChatAgent } from "/ai/chat-agents/ChatAgents.js";
import { SUPPORTED_CHAT_AGENTS } from "/structs/ai/AIStructs.js";
import { APISession, SessionId } from "/structs/api/APIStructs.js";
import { dlog } from "/utilities/dlog.js";

export class Session implements APISession {
  id: SessionId;
  chatAgent?: ChatAgent;
  response?: any;

  constructor(sessionConfig: APISession) {
    this.id = sessionConfig.id;
    this.chatAgent = sessionConfig.chatAgent;
    this.response = sessionConfig.response;
  }

  async setupChatAgent() {
    if (this.chatAgent) return;
    // TODO: until functionality is implemented, use uOttawa chat agent
    this.chatAgent = await setupNewChatAgent(SUPPORTED_CHAT_AGENTS.U_OTTAWA);
  }

  getChatAgent() {
    return this.chatAgent;
  }

  /**
   * Checks if the provided string is a valid session ID (UUID v4)
   * @param sessionId string representing session ID
   * @returns boolean indicating whether the session ID is valid
   */
  static isValidSessionId(sessionId: string | undefined): boolean {
    if (!sessionId || sessionId.length !== 36) return false;
    // UUID v4 regex pattern
    const pattern =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/iu;
    // session id length should be 36 and should conform to UUID v4 pattern
    return pattern.test(sessionId);
  }
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private sessionTimeoutQueue: Map<string, unknown> = new Map();

  // Creates a new session, adds it to the session manager and returns the new session
  public getNewSession(sessionConfig: APISession): Session {
    const session: Session = new Session(sessionConfig);
    this.sessions.set(session.id, session);
    dlog.msg(`SessionManager: New session created: ID: ${session.id}`);
    return session;
  }

  public getSession(sessionId: SessionId): Session | undefined {
    return this.sessions.get(sessionId);
  }

  public deleteSession(sessionId: SessionId): void {
    dlog.msg(`SessionManager: Deleting session: ID: ${sessionId}`);
    this.sessions.delete(sessionId);
  }

  public setSessionExpiration(sessionId: SessionId, time: number): void {
    const sessionTimeout = setTimeout(() => {
      this.deleteSession(sessionId);
    }, time);
    this.sessionTimeoutQueue.set(sessionId, sessionTimeout);
  }

  public terminateSessionExpiration(sessionId: SessionId): void {
    const sessionTimeout = this.sessionTimeoutQueue.get(sessionId);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout as NodeJS.Timeout);
      this.sessionTimeoutQueue.delete(sessionId);
    } else {
      dlog.warn(`SessionManager: Session timeout not found: ID: ${sessionId}`);
    }
  }
}
