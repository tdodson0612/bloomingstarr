// src/lib/validation/helpers.ts

import { getColumnsForTable } from "@/lib/meta/getTableMeta";
import { validateServerData, type ValidationErrors } from "./index";

/**
 * Helper to validate form data for a specific table
 * Throws an error if validation fails
 */
export function validateTableData(
  tableId: string,
  data: Record<string, any>
): void {
  const columns = getColumnsForTable(tableId);
  const validation = validateServerData(columns, data);

  if (!validation.valid) {
    const errorMessages = Object.values(validation.errors).join("; ");
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}

/**
 * Extract form data into a typed object
 * Handles common conversions (dates, numbers, etc.)
 */
export function extractFormData(formData: FormData): Record<string, any> {
  const data: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (value === "") {
      data[key] = null;
    } else if (typeof value === "string") {
      data[key] = value;
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * Convert FormData to database-ready object
 * Handles type conversions based on field names
 */
export function formDataToDbData(
  formData: FormData,
  businessId: string
): Record<string, any> {
  const data: Record<string, any> = {
    businessId,
  };

  for (const [key, value] of formData.entries()) {
    const stringValue = value?.toString() || "";

    // Skip empty values
    if (!stringValue) {
      data[key] = null;
      continue;
    }

    // Date fields
    if (key.toLowerCase().includes("date")) {
      data[key] = new Date(stringValue);
      continue;
    }

    // Number fields (quantity, amount, price, cost, etc.)
    if (
      key.toLowerCase().includes("quantity") ||
      key.toLowerCase().includes("amount") ||
      key.toLowerCase().includes("price") ||
      key.toLowerCase().includes("cost") ||
      key.toLowerCase().includes("markup")
    ) {
      data[key] = Number(stringValue) || null;
      continue;
    }

    // Default to string
    data[key] = stringValue;
  }

  return data;
}

/**
 * Simplified validation + conversion helper
 * Use this in your server actions for one-line validation
 */
export function validateAndPrepareData(
  tableId: string,
  formData: FormData,
  businessId: string
): any {  // Changed from Record<string, any> to any
  const data = formDataToDbData(formData, businessId);
  validateTableData(tableId, data);
  return data;
}