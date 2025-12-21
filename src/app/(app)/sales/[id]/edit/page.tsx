import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updateSale(id: string, formData: FormData) {
  "use server";

  await prisma.sales.update({
    where: { id },
    data: {
      saleDate: formData.get("saleDate")
        ? new Date(formData.get("saleDate")!.toString())
        : null,
      customerName: formData.get("customerName")?.toString() || null,
      plantName: formData.get("plantName")?.toString() || null,
      genus: formData.get("genus")?.toString() || null,
      cultivar: formData.get("cultivar")?.toString() || null,
      size: formData.get("size")?.toString() || null,
      quantity: Number(formData.get("quantity")) || null,
      unitPrice: formData.get("unitPrice") ? Number(formData.get("unitPrice")) : null,
      totalPrice: formData.get("totalPrice") ? Number(formData.get("totalPrice")) : null,
      paymentMethod: formData.get("paymentMethod")?.toString() || null,
      employee: formData.get("employee")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/sales");
}

// --- SERVER ACTION FOR DELETING ---
async function deleteSale(id: string) {
  "use server";

  await prisma.sales.delete({
    where: { id },
  });

  redirect("/sales");
}

export default async function EditSalePage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.sales.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Sale</h1>

      <form
        action={updateSale.bind(null, params.id)}
        className="space-y-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Sale Date</label>
          <input
            type="date"
            name="saleDate"
            className="border p-2 rounded w-full"
            defaultValue={
              record.saleDate
                ? record.saleDate.toISOString().slice(0, 10)
                : ""
            }
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            className="border p-2 rounded w-full"
            defaultValue={record.customerName ?? ""}
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

        {/* Unit Price */}
        <div>
          <label className="block text-sm font-medium">Unit Price ($)</label>
          <input
            type="number"
            name="unitPrice"
            step="0.01"
            className="border p-2 rounded w-full"
            defaultValue={record.unitPrice ?? ""}
          />
        </div>

        {/* Total Price */}
        <div>
          <label className="block text-sm font-medium">Total Price ($)</label>
          <input
            type="number"
            name="totalPrice"
            step="0.01"
            className="border p-2 rounded w-full"
            defaultValue={record.totalPrice ?? ""}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            className="border p-2 rounded w-full"
            defaultValue={record.paymentMethod ?? ""}
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
            href="/sales"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deleteSale.bind(null, record.id)}
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