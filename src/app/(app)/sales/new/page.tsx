import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createSale(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("sales", formData, session.businessId);

  try {
    await prisma.sales.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save sale record");
  }

  redirect("/sales");
}

export default function NewSalePage() {
  return (
    <DataForm
      slug="sales"
      mode="new"
      onSubmit={createSale}
      cancelHref="/sales"
    />
  );
}