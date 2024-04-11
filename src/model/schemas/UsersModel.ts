import { UserModelSchema } from "./UserModel.js";
import { z } from "zod";

export const UsersModelSchema = z.record(UserModelSchema);
