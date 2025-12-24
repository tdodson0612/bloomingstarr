// app/(app)/overhead-expenses/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData } from "@/lib/roles";
import { redirect } from "next/navigation";
import type { OverheadExpenses, Prisma } from "@prisma/client";
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

export default async function OverheadExpensesPage({
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
  const table = getTableBySlug("overhead-expenses");
  const columns = table ? getColumnsForTable(table.id) : [];

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const vendorParam = params.vendor;
  const vendorsSelected = toStringArray(vendorParam);

  const category = (params.category as string) || "";
  const paymentMethod = (params.paymentMethod as string) || "";

  const amountMin = (params.amountMin as string) || "";
  const amountMax = (params.amountMax as string) || "";

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
  const where: Prisma.OverheadExpensesWhereInput = {
    businessId: session.businessId,
  };

  if (search) {
    where.OR = [
      { category: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { vendor: { contains: search, mode: "insensitive" } },
      { paymentMethod: { contains: search, mode: "insensitive" } },
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { employee: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (vendorsSelected.length > 0) {
    where.vendor = { in: vendorsSelected };
  }

  if (category) {
    where.category = { equals: category };
  }

  if (paymentMethod) {
    where.paymentMethod = { equals: paymentMethod };
  }

  if (amountMin || amountMax) {
    where.amount = {};
    if (amountMin) {
      where.amount.gte = Number(amountMin);
    }
    if (amountMax) {
      where.amount.lte = Number(amountMax);
    }
  }

  if (dateFrom || dateTo) {
    where.expenseDate = {};
    if (dateFrom) {
      where.expenseDate.gte = dateFrom;
    }
    if (dateTo) {
      where.expenseDate.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [
    records,
    vendorOptionsRaw,
    categoryOptionsRaw,
    paymentMethodOptionsRaw,
  ] = await Promise.all([
    prisma.overheadExpenses.findMany({
      where,
      orderBy: { expenseDate: "desc" },
    }),
    prisma.overheadExpenses.findMany({
      where: { businessId: session.businessId },
      select: { vendor: true },
      distinct: ["vendor"],
    }),
    prisma.overheadExpenses.findMany({
      where: { businessId: session.businessId },
      select: { category: true },
      distinct: ["category"],
    }),
    prisma.overheadExpenses.findMany({
      where: { businessId: session.businessId },
      select: { paymentMethod: true },
      distinct: ["paymentMethod"],
    }),
  ]);

  const vendors = vendorOptionsRaw
    .map((v: { vendor: string | null }) => v.vendor)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const categories = categoryOptionsRaw
    .map((v: { category: string | null }) => v.category)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const paymentMethods = paymentMethodOptionsRaw
    .map((v: { paymentMethod: string | null }) => v.paymentMethod)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  // Calculate total
  const total = records.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          {table?.name || "Overhead Expenses"}
        </h1>

        {/* Only show Add button if user can edit */}
        {canEdit && (
          <Link
            href="/overhead-expenses/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Expense
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          vendorsSelected={vendorsSelected}
          category={category}
          paymentMethod={paymentMethod}
          amountMin={amountMin}
          amountMax={amountMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          vendorOptions={vendors}
          categoryOptions={categories}
          paymentMethodOptions={paymentMethods}
        />
      </div>

      {/* Summary */}
      <div className="bg-white shadow p-4 rounded border mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Expenses:</span>
          <span className="text-2xl font-bold text-red-600">
            ${total.toFixed(2)}
          </span>
        </div>
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
            {records.map((r: OverheadExpenses) => (
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
                        href={`/overhead-expenses/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}
                      <form
                        action={async () => {
                          "use server";
                          await prisma.overheadExpenses.delete({
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
            No expense records match your filters.
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