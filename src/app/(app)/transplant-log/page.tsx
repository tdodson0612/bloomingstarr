// app/(app)/transplant-log/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData } from "@/lib/roles";
import { redirect } from "next/navigation";
import type { TransplantLog, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";
import { getTableBySlug, getColumnsForTable } from "@/lib/meta/getTableMeta";
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

export default async function TransplantLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check permissions
  const session = await getSession();
  if (!session) redirect("/login");
  
  const canEdit = canEditData(session.role);

  const params = await searchParams;

  // 🆕 METADATA - Get table and column definitions
  const table = getTableBySlug("transplant-log");
  const columns = table ? getColumnsForTable(table.id) : [];

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const employeeParam = params.employee;
  const employeesSelected = toStringArray(employeeParam);

  const plantName = (params.plantName as string) || "";
  const genus = (params.genus as string) || "";
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
  const where: Prisma.TransplantLogWhereInput = {
    businessId: session.businessId,
  };

  if (search) {
    where.OR = [
      { plantName: { contains: search, mode: "insensitive" } },
      { genus: { contains: search, mode: "insensitive" } },
      { cultivar: { contains: search, mode: "insensitive" } },
      { fromSize: { contains: search, mode: "insensitive" } },
      { toSize: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { employee: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (employeesSelected.length > 0) {
    where.employee = { in: employeesSelected };
  }

  if (plantName) {
    where.plantName = { equals: plantName };
  }

  if (genus) {
    where.genus = { equals: genus };
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
    where.transplantDate = {};
    if (dateFrom) {
      where.transplantDate.gte = dateFrom;
    }
    if (dateTo) {
      where.transplantDate.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [records, employeeOptionsRaw, plantNameOptionsRaw, genusOptionsRaw, locationOptionsRaw] =
    await Promise.all([
      prisma.transplantLog.findMany({
        where,
        orderBy: { transplantDate: "desc" },
      }),
      prisma.transplantLog.findMany({
        where: { businessId: session.businessId },
        select: { employee: true },
        distinct: ["employee"],
      }),
      prisma.transplantLog.findMany({
        where: { businessId: session.businessId },
        select: { plantName: true },
        distinct: ["plantName"],
      }),
      prisma.transplantLog.findMany({
        where: { businessId: session.businessId },
        select: { genus: true },
        distinct: ["genus"],
      }),
      prisma.transplantLog.findMany({
        where: { businessId: session.businessId },
        select: { location: true },
        distinct: ["location"],
      }),
    ]);

  const employees = employeeOptionsRaw
    .map((v: { employee: string | null }) => v.employee)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const plantNames = plantNameOptionsRaw
    .map((v: { plantName: string | null }) => v.plantName)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const genuses = genusOptionsRaw
    .map((v: { genus: string | null }) => v.genus)
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
        <h1 className="text-2xl font-semibold">
          {table?.name || "Transplant Log"}
        </h1>

        {/* Only show Add button if user can edit */}
        {canEdit && (
          <Link
            href="/transplant-log/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Transplant
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          employeesSelected={employeesSelected}
          plantName={plantName}
          genus={genus}
          location={location}
          qtyMin={qtyMin}
          qtyMax={qtyMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          employeeOptions={employees}
          plantNameOptions={plantNames}
          genusOptions={genuses}
          locationOptions={locations}
        />
      </div>

      {/* 🆕 METADATA-DRIVEN TABLE */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1200px]">
          <thead>
            <tr className="border-b bg-gray-50">
              {/* Dynamically render headers from metadata */}
              {columns.map((col) => (
                <th key={col.id} className="py-2 px-2">
                  {col.name}
                </th>
              ))}
              {canEdit && <th className="py-2 px-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {records.map((r: TransplantLog) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                {/* Dynamically render cells from metadata */}
                {columns.map((col) => {
                  const value = (r as any)[col.id];
                  return (
                    <td key={col.id} className="py-2 px-2">
                      {formatCellValue(value, col.type)}
                    </td>
                  );
                })}

                {/* ACTIONS - Only show if user can edit */}
                {canEdit && (
                  <td className="py-2 px-2">
                    <div className="flex gap-3">
                      {/* EDIT */}
                      <Link
                        href={`/transplant-log/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}
                      <form
                        action={async () => {
                          "use server";
                          await prisma.transplantLog.delete({
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
            No transplant records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

// 🆕 HELPER - Format cell values based on column type
function formatCellValue(value: any, type: string): string {
  if (value === null || value === undefined) return "-";

  switch (type) {
    case "date":
      if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
      }
      return value;

    case "currency":
      const num = Number(value);
      return isNaN(num) ? value : `$${num.toFixed(2)}`;

    case "percent":
      const pct = Number(value);
      return isNaN(pct) ? value : `${pct}%`;

    case "number":
      return String(value ?? "-");

    case "text":
    default:
      return String(value || "-");
  }
}