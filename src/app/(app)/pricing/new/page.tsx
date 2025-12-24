import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requirePricingAccess } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createPricing(formData: FormData) {
  "use server";
  const session = await requirePricingAccess();

  const data = validateAndPrepareData("pricing", formData, session.businessId);

  try {
    await prisma.pricing.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save pricing record");
  }

  redirect("/pricing");
}

export default function NewPricingPage() {
  return (
    <DataForm
      slug="pricing"
      mode="new"
      onSubmit={createPricing}
      cancelHref="/pricing"
    />
  );
}