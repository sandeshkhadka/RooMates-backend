import { Request, Response } from "express";
import prisma from "../db";

export async function createTask(req: Request, res: Response) {
  const name: string = req.body.name;
  const belongsToid: string = req.user!.id;

  const task = await prisma.routineTask.create({
    data: {
      belongsToId: belongsToid,
      name: name,
    },
  });

  res.status(200);
  res.json({ task });
}

export async function getTasks(req: Request, res: Response) {
  const tasks = await prisma.routineTask.findMany({
    where: {
      status: "Pending",
    },
  });

  res.status(200);
  res.json({ tasks });
}

export async function updateTask(req: Request, res: Response) {
  const status = req.body.status;
  const name = req.body.status;
  // const schedule = req.body.schedule;
  const taskId = req.params.id;
  const task = await prisma.routineTask.update({
    where: {
      id: taskId,
    },
    data: {
      status: status,
      name: name,
      // schedule: schedule,
    },
  });

  res.status(200);
  res.json({ task });
}

export async function getTaskById(req: Request, res: Response) {
  const taskId = req.params.id;
  console.log(taskId);
  try {
    const task = await prisma.routineTask.findUnique({
      where: {
        id: taskId,
      },
      include: {
        belongsTo: true,
      },
    });

    res.status(200);
    res.json({ task });
  } catch (e) {
    res.status(400);
    res.json({ message: "No such task found" });
  }
}
