// src/lib/validation/rules.ts

/**
 * Validation rule type
 * Returns error message string if invalid, null if valid
 */
export type ValidationRule = (value: any, fieldName: string) => string | null;

/**
 * Required field validation
 */
export const required = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Minimum value validation (for numbers)
 */
export const min = (minValue: number): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) return null; // Let type validation handle this
  if (num < minValue) {
    return `${fieldName} must be at least ${minValue}`;
  }
  return null;
};

/**
 * Maximum value validation (for numbers)
 */
export const max = (maxValue: number): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) return null; // Let type validation handle this
  if (num > maxValue) {
    return `${fieldName} must be no more than ${maxValue}`;
  }
  return null;
};

/**
 * Minimum length validation (for strings)
 */
export const minLength = (minLen: number): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  if (str.length < minLen) {
    return `${fieldName} must be at least ${minLen} characters`;
  }
  return null;
};

/**
 * Maximum length validation (for strings)
 */
export const maxLength = (maxLen: number): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  if (str.length > maxLen) {
    return `${fieldName} must be no more than ${maxLen} characters`;
  }
  return null;
};

/**
 * Pattern validation (regex)
 */
export const pattern = (regex: RegExp, message: string): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  if (!regex.test(str)) {
    return message || `${fieldName} format is invalid`;
  }
  return null;
};

/**
 * Email validation
 */
export const email = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(value))) {
    return `${fieldName} must be a valid email address`;
  }
  return null;
};

/**
 * Positive number validation
 */
export const positive = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num <= 0) {
    return `${fieldName} must be positive`;
  }
  return null;
};

/**
 * Non-negative number validation (0 or greater)
 */
export const nonNegative = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < 0) {
    return `${fieldName} cannot be negative`;
  }
  return null;
};

/**
 * Valid date validation
 */
export const validDate = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return `${fieldName} must be a valid date`;
  }
  return null;
};

/**
 * Date not in future validation
 */
export const notFuture = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  const now = new Date();
  if (date > now) {
    return `${fieldName} cannot be in the future`;
  }
  return null;
};

/**
 * Date not in past validation
 */
export const notPast = (): ValidationRule => (value, fieldName) => {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today
  if (date < now) {
    return `${fieldName} cannot be in the past`;
  }
  return null;
};

/**
 * Combine multiple validation rules
 */
export const combine = (...rules: ValidationRule[]): ValidationRule => (value, fieldName) => {
  for (const rule of rules) {
    const error = rule(value, fieldName);
    if (error) return error; // Return first error found
  }
  return null;
};