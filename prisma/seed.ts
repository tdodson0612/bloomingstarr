// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo business
  const business = await prisma.business.upsert({
    where: { id: "demo-business" },
    update: {},
    create: {
      id: "demo-business",
      name: "Blooming Starr Nursery",
    },
  });

  console.log("✅ Created business:", business.name);

  // Create test users with NUMERIC passwords
  const users = [
    {
      employeeId: "1000",
      password: "1111",
      name: "Alice Owner",
      email: "alice@bloomingstarr.com",
      role: "OWNER",
    },
    {
      employeeId: "2000",
      password: "2222",
      name: "Bob Manager",
      email: "bob@bloomingstarr.com",
      role: "MANAGER",
    },
    {
      employeeId: "3000",
      password: "3333",
      name: "Charlie Employee",
      email: "charlie@bloomingstarr.com",
      role: "EMPLOYEE",
    },
  ];

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    const created = await prisma.user.upsert({
      where: { employeeId: user.employeeId },
      update: {
        password: hashedPassword,
        name: user.name,
        email: user.email,
        role: user.role as any,
      },
      create: {
        employeeId: user.employeeId,
        password: hashedPassword,
        name: user.name,
        email: user.email,
        role: user.role as any,
        businessId: business.id,
      },
    });
    console.log(`✅ Created/Updated user: ${created.name} (${user.employeeId})`);
  }

  // ========================================
  // SEED TABLE METADATA
  // ========================================
  console.log("\n📊 Seeding table metadata...");

  const tables = [
    {
      slug: "plant-intake",
      displayName: "Plant Intake",
      order: 1,
      columns: [
        { fieldName: "dateReceived", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "sku", displayName: "SKU", dataType: "text", order: 2 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 3 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 4 },
        { fieldName: "size", displayName: "Size", dataType: "text", order: 5 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 6 },
        { fieldName: "vendor", displayName: "Vendor", dataType: "text", order: 7 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 8 },
      ],
    },
    {
      slug: "product-intake",
      displayName: "Product Intake",
      order: 2,
      columns: [
        { fieldName: "dateReceived", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "productName", displayName: "Product Name", dataType: "text", order: 2 },
        { fieldName: "category", displayName: "Category", dataType: "text", order: 3 },
        { fieldName: "brand", displayName: "Brand", dataType: "text", order: 4 },
        { fieldName: "sku", displayName: "SKU", dataType: "text", order: 5 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 6 },
        { fieldName: "unit", displayName: "Unit", dataType: "text", order: 7 },
        { fieldName: "unitCost", displayName: "Unit Cost", dataType: "currency", order: 8 },
        { fieldName: "totalCost", displayName: "Total Cost", dataType: "currency", order: 9 },
        { fieldName: "vendor", displayName: "Vendor", dataType: "text", order: 10 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 11 },
      ],
    },
    {
      slug: "transplant-log",
      displayName: "Transplant Log",
      order: 3,
      columns: [
        { fieldName: "transplantDate", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "plantName", displayName: "Plant Name", dataType: "text", order: 2 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 3 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 4 },
        { fieldName: "fromSize", displayName: "From Size", dataType: "text", order: 5 },
        { fieldName: "toSize", displayName: "To Size", dataType: "text", order: 6 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 7 },
        { fieldName: "location", displayName: "Location", dataType: "text", order: 8 },
        { fieldName: "employee", displayName: "Employee", dataType: "text", order: 9 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 10 },
      ],
    },
    {
      slug: "treatment-tracking",
      displayName: "Treatment Tracking",
      order: 4,
      columns: [
        { fieldName: "treatmentDate", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "plantName", displayName: "Plant Name", dataType: "text", order: 2 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 3 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 4 },
        { fieldName: "treatmentType", displayName: "Treatment Type", dataType: "text", order: 5 },
        { fieldName: "product", displayName: "Product", dataType: "text", order: 6 },
        { fieldName: "dosage", displayName: "Dosage", dataType: "text", order: 7 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 8 },
        { fieldName: "location", displayName: "Location", dataType: "text", order: 9 },
        { fieldName: "reason", displayName: "Reason", dataType: "text", order: 10 },
        { fieldName: "employee", displayName: "Employee", dataType: "text", order: 11 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 12 },
      ],
    },
    {
      slug: "fertilizer-log",
      displayName: "Fertilizer Log",
      order: 5,
      columns: [
        { fieldName: "applicationDate", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "plantName", displayName: "Plant Name", dataType: "text", order: 2 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 3 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 4 },
        { fieldName: "fertilizerType", displayName: "Fertilizer Type", dataType: "text", order: 5 },
        { fieldName: "brand", displayName: "Brand", dataType: "text", order: 6 },
        { fieldName: "npkRatio", displayName: "NPK Ratio", dataType: "text", order: 7 },
        { fieldName: "applicationRate", displayName: "Application Rate", dataType: "text", order: 8 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 9 },
        { fieldName: "location", displayName: "Location", dataType: "text", order: 10 },
        { fieldName: "employee", displayName: "Employee", dataType: "text", order: 11 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 12 },
      ],
    },
    {
      slug: "overhead-expenses",
      displayName: "Overhead Expenses",
      order: 6,
      columns: [
        { fieldName: "expenseDate", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "category", displayName: "Category", dataType: "text", order: 2 },
        { fieldName: "description", displayName: "Description", dataType: "text", order: 3 },
        { fieldName: "vendor", displayName: "Vendor", dataType: "text", order: 4 },
        { fieldName: "amount", displayName: "Amount", dataType: "currency", order: 5 },
        { fieldName: "paymentMethod", displayName: "Payment Method", dataType: "text", order: 6 },
        { fieldName: "invoiceNumber", displayName: "Invoice #", dataType: "text", order: 7 },
        { fieldName: "employee", displayName: "Employee", dataType: "text", order: 8 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 9 },
      ],
    },
    {
      slug: "sales",
      displayName: "Sales",
      order: 7,
      columns: [
        { fieldName: "saleDate", displayName: "Date", dataType: "date", order: 1, isRequired: true },
        { fieldName: "customerName", displayName: "Customer", dataType: "text", order: 2 },
        { fieldName: "plantName", displayName: "Plant Name", dataType: "text", order: 3 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 4 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 5 },
        { fieldName: "size", displayName: "Size", dataType: "text", order: 6 },
        { fieldName: "quantity", displayName: "Quantity", dataType: "number", order: 7 },
        { fieldName: "unitPrice", displayName: "Unit Price", dataType: "currency", order: 8 },
        { fieldName: "totalPrice", displayName: "Total Price", dataType: "currency", order: 9 },
        { fieldName: "paymentMethod", displayName: "Payment Method", dataType: "text", order: 10 },
        { fieldName: "employee", displayName: "Employee", dataType: "text", order: 11 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 12 },
      ],
    },
    {
      slug: "pricing",
      displayName: "Pricing",
      order: 8,
      columns: [
        { fieldName: "plantName", displayName: "Plant Name", dataType: "text", order: 1 },
        { fieldName: "genus", displayName: "Genus", dataType: "text", order: 2 },
        { fieldName: "cultivar", displayName: "Cultivar", dataType: "text", order: 3 },
        { fieldName: "size", displayName: "Size", dataType: "text", order: 4 },
        { fieldName: "basePrice", displayName: "Base Price", dataType: "currency", order: 5 },
        { fieldName: "markup", displayName: "Markup (%)", dataType: "number", order: 6 },
        { fieldName: "finalPrice", displayName: "Final Price", dataType: "currency", order: 7 },
        { fieldName: "category", displayName: "Category", dataType: "text", order: 8 },
        { fieldName: "notes", displayName: "Notes", dataType: "text", order: 9 },
      ],
    },
  ];

  for (const tableData of tables) {
    // Check if table metadata already exists
    const existing = await prisma.tableMetadata.findUnique({
      where: {
        businessId_slug: {
          businessId: business.id,
          slug: tableData.slug,
        },
      },
    });

    if (existing) {
      console.log(`  ⏭️  Table ${tableData.slug} already exists, skipping...`);
      continue;
    }

    await prisma.tableMetadata.create({
      data: {
        businessId: business.id,
        slug: tableData.slug,
        displayName: tableData.displayName,
        order: tableData.order,
        isVisible: true,
        columns: {
          create: tableData.columns,
        },
      },
    });

    console.log(`  ✅ Created ${tableData.displayName} with ${tableData.columns.length} columns`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Test accounts:");
  console.log("   Owner:    ID: 1000, PIN: 1111");
  console.log("   Manager:  ID: 2000, PIN: 2222");
  console.log("   Employee: ID: 3000, PIN: 3333");
  console.log("\n📊 Table metadata seeded for 8 tables");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });