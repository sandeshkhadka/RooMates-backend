-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Completed', 'Missed');

-- AlterTable
ALTER TABLE "Contribution" ADD COLUMN     "approvedBy" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RoutineTask" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'Pending';
