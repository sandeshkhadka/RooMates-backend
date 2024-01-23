-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTask" DROP CONSTRAINT "RoutineTask_belongsToId_fkey";

-- AddForeignKey
ALTER TABLE "RoutineTask" ADD CONSTRAINT "RoutineTask_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
