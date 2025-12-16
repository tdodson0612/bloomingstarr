import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET → return all plant intake records
export async function GET() {
  try {
    const plants = await prisma.plantIntake.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plants);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST → create a new record
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newPlant = await prisma.plantIntake.create({
      data,
    });

    return NextResponse.json(newPlant, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
