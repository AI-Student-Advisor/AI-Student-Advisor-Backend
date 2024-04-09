import { UsersModelSchema } from "./schemas/UsersModel.js";
import { Database } from "/database/interfaces/Database.js";
import { HTTP_BAD_REQUEST } from "/utilities/Constants.js";
import { HTTPError } from "/utilities/HTTPError.js";

const databasePath = "user/credentials";

export class UserManager {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public async verify(username: string, password: string) {
    const users = await this.database.get(databasePath, UsersModelSchema);
    const user = users[username];
    if (user === undefined || user.password !== password) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username or password`);
    }
  }

  public async register(username: string, password: string) {
    const users = await this.database.get(databasePath, UsersModelSchema);
    if (users[username] !== undefined) {
      throw new HTTPError(
        HTTP_BAD_REQUEST,
        `This username has been used, please try another one.`
      );
    }
    users[username] = {
      username: username,
      password: password
    };
    await this.database.set(databasePath, users, UsersModelSchema);
  }
}
