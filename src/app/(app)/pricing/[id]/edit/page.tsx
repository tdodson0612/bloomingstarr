//src/app/(app)/pricing/[id]/edit/page.tsx
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updatePricing(id: string, formData: FormData) {
  "use server";

  await prisma.pricing.update({
    where: { id },
    data: {
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

// --- SERVER ACTION FOR DELETING ---
async function deletePricing(id: string) {
  "use server";

  await prisma.pricing.delete({
    where: { id },
  });

  redirect("/pricing");
}

export default async function EditPricingPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.pricing.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Pricing</h1>

      <form
        action={updatePricing.bind(null, params.id)}
        className="space-y-4"
      >
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

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium">Base Price ($)</label>
          <input
            type="number"
            name="basePrice"
            step="0.01"
            className="border p-2 rounded w-full"
            defaultValue={record.basePrice ?? ""}
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
            defaultValue={record.markup ?? ""}
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
            defaultValue={record.finalPrice ?? ""}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            className="border p-2 rounded w-full"
            defaultValue={record.category ?? ""}
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
            href="/pricing"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deletePricing.bind(null, record.id)}
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