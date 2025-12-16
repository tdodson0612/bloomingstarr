-- CreateTable
CREATE TABLE "PlantIntake" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "sku" TEXT,
    "genus" TEXT,
    "cultivar" TEXT,
    "size" TEXT,
    "quantity" INTEGER,
    "vendor" TEXT,
    "dateReceived" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantIntake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlantIntake" ADD CONSTRAINT "PlantIntake_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
