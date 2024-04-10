import { UsernameSchema } from "/api/schemas/Common.js";
import { z } from "zod";

export const AuthPayloadSchema = z.object({
  username: UsernameSchema
});
