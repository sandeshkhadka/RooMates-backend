import { Request, Response } from "express";
import { comparePassword, createJwt, hashPassword } from "../modules/auth";
import prisma from "../db";

export async function signin(req: Request, res: Response) {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user === null) {
    res.status(401);
    return res.json({
      message: "Incorrect username or password",
    });
  }
  const hashedPassword = user.password;
  const authPassed = await comparePassword(password, hashedPassword);
  if (!authPassed) {
    res.status(401);
    return res.json({
      message: "Incorrect username or password",
    });
  }
  const token = createJwt({
    username: user.username,
    id: user.id,
  });
  res.status(200);
  res.json({ token });
}

export async function signup(req: Request, res: Response) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const email: string = req.body.email;

  const hashedPassword = await hashPassword(password);

  try {
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
  } catch (e) {
    console.log(e);
    res.status(400);
    res.json({
      message: "username not available",
    });
  }
}
