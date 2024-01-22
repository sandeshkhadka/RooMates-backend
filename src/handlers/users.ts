import { NextFunction, Request, Response } from "express";
import prisma from "../db.js";
import CustomError from "../modules/errors.js";
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        id: true,
        routineTasks: {
          where: {
            status: "Pending",
          },
        },
      },
    });
    const fiteredUsers = users.map((user) => {
      return { username: user.username, id: user.id, tasks: user.routineTasks };
    });
    res.status(200);
    res.json({ users: fiteredUsers });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get users", 500));
    }
  }
}

export function rehydrate(req: Request, res: Response) {
  res.status(200);
  res.json(req.user);
}
