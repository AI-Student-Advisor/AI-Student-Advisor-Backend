import type { AuthPayloadSchema } from "/auth/schemas/AuthPayload.js";
import { z } from "zod";

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
