import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateSale(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("sales", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.sales.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update sale record");
  }

  redirect("/sales");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteSale(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.sales.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete sale record");
  }

  redirect("/sales");
}

export default async function EditSalePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.sales.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="sales"
      mode="edit"
      record={record}
      onSubmit={updateSale.bind(null, params.id)}
      onDelete={deleteSale.bind(null, params.id)}
      cancelHref="/sales"
    />
  );
}