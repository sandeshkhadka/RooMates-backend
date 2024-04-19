import { NextFunction, Request, Response } from "express";
import prisma, { PAGE_SIZE } from "../db.js";
import CustomError from "../modules/errors.js";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const name: string = req.body.name;
  const belongsToid: string = req.body.assignToId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: belongsToid,
      },
    });
    if (!user) {
      throw new CustomError("User not found", 400);
    }
    const task = await prisma.routineTask.create({
      data: {
        belongsToId: belongsToid,
        name: name,
      },
    });

    res.status(200);
    res.json({ task });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not create task", 500));
    }
  }
}

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const page = req.body.page;
  const offset = (parseInt(page) - 1) * PAGE_SIZE;
  try {
    const tasks = await prisma.routineTask.findMany({
      take: PAGE_SIZE,
      skip: offset,
    });

    res.status(200);
    res.json({ tasks });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get task", 500));
    }
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = req.body.status;
  const name = req.body.name;
  const userId = req.user!.id;
  // const schedule = req.body.schedule;
  const taskId = req.params.id;
  try {
    const task = await prisma.routineTask.findUnique({
      where: {
        id: taskId,
        belongsToId: userId,
      },
    });
    if (!task) {
      throw new CustomError("No such task found", 404);
    }
    const updatedTask = await prisma.routineTask.update({
      where: {
        id: taskId,
        belongsToId: userId,
      },
      data: {
        status: status,
        name: name,
        // schedule: schedule,
      },
    });

    res.status(200);
    res.json({ updatedTask });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not update task", 500));
    }
  }
}
export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const taskId = req.params.id;
  const userId = req.user!.id;
  try {
    const deletedTask = await prisma.routineTask.delete({
      where: {
        id: taskId,
        belongsToId: userId,
      },
    });
    if (!deletedTask) {
      throw new CustomError("No such task", 404);
    }
    res.status(200);
    res.json({ deletedTask });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not delete task", 500));
    }
  }
}
export async function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const taskId = req.params.id;
  try {
    const task = await prisma.routineTask.findUnique({
      where: {
        id: taskId,
      },
      include: {
        belongsTo: true,
      },
    });
    if (!task) {
      throw new CustomError("No such task found", 404);
    }
    res.status(200);
    res.json({ task });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get task", 500));
    }
  }
}
