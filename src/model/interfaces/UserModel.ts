import type { UserModelSchema } from "/model/schemas/UserModel.js";
import { z } from "zod";

export type UserModel = z.infer<typeof UserModelSchema>;
