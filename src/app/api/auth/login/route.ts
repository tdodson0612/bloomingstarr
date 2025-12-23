import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password } = await request.json();

    if (!employeeId || !password) {
      return NextResponse.json(
        { error: "Employee ID and password are required" },
        { status: 400 }
      );
    }

    // Find user by employee ID
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Incorrect employee ID or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect employee ID or password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      userId: user.id,
      role: user.role,
      name: user.name,
      employeeId: user.employeeId,
      businessId: user.businessId,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}