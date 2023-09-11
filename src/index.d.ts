import { User } from "./modules/auth.ts";
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
