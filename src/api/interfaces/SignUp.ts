import {
  PostUserRequestSchema,
  PostUserResponseSchema
} from "/api/schemas/SignUp.js";
import { z } from "zod";

export type PostUserRequest = z.infer<typeof PostUserRequestSchema>;
export type PostUserResponse = z.infer<typeof PostUserResponseSchema>;
