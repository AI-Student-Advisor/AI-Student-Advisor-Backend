class Session {
  public id: string;
  public userId: string;
  public expiresAt: Date;

  constructor(id: string, userId: string, expiresAt: Date) {
    this.id = id;
    this.userId = userId;
    this.expiresAt = expiresAt;
  }
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();

  public createSession(session: Session): void {
    this.sessions.set(session.id, session);
  }

  public getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  public deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
