import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createOverheadExpense(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("overhead-expenses", formData, session.businessId);

  try {
    await prisma.overheadExpenses.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save overhead expense record");
  }

  redirect("/overhead-expenses");
}

export default function NewOverheadExpensePage() {
  return (
    <DataForm
      slug="overhead-expenses"
      mode="new"
      onSubmit={createOverheadExpense}
      cancelHref="/overhead-expenses"
    />
  );
}