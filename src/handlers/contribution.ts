import { Request, Response } from "express";
import prisma from "../db";

export async function getContributions(req: Request, res: Response) {
  const contributions = await prisma.contribution.findMany();

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
