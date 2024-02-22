/*
  Warnings:

  - You are about to drop the column `secretKey` on the `UserApiKey` table. All the data in the column will be lost.
  - Added the required column `keyPrefix` to the `UserApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserApiKey" DROP COLUMN "secretKey",
ADD COLUMN     "keyPrefix" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
