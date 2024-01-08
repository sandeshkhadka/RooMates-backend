import { NextFunction, Request, Response } from "express";
import { sendVerificationMail } from "../services/EmailServices";
import {
  comparePassword,
  createJwt,
  createSignupToken,
  hashPassword,
  verifySignupToken,
} from "../modules/auth";
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
export async function requestSignup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const username: string = req.body.username;
  const email: string = req.body.email;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
    });
    if (users.length) {
      console.log(users);
      let emailFlag = false,
        usernameFlag = false;

      for (const user of users) {
        if (user.username == username) {
          usernameFlag = true;
          break;
        } else if (user.email == email) {
          emailFlag = true;
          break;
        }
      }

      if (usernameFlag) {
        throw new CustomError("USERNAME ERROR", 400);
      } else if (emailFlag) {
        throw new CustomError("EMAIL ERROR", 400);
      } else {
        throw new CustomError("Could not signup", 500);
      }
    }
    const token = createSignupToken({ username, email });
    sendVerificationMail(token);
    res
      .status(200)
      .send(
        JSON.stringify({ message: "Check your email for verification link." }),
      );
  } catch (e) {
    next(e);
  }
}
export async function signup(req: Request, res: Response, next: NextFunction) {
  const password: string = req.body.password;
  const signupToken: string = req.body.token;

  try {
    const info = verifySignupToken(signupToken);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: info.username,
        password: hashedPassword,
        email: info.email,
      },
    });

    const jwt_token = createJwt({
      username: user.username,
      id: user.id,
    });

    res.status(200);
    res.json({
      username: user.username,
      email: user.email,
      id: user.id,
      token: jwt_token,
    });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("EXPIRED", 400));
    }
  }
}
