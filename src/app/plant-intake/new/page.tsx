import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createPlantIntake(formData: FormData) {
  "use server";

  await prisma.plantIntake.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
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

export default function NewPlantIntakePage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Plant Intake</h1>

      <form action={createPlantIntake} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date Received</label>
          <input
            type="date"
            name="dateReceived"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            name="sku"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Genus */}
        <div>
          <label className="block text-sm font-medium">Genus</label>
          <input
            type="text"
            name="genus"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Cultivar */}
        <div>
          <label className="block text-sm font-medium">Cultivar</label>
          <input
            type="text"
            name="cultivar"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium">Size</label>
          <input
            type="text"
            name="size"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="border p-2 rounded w-full"
            min="0"
          />
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium">Vendor</label>
          <input
            type="text"
            name="vendor"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            className="border p-2 rounded w-full"
            rows={3}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>

          <a
            href="/plant-intake"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
