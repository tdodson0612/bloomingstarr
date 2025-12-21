"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  search: string;
  vendorsSelected: string[];
  category: string;
  paymentMethod: string;
  amountMin: string;
  amountMax: string;
  dateFrom: string;
  dateTo: string;
  quickRange: string;
  vendorOptions: string[];
  categoryOptions: string[];
  paymentMethodOptions: string[];
};

export default function FilterBar({
  search,
  vendorsSelected,
  category,
  paymentMethod,
  amountMin,
  amountMax,
  dateFrom,
  dateTo,
  quickRange,
  vendorOptions,
  categoryOptions,
  paymentMethodOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localSearch, setLocalSearch] = useState(search);
  const [localVendors, setLocalVendors] = useState<string[]>(vendorsSelected);
  const [localCategory, setLocalCategory] = useState(category);
  const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethod);
  const [localAmountMin, setLocalAmountMin] = useState(amountMin);
  const [localAmountMax, setLocalAmountMax] = useState(amountMax);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [localQuickRange, setLocalQuickRange] = useState(quickRange);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (localSearch) params.set("search", localSearch);
    else params.delete("search");

    if (localVendors.length > 0) params.set("vendor", localVendors.join(","));
    else params.delete("vendor");

    if (localCategory) params.set("category", localCategory);
    else params.delete("category");

    if (localPaymentMethod) params.set("paymentMethod", localPaymentMethod);
    else params.delete("paymentMethod");

    if (localAmountMin) params.set("amountMin", localAmountMin);
    else params.delete("amountMin");

    if (localAmountMax) params.set("amountMax", localAmountMax);
    else params.delete("amountMax");

    if (localQuickRange && localQuickRange !== "all") {
      params.set("quickRange", localQuickRange);
      params.delete("dateFrom");
      params.delete("dateTo");
    } else {
      params.delete("quickRange");
      if (localDateFrom) params.set("dateFrom", localDateFrom);
      else params.delete("dateFrom");
      if (localDateTo) params.set("dateTo", localDateTo);
      else params.delete("dateTo");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function clearFilters() {
    setLocalSearch("");
    setLocalVendors([]);
    setLocalCategory("");
    setLocalPaymentMethod("");
    setLocalAmountMin("");
    setLocalAmountMax("");
    setLocalDateFrom("");
    setLocalDateTo("");
    setLocalQuickRange("");
    startTransition(() => {
      router.push("/overhead-expenses");
    });
  }

  function toggleVendor(v: string) {
    setLocalVendors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
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

      {/* Vendor (Multi-select) */}
      <div>
        <label className="block text-sm font-medium mb-1">Vendor</label>
        <div className="flex flex-wrap gap-2">
          {vendorOptions.map((v) => (
            <button
              key={v}
              onClick={() => toggleVendor(v)}
              className={`px-3 py-1 rounded text-sm ${
                localVendors.includes(v)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
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

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          value={localPaymentMethod}
          onChange={(e) => setLocalPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {paymentMethodOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Amount Min ($)</label>
          <input
            type="number"
            value={localAmountMin}
            onChange={(e) => setLocalAmountMin(e.target.value)}
            step="0.01"
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount Max ($)</label>
          <input
            type="number"
            value={localAmountMax}
            onChange={(e) => setLocalAmountMax(e.target.value)}
            step="0.01"
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Date Quick Range */}
      <div>
        <label className="block text-sm font-medium mb-1">Date Range</label>
        <select
          value={localQuickRange}
          onChange={(e) => setLocalQuickRange(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Custom</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="last7">Last 7 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="last30">Last 30 Days</option>
          <option value="thisYear">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Custom Date Range */}
      {!localQuickRange && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input
              type="date"
              value={localDateFrom}
              onChange={(e) => setLocalDateFrom(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input
              type="date"
              value={localDateTo}
              onChange={(e) => setLocalDateTo(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      )}

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