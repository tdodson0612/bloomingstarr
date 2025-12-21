"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  search: string;
  plantName: string;
  category: string;
  size: string;
  priceMin: string;
  priceMax: string;
  plantNameOptions: string[];
  categoryOptions: string[];
  sizeOptions: string[];
};

export default function FilterBar({
  search,
  plantName,
  category,
  size,
  priceMin,
  priceMax,
  plantNameOptions,
  categoryOptions,
  sizeOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localSearch, setLocalSearch] = useState(search);
  const [localPlantName, setLocalPlantName] = useState(plantName);
  const [localCategory, setLocalCategory] = useState(category);
  const [localSize, setLocalSize] = useState(size);
  const [localPriceMin, setLocalPriceMin] = useState(priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (localSearch) params.set("search", localSearch);
    else params.delete("search");

    if (localPlantName) params.set("plantName", localPlantName);
    else params.delete("plantName");

    if (localCategory) params.set("category", localCategory);
    else params.delete("category");

    if (localSize) params.set("size", localSize);
    else params.delete("size");

    if (localPriceMin) params.set("priceMin", localPriceMin);
    else params.delete("priceMin");

    if (localPriceMax) params.set("priceMax", localPriceMax);
    else params.delete("priceMax");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function clearFilters() {
    setLocalSearch("");
    setLocalPlantName("");
    setLocalCategory("");
    setLocalSize("");
    setLocalPriceMin("");
    setLocalPriceMax("");
    startTransition(() => {
      router.push("/pricing");
    });
  }

  return (
    <div className="bg-white p-4 rounded border shadow-sm space-y-3">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search all fields..."
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Plant Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Plant Name</label>
        <select
          value={localPlantName}
          onChange={(e) => setLocalPlantName(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {plantNameOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={localCategory}
          onChange={(e) => setLocalCategory(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={localSize}
          onChange={(e) => setLocalSize(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {sizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Price Min ($)</label>
          <input
            type="number"
            value={localPriceMin}
            onChange={(e) => setLocalPriceMin(e.target.value)}
            step="0.01"
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Max ($)</label>
          <input
            type="number"
            value={localPriceMax}
            onChange={(e) => setLocalPriceMax(e.target.value)}
            step="0.01"
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}