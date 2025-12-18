// src/lib/meta/defaultTables.ts
import { AppTable, AppColumn } from "./types";

export const DEFAULT_TABLES: AppTable[] = [
  {
    id: "plant-intake",
    name: "Plant Intake",
    slug: "plant-intake",
    createdBy: "system",
    createdAt: new Date(),
    isDeleted: false,
  },
];

export const DEFAULT_COLUMNS: AppColumn[] = [
  {
    id: "dateReceived",
    tableId: "plant-intake",
    name: "Date Received",
    type: "date",
    isComputed: false,
    orderIndex: 0,
    isVisible: true,
  },
  {
    id: "sku",
    tableId: "plant-intake",
    name: "SKU",
    type: "text",
    isComputed: false,
    orderIndex: 1,
    isVisible: true,
  },
  {
    id: "genus",
    tableId: "plant-intake",
    name: "Genus",
    type: "text",
    isComputed: false,
    orderIndex: 2,
    isVisible: true,
  },
  {
    id: "cultivar",
    tableId: "plant-intake",
    name: "Cultivar",
    type: "text",
    isComputed: false,
    orderIndex: 3,
    isVisible: true,
  },
  {
    id: "size",
    tableId: "plant-intake",
    name: "Size",
    type: "text",
    isComputed: false,
    orderIndex: 4,
    isVisible: true,
  },
  {
    id: "quantity",
    tableId: "plant-intake",
    name: "Quantity",
    type: "number",
    isComputed: false,
    orderIndex: 5,
    isVisible: true,
  },
  {
    id: "vendor",
    tableId: "plant-intake",
    name: "Vendor",
    type: "text",
    isComputed: false,
    orderIndex: 6,
    isVisible: true,
  },
  {
    id: "notes",
    tableId: "plant-intake",
    name: "Notes",
    type: "text",
    isComputed: false,
    orderIndex: 7,
    isVisible: true,
  },
];
