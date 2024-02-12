import { UserForResponse } from "../user/user.types";

declare global {
  namespace Express {
    export interface Request {
      user?: UserForResponse;
    }
  }
}

export {};
