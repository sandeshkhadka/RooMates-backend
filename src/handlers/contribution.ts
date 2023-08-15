import { Request, Response } from "express";
import prisma from "../db";

export async function approveContribution(req: Request, res: Response) {
  const username: string = req.user!.username;
  const contributionId: string = req.params.id;

  const contribution = await prisma.contribution.findUnique({
    where: {
      id: contributionId,
    },
  });
  if (!contribution) {
    res.status(400);
    return res.json({ message: "No such contribution found" });
  }
  const approvedBy = contribution.approvedBy;
  if (approvedBy.includes(username)) {
    res.status(200);
    return res.json({ message: "already approved" });
  }
  const totalUsers = await prisma.user.findMany();
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
}
export async function deleteContribuion(req: Request, res: Response) {
  const contributionId = req.params.id;
  const userId = req.user!.id;

  const contribution = await prisma.contribution.findUnique({
    where: {
      id: contributionId,
    },
  });

  if (!contribution) {
    res.status(400);
    return res.json({ message: "no such contribution" });
  }

  if (contribution.belongsToId !== userId) {
    res.status(401);
    return res.json({ message: "not authorized to do that" });
  }

  const deleted = await prisma.contribution.delete({
    where: {
      id: contributionId,
    },
  });

  res.status(200);
  res.json({ deleted });
}
export async function getContributions(req: Request, res: Response) {
  const contributions = await prisma.contribution.findMany({
    include: {
      belongsTo: {
        select: {
          username: true,
        },
      },
    },
  });

  res.status(200);
  res.json({ contributions });
}
export async function getContributionById(req: Request, res: Response) {
  const id = req.params.id;
  const contribution = await prisma.contribution.findUnique({
    where: {
      id: id,
    },
  });

  res.status(200);
  res.json({ contribution });
}

export async function updateContibutions(req: Request, res: Response) {
  const name: string = req.body.name;
  const amount: number = req.body.amount;
  const type: string = req.body.type;
  const contibutionId = req.params.id;
  const userId = req.user!.id;
  const contribution = await prisma.contribution.findUnique({
    where: {
      id: contibutionId,
    },
  });

  if (!contribution) {
    res.status(400);
    return res.json({ message: "No such contribution found" });
  }
  if (userId !== contribution.belongsToId) {
    res.status(400);
    return res.json({ message: "You don't own this contribution" });
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
}

export async function createContribution(req: Request, res: Response) {
  const name: string = req.body.name;
  const type: string = req.body.type;
  const belongsToId: string = req.user!.id;
  const amount: number = req.body.amount;
  const username: string = req.user!.username;
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
}
