import { NextFunction, Request, Response } from "express";

type ErrorType = "server" | "client" | "auth";
class CustomError extends Error {
  type: ErrorType;
  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
  }
}
export function errHandler(
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err, req);
  console.log("--------------------------------------------\n\n");
  next();
}
export default CustomError;
