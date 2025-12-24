import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createTransplantLog(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("transplant-log", formData, session.businessId);

  try {
    await prisma.transplantLog.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save transplant log record");
  }

  redirect("/transplant-log");
}

export default function NewTransplantLogPage() {
  return (
    <DataForm
      slug="transplant-log"
      mode="new"
      onSubmit={createTransplantLog}
      cancelHref="/transplant-log"
    />
  );
}