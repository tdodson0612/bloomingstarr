// src/components/DataTable.tsx
"use client";

import { getTableBySlug, getColumnsForTable } from "@/lib/meta/getTableMeta";
import { AppColumn, ColumnType } from "@/lib/meta/types";

interface DataTableProps {
  slug: string;
  data: Record<string, any>[];
  canEdit: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DataTable({
  slug,
  data,
  canEdit,
  onAdd,
  onEdit,
  onDelete,
}: DataTableProps) {
  const table = getTableBySlug(slug);
  const columns = table ? getColumnsForTable(table.id) : [];

  if (!table) {
    return (
      <div className="p-6 text-center text-gray-500">
        Table &quot;{slug}&quot; not found
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">{table.name}</h1>
          {canEdit && onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add {table.name}
            </button>
          )}
        </div>
        <div className="text-center py-12 text-gray-500">
          No records yet. Click &quot;+ Add&quot; to create one.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{table.name}</h1>
        {canEdit && onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add {table.name}
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                >
                  {col.name}
                </th>
              ))}
              {canEdit && (onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.id} className="px-4 py-3 text-sm">
                    {formatCellValue(row[col.id], col.type)}
                  </td>
                ))}
                {canEdit && (onEdit || onDelete) && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm("Delete this record?")) {
                              onDelete(row.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Format cell values based on column type
 */
function formatCellValue(value: any, type: ColumnType): string {
  if (value === null || value === undefined) return "—";

  switch (type) {
    case "date":
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return value;

    case "currency":
      const num = Number(value);
      return isNaN(num) ? value : `$${num.toFixed(2)}`;

    case "percent":
      const pct = Number(value);
      return isNaN(pct) ? value : `${pct}%`;

    case "number":
      return String(value);

    case "text":
    default:
      return String(value);
  }
}