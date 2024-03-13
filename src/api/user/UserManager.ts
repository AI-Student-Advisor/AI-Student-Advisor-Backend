import { SessionId } from "../interfaces/Common";
import { User } from "./User";
import { HTTP_BAD_REQUEST } from "/utilities/Constants";
import { HTTPError } from "/utilities/HTTPError";

export class UserManager {
  private users: Map<string, User> = new Map();

  public async getUser(username: string, password: string) {
    const user = this.users.get(username);
    if (user === undefined || !user.validPassword(password)) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username or password`);
    }
    return user.getSession();
  }

  public async createUser(username: string, password: string) {
    if (password.length < 6) {
      throw new HTTPError(
        HTTP_BAD_REQUEST,
        `The length of the password should be larger than 5. Actual: ${password.length}`
      );
    }
    const user = this.users.get(username);
    if (user !== undefined) {
      throw new HTTPError(
        HTTP_BAD_REQUEST,
        `This username has been used, please try another one.`
      );
    }
    const newUser = new User(username, password);

    this.users.set(username, newUser);

    return username;
  }

  public async addSession(username: string, sessionId: SessionId) {
    const user = this.users.get(username);
    if (user === undefined) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username`);
    }
    if (user.addSession(sessionId)) {
      return sessionId;
    }
    throw new HTTPError(HTTP_BAD_REQUEST, `Cannot add Session: ${sessionId}`);
  }

  public async deleteSession(username: string, sessionId: SessionId) {
    const user = this.users.get(username);
    if (user === undefined) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username`);
    }
    const result = user.deleteSession(sessionId);
    if (result !== null) {
      return result;
    }
    throw new HTTPError(
      HTTP_BAD_REQUEST,
      `Unable to delete session: ${sessionId}`
    );
  }
}
