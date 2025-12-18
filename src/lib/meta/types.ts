// src/lib/meta/types.ts

/**
 * Represents a user-created table
 * Example: "Plant Intake", "Sales", "Schedule"
 */
export interface AppTable {
  id: string;               // unique ID
  name: string;             // display name (editable by managers)
  slug: string;             // used in URLs (plant-intake, sales)
  createdBy: string;        // user ID
  createdAt: Date;
  isDeleted: boolean;       // soft delete
}

/**
 * Represents a column inside a table
 * Example: SKU, Quantity, Date Received
 */
export interface AppColumn {
  id: string;
  tableId: string;          // which table this column belongs to
  name: string;             // column name (editable)
  type: ColumnType;         // data type
  isComputed: boolean;      // does this column use a formula?
  formula?: string;         // stored formula (if computed)
  orderIndex: number;       // column order
  isVisible: boolean;       // hide/show column
}

/**
 * Allowed column types (simple on purpose)
 */
export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "percent";

/**
 * Represents a single row in a table
 */
export interface AppRow {
  id: string;
  tableId: string;
  createdAt: Date;
  createdBy: string;
}

/**
 * Represents a single cell value
 * (this is why columns can be renamed safely)
 */
export interface AppCell {
  id: string;
  rowId: string;
  columnId: string;
  value: string | null;     // everything stored as string for now
}
