/*
  Warnings:

  - You are about to drop the column `key` on the `UserApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiKey]` on the table `UserApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `UserApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKey` to the `UserApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserApiKey_key_key";

-- AlterTable
ALTER TABLE "UserApiKey" DROP COLUMN "key",
ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "secretKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_apiKey_key" ON "UserApiKey"("apiKey");
