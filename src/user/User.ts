import { SessionId } from "../api/interfaces/Common.js";

export class User {
  private username: string;
  private password: string;
  private sessions: SessionId[];

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.sessions = [];
  }

  public validPassword(password: string) {
    return this.password === password;
  }

  public getUserName() {
    return this.username;
  }

  public setPassword(oldPassword: string, newPassword: string) {
    if (this.validPassword(oldPassword)) {
      this.password = newPassword;
      return true;
    }
    return false;
  }

  public addSession(newSessionId: SessionId) {
    try {
      this.sessions.push(newSessionId);
      return true;
    } catch (error) {
      return false;
    }
  }

  public deleteSession(sessionId: SessionId) {
    try {
      const index = this.sessions.indexOf(sessionId);
      if (index > -1) {
        this.sessions.splice(index, 1);
        return sessionId;
      }
      //Invalid ChatSession ID
      return sessionId;
    } catch (error) {
      return null;
    }
  }

  public getSession() {
    return this.sessions;
  }
}
