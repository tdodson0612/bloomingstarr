import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updatePlantIntake(id: string, formData: FormData) {
  "use server";

  await prisma.plantIntake.update({
    where: { id },
    data: {
      sku: formData.get("sku")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      size: formData.get("size")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      vendor: formData.get("vendor")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
      dateReceived: formData.get("dateReceived")
        ? new Date(formData.get("dateReceived")!.toString())
        : null,
    },
  });

  redirect("/plant-intake");
}

// --- SERVER ACTION FOR DELETING ---
async function deletePlantIntake(id: string) {
  "use server";

  await prisma.plantIntake.delete({
    where: { id },
  });

  redirect("/plant-intake");
}

export default async function EditPlantIntakePage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.plantIntake.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Plant Intake</h1>

      <form
        action={updatePlantIntake.bind(null, params.id)}
        className="space-y-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date Received</label>
          <input
            type="date"
            name="dateReceived"
            className="border p-2 rounded w-full"
            defaultValue={
              record.dateReceived
                ? record.dateReceived.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            name="sku"
            className="border p-2 rounded w-full"
            defaultValue={record.sku ?? ""}
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

        {/* Size */}
        <div>
          <label className="block text-sm font-medium">Size</label>
          <input
            type="text"
            name="size"
            className="border p-2 rounded w-full"
            defaultValue={record.size ?? ""}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="border p-2 rounded w-full"
            defaultValue={record.quantity ?? ""}
          />
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium">Vendor</label>
          <input
            type="text"
            name="vendor"
            className="border p-2 rounded w-full"
            defaultValue={record.vendor ?? ""}
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
            href="/plant-intake"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deletePlantIntake.bind(null, record.id)}
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
