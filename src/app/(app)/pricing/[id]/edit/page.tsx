import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requirePricingAccess } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updatePricing(id: string, formData: FormData) {
  "use server";
  const session = await requirePricingAccess();

  const data = validateAndPrepareData("pricing", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.pricing.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update pricing record");
  }

  redirect("/pricing");
}

// --- SERVER ACTION FOR DELETING ---
async function deletePricing(id: string) {
  "use server";
  const session = await requirePricingAccess();

  try {
    await prisma.pricing.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete pricing record");
  }

  redirect("/pricing");
}

export default async function EditPricingPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requirePricingAccess();

  const record = await prisma.pricing.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="pricing"
      mode="edit"
      record={record}
      onSubmit={updatePricing.bind(null, params.id)}
      onDelete={deletePricing.bind(null, params.id)}
      cancelHref="/pricing"
    />
  );
}