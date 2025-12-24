import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateOverheadExpense(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("overhead-expenses", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.overheadExpenses.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update overhead expense record");
  }

  redirect("/overhead-expenses");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteOverheadExpense(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.overheadExpenses.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete overhead expense record");
  }

  redirect("/overhead-expenses");
}

export default async function EditOverheadExpensePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.overheadExpenses.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="overhead-expenses"
      mode="edit"
      record={record}
      onSubmit={updateOverheadExpense.bind(null, params.id)}
      onDelete={deleteOverheadExpense.bind(null, params.id)}
      cancelHref="/overhead-expenses"
    />
  );
}