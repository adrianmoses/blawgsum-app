/*
  Warnings:

  - Added the required column `projectId` to the `UserMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserMedia" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserMedia" ADD CONSTRAINT "UserMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
