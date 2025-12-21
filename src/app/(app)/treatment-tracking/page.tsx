// app/treatment-tracking/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData } from "@/lib/roles";
import type { TreatmentTracking, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value)
    ? value
    : value.split(",").map((v) => v.trim()).filter(Boolean);
}

export default async function TreatmentTrackingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // --- Permissions ---
  const session = await getSession();
  const canEdit = session ? canEditData(session.role) : false;

  const params = await searchParams;

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const employeeParam = params.employee;
  const employeesSelected = toStringArray(employeeParam);

  const treatmentType = (params.treatmentType as string) || "";
  const plantName = (params.plantName as string) || "";
  const location = (params.location as string) || "";

  const qtyMin = (params.qtyMin as string) || "";
  const qtyMax = (params.qtyMax as string) || "";

  const dateFromParam = (params.dateFrom as string) || "";
  const dateToParam = (params.dateTo as string) || "";
  const quickRange = (params.quickRange as string) || "";

  // --- Build date range based on quickRange if present ---
  let dateFrom = dateFromParam ? new Date(dateFromParam) : undefined;
  let dateTo = dateToParam ? new Date(dateToParam) : undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function startOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function startOfYear(d: Date) {
    return new Date(d.getFullYear(), 0, 1);
  }

  if (quickRange && quickRange !== "all") {
    switch (quickRange) {
      case "today":
        dateFrom = today;
        dateTo = new Date(today);
        dateTo.setHours(23, 59, 59, 999);
        break;
      case "thisWeek": {
        const from = startOfWeek(today);
        dateFrom = from;
        const to = new Date();
        to.setHours(23, 59, 59, 999);
        dateTo = to;
        break;
      }
      case "last7": {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);
        dateFrom = from;
        const to = new Date();
        to.setHours(23, 59, 59, 999);
        dateTo = to;
        break;
      }
      case "thisMonth": {
        const from = startOfMonth(today);
        dateFrom = from;
        const to = new Date();
        to.setHours(23, 59, 59, 999);
        dateTo = to;
        break;
      }
      case "last30": {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);
        dateFrom = from;
        const to = new Date();
        to.setHours(23, 59, 59, 999);
        dateTo = to;
        break;
      }
      case "thisYear": {
        const from = startOfYear(today);
        dateFrom = from;
        const to = new Date();
        to.setHours(23, 59, 59, 999);
        dateTo = to;
        break;
      }
    }
  }

  // --- Prisma WHERE conditions ---
  const where: Prisma.TreatmentTrackingWhereInput = {};

  if (search) {
    where.OR = [
      { plantName: { contains: search, mode: "insensitive" } },
      { genus: { contains: search, mode: "insensitive" } },
      { cultivar: { contains: search, mode: "insensitive" } },
      { treatmentType: { contains: search, mode: "insensitive" } },
      { product: { contains: search, mode: "insensitive" } },
      { dosage: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { reason: { contains: search, mode: "insensitive" } },
      { employee: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (employeesSelected.length > 0) {
    where.employee = { in: employeesSelected };
  }

  if (treatmentType) {
    where.treatmentType = { equals: treatmentType };
  }

  if (plantName) {
    where.plantName = { equals: plantName };
  }

  if (location) {
    where.location = { equals: location };
  }

  if (qtyMin || qtyMax) {
    where.quantity = {};
    if (qtyMin) {
      where.quantity.gte = Number(qtyMin);
    }
    if (qtyMax) {
      where.quantity.lte = Number(qtyMax);
    }
  }

  if (dateFrom || dateTo) {
    where.treatmentDate = {};
    if (dateFrom) {
      where.treatmentDate.gte = dateFrom;
    }
    if (dateTo) {
      where.treatmentDate.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [
    records,
    employeeOptionsRaw,
    treatmentTypeOptionsRaw,
    plantNameOptionsRaw,
    locationOptionsRaw,
  ] = await Promise.all([
    prisma.treatmentTracking.findMany({
      where,
      orderBy: { treatmentDate: "desc" },
    }),
    prisma.treatmentTracking.findMany({
      select: { employee: true },
      distinct: ["employee"],
    }),
    prisma.treatmentTracking.findMany({
      select: { treatmentType: true },
      distinct: ["treatmentType"],
    }),
    prisma.treatmentTracking.findMany({
      select: { plantName: true },
      distinct: ["plantName"],
    }),
    prisma.treatmentTracking.findMany({
      select: { location: true },
      distinct: ["location"],
    }),
  ]);

  const employees = employeeOptionsRaw
    .map((v: { employee: string | null }) => v.employee)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const treatmentTypes = treatmentTypeOptionsRaw
    .map((v: { treatmentType: string | null }) => v.treatmentType)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const plantNames = plantNameOptionsRaw
    .map((v: { plantName: string | null }) => v.plantName)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const locations = locationOptionsRaw
    .map((v: { location: string | null }) => v.location)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Treatment Tracking</h1>

        {canEdit && (
          <Link
            href="/treatment-tracking/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Treatment
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          employeesSelected={employeesSelected}
          treatmentType={treatmentType}
          plantName={plantName}
          location={location}
          qtyMin={qtyMin}
          qtyMax={qtyMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          employeeOptions={employees}
          treatmentTypeOptions={treatmentTypes}
          plantNameOptions={plantNames}
          locationOptions={locations}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1400px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Plant Name</th>
              <th className="py-2 px-2">Genus</th>
              <th className="py-2 px-2">Cultivar</th>
              <th className="py-2 px-2">Treatment Type</th>
              <th className="py-2 px-2">Product</th>
              <th className="py-2 px-2">Dosage</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2">Location</th>
              <th className="py-2 px-2">Reason</th>
              <th className="py-2 px-2">Employee</th>
              <th className="py-2 px-2">Notes</th>
              {canEdit && <th className="py-2 px-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {records.map((r: TreatmentTracking) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  {r.treatmentDate
                    ? r.treatmentDate.toISOString().slice(0, 10)
                    : "-"}
                </td>
                <td className="py-2 px-2">{r.plantName || "-"}</td>
                <td className="py-2 px-2">{r.genus || "-"}</td>
                <td className="py-2 px-2">{r.cultivar || "-"}</td>
                <td className="py-2 px-2">{r.treatmentType || "-"}</td>
                <td className="py-2 px-2">{r.product || "-"}</td>
                <td className="py-2 px-2">{r.dosage || "-"}</td>
                <td className="py-2 px-2">{r.quantity ?? "-"}</td>
                <td className="py-2 px-2">{r.location || "-"}</td>
                <td className="py-2 px-2">{r.reason || "-"}</td>
                <td className="py-2 px-2">{r.employee || "-"}</td>
                <td className="py-2 px-2">{r.notes || "-"}</td>

                {canEdit && (
                  <td className="py-2 px-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/treatment-tracking/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await prisma.treatmentTracking.delete({
                            where: { id: r.id },
                          });
                        }}
                      >
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                          onClick={(e) => {
                            if (!confirm("Delete this record?"))
                              e.preventDefault();
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No treatment records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
