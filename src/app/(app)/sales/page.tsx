// app/sales/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData } from "@/lib/roles";
import type { Sales, Prisma } from "@prisma/client";
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

export default async function SalesPage({
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

  const customerName = (params.customerName as string) || "";
  const plantName = (params.plantName as string) || "";
  const paymentMethod = (params.paymentMethod as string) || "";

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
  const where: Prisma.SalesWhereInput = {};

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { plantName: { contains: search, mode: "insensitive" } },
      { genus: { contains: search, mode: "insensitive" } },
      { cultivar: { contains: search, mode: "insensitive" } },
      { size: { contains: search, mode: "insensitive" } },
      { paymentMethod: { contains: search, mode: "insensitive" } },
      { employee: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (employeesSelected.length > 0) {
    where.employee = { in: employeesSelected };
  }

  if (customerName) {
    where.customerName = { equals: customerName };
  }

  if (plantName) {
    where.plantName = { equals: plantName };
  }

  if (paymentMethod) {
    where.paymentMethod = { equals: paymentMethod };
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
    where.saleDate = {};
    if (dateFrom) {
      where.saleDate.gte = dateFrom;
    }
    if (dateTo) {
      where.saleDate.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [
    records,
    employeeOptionsRaw,
    customerOptionsRaw,
    plantNameOptionsRaw,
    paymentMethodOptionsRaw,
  ] = await Promise.all([
    prisma.sales.findMany({
      where,
      orderBy: { saleDate: "desc" },
    }),
    prisma.sales.findMany({
      select: { employee: true },
      distinct: ["employee"],
    }),
    prisma.sales.findMany({
      select: { customerName: true },
      distinct: ["customerName"],
    }),
    prisma.sales.findMany({
      select: { plantName: true },
      distinct: ["plantName"],
    }),
    prisma.sales.findMany({
      select: { paymentMethod: true },
      distinct: ["paymentMethod"],
    }),
  ]);

  const employees = employeeOptionsRaw
    .map((v: { employee: string | null }) => v.employee)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const customers = customerOptionsRaw
    .map((v: { customerName: string | null }) => v.customerName)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const plantNames = plantNameOptionsRaw
    .map((v: { plantName: string | null }) => v.plantName)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const paymentMethods = paymentMethodOptionsRaw
    .map((v: { paymentMethod: string | null }) => v.paymentMethod)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  // Calculate totals
  const totalRevenue = records.reduce(
    (sum, r) => sum + (r.totalPrice || 0),
    0
  );
  const totalUnits = records.reduce(
    (sum, r) => sum + (r.quantity || 0),
    0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Sales</h1>

        {canEdit && (
          <Link
            href="/sales/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Sale
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          employeesSelected={employeesSelected}
          customerName={customerName}
          plantName={plantName}
          paymentMethod={paymentMethod}
          qtyMin={qtyMin}
          qtyMax={qtyMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          employeeOptions={employees}
          customerOptions={customers}
          plantNameOptions={plantNames}
          paymentMethodOptions={paymentMethods}
        />
      </div>

      {/* Summary */}
      <div className="bg-white shadow p-4 rounded border mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Total Revenue:</span>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Total Units Sold:</span>
            <p className="text-2xl font-bold text-blue-600">{totalUnits}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1300px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Customer</th>
              <th className="py-2 px-2">Plant Name</th>
              <th className="py-2 px-2">Genus</th>
              <th className="py-2 px-2">Cultivar</th>
              <th className="py-2 px-2">Size</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2">Unit Price</th>
              <th className="py-2 px-2">Total Price</th>
              <th className="py-2 px-2">Payment</th>
              <th className="py-2 px-2">Employee</th>
              <th className="py-2 px-2">Notes</th>
              {canEdit && <th className="py-2 px-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {records.map((r: Sales) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  {r.saleDate ? r.saleDate.toISOString().slice(0, 10) : "-"}
                </td>
                <td className="py-2 px-2">{r.customerName || "-"}</td>
                <td className="py-2 px-2">{r.plantName || "-"}</td>
                <td className="py-2 px-2">{r.genus || "-"}</td>
                <td className="py-2 px-2">{r.cultivar || "-"}</td>
                <td className="py-2 px-2">{r.size || "-"}</td>
                <td className="py-2 px-2">{r.quantity ?? "-"}</td>
                <td className="py-2 px-2">
                  {r.unitPrice ? `$${r.unitPrice.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">
                  {r.totalPrice ? `$${r.totalPrice.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">{r.paymentMethod || "-"}</td>
                <td className="py-2 px-2">{r.employee || "-"}</td>
                <td className="py-2 px-2">{r.notes || "-"}</td>

                {canEdit && (
                  <td className="py-2 px-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/sales/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await prisma.sales.delete({
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
            No sales records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
