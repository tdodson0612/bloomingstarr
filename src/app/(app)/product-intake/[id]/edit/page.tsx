import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updateProductIntake(id: string, formData: FormData) {
  "use server";

  await prisma.productIntake.update({
    where: { id },
    data: {
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

// --- SERVER ACTION FOR DELETING ---
async function deleteProductIntake(id: string) {
  "use server";

  await prisma.productIntake.delete({
    where: { id },
  });

  redirect("/product-intake");
}

export default async function EditProductIntakePage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.productIntake.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Product Intake</h1>

      <form
        action={updateProductIntake.bind(null, params.id)}
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

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="productName"
            className="border p-2 rounded w-full"
            defaultValue={record.productName ?? ""}
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

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            className="border p-2 rounded w-full"
            defaultValue={record.brand ?? ""}
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

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium">Unit</label>
          <input
            type="text"
            name="unit"
            className="border p-2 rounded w-full"
            defaultValue={record.unit ?? ""}
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
            defaultValue={record.unitCost ?? ""}
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
            defaultValue={record.totalCost ?? ""}
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
            href="/product-intake"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deleteProductIntake.bind(null, record.id)}
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