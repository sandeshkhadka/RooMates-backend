import { NextFunction, Request, Response } from "express";
import prisma from "../db.js";
import CustomError from "../modules/errors.js";

type ContributionDistribution = {
  byUser: {
    userId: string;
    amount: number;
  }[];
};

export async function getContributionDistribution(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const distribution: ContributionDistribution = {
    byUser: [],
  };
  try {
    const grouped = await prisma.contribution.groupBy({
      by: ["belongsToId"],
      _sum: {
        amount: true,
      },
    });
    const contribution = grouped.map((item) => ({
      userId: item.belongsToId,
      amount: item._sum.amount || 0,
    }));
    distribution.byUser = contribution;

    res.json(distribution);
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get contribution distribution", 500));
    }
  }
}
export async function getPendingTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const groupedtasks = await prisma.routineTask.groupBy({
      by: ["belongsToId"],
      _count: {
        id: true,
      },
      where: {
        status: "Pending",
      },
    });
    const tasks = groupedtasks.map((item) => ({
      userId: item.belongsToId,
      amount: item._count.id,
    }));
    res.status(200);
    res.json({ tasks });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get pending task", 500));
    }
  }
}
