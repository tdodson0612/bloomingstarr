import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION FOR UPDATING ---
async function updateProductIntake(id: string, formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("product-intake", formData, session.businessId);
  delete data.businessId; // Can't change businessId on update

  try {
    await prisma.productIntake.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update product intake record");
  }

  redirect("/product-intake");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteProductIntake(id: string) {
  "use server";
  const session = await requireAuth();

  try {
    await prisma.productIntake.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete product intake record");
  }

  redirect("/product-intake");
}

export default async function EditProductIntakePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();

  const record = await prisma.productIntake.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  if (record.businessId !== session.businessId) {
    return notFound();
  }

  return (
    <DataForm
      slug="product-intake"
      mode="edit"
      record={record}
      onSubmit={updateProductIntake.bind(null, params.id)}
      onDelete={deleteProductIntake.bind(null, params.id)}
      cancelHref="/product-intake"
    />
  );
}