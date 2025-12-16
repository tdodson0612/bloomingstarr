"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function deletePlantIntake(id: string) {
  await prisma.plantIntake.delete({
    where: { id },
  });

  redirect("/plant-intake");
}
    