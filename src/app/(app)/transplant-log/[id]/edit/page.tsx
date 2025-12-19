import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";

// --- SERVER ACTION FOR UPDATING ---
async function updateTransplantLog(id: string, formData: FormData) {
  "use server";

  await prisma.transplantLog.update({
    where: { id },
    data: {
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

// --- SERVER ACTION FOR DELETING ---
async function deleteTransplantLog(id: string) {
  "use server";

  await prisma.transplantLog.delete({
    where: { id },
  });

  redirect("/transplant-log");
}

export default async function EditTransplantLogPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await prisma.transplantLog.findUnique({
    where: { id: params.id },
  });

  if (!record) return notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Transplant</h1>

      <form
        action={updateTransplantLog.bind(null, params.id)}
        className="space-y-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Transplant Date</label>
          <input
            type="date"
            name="transplantDate"
            className="border p-2 rounded w-full"
            defaultValue={
              record.transplantDate
                ? record.transplantDate.toISOString().slice(0, 10)
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

        {/* From Size */}
        <div>
          <label className="block text-sm font-medium">From Size</label>
          <input
            type="text"
            name="fromSize"
            className="border p-2 rounded w-full"
            defaultValue={record.fromSize ?? ""}
          />
        </div>

        {/* To Size */}
        <div>
          <label className="block text-sm font-medium">To Size</label>
          <input
            type="text"
            name="toSize"
            className="border p-2 rounded w-full"
            defaultValue={record.toSize ?? ""}
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
            href="/transplant-log"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>

          {/* DELETE BUTTON */}
          <form
            action={deleteTransplantLog.bind(null, record.id)}
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