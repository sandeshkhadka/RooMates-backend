import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
  errorCode: number;
  constructor(message: string, type: number) {
    super(message);
    this.errorCode = type;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
export function errHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  console.log("--------------------------------------------\n\n");
  if (err.errorCode) {
    res.status(err.errorCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: "Something went wrong" });
  }
}
export default CustomError;
