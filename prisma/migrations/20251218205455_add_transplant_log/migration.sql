-- CreateTable
CREATE TABLE "TransplantLog" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "transplantDate" TIMESTAMP(6),
    "plantName" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "fromSize" TEXT,
    "toSize" TEXT,
    "quantity" INTEGER,
    "location" TEXT,
    "employee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransplantLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransplantLog_businessId_idx" ON "TransplantLog"("businessId");

-- CreateIndex
CREATE INDEX "TransplantLog_transplantDate_idx" ON "TransplantLog"("transplantDate");

-- CreateIndex
CREATE INDEX "TransplantLog_plantName_idx" ON "TransplantLog"("plantName");

-- AddForeignKey
ALTER TABLE "TransplantLog" ADD CONSTRAINT "TransplantLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
