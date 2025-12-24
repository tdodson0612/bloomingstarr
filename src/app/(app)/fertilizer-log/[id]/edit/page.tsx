import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateFertilizerLog(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("fertilizer-log", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.fertilizerLog.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update fertilizer log record");
  }

  redirect("/fertilizer-log");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteFertilizerLog(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.fertilizerLog.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete fertilizer log record");
  }

  redirect("/fertilizer-log");
}

export default async function EditFertilizerLogPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.fertilizerLog.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="fertilizer-log"
      mode="edit"
      record={record}
      onSubmit={updateFertilizerLog.bind(null, params.id)}
      onDelete={deleteFertilizerLog.bind(null, params.id)}
      cancelHref="/fertilizer-log"
    />
  );
}