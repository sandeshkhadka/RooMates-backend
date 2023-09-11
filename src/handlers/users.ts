import { Request, Response } from "express";
import prisma from "../db";
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    include: {
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
}

export function rehydrate(req: Request, res: Response) {
  res.status(200);
  res.json(req.user);
}
