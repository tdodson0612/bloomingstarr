/*
  Warnings:

  - You are about to drop the column `loginCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_loginCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginCode",
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");
