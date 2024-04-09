import type { UsersModelSchema } from "/model/schemas/UsersModel.js";
import { z } from "zod";

export type UsersModel = z.infer<typeof UsersModelSchema>;
