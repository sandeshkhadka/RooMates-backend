import { Request, Response } from "express";
import prisma from "../db";

type ContributionDistribution = {
  byUser: {
    userId: string;
    amount: number;
  }[];
};

export async function getContributionDistribution(req: Request, res: Response) {
  const distribution: ContributionDistribution = {
    byUser: [],
  };
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
}
export async function getPendingTasks(req: Request, res: Response) {
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
}
