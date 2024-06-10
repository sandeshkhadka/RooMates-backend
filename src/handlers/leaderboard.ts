import { NextFunction, Request, Response } from "express";
import prisma from "../db.js";
import CustomError from "../modules/errors.js";

type ContributionLeaderboard = {
  rank: number;
  userId: string;
  amount: number;
}[];
type ExpenseLeaderboard = {
  rank: number;
  category: string;
  amount: {
    amount: number | null;
  };
}[];
type TaskLeaderboard = {
  pending: {
    userId: string;
    amount: number;
  }[];
  completed: {
    userId: string;
    amount: number;
  }[];
  missed: {
    userId: string;
    amount: number;
  }[];
};

export async function contributionLeaderboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const grouped = await prisma.contribution.groupBy({
      by: ["belongsToId"],
      _sum: {
        amount: true,
      },
      orderBy: [
        {
          _sum: {
            amount: "desc",
          },
        },
      ],
    });
    const contribution = grouped.map((item, index) => ({
      rank: index + 1,
      userId: item.belongsToId,
      amount: item._sum.amount || 0,
    }));
    const leaderboard: ContributionLeaderboard = contribution;

    res.json(leaderboard);
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get contribution distribution", 500));
    }
  }
}
export async function expenseTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await prisma.$queryRaw`SELECT "Contribution"."createdAt"::date, SUM("Contribution".amount) FROM "Contribution" GROUP BY 1 ORDER BY 1 ASC;`

    res.status(200)
    res.json(JSON.parse(JSON.stringify(data, (key, value) => (typeof value == "bigint" ? value.toString() : value))))
  } catch (e) {
    if (e instanceof CustomError) {
      next(e)
    } else {
      console.log(e)
      next(new CustomError("Couldn't get expense chart", 500))
    }
  }
}
export async function taskleaderboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const groupedtasks = await prisma.routineTask.groupBy({
      by: ["belongsToId", "status"],
      _count: {
        id: true,
      },
      // where: {
      //   status: "Pending",
      // },
    });
    const pending = groupedtasks
      .filter((item) => item.status == "Pending")
      .map((item) => ({ userId: item.belongsToId, amount: item._count.id }));
    const completed = groupedtasks
      .filter((item) => item.status == "Completed")
      .map((item) => ({ userId: item.belongsToId, amount: item._count.id }));
    const missed = groupedtasks
      .filter((item) => item.status == "Missed")
      .map((item) => ({ userId: item.belongsToId, amount: item._count.id }));
    res.status(200);
    const leaderboard: TaskLeaderboard = { pending, completed, missed };
    res.json(leaderboard);
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not get pending task", 500));
    }
  }
}

export async function expenseLeaderboard(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const grouped = await prisma.contribution.groupBy({
      by: ["type"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });
    const leaderboard: ExpenseLeaderboard = grouped.map((item, index) => {
      return {
        rank: index + 1,
        category: item.type,
        amount: item._sum,
      };
    });
    res.status(200);
    res.json(leaderboard);
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("Couldnot get expense leaderboard", 500));
    }
  }
}
