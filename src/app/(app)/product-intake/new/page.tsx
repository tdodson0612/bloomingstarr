import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createProductIntake(formData: FormData) {
  "use server";

  await prisma.productIntake.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
      productName: formData.get("productName")?.toString() || null,
      category: formData.get("category")?.toString() || null,
      brand: formData.get("brand")?.toString() || null,
      sku: formData.get("sku")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      unit: formData.get("unit")?.toString() || null,
      unitCost: formData.get("unitCost") ? Number(formData.get("unitCost")) : null,
      totalCost: formData.get("totalCost") ? Number(formData.get("totalCost")) : null,
      vendor: formData.get("vendor")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
      dateReceived: formData.get("dateReceived")
        ? new Date(formData.get("dateReceived")!.toString())
        : null,
    },
  });

  redirect("/product-intake");
}

export default function NewProductIntakePage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Product Intake</h1>

      <form action={createProductIntake} className="space-y-4">
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

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="productName"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Pots, Soil, Tools, Fertilizer"
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

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            type="text"
            name="sku"
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

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium">Unit</label>
          <input
            type="text"
            name="unit"
            placeholder="e.g., bags, boxes, each"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Unit Cost */}
        <div>
          <label className="block text-sm font-medium">Unit Cost ($)</label>
          <input
            type="number"
            name="unitCost"
            step="0.01"
            className="border p-2 rounded w-full"
            min="0"
          />
        </div>

        {/* Total Cost */}
        <div>
          <label className="block text-sm font-medium">Total Cost ($)</label>
          <input
            type="number"
            name="totalCost"
            step="0.01"
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
            href="/product-intake"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}