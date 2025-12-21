-- CreateTable
CREATE TABLE "OverheadExpenses" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "expenseDate" TIMESTAMP(6),
    "category" TEXT,
    "description" TEXT,
    "vendor" TEXT,
    "amount" DOUBLE PRECISION,
    "paymentMethod" TEXT,
    "invoiceNumber" TEXT,
    "employee" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OverheadExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OverheadExpenses_businessId_idx" ON "OverheadExpenses"("businessId");

-- CreateIndex
CREATE INDEX "OverheadExpenses_expenseDate_idx" ON "OverheadExpenses"("expenseDate");

-- CreateIndex
CREATE INDEX "OverheadExpenses_category_idx" ON "OverheadExpenses"("category");

-- AddForeignKey
ALTER TABLE "OverheadExpenses" ADD CONSTRAINT "OverheadExpenses_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
