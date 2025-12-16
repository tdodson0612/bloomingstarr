import { prisma } from "@/lib/db";
import { PlantIntake } from "@prisma/client";

export default async function PlantIntakePage() {
  const records: PlantIntake[] = await prisma.plantIntake.findMany({
    orderBy: { dateReceived: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Plant Intake</h1>

      <div className="bg-white shadow p-4 rounded border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date Received</th>
              <th className="py-2">SKU</th>
              <th className="py-2">Genus</th>
              <th className="py-2">Cultivar</th>
              <th className="py-2">Size</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Vendor</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r: PlantIntake) => (
              <tr key={r.id} className="border-b">
                <td className="py-2">
                  {r.dateReceived
                    ? r.dateReceived.toISOString().slice(0, 10)
                    : "-"}
                </td>
                <td className="py-2">{r.sku ?? "-"}</td>
                <td className="py-2">{r.genus ?? "-"}</td>
                <td className="py-2">{r.cultivar ?? "-"}</td>
                <td className="py-2">{r.size ?? "-"}</td>
                <td className="py-2">{r.quantity ?? "-"}</td>
                <td className="py-2">{r.vendor ?? "-"}</td>
                <td className="py-2">{r.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No intake records yet.
          </p>
        )}
      </div>
    </div>
  );
}
