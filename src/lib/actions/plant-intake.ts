"use server";

import { prisma } from "@/lib/db";
import { requireEditAccess, requireBusinessAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// DELETE PLANT INTAKE
// ============================================
export async function deletePlantIntake(id: string) {
  // 1. Check role (Manager/Owner only)
  await requireEditAccess();
  
  // 2. Fetch record to validate business ownership
  const record = await prisma.plantIntake.findUnique({
    where: { id },
    select: { businessId: true },
  });
  
  if (!record) {
    throw new Error("Record not found");
  }
  
  // 3. Validate business access
  await requireBusinessAccess(record.businessId);
  
  // 4. Delete
  await prisma.plantIntake.delete({
    where: { id },
  });
  
  // 5. Revalidate and redirect
  revalidatePath("/plant-intake");
  redirect("/plant-intake");
}

// ============================================
// CREATE PLANT INTAKE
// ============================================
export async function createPlantIntake(formData: FormData) {
  const session = await requireEditAccess();
  
  const dateReceivedStr = formData.get("dateReceived") as string | null;
  
  const data = {
    businessId: session.businessId,
    sku: formData.get("sku") as string | null,
    genus: formData.get("genus") as string | null,
    cultivar: formData.get("cultivar") as string | null,
    size: formData.get("size") as string | null,
    quantity: formData.get("quantity") ? parseInt(formData.get("quantity") as string) : null,
    vendor: formData.get("vendor") as string | null,
    dateReceived: dateReceivedStr ? new Date(dateReceivedStr) : null,
    notes: formData.get("notes") as string | null,
  };
  
  await prisma.plantIntake.create({ data });
  
  revalidatePath("/plant-intake");
  redirect("/plant-intake");
}

// ============================================
// UPDATE PLANT INTAKE
// ============================================
export async function updatePlantIntake(id: string, formData: FormData) {
  await requireEditAccess();
  
  // Validate business ownership
  const existing = await prisma.plantIntake.findUnique({
    where: { id },
    select: { businessId: true },
  });
  
  if (!existing) throw new Error("Record not found");
  await requireBusinessAccess(existing.businessId);
  
  const dateReceivedStr = formData.get("dateReceived") as string | null;
  
  const data = {
    sku: formData.get("sku") as string | null,
    genus: formData.get("genus") as string | null,
    cultivar: formData.get("cultivar") as string | null,
    size: formData.get("size") as string | null,
    quantity: formData.get("quantity") ? parseInt(formData.get("quantity") as string) : null,
    vendor: formData.get("vendor") as string | null,
    dateReceived: dateReceivedStr ? new Date(dateReceivedStr) : null,
    notes: formData.get("notes") as string | null,
  };
  
  await prisma.plantIntake.update({
    where: { id },
    data,
  });
  
  revalidatePath("/plant-intake");
  redirect("/plant-intake");
}