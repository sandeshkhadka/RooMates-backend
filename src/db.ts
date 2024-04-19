import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const PAGE_SIZE = 10;
export default prisma;
