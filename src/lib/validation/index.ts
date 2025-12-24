// src/lib/validation/index.ts

import type { AppColumn } from "@/lib/meta/types";
import { required, nonNegative, validDate } from "./rules";

export * from "./rules";

/**
 * Validation errors object type
 */
export type ValidationErrors = Record<string, string>;

/**
 * Validate a single field based on its column metadata
 */
export function validateField(
  column: AppColumn,
  value: any
): string | null {
  const { name, type, required: isRequired } = column;

  // Check required
  if (isRequired) {
    if (value === null || value === undefined || value === "") {
      return `${name} is required`;
    }
  }

  // If empty and not required, skip other validations
  if (value === null || value === undefined || value === "") {
    return null;
  }

  // Type-specific validation
  switch (type) {
    case "number":
    case "currency":
    case "percent":
      const num = Number(value);
      if (isNaN(num)) {
        return `${name} must be a valid number`;
      }
      if (num < 0) {
        return `${name} cannot be negative`;
      }
      break;

    case "date":
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return `${name} must be a valid date`;
      }
      break;

    case "text":
      // Text fields are generally flexible, but we can add length checks if needed
      const str = String(value);
      if (str.length > 10000) {
        return `${name} is too long (max 10000 characters)`;
      }
      break;
  }

  return null;
}

/**
 * Validate all fields in a form based on column metadata
 */
export function validateForm(
  columns: AppColumn[],
  formData: FormData
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const column of columns) {
    // Skip computed columns (not editable)
    if (column.isComputed) continue;

    const value = formData.get(column.id);
    const error = validateField(column, value);

    if (error) {
      errors[column.id] = error;
    }
  }

  return errors;
}

/**
 * Validate all fields from a data object
 */
export function validateData(
  columns: AppColumn[],
  data: Record<string, any>
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const column of columns) {
    // Skip computed columns (not editable)
    if (column.isComputed) continue;

    const value = data[column.id];
    const error = validateField(column, value);

    if (error) {
      errors[column.id] = error;
    }
  }

  return errors;
}

/**
 * Check if validation errors exist
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Format validation errors for display
 */
export function formatErrors(errors: ValidationErrors): string {
  return Object.values(errors).join(". ");
}

/**
 * Server-side validation helper
 * Returns { valid: true } or { valid: false, errors: {...} }
 */
export function validateServerData(
  columns: AppColumn[],
  data: Record<string, any>
): { valid: true } | { valid: false; errors: ValidationErrors } {
  const errors = validateData(columns, data);

  if (hasErrors(errors)) {
    return { valid: false, errors };
  }

  return { valid: true };
}