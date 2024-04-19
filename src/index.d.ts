import { User } from "./modules/auth.ts";
declare global {
  const PAGE_SIZE = 10;
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare module "socket.io" {
  export interface Socket {
    user?: User;
  }
}
