import {
  PostRequestSchema,
  PostResponseSchema
} from "/api/schemas/Conversation.js";
import { z } from "zod";

export type PostRequest = z.infer<typeof PostRequestSchema>;
export type PostResponse = z.infer<typeof PostResponseSchema>;
