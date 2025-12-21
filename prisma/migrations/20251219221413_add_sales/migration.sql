-- CreateTable
CREATE TABLE "Sales" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "saleDate" TIMESTAMP(6),
    "customerName" TEXT,
    "plantName" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "size" TEXT,
    "quantity" INTEGER,
    "unitPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "paymentMethod" TEXT,
    "employee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sales_businessId_idx" ON "Sales"("businessId");

-- CreateIndex
CREATE INDEX "Sales_saleDate_idx" ON "Sales"("saleDate");

-- CreateIndex
CREATE INDEX "Sales_customerName_idx" ON "Sales"("customerName");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
