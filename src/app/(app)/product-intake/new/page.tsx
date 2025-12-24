import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createProductIntake(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("product-intake", formData, session.businessId);

  try {
    await prisma.productIntake.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save product intake record");
  }

  redirect("/product-intake");
}

export default function NewProductIntakePage() {
  return (
    <DataForm
      slug="product-intake"
      mode="new"
      onSubmit={createProductIntake}
      cancelHref="/product-intake"
    />
  );
}