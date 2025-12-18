-- CreateTable
CREATE TABLE "ProductIntake" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productName" TEXT,
    "category" TEXT,
    "brand" TEXT,
    "sku" TEXT,
    "quantity" INTEGER,
    "unit" TEXT,
    "unitCost" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "vendor" TEXT,
    "dateReceived" TIMESTAMP(6),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductIntake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductIntake_businessId_idx" ON "ProductIntake"("businessId");

-- CreateIndex
CREATE INDEX "ProductIntake_category_idx" ON "ProductIntake"("category");

-- CreateIndex
CREATE INDEX "ProductIntake_dateReceived_idx" ON "ProductIntake"("dateReceived");

-- AddForeignKey
ALTER TABLE "ProductIntake" ADD CONSTRAINT "ProductIntake_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
