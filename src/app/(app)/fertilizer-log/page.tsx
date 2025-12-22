// app/fertilizer-log/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData } from "@/lib/roles";
import type { FertilizerLog, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";
import ConfirmSubmitButton from "./ConfirmSubmitButton";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value)
    ? value
    : value.split(",").map((v) => v.trim()).filter(Boolean);
}

export default async function FertilizerLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check permissions
  const session = await getSession();
  const canEdit = session ? canEditData(session.role) : false;

  const params = await searchParams;

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const employeeParam = params.employee;
  const employeesSelected = toStringArray(employeeParam);

  const fertilizerType = (params.fertilizerType as string) || "";
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
  const where: Prisma.FertilizerLogWhereInput = {};

  if (search) {
    where.OR = [
      { plantName: { contains: search, mode: "insensitive" } },
      { genus: { contains: search, mode: "insensitive" } },
      { cultivar: { contains: search, mode: "insensitive" } },
      { fertilizerType: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { npkRatio: { contains: search, mode: "insensitive" } },
      { applicationRate: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { employee: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (employeesSelected.length > 0) {
    where.employee = { in: employeesSelected };
  }

  if (fertilizerType) {
    where.fertilizerType = { equals: fertilizerType };
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
    where.applicationDate = {};
    if (dateFrom) {
      where.applicationDate.gte = dateFrom;
    }
    if (dateTo) {
      where.applicationDate.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [
    records,
    employeeOptionsRaw,
    fertilizerTypeOptionsRaw,
    plantNameOptionsRaw,
    locationOptionsRaw,
  ] = await Promise.all([
    prisma.fertilizerLog.findMany({
      where,
      orderBy: { applicationDate: "desc" },
    }),
    prisma.fertilizerLog.findMany({
      select: { employee: true },
      distinct: ["employee"],
    }),
    prisma.fertilizerLog.findMany({
      select: { fertilizerType: true },
      distinct: ["fertilizerType"],
    }),
    prisma.fertilizerLog.findMany({
      select: { plantName: true },
      distinct: ["plantName"],
    }),
    prisma.fertilizerLog.findMany({
      select: { location: true },
      distinct: ["location"],
    }),
  ]);

  const employees = employeeOptionsRaw
    .map((v: { employee: string | null }) => v.employee)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const fertilizerTypes = fertilizerTypeOptionsRaw
    .map((v: { fertilizerType: string | null }) => v.fertilizerType)
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
        <h1 className="text-2xl font-semibold">Fertilizer Log</h1>

        {/* Only show Add button if user can edit */}
        {canEdit && (
          <Link
            href="/fertilizer-log/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Application
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          employeesSelected={employeesSelected}
          fertilizerType={fertilizerType}
          plantName={plantName}
          location={location}
          qtyMin={qtyMin}
          qtyMax={qtyMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          employeeOptions={employees}
          fertilizerTypeOptions={fertilizerTypes}
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
              <th className="py-2 px-2">Fertilizer Type</th>
              <th className="py-2 px-2">Brand</th>
              <th className="py-2 px-2">NPK Ratio</th>
              <th className="py-2 px-2">Application Rate</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2">Location</th>
              <th className="py-2 px-2">Employee</th>
              <th className="py-2 px-2">Notes</th>
              {canEdit && <th className="py-2 px-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {records.map((r: FertilizerLog) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  {r.applicationDate
                    ? r.applicationDate.toISOString().slice(0, 10)
                    : "-"}
                </td>
                <td className="py-2 px-2">{r.plantName || "-"}</td>
                <td className="py-2 px-2">{r.genus || "-"}</td>
                <td className="py-2 px-2">{r.cultivar || "-"}</td>
                <td className="py-2 px-2">{r.fertilizerType || "-"}</td>
                <td className="py-2 px-2">{r.brand || "-"}</td>
                <td className="py-2 px-2">{r.npkRatio || "-"}</td>
                <td className="py-2 px-2">{r.applicationRate || "-"}</td>
                <td className="py-2 px-2">{r.quantity ?? "-"}</td>
                <td className="py-2 px-2">{r.location || "-"}</td>
                <td className="py-2 px-2">{r.employee || "-"}</td>
                <td className="py-2 px-2">{r.notes || "-"}</td>

                {/* ACTIONS - Only show if user can edit */}
                {canEdit && (
                  <td className="py-2 px-2">
                    <div className="flex gap-3">
                      {/* EDIT */}
                      <Link
                        href={`/fertilizer-log/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}
                      <form
                        action={async () => {
                          "use server";
                          await prisma.fertilizerLog.delete({
                            where: { id: r.id },
                          });
                        }}
                      >
                        <ConfirmSubmitButton confirmText="Delete this record?">
                          Delete
                        </ConfirmSubmitButton>
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
            No fertilizer records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}