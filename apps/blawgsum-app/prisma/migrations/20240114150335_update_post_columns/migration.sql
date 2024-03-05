/*
  Warnings:

  - You are about to drop the column `headline` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatetAt` on the `Post` table. All the data in the column will be lost.
  - Added the required column `isPublished` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `savedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "headline",
DROP COLUMN "updatetAt",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL,
ADD COLUMN     "savedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
