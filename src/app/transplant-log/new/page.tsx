import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createTransplantLog(formData: FormData) {
  "use server";

  await prisma.transplantLog.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
      transplantDate: formData.get("transplantDate")
        ? new Date(formData.get("transplantDate")!.toString())
        : null,
      plantName: formData.get("plantName")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      fromSize: formData.get("fromSize")?.toString() || null,
      toSize: formData.get("toSize")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      location: formData.get("location")?.toString() || null,
      employee: formData.get("employee")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/transplant-log");
}

export default function NewTransplantLogPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Transplant</h1>

      <form action={createTransplantLog} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Transplant Date</label>
          <input
            type="date"
            name="transplantDate"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Plant Name */}
        <div>
          <label className="block text-sm font-medium">Plant Name</label>
          <input
            type="text"
            name="plantName"
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

        {/* From Size */}
        <div>
          <label className="block text-sm font-medium">From Size</label>
          <input
            type="text"
            name="fromSize"
            placeholder="e.g., 4 inch"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* To Size */}
        <div>
          <label className="block text-sm font-medium">To Size</label>
          <input
            type="text"
            name="toSize"
            placeholder="e.g., 1 gallon"
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

        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g., Greenhouse A, Bench 3"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium">Employee</label>
          <input
            type="text"
            name="employee"
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
            href="/transplant-log"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}