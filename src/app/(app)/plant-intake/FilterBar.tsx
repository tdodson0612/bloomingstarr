// app/plant-intake/FilterBar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterBarProps = {
  search: string;
  vendorsSelected: string[];
  genus: string;
  cultivar: string;
  size: string;
  qtyMin: string;
  qtyMax: string;
  dateFrom: string;
  dateTo: string;
  quickRange: string;
  vendorOptions: string[];
  genusOptions: string[];
  cultivarOptions: string[];
  sizeOptions: string[];
};

const STORAGE_KEY = "plantIntakeFilters";

export default function FilterBar(props: FilterBarProps) {
  const {
    search,
    vendorsSelected,
    genus,
    cultivar,
    size,
    qtyMin,
    qtyMax,
    dateFrom,
    dateTo,
    quickRange,
    vendorOptions,
    genusOptions,
    cultivarOptions,
    sizeOptions,
  } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [vendorSelection, setVendorSelection] = useState<string[]>(vendorsSelected);

  // Load filters from localStorage if URL is empty
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasUrlFilters = searchParams.toString().length > 0;
    if (!hasUrlFilters) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const url = `${pathname}?${saved}`;
        router.replace(url);
      }
    }
  }, [pathname, router, searchParams]);

  // Update vendorSelection when props change (URL change)
  useEffect(() => {
    setVendorSelection(vendorsSelected);
  }, [vendorsSelected]);

  function updateFilters(next: Record<string, string | string[] | undefined>) {
    const params = new URLSearchParams();

    function setParam(key: string, value?: string | string[]) {
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else if (value.trim() !== "") {
        params.set(key, value);
      }
    }

    setParam("search", next.search as string);
    setParam("vendor", next.vendor as string[] | string);
    setParam("genus", next.genus as string);
    setParam("cultivar", next.cultivar as string);
    setParam("size", next.size as string);
    setParam("qtyMin", next.qtyMin as string);
    setParam("qtyMax", next.qtyMax as string);
    setParam("dateFrom", next.dateFrom as string);
    setParam("dateTo", next.dateTo as string);
    setParam("quickRange", next.quickRange as string);

    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    // Save to localStorage for sticky filters
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, qs);
    }

    router.push(url);
  }

  function handleQuickRange(range: string) {
    updateFilters({
      search,
      vendor: vendorSelection,
      genus,
      cultivar,
      size,
      qtyMin,
      qtyMax,
      // when quickRange is used, we clear manual date fields
      dateFrom: "",
      dateTo: "",
      quickRange: range,
    });
  }

  function handleChangeField(field: string, value: string) {
    updateFilters({
      search: field === "search" ? value : search,
      vendor: vendorSelection,
      genus: field === "genus" ? value : genus,
      cultivar: field === "cultivar" ? value : cultivar,
      size: field === "size" ? value : size,
      qtyMin: field === "qtyMin" ? value : qtyMin,
      qtyMax: field === "qtyMax" ? value : qtyMax,
      dateFrom: field === "dateFrom" ? value : dateFrom,
      dateTo: field === "dateTo" ? value : dateTo,
      quickRange: field === "dateFrom" || field === "dateTo" ? "" : quickRange,
    });
  }

  function toggleVendor(v: string) {
    let next: string[];
    if (vendorSelection.includes(v)) {
      next = vendorSelection.filter((x) => x !== v);
    } else {
      next = [...vendorSelection, v];
    }
    setVendorSelection(next);

    updateFilters({
      search,
      vendor: next,
      genus,
      cultivar,
      size,
      qtyMin,
      qtyMax,
      dateFrom,
      dateTo,
      quickRange,
    });
  }

  function clearAll() {
    setVendorSelection([]);
    updateFilters({
      search: "",
      vendor: [],
      genus: "",
      cultivar: "",
      size: "",
      qtyMin: "",
      qtyMax: "",
      dateFrom: "",
      dateTo: "",
      quickRange: "",
    });
  }

  return (
    <div className="bg-white border rounded shadow-sm p-4 space-y-3">
      {/* Top row: global search + quick actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search SKU, genus, cultivar, vendor, notes..."
            defaultValue={search}
            onBlur={(e) => handleChangeField("search", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="px-3 py-2 text-sm border rounded bg-gray-50 hover:bg-gray-100"
        >
          Clear filters
        </button>
      </div>

      {/* Second row: dropdowns */}
      <div className="flex flex-wrap gap-3">
        {/* Vendor (multi-select via checkboxes) */}
        <div className="min-w-[220px]">
          <p className="text-xs font-medium mb-1">Vendor</p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded p-2">
            {vendorOptions.length === 0 && (
              <span className="text-xs text-gray-500">No vendors yet</span>
            )}
            {vendorOptions.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleVendor(v)}
                className={`text-xs px-2 py-1 rounded border ${
                  vendorSelection.includes(v)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Genus */}
        <div className="min-w-[160px]">
          <label className="block text-xs font-medium mb-1">Genus</label>
          <select
            defaultValue={genus}
            onChange={(e) => handleChangeField("genus", e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {genusOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Cultivar */}
        <div className="min-w-[160px]">
          <label className="block text-xs font-medium mb-1">Cultivar</label>
          <select
            defaultValue={cultivar}
            onChange={(e) => handleChangeField("cultivar", e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {cultivarOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="min-w-[140px]">
          <label className="block text-xs font-medium mb-1">Size</label>
          <select
            defaultValue={size}
            onChange={(e) => handleChangeField("size", e.target.value)}
            className="w-full border rounded px-2 py-2 text-sm"
          >
            <option value="">All</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Third row: quantity + dates + quick range */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Quantity */}
        <div className="flex gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Qty ≥</label>
            <input
              type="number"
              defaultValue={qtyMin}
              onBlur={(e) => handleChangeField("qtyMin", e.target.value)}
              className="border rounded px-2 py-1 text-sm w-20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Qty ≤</label>
            <input
              type="number"
              defaultValue={qtyMax}
              onBlur={(e) => handleChangeField("qtyMax", e.target.value)}
              className="border rounded px-2 py-1 text-sm w-20"
            />
          </div>
        </div>

        {/* Manual date range */}
        <div className="flex gap-2">
          <div>
            <label className="block text-xs font-medium mb-1">Date from</label>
            <input
              type="date"
              defaultValue={dateFrom}
              onBlur={(e) => handleChangeField("dateFrom", e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Date to</label>
            <input
              type="date"
              defaultValue={dateTo}
              onBlur={(e) => handleChangeField("dateTo", e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Quick ranges */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium mr-1 mb-1">Quick date:</span>
          {[
            { key: "today", label: "Today" },
            { key: "thisWeek", label: "This week" },
            { key: "last7", label: "Last 7 days" },
            { key: "thisMonth", label: "This month" },
            { key: "last30", label: "Last 30 days" },
            { key: "thisYear", label: "This year" },
            { key: "all", label: "All" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleQuickRange(opt.key)}
              className={`text-xs px-2 py-1 rounded border ${
                quickRange === opt.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
