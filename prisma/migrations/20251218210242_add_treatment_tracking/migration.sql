-- CreateTable
CREATE TABLE "TreatmentTracking" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "treatmentDate" TIMESTAMP(6),
    "plantName" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "treatmentType" TEXT,
    "product" TEXT,
    "dosage" TEXT,
    "quantity" INTEGER,
    "location" TEXT,
    "reason" TEXT,
    "employee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TreatmentTracking_businessId_idx" ON "TreatmentTracking"("businessId");

-- CreateIndex
CREATE INDEX "TreatmentTracking_treatmentDate_idx" ON "TreatmentTracking"("treatmentDate");

-- CreateIndex
CREATE INDEX "TreatmentTracking_treatmentType_idx" ON "TreatmentTracking"("treatmentType");

-- AddForeignKey
ALTER TABLE "TreatmentTracking" ADD CONSTRAINT "TreatmentTracking_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
