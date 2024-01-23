import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { sendVerificationMail } from "../services/EmailServices.js";
import {
  comparePassword,
  createJwt,
  createSignupToken,
  hashPassword,
  verifySignupToken,
} from "../modules/auth.js";
import CustomError from "../modules/errors.js";
import prisma from "../db.js";

export async function signin(req: Request, res: Response, next: NextFunction) {
  const username: string = req.body.username;
  const password: string = req.body.password;
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
    sendVerificationMail(token, email);
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
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("form parse error");
      }
      if (!(fields.password && fields.token && files.profile)) {
        throw new Error("insufficinet fileds");
      }
      const [password] = fields.password;
      const [signupToken] = fields.token;
      const [image] = files.profile;

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
      const pwd = dirname(fileURLToPath(import.meta.url));
      const spwd = pwd.split("/");
      spwd.splice(spwd.length - 2);
      const path = `${spwd.join("/")}/uploads/profile_pic/${user.id}.jpeg`;
      fs.writeFile(path, await fs.readFile(image.filepath)).then(() => {
        res.status(200);
        res.json({
          username: user.username,
          email: user.email,
          id: user.id,
          token: jwt_token,
        });
      });
    } catch (err) {
      if (err instanceof CustomError) {
        next(err);
      } else {
        next(new CustomError("EXPIRED", 400));
      }
    }
  });
}
