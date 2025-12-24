import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateTransplantLog(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("transplant-log", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.transplantLog.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update transplant log record");
  }

  redirect("/transplant-log");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteTransplantLog(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.transplantLog.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete transplant log record");
  }

  redirect("/transplant-log");
}

export default async function EditTransplantLogPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.transplantLog.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="transplant-log"
      mode="edit"
      record={record}
      onSubmit={updateTransplantLog.bind(null, params.id)}
      onDelete={deleteTransplantLog.bind(null, params.id)}
      cancelHref="/transplant-log"
    />
  );
}