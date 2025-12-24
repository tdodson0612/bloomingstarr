import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updatePlantIntake(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("plant-intake", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.plantIntake.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update plant intake record");
  }

  redirect("/plant-intake");
}

// --- SERVER ACTION FOR DELETING ---
async function deletePlantIntake(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.plantIntake.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete plant intake record");
  }

  redirect("/plant-intake");
}

export default async function EditPlantIntakePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.plantIntake.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="plant-intake"
      mode="edit"
      record={record}
      onSubmit={updatePlantIntake.bind(null, params.id)}
      onDelete={deletePlantIntake.bind(null, params.id)}
      cancelHref="/plant-intake"
    />
  );
}