-- CreateTable
CREATE TABLE "FertilizerLog" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(6),
    "plantName" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "fertilizerType" TEXT,
    "brand" TEXT,
    "npkRatio" TEXT,
    "applicationRate" TEXT,
    "quantity" INTEGER,
    "location" TEXT,
    "employee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FertilizerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FertilizerLog_businessId_idx" ON "FertilizerLog"("businessId");

-- CreateIndex
CREATE INDEX "FertilizerLog_applicationDate_idx" ON "FertilizerLog"("applicationDate");

-- CreateIndex
CREATE INDEX "FertilizerLog_fertilizerType_idx" ON "FertilizerLog"("fertilizerType");

-- AddForeignKey
ALTER TABLE "FertilizerLog" ADD CONSTRAINT "FertilizerLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
