import { UsersModelSchema } from "./schemas/UsersModel.js";
import { Database } from "/database/interfaces/Database.js";
import { HTTP_BAD_REQUEST } from "/utilities/Constants.js";
import { HTTPError } from "/utilities/HTTPError.js";
import { z, ZodError, ZodType } from "zod";

export class UserManager {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  public async verify(username: string, password: string) {
    const databasePath = `user/${username}/credential/password`;

    const users = await this.getRecordFromDatabase(
      databasePath,
      UsersModelSchema
    );
    const user = users[username];
    if (user === undefined || user.password !== password) {
      throw new HTTPError(HTTP_BAD_REQUEST, `Invalid Username or password`);
    }
  }

  public async register(username: string, password: string) {
    const databasePath = `user/${username}/credential/password`;

    const users = await this.getRecordFromDatabase(
      databasePath,
      UsersModelSchema
    );
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

  private async getRecordFromDatabase<T extends ZodType>(
    path: string,
    schema: T
  ): Promise<z.infer<T>> {
    let records = {};
    try {
      records = await this.database.get(path, schema);
    } catch (e) {
      if (e instanceof ZodError) {
        records = schema.parse({});
      } else {
        throw e;
      }
    }
    return records;
  }
}
