import {
  PostUserRequestSchema,
  PostUserResponseSchema
} from "../schemas/SignUp";
import { z } from "zod";

export type PostUserRequest = z.infer<typeof PostUserRequestSchema>;
export type PostUserResponse = z.infer<typeof PostUserResponseSchema>;
