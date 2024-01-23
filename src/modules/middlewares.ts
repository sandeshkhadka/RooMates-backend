import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "./auth.js";
import { validationResult } from "express-validator";
import { Socket } from "socket.io";
// import { ExtendedError } from "socket.io/dist/namespace.ts";

function rejectRequest(res: Response, status: number, message: string) {
  res.status(status);
  res.json({ message });
}

export function contributionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return rejectRequest(res, 400, "Insufficient data sent");
  }
  next();
}
export function createTaskMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return rejectRequest(res, 400, "Insufficient data sent");
  }
  next();
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
    return res.status(400).send("Missing password, token or profile_picture");
  }

  next();
}
export function requestSignUpMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return rejectRequest(res, 400, "username and email fields cannot be empty");
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
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    rejectRequest(res, 401, "Invalid jwt");
  }
}
export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  const bearer = socket.handshake.auth.token;
  if (!bearer) {
    return next(new Error("Not authorized"));
  }
  const [, token] = bearer.split(" ");

  if (!token) {
    return next(new Error("Not authorized"));
  }
  try {
    const user = verifyJwt(token);
    socket.user = user;
    next();
  } catch (e) {
    console.log(e);
    next(new Error("Invalid jwt"));
  }
}
