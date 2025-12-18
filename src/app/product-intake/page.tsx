// app/product-intake/page.tsx
import { prisma } from "@/lib/db";
import type { ProductIntake, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").map((v) => v.trim()).filter(Boolean);
}

export default async function ProductIntakePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const vendorParam = params.vendor;
  const vendorsSelected = toStringArray(vendorParam);

  const category = (params.category as string) || "";
  const brand = (params.brand as string) || "";

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
  const where: Prisma.ProductIntakeWhereInput = {};

  if (search) {
    where.OR = [
      { sku: { contains: search, mode: "insensitive" } },
      { productName: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { vendor: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
      { unit: { contains: search, mode: "insensitive" } },
    ];
  }

  if (vendorsSelected.length > 0) {
    where.vendor = { in: vendorsSelected };
  }

  if (category) {
    where.category = { equals: category };
  }

  if (brand) {
    where.brand = { equals: brand };
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
    where.dateReceived = {};
    if (dateFrom) {
      where.dateReceived.gte = dateFrom;
    }
    if (dateTo) {
      where.dateReceived.lte = dateTo;
    }
  }

  // --- Fetch records & distinct filter options ---
  const [records, vendorOptionsRaw, categoryOptionsRaw, brandOptionsRaw] =
    await Promise.all([
      prisma.productIntake.findMany({
        where,
        orderBy: { dateReceived: "desc" },
      }),
      prisma.productIntake.findMany({
        select: { vendor: true },
        distinct: ["vendor"],
      }),
      prisma.productIntake.findMany({
        select: { category: true },
        distinct: ["category"],
      }),
      prisma.productIntake.findMany({
        select: { brand: true },
        distinct: ["brand"],
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

  const brands = brandOptionsRaw
    .map((v: { brand: string | null }) => v.brand)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product Intake</h1>

        <Link
          href="/product-intake/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          vendorsSelected={vendorsSelected}
          category={category}
          brand={brand}
          qtyMin={qtyMin}
          qtyMax={qtyMax}
          dateFrom={dateFromParam}
          dateTo={dateToParam}
          quickRange={quickRange}
          vendorOptions={vendors}
          categoryOptions={categories}
          brandOptions={brands}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1200px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Product Name</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Brand</th>
              <th className="py-2 px-2">SKU</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2">Unit</th>
              <th className="py-2 px-2">Unit Cost</th>
              <th className="py-2 px-2">Total Cost</th>
              <th className="py-2 px-2">Vendor</th>
              <th className="py-2 px-2">Notes</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r: ProductIntake) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  {r.dateReceived
                    ? r.dateReceived.toISOString().slice(0, 10)
                    : "-"}
                </td>
                <td className="py-2 px-2">{r.productName || "-"}</td>
                <td className="py-2 px-2">{r.category || "-"}</td>
                <td className="py-2 px-2">{r.brand || "-"}</td>
                <td className="py-2 px-2">{r.sku || "-"}</td>
                <td className="py-2 px-2">{r.quantity ?? "-"}</td>
                <td className="py-2 px-2">{r.unit || "-"}</td>
                <td className="py-2 px-2">
                  {r.unitCost ? `$${r.unitCost.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">
                  {r.totalCost ? `$${r.totalCost.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">{r.vendor || "-"}</td>
                <td className="py-2 px-2">{r.notes || "-"}</td>

                {/* ACTIONS */}
                <td className="py-2 px-2">
                  <div className="flex gap-3">
                    {/* EDIT */}
                    <Link
                      href={`/product-intake/${r.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    {/* DELETE */}
                    <form
                      action={async () => {
                        "use server";
                        await prisma.productIntake.delete({
                          where: { id: r.id },
                        });
                      }}
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                        onClick={(e) => {
                          if (!confirm("Delete this record?")) e.preventDefault();
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No product intake records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}