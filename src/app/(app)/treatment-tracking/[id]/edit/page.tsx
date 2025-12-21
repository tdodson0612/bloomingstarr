import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updateTreatmentTracking(id: string, formData: FormData) {
  "use server";

  await prisma.treatmentTracking.update({
    where: { id },
    data: {
      treatmentDate: formData.get("treatmentDate")
        ? new Date(formData.get("treatmentDate")!.toString())
        : null,
      plantName: formData.get("plantName")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      treatmentType: formData.get("treatmentType")?.toString() || null,
      product: formData.get("product")?.toString() || null,
      dosage: formData.get("dosage")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      location: formData.get("location")?.toString() || null,
      reason: formData.get("reason")?.toString() || null,
      employee: formData.get("employee")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/treatment-tracking");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteTreatmentTracking(id: string) {
  "use server";

  await prisma.treatmentTracking.delete({
    where: { id },
  });

  redirect("/treatment-tracking");
}

export default async function EditTreatmentTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.treatmentTracking.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Treatment</h1>

      <form
        action={updateTreatmentTracking.bind(null, params.id)}
        className="space-y-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Treatment Date</label>
          <input
            type="date"
            name="treatmentDate"
            className="border p-2 rounded w-full"
            defaultValue={
              record.treatmentDate
                ? record.treatmentDate.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>

        {/* Plant Name */}
        <div>
          <label className="block text-sm font-medium">Plant Name</label>
          <input
            type="text"
            name="plantName"
            className="border p-2 rounded w-full"
            defaultValue={record.plantName ?? ""}
          />
        </div>

        {/* Genus */}
        <div>
          <label className="block text-sm font-medium">Genus</label>
          <input
            type="text"
            name="genus"
            className="border p-2 rounded w-full"
            defaultValue={record.genus ?? ""}
          />
        </div>

        {/* Cultivar */}
        <div>
          <label className="block text-sm font-medium">Cultivar</label>
          <input
            type="text"
            name="cultivar"
            className="border p-2 rounded w-full"
            defaultValue={record.cultivar ?? ""}
          />
        </div>

        {/* Treatment Type */}
        <div>
          <label className="block text-sm font-medium">Treatment Type</label>
          <input
            type="text"
            name="treatmentType"
            placeholder="e.g., Pesticide, Fungicide, Herbicide"
            className="border p-2 rounded w-full"
            defaultValue={record.treatmentType ?? ""}
          />
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium">Product</label>
          <input
            type="text"
            name="product"
            className="border p-2 rounded w-full"
            defaultValue={record.product ?? ""}
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-medium">Dosage</label>
          <input
            type="text"
            name="dosage"
            placeholder="e.g., 2 oz per gallon"
            className="border p-2 rounded w-full"
            defaultValue={record.dosage ?? ""}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium">Quantity Treated</label>
          <input
            type="number"
            name="quantity"
            className="border p-2 rounded w-full"
            defaultValue={record.quantity ?? ""}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            className="border p-2 rounded w-full"
            defaultValue={record.location ?? ""}
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium">Reason</label>
          <input
            type="text"
            name="reason"
            placeholder="e.g., Aphid infestation, Powdery mildew"
            className="border p-2 rounded w-full"
            defaultValue={record.reason ?? ""}
          />
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium">Employee</label>
          <input
            type="text"
            name="employee"
            className="border p-2 rounded w-full"
            defaultValue={record.employee ?? ""}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            className="border p-2 rounded w-full"
            rows={3}
            defaultValue={record.notes ?? ""}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

          <a
            href="/treatment-tracking"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deleteTreatmentTracking.bind(null, record.id)}
            className="ml-auto"
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={(e) => {
                if (!confirm("Delete this record?")) e.preventDefault();
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}