// src/components/DataForm.tsx
"use client";

import { useState } from "react";
import { getTableBySlug, getColumnsForTable } from "@/lib/meta/getTableMeta";
import { validateForm, type ValidationErrors } from "@/lib/validation";
import type { AppColumn } from "@/lib/meta/types";

interface DataFormProps {
  slug: string;
  mode: "new" | "edit";
  record?: Record<string, any>;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onDelete?: () => void;
  cancelHref: string;
}

export function DataForm({
  slug,
  mode,
  record,
  onSubmit,
  onDelete,
  cancelHref,
}: DataFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const table = getTableBySlug(slug);
  const columns = table ? getColumnsForTable(table.id) : [];

  if (!table) {
    return <div className="p-6 text-red-600">Table {slug} not found</div>;
  }

  const editableColumns = columns.filter((col) => !col.isComputed);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setErrors({});
    setServerError("");

    const formData = new FormData(e.currentTarget);

    const validationErrors = validateForm(editableColumns, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setServerError(error.message || "An error occurred while saving");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">
        {mode === "new" ? `Add ${table.name}` : `Edit ${table.name}`}
      </h1>

      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm font-medium">Error</p>
          <p className="text-red-700 text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {editableColumns.map((col) => (
          <FormField
            key={col.id}
            column={col}
            defaultValue={record?.[col.id]}
            error={errors[col.id]}
            onChange={() => {
              if (errors[col.id]) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next[col.id];
                  return next;
                });
              }
            }}
          />
        ))}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              mode === "new"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Saving..." : mode === "new" ? "Save" : "Save Changes"}
          </button>

          <a href={cancelHref} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </a>

          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this record?")) {
                  onDelete();
                }
              }}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-auto disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  column: AppColumn;
  defaultValue?: any;
  error?: string;
  onChange?: () => void;
}

function FormField({ column, defaultValue, error, onChange }: FormFieldProps) {
  const { id, name, type, required, placeholder } = column;

  const formattedDefaultValue =
    type === "date" && defaultValue instanceof Date
      ? defaultValue.toISOString().slice(0, 10)
      : defaultValue ?? "";

  const inputClasses = `border p-2 rounded w-full ${
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
  }`;

  const renderInput = () => {
    switch (type) {
      case "text":
        if (id.toLowerCase().includes("notes")) {
          return (
            <textarea
              name={id}
              className={inputClasses}
              rows={3}
              defaultValue={formattedDefaultValue}
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
            />
          );
        }
        return (
          <input
            type="text"
            name={id}
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );

      case "number":
        return (
          <input
            type="number"
            name={id}
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            min="0"
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );

      case "date":
        return (
          <input
            type="date"
            name={id}
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            required={required}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );

      case "currency":
        return (
          <input
            type="number"
            name={id}
            step="0.01"
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            min="0"
            required={required}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );

      case "percent":
        return (
          <input
            type="number"
            name={id}
            step="0.01"
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            min="0"
            placeholder={placeholder || "e.g., 25 for 25%"}
            required={required}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );

      default:
        return (
          <input
            type="text"
            name={id}
            className={inputClasses}
            defaultValue={formattedDefaultValue}
            required={required}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}