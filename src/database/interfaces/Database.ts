import { z, ZodType } from "zod";

export interface Database {
  set<T extends ZodType>(
    path: string,
    value: z.infer<T>,
    schema: T
  ): Promise<void>;
  get<T extends ZodType>(path: string, schema: T): Promise<z.infer<T>>;
  delete(path: string): Promise<void>;
  update<T extends ZodType>(
    path: string,
    value: z.infer<T>,
    schema: T
  ): Promise<void>;
}
