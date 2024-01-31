import { NextFunction, Request, Response } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import CustomError from "../modules/errors.js";
import prisma from "../db.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import formidable from "formidable";
import {
  comparePassword,
  createJwt,
  createTemporaryToken,
  hashPassword,
  verifyTemporaryToken,
} from "../modules/auth.js";
import jwtPkg from "jsonwebtoken";
const { JsonWebTokenError } = jwtPkg;
import { sendPasswordResetMail } from "../services/EmailServices.js";
export async function getProfilePicture(req: Request, res: Response) {
  const id = req.params.id;
  const pwd = dirname(fileURLToPath(import.meta.url));
  const spwd = pwd.split("/");
  spwd.splice(spwd.length - 2);
  const path = `${spwd.join("/")}/uploads/profile_pic/${id}.jpeg`;
  res.sendFile(path, (err) => {
    if (err) {
      res.status(400).send("Couldn't find image");
    }
  });
}

export async function changeUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.user!.id;
    const username = req.user!.username;
    const newUsername: string = req.body.newUsername;
    if (!newUsername) {
      throw new CustomError("bad username", 400);
    }
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: newUsername,
      },
    });
    const token = createJwt({
      username: user.username,
      email: user.email,
      id: user.id,
    });
    res.status(200).send({
      userid: user.id,
      old_username: username,
      updated_username: user.username,
      token: token,
    });
  } catch (e) {
    if (e instanceof CustomError) {
      next(e);
    } else if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == "P2002") {
        next(new CustomError("username not availabe", 409));
      }
    } else {
      next(new CustomError("failed to change username", 500));
    }
  }
}
export async function changeProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.user!.id;
  const form = formidable({});
  form.parse(req, async (err, _fields, files) => {
    try {
      if (err) {
        throw new Error("failed to parse form");
      }
      const newProfile = files.profile;
      if (!newProfile) {
        throw new CustomError("new profile picture not received", 400);
      }
      const image = newProfile[0];

      const pwd = dirname(fileURLToPath(import.meta.url));
      const spwd = pwd.split("/");
      spwd.splice(spwd.length - 2);
      const path = `${spwd.join("/")}/uploads/profile_pic/${id}.jpeg`;
      await fs.writeFile(path, await fs.readFile(image.filepath));
      res.status(200).send({
        message: "profile picture updated",
      });
    } catch (e) {
      if (e instanceof CustomError) {
        next(e);
      }
    }
  });
}
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const oldPasword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const id = req.user!.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new CustomError("no such user", 404);
    }
    if (!(await comparePassword(oldPasword, user.password))) {
      throw new CustomError("wrong password", 401);
    }
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).send({
      message: "Password change successfull",
    });
  } catch (e) {
    if (e instanceof CustomError) {
      next(e);
    } else {
      next(new Error("Could not change password"));
    }
  }
}
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.body.token;
  const newPassword = req.body.newPassword;
  try {
    const user = verifyTemporaryToken(token);
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: {
        username: user.username,
        email: user.email,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatedUser) {
      throw new CustomError("no such user", 404);
    }
    res.status(200).send({
      message: "Password reset successfull",
    });
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      next(new CustomError("expired", 401));
    } else {
      next(e);
    }
  }
}
export async function requestResetLink(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email: string = req.body.email;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new CustomError("No such user", 404);
    }
    const token = createTemporaryToken({
      username: user.username,
      email: user.email,
    });
    sendPasswordResetMail(token, user.email);
    res.status(200).send({
      message: "reset link sent",
    });
  } catch (e) {
    next(e);
  }
}
