import {
  PostUserRequestSchema,
  PostUserResponseSchema
} from "/api/schemas/LogIn.js";
import { z } from "zod";

export type GetUserRequest = z.infer<typeof PostUserRequestSchema>;
export type GetUserResponse = z.infer<typeof PostUserResponseSchema>;
