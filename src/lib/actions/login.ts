// src/lib/actions/login.ts

"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function loginWithPin(pinOrId: string) {
  // CHANGE THIS FIELD NAME if your schema uses something else
  // e.g. { where: { pinCode: pinOrId } } or { where: { employeePin: pinOrId } }
  const user = await prisma.user.findFirst({
    where: { loginCode: pinOrId },
  });

  if (!user) return { ok: false };

  const cookieStore = await cookies();

  cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });
  cookieStore.set("role", String(user.role), { httpOnly: true, path: "/" });
  cookieStore.set("businessId", user.businessId, { httpOnly: true, path: "/" });

  return { ok: true };
}
