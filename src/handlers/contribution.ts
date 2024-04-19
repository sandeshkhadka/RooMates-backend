import { NextFunction, Request, Response } from "express";
import prisma from "../db.js";
import CustomError from "../modules/errors.js";
export async function approveContribution(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // const userId = req.user!.id;
  const username: string = req.user!.username;
  const contributionId: string = req.params.id;

  try {
    const contribution = await prisma.contribution.findUnique({
      where: {
        id: contributionId,
      },
    });
    if (!contribution) {
      throw new CustomError("Contribution not found", 404);
    }
    const approvedBy = contribution.approvedBy;
    if (approvedBy.includes(username)) {
      res.status(200);
      return res.json({ message: "already approved" });
    }
    const totalUsers = await prisma.user.findMany({
      select: {
        username: true,
      },
    });
    const allUsernames = totalUsers.map((user) => user.username);

    approvedBy.push(username);
    let passed = true;
    allUsernames.forEach((username) => {
      if (!approvedBy.includes(username)) {
        passed = false;
      }
    });

    const updatedContribution = await prisma.contribution.update({
      where: {
        id: contributionId,
      },
      data: {
        approvedBy: approvedBy,
        passed: passed,
      },
    });

    res.status(200);
    res.json({ updatedContribution });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not update contribution", 500));
    }
  }
}
export async function deleteContribuion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const contributionId = req.params.id;
  const userId = req.user!.id;

  try {
    const deleted = await prisma.contribution.delete({
      where: {
        id: contributionId,
        belongsToId: userId,
      },
    });

    res.status(200);
    res.json({ deleted });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not delete contribution", 500));
    }
  }
}
export async function getContributions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const page = req.body.page;
  const offset = (parseInt(page) - 1) * PAGE_SIZE;
  try {
    const contributions = await prisma.contribution.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: PAGE_SIZE,
    });

    res.status(200);
    res.json({ contributions });
  } catch (err) {
    next(new CustomError("Could not get contributions", 500));
  }
}

export async function getContributionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  try {
    const contribution = await prisma.contribution.findUnique({
      where: {
        id: id,
      },
    });
    if (!contribution) {
      throw new CustomError("Contribution not found", 404);
    }
    res.status(200);
    res.json({ contribution });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError(`Could not get contribution with id :${id}`, 500));
    }
  }
}
export async function getContributionByDate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startDate = new Date(req.body.startDate).toISOString();
  const endDate = new Date(req.body.endDate).toISOString();
  try {
    const contributions = await prisma.contribution.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    res.status(200);
    res.json({ contributions });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(
        new CustomError(
          `Could not get contribution with within ${startDate} and ${endDate}`,
          500,
        ),
      );
    }
  }
}
export async function updateContibutions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const name: string = req.body.name;
  const amount: number = req.body.amount;
  const type: string = req.body.type;
  const contibutionId = req.params.id;
  const userId = req.user!.id;
  const username = req.user!.username;
  try {
    const contribution = await prisma.contribution.findUnique({
      where: {
        id: contibutionId,
      },
    });

    if (!contribution) {
      throw new CustomError("Contribution not found", 404);
    }
    if (userId !== contribution.belongsToId) {
      throw new CustomError(
        `Contribution does not belongs to ${username}`,
        401,
      );
    }
    const updatedContribution = await prisma.contribution.update({
      where: {
        id: contribution.id,
      },
      data: {
        name: name,
        amount: amount,
        type: type,
      },
    });

    res.status(200);
    res.json({ updatedContribution });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError("Could not update contribution", 500));
    }
  }
}

export async function createContribution(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const name: string = req.body.name;
  const type: string = req.body.type;
  const belongsToId: string = req.user!.id;
  const amount: number = req.body.amount;
  const username: string = req.user!.username;
  try {
    const contribution = await prisma.contribution.create({
      data: {
        name: name,
        type: type,
        belongsToId: belongsToId,
        amount: amount,
        approvedBy: [username],
      },
    });

    res.status(200);
    res.json({ contribution });
  } catch (err) {
    next(new CustomError("Could not create Contribuion", 500));
  }
}
