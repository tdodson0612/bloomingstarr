// app/(app)/pricing/page.tsx
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { canEditData, canViewPricing } from "@/lib/roles";
import { redirect } from "next/navigation";
import type { Pricing, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";
import { getTableBySlug, getColumnsForTable } from "@/lib/meta/getTableMeta";
import ConfirmSubmitButton from "./ConfirmSubmitButton";
import { deletePricing } from "@/lib/actions/pricing";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check permissions - Pricing page is restricted to Managers/Owners only
  const session = await getSession();
  const canView = session ? canViewPricing(session.role) : false;
  
  // Redirect employees away from pricing page
  if (!canView || !session) {
    redirect("/home");
  }

  // Check edit permissions (Managers/Owners can edit)
  const canEdit = canEditData(session.role);

  const params = await searchParams;

  // 🆕 METADATA - Get table and column definitions
  const table = getTableBySlug("pricing");
  const columns = table ? getColumnsForTable(table.id) : [];

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const plantName = (params.plantName as string) || "";
  const category = (params.category as string) || "";
  const size = (params.size as string) || "";

  const priceMin = (params.priceMin as string) || "";
  const priceMax = (params.priceMax as string) || "";

  // --- Prisma WHERE conditions ---
  const where: Prisma.PricingWhereInput = {
    businessId: session.businessId,
  };

  if (search) {
    where.OR = [
      { plantName: { contains: search, mode: "insensitive" } },
      { genus: { contains: search, mode: "insensitive" } },
      { cultivar: { contains: search, mode: "insensitive" } },
      { size: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  if (plantName) {
    where.plantName = { equals: plantName };
  }

  if (category) {
    where.category = { equals: category };
  }

  if (size) {
    where.size = { equals: size };
  }

  if (priceMin || priceMax) {
    where.finalPrice = {};
    if (priceMin) {
      where.finalPrice.gte = Number(priceMin);
    }
    if (priceMax) {
      where.finalPrice.lte = Number(priceMax);
    }
  }

  // --- Fetch records & distinct filter options ---
  const [records, plantNameOptionsRaw, categoryOptionsRaw, sizeOptionsRaw] =
    await Promise.all([
      prisma.pricing.findMany({
        where,
        orderBy: { plantName: "asc" },
      }),
      prisma.pricing.findMany({
        where: { businessId: session.businessId },
        select: { plantName: true },
        distinct: ["plantName"],
      }),
      prisma.pricing.findMany({
        where: { businessId: session.businessId },
        select: { category: true },
        distinct: ["category"],
      }),
      prisma.pricing.findMany({
        where: { businessId: session.businessId },
        select: { size: true },
        distinct: ["size"],
      }),
    ]);

  const plantNames = plantNameOptionsRaw
    .map((v: { plantName: string | null }) => v.plantName)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const categories = categoryOptionsRaw
    .map((v: { category: string | null }) => v.category)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  const sizes = sizeOptionsRaw
    .map((v: { size: string | null }) => v.size)
    .filter((v): v is string => v !== null)
    .sort((a: string, b: string) => a.localeCompare(b));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          {table?.name || "Pricing"}
        </h1>

        {/* Only show Add button if user can edit */}
        {canEdit && (
          <Link
            href="/pricing/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Price
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          search={search}
          plantName={plantName}
          category={category}
          size={size}
          priceMin={priceMin}
          priceMax={priceMax}
          plantNameOptions={plantNames}
          categoryOptions={categories}
          sizeOptions={sizes}
        />
      </div>

      {/* 🆕 METADATA-DRIVEN TABLE */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1000px]">
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
            {records.map((r: Pricing) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                {/* Dynamically render cells from metadata */}
                {columns.map((col) => {
                  const value = (r as any)[col.id];
                  // Special styling for finalPrice column
                  const isFinalPrice = col.id === "finalPrice";
                  return (
                    <td 
                      key={col.id} 
                      className={`py-2 px-2 ${isFinalPrice ? "font-semibold text-green-600" : ""}`}
                    >
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
                        href={`/pricing/${r.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      {/* DELETE */}
                      <form action={deletePricing.bind(null, r.id)}>
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
            No pricing records match your filters.
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