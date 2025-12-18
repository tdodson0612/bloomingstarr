/*
  Warnings:

  - Added the required column `updatedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PlantIntake" ALTER COLUMN "dateReceived" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "PlantIntake_businessId_idx" ON "PlantIntake"("businessId");

-- CreateIndex
CREATE INDEX "PlantIntake_sku_idx" ON "PlantIntake"("sku");

-- CreateIndex
CREATE INDEX "PlantIntake_dateReceived_idx" ON "PlantIntake"("dateReceived");
