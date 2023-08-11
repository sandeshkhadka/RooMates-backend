import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "./auth";
import { validationResult } from "express-validator";
function rejectRequest(res: Response, status: number, message: string) {
  res.status(status);
  res.json({ message });
}

export function signInMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return rejectRequest(
      res,
      400,
      "username and password fields cannot be empty",
    );
  }

  next();
}

export function signUpMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return rejectRequest(
      res,
      400,
      "username,password and email fields cannot be empty",
    );
  }

  next();
}
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return rejectRequest(res, 401, "Not authorized");
  }
  const [, token] = bearer.split(" ");

  if (!token) {
    return rejectRequest(res, 401, "Unauthorized");
  }
  try {
    const user = verifyJwt(token);
    Object.defineProperty(req, "user", user);
    next();
  } catch (e) {
    console.log(e);
    rejectRequest(res, 401, "Invalid jwt");
  }
}
