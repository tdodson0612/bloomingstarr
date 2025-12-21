-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "plantName" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "size" TEXT,
    "basePrice" DOUBLE PRECISION,
    "markup" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pricing_businessId_idx" ON "Pricing"("businessId");

-- CreateIndex
CREATE INDEX "Pricing_plantName_idx" ON "Pricing"("plantName");

-- CreateIndex
CREATE INDEX "Pricing_category_idx" ON "Pricing"("category");

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
