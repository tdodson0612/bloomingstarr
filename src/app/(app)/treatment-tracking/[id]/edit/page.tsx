import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateTreatmentTracking(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("treatment-tracking", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.treatmentTracking.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update treatment tracking record");
  }

  redirect("/treatment-tracking");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteTreatmentTracking(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.treatmentTracking.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete treatment tracking record");
  }

  redirect("/treatment-tracking");
}

export default async function EditTreatmentTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.treatmentTracking.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="treatment-tracking"
      mode="edit"
      record={record}
      onSubmit={updateTreatmentTracking.bind(null, params.id)}
      onDelete={deleteTreatmentTracking.bind(null, params.id)}
      cancelHref="/treatment-tracking"
    />
  );
}