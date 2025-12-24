import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createPlantIntake(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("plant-intake", formData, session.businessId);

  try {
    await prisma.plantIntake.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save plant intake record");
  }

  redirect("/plant-intake");
}

export default function NewPlantIntakePage() {
  return (
    <DataForm
      slug="plant-intake"
      mode="new"
      onSubmit={createPlantIntake}
      cancelHref="/plant-intake"
    />
  );
}