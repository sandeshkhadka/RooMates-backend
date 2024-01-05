import { NextFunction, Request, Response } from "express";
import { comparePassword, createJwt, hashPassword } from "../modules/auth";
import CustomError from "../modules/errors";
import prisma from "../db";

export async function signin(req: Request, res: Response, next: NextFunction) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  // console.log(username, password);
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user === null) {
      throw new CustomError("Incorrect username or password", 401);
    }
    const hashedPassword = user.password;
    const authPassed = await comparePassword(password, hashedPassword);
    if (!authPassed) {
      throw new CustomError("Incorrect username or password", 401);
    }
    const token = createJwt({
      username: user.username,
      id: user.id,
    });
    res.status(200);
    res.json({
      token,
      user: {
        username: user.username,
        id: user.id,
      },
    });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not login", 500));
    }
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const email: string = req.body.email;

  try {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
      },
    });

    const token = createJwt({
      username: user.username,
      id: user.id,
    });

    res.status(200);
    res.json({
      username: user.username,
      email: user.email,
      id: user.id,
      token: token,
    });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not signup", 500));
    }
  }
}
