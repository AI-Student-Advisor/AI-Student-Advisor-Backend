import { SessionId, Users } from "../interfaces/Common";
import { UserStore } from "../interfaces/SignUp";
import { UserSchema, UsersSchema } from "./../schemas/Common";
import { Database } from "/database/interfaces/Database";
import { HTTP_BAD_REQUEST } from "/utilities/Constants";
import { parseError } from "/utilities/ErrorParser";
import { HTTPError } from "/utilities/HTTPError";
import { Session } from "inspector";
import { array, string, z } from "zod";

const usersPath = "users/userManager";

export class UserManager {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public async getUser(username: string, password: string) {
    const users = await this.database.get(usersPath, UsersSchema);
    const user = users[username];
    if (user === undefined || user.password !== password) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username or password`);
    }
    return user.sessions;
  }

  public async createUser(username: string, password: string) {
    if (password.length < 6) {
      throw new HTTPError(
        HTTP_BAD_REQUEST,
        `The length of the password should be larger than 5. Actual: ${password.length}`
      );
    }
    try {
      const users = await this.database.get(usersPath, UsersSchema);
      console.log(users);
      if (users[username] !== undefined) {
        throw new HTTPError(
          HTTP_BAD_REQUEST,
          `This username has been used, please try another one.`
        );
      }
      users[username] = {
        username: username,
        password: password,
        sessions: []
      };

      await this.database.set(usersPath, users, UsersSchema);
    } catch (error) {
      const { statusCode } = parseError(error);
      if (statusCode === 400) {
        const users: UserStore = {};
        users[username] = {
          username: username,
          password: password,
          sessions: []
        };
        await this.database.set(usersPath, users, UsersSchema);
      } else {
        throw error;
      }
    }

    return username;
  }

  public async getUserSession(username: string) {
    const users = await this.database.get(usersPath, UsersSchema);
    const user = users[username];
    if (user === undefined) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid username`);
    }
    return user.sessions;
  }

  public async addSession(username: string, sessionId: SessionId) {
    const users = await this.database.get(usersPath, UsersSchema);
    const user = users[username];
    if (user === undefined) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid username`);
    }
    user.sessions.push(sessionId);
    await this.database.set(usersPath, users, UsersSchema);
    return true;
  }

  public async deleteSession(username: string, sessionId: SessionId) {
    const users = await this.database.get(usersPath, UsersSchema);
    const user = users[username];

    if (user === undefined) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid username`);
    }
    const index = user.sessions.indexOf(sessionId);
    if (index > -1) {
      user.sessions.splice(index, 1);
      await this.database.set(usersPath, users, UsersSchema);
      console.log(user.sessions);
      return sessionId;
    }
    throw new HTTPError(
      HTTP_BAD_REQUEST,
      `Unable to delete session: ${sessionId}`
    );
  }
}
