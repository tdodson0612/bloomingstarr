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

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Test accounts:");
  console.log("   Owner:    ID: 1000, PIN: 1111");
  console.log("   Manager:  ID: 2000, PIN: 2222");
  console.log("   Employee: ID: 3000, PIN: 3333");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });