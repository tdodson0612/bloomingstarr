// src/lib/meta/types.ts

/**
 * Represents a user-created table
 * Example: "Plant Intake", "Sales", "Schedule"
 */
export interface AppTable {
  id: string;               // unique ID (stable, not editable)
  name: string;             // display name (manager-editable)
  slug: string;             // used in URLs (plant-intake, sales)
  createdBy: string;        // user ID
  createdAt: Date;
  isDeleted: boolean;       // soft delete
}

/**
 * Allowed column types (intentionally simple)
 */
export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "percent";

/**
 * Represents a column inside a table
 * Example: SKU, Quantity, Date Received
 */
export interface AppColumn {
  /** Stable identifier (never changes, used in DB + forms) */
  id: string;

  /** Which table this column belongs to */
  tableId: string;

  /** Display name (manager-editable) */
  name: string;

  /** Data type */
  type: ColumnType;

  /** Does this column use a formula? */
  isComputed: boolean;

  /** Stored formula (if computed) */
  formula?: string;

  /** Column order (manager-controlled) */
  orderIndex: number;

  /** Hide/show column in tables */
  isVisible: boolean;

  /**
   * Is this field required?
   */
  required?: boolean;

  // ─────────────────────────────────────────────
  // 🔥 FORM METADATA (NEW – REQUIRED FOR DynamicForm)
  // ─────────────────────────────────────────────

  /**
   * Can users edit this field?
   * Defaults to true.
   * Set false for IDs, system fields, computed values.
   */
  isEditable?: boolean;

  /**
   * Is a value required on create/edit?
   * Defaults to false.
   */
  isRequired?: boolean;

  /**
   * Placeholder text shown in inputs
   */
  placeholder?: string;

  /**
   * Default value used in create mode
   */
  defaultValue?: string;
}

/**
 * Represents a single row in a table
 * (row-level metadata only)
 */
export interface AppRow {
  id: string;
  tableId: string;
  createdAt: Date;
  createdBy: string;
}

/**
 * Represents a single cell value
 * (column rename-safe, metadata-driven)
 */
export interface AppCell {
  id: string;
  rowId: string;
  columnId: string;
  value: string | null;     // stored as string for now (intentional)
}
