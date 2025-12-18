// src/lib/meta/getTableMeta.ts
import { DEFAULT_TABLES, DEFAULT_COLUMNS } from "./defaultTables";
import { AppTable, AppColumn } from "./types";

export function getTableBySlug(slug: string): AppTable | undefined {
  return DEFAULT_TABLES.find((t) => t.slug === slug && !t.isDeleted);
}

export function getColumnsForTable(tableId: string): AppColumn[] {
  return DEFAULT_COLUMNS
    .filter((c) => c.tableId === tableId && c.isVisible)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}
