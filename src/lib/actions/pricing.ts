"use server";

import { prisma } from "@/lib/db";
import { requireEditAccess, requirePricingAccess, requireBusinessAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// DELETE PRICING
// ============================================
export async function deletePricing(id: string) {
  // 1. Check role (Manager/Owner only)
  await requireEditAccess();
  
  // 2. Fetch record to validate business ownership
  const record = await prisma.pricing.findUnique({
    where: { id },
    select: { businessId: true },
  });
  
  if (!record) {
    throw new Error("Record not found");
  }
  
  // 3. Validate business access
  await requireBusinessAccess(record.businessId);
  
  // 4. Delete
  await prisma.pricing.delete({
    where: { id },
  });
  
  // 5. Revalidate and redirect
  revalidatePath("/pricing");
  redirect("/pricing");
}

// ============================================
// CREATE PRICING
// ============================================
export async function createPricing(formData: FormData) {
  const session = await requireEditAccess();
  
  const data = {
    businessId: session.businessId,
    plantName: formData.get("plantName") as string | null,
    genus: formData.get("genus") as string | null,
    cultivar: formData.get("cultivar") as string | null,
    size: formData.get("size") as string | null,
    basePrice: formData.get("basePrice") ? parseFloat(formData.get("basePrice") as string) : null,
    markup: formData.get("markup") ? parseFloat(formData.get("markup") as string) : null,
    finalPrice: formData.get("finalPrice") ? parseFloat(formData.get("finalPrice") as string) : null,
    category: formData.get("category") as string | null,
    notes: formData.get("notes") as string | null,
  };
  
  await prisma.pricing.create({ data });
  
  revalidatePath("/pricing");
  redirect("/pricing");
}

// ============================================
// UPDATE PRICING
// ============================================
export async function updatePricing(id: string, formData: FormData) {
  await requireEditAccess();
  
  // Validate business ownership
  const existing = await prisma.pricing.findUnique({
    where: { id },
    select: { businessId: true },
  });
  
  if (!existing) throw new Error("Record not found");
  await requireBusinessAccess(existing.businessId);
  
  const data = {
    plantName: formData.get("plantName") as string | null,
    genus: formData.get("genus") as string | null,
    cultivar: formData.get("cultivar") as string | null,
    size: formData.get("size") as string | null,
    basePrice: formData.get("basePrice") ? parseFloat(formData.get("basePrice") as string) : null,
    markup: formData.get("markup") ? parseFloat(formData.get("markup") as string) : null,
    finalPrice: formData.get("finalPrice") ? parseFloat(formData.get("finalPrice") as string) : null,
    category: formData.get("category") as string | null,
    notes: formData.get("notes") as string | null,
  };
  
  await prisma.pricing.update({
    where: { id },
    data,
  });
  
  revalidatePath("/pricing");
  redirect("/pricing");
}