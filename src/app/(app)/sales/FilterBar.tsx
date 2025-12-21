"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  search: string;
  employeesSelected: string[];
  customerName: string;
  plantName: string;
  paymentMethod: string;
  qtyMin: string;
  qtyMax: string;
  dateFrom: string;
  dateTo: string;
  quickRange: string;
  employeeOptions: string[];
  customerOptions: string[];
  plantNameOptions: string[];
  paymentMethodOptions: string[];
};

export default function FilterBar({
  search,
  employeesSelected,
  customerName,
  plantName,
  paymentMethod,
  qtyMin,
  qtyMax,
  dateFrom,
  dateTo,
  quickRange,
  employeeOptions,
  customerOptions,
  plantNameOptions,
  paymentMethodOptions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localSearch, setLocalSearch] = useState(search);
  const [localEmployees, setLocalEmployees] = useState<string[]>(employeesSelected);
  const [localCustomerName, setLocalCustomerName] = useState(customerName);
  const [localPlantName, setLocalPlantName] = useState(plantName);
  const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethod);
  const [localQtyMin, setLocalQtyMin] = useState(qtyMin);
  const [localQtyMax, setLocalQtyMax] = useState(qtyMax);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [localQuickRange, setLocalQuickRange] = useState(quickRange);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (localSearch) params.set("search", localSearch);
    else params.delete("search");

    if (localEmployees.length > 0) params.set("employee", localEmployees.join(","));
    else params.delete("employee");

    if (localCustomerName) params.set("customerName", localCustomerName);
    else params.delete("customerName");

    if (localPlantName) params.set("plantName", localPlantName);
    else params.delete("plantName");

    if (localPaymentMethod) params.set("paymentMethod", localPaymentMethod);
    else params.delete("paymentMethod");

    if (localQtyMin) params.set("qtyMin", localQtyMin);
    else params.delete("qtyMin");

    if (localQtyMax) params.set("qtyMax", localQtyMax);
    else params.delete("qtyMax");

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
    setLocalEmployees([]);
    setLocalCustomerName("");
    setLocalPlantName("");
    setLocalPaymentMethod("");
    setLocalQtyMin("");
    setLocalQtyMax("");
    setLocalDateFrom("");
    setLocalDateTo("");
    setLocalQuickRange("");
    startTransition(() => {
      router.push("/sales");
    });
  }

  function toggleEmployee(e: string) {
    setLocalEmployees((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
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

      {/* Employee (Multi-select) */}
      <div>
        <label className="block text-sm font-medium mb-1">Employee</label>
        <div className="flex flex-wrap gap-2">
          {employeeOptions.map((e) => (
            <button
              key={e}
              onClick={() => toggleEmployee(e)}
              className={`px-3 py-1 rounded text-sm ${
                localEmployees.includes(e)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Customer</label>
        <select
          value={localCustomerName}
          onChange={(e) => setLocalCustomerName(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {customerOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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

      {/* Quantity Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Qty Min</label>
          <input
            type="number"
            value={localQtyMin}
            onChange={(e) => setLocalQtyMin(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Qty Max</label>
          <input
            type="number"
            value={localQtyMax}
            onChange={(e) => setLocalQtyMax(e.target.value)}
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