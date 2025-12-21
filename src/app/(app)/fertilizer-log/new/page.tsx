import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createFertilizerLog(formData: FormData) {
  "use server";

  await prisma.fertilizerLog.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
      applicationDate: formData.get("applicationDate")
        ? new Date(formData.get("applicationDate")!.toString())
        : null,
      plantName: formData.get("plantName")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      fertilizerType: formData.get("fertilizerType")?.toString() || null,
      brand: formData.get("brand")?.toString() || null,
      npkRatio: formData.get("npkRatio")?.toString() || null,
      applicationRate: formData.get("applicationRate")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      location: formData.get("location")?.toString() || null,
      employee: formData.get("employee")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/fertilizer-log");
}

export default function NewFertilizerLogPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Fertilizer Application</h1>

      <form action={createFertilizerLog} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Application Date</label>
          <input
            type="date"
            name="applicationDate"
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

        {/* Fertilizer Type */}
        <div>
          <label className="block text-sm font-medium">Fertilizer Type</label>
          <input
            type="text"
            name="fertilizerType"
            placeholder="e.g., Liquid, Granular, Slow-release"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* NPK Ratio */}
        <div>
          <label className="block text-sm font-medium">NPK Ratio</label>
          <input
            type="text"
            name="npkRatio"
            placeholder="e.g., 20-20-20, 10-10-10"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Application Rate */}
        <div>
          <label className="block text-sm font-medium">Application Rate</label>
          <input
            type="text"
            name="applicationRate"
            placeholder="e.g., 1 tbsp per gallon, 100 ppm"
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
            href="/fertilizer-log"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}