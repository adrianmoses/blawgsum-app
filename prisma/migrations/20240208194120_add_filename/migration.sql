/*
  Warnings:

  - You are about to drop the column `media` on the `UserMedia` table. All the data in the column will be lost.
  - Added the required column `filename` to the `UserMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `UserMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserMedia" DROP COLUMN "media",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
