/*
  Warnings:

  - You are about to drop the column `provider` on the `SocialAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialAuth" DROP COLUMN "provider";

-- AddForeignKey
ALTER TABLE "SocialAuth" ADD CONSTRAINT "SocialAuth_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "SocialProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
