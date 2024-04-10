import type { Username } from "/api/interfaces/Common.js";
import type { Request } from "express";

export interface AuthorizedRequest extends Request {
  auth: {
    username: Username;
  };
}
