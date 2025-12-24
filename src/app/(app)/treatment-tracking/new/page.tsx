import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { DataForm } from "@/components/DataForm";
import { validateAndPrepareData } from "@/lib/validation/helpers";

// --- SERVER ACTION ---
async function createTreatmentTracking(formData: FormData) {
  "use server";
  const session = await requireAuth();

  const data = validateAndPrepareData("treatment-tracking", formData, session.businessId);

  try {
    await prisma.treatmentTracking.create({ data });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save treatment tracking record");
  }

  redirect("/treatment-tracking");
}

export default function NewTreatmentTrackingPage() {
  return (
    <DataForm
      slug="treatment-tracking"
      mode="new"
      onSubmit={createTreatmentTracking}
      cancelHref="/treatment-tracking"
    />
  );
}