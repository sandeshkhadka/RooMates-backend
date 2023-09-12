import { Request, Response } from "express";
import prisma from "../db";

export async function createTask(req: Request, res: Response) {
  const name: string = req.body.name;
  const belongsToid: string = req.body.assignToId;
  const user = await prisma.user.findUnique({
    where: {
      id: belongsToid,
    },
  });
  if (!user) {
    res.status(401);
    res.json({
      error: "No such user found to assign task",
    });
    return;
  }
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
  const tasks = await prisma.routineTask.findMany();

  res.status(200);
  res.json({ tasks });
}

export async function updateTask(req: Request, res: Response) {
  const status = req.body.status;
  const name = req.body.name;
  const userId = req.user!.id;
  // const schedule = req.body.schedule;
  const taskId = req.params.id;
  const task = await prisma.routineTask.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    res.status(400);
    res.json({
      message: "No such task found",
    });
    return;
  }
  if (task.belongsToId !== userId) {
    res.status(400);
    res.json({
      message: "Could not update task",
    });
    return;
  }
  const updatedTask = await prisma.routineTask.update({
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
  res.json({ updatedTask });
}
export async function deleteTask(req: Request, res: Response) {
  const taskId = req.params.id;
  const userId = req.user!.id;
  const task = await prisma.routineTask.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    res.status(400);
    res.json({ message: "No such task" });
    return;
  }
  if (task.belongsToId !== userId) {
    res.status(400);
    res.json({ message: "Could not delete task" });
    return;
  }
  const deletedTask = await prisma.routineTask.delete({
    where: {
      id: task.id,
      belongsToId: userId,
    },
  });
  res.status(200);
  res.json({ deletedTask });
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
