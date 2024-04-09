import { z } from "zod";

export const UserModelSchema = z.object({
  /**
   * Unique username
   */
  username: z.string().trim().min(1),

  /**
   * User password with minimum length of 6
   */
  password: z.string().trim().min(6)
});
