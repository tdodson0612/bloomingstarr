import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createPricing(formData: FormData) {
  "use server";

  await prisma.pricing.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
      plantName: formData.get("plantName")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      size: formData.get("size")?.toString() || null,
      basePrice: formData.get("basePrice") ? Number(formData.get("basePrice")) : null,
      markup: formData.get("markup") ? Number(formData.get("markup")) : null,
      finalPrice: formData.get("finalPrice") ? Number(formData.get("finalPrice")) : null,
      category: formData.get("category")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/pricing");
}

export default function NewPricingPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Pricing</h1>

      <form action={createPricing} className="space-y-4">
        {/* Plant Name */}
        <div>
          <label className="block text-sm font-medium">Plant Name</label>
          <input
            type="text"
            name="plantName"
            className="border p-2 rounded w-full"
            required
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
            placeholder="e.g., 4 inch, 1 gallon"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium">Base Price ($)</label>
          <input
            type="number"
            name="basePrice"
            step="0.01"
            className="border p-2 rounded w-full"
            min="0"
          />
        </div>

        {/* Markup */}
        <div>
          <label className="block text-sm font-medium">Markup (%)</label>
          <input
            type="number"
            name="markup"
            step="0.01"
            className="border p-2 rounded w-full"
            min="0"
            placeholder="e.g., 25 for 25%"
          />
        </div>

        {/* Final Price */}
        <div>
          <label className="block text-sm font-medium">Final Price ($)</label>
          <input
            type="number"
            name="finalPrice"
            step="0.01"
            className="border p-2 rounded w-full"
            min="0"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Perennials, Annuals, Shrubs"
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
            href="/pricing"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}