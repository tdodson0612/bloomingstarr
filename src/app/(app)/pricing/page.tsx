// app/pricing/page.tsx
import { prisma } from "@/lib/db";
import type { Pricing, Prisma } from "@prisma/client";
import Link from "next/link";
import FilterBar from "./FilterBar";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // --- Read filters from URL ---
  const search = (params.search as string) || "";
  const plantName = (params.plantName as string) || "";
  const category = (params.category as string) || "";
  const size = (params.size as string) || "";

  const priceMin = (params.priceMin as string) || "";
  const priceMax = (params.priceMax as string) || "";

  // --- Prisma WHERE conditions ---
  const where: Prisma.PricingWhereInput = {};

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
        select: { plantName: true },
        distinct: ["plantName"],
      }),
      prisma.pricing.findMany({
        select: { category: true },
        distinct: ["category"],
      }),
      prisma.pricing.findMany({
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
        <h1 className="text-2xl font-semibold">Pricing</h1>

        <Link
          href="/pricing/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Price
        </Link>
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

      {/* Table */}
      <div className="bg-white shadow p-4 rounded border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2">Plant Name</th>
              <th className="py-2 px-2">Genus</th>
              <th className="py-2 px-2">Cultivar</th>
              <th className="py-2 px-2">Size</th>
              <th className="py-2 px-2">Base Price</th>
              <th className="py-2 px-2">Markup (%)</th>
              <th className="py-2 px-2">Final Price</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Notes</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r: Pricing) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">{r.plantName || "-"}</td>
                <td className="py-2 px-2">{r.genus || "-"}</td>
                <td className="py-2 px-2">{r.cultivar || "-"}</td>
                <td className="py-2 px-2">{r.size || "-"}</td>
                <td className="py-2 px-2">
                  {r.basePrice ? `$${r.basePrice.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">
                  {r.markup ? `${r.markup}%` : "-"}
                </td>
                <td className="py-2 px-2 font-semibold text-green-600">
                  {r.finalPrice ? `$${r.finalPrice.toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-2">{r.category || "-"}</td>
                <td className="py-2 px-2">{r.notes || "-"}</td>

                {/* ACTIONS */}
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
                    <form
                      action={async () => {
                        "use server";
                        await prisma.pricing.delete({
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
            No pricing records match your filters.
          </p>
        )}
      </div>
    </div>
  );
}