import { Role } from "@prisma/client";
import { SessionData } from "./auth";

// Check if user can edit data (add/edit/delete records)
export function canEditData(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Check if user can edit tables/columns (metadata)
export function canEditTables(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Check if user can manage users
export function canManageUsers(role: Role): boolean {
  return role === "OWNER";
}

// Check if user can view pricing
export function canViewPricing(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Check if user can edit pricing
export function canEditPricing(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Check if user can view all time clock entries
export function canViewAllTimeEntries(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Check if user can edit time clock entries
export function canEditTimeEntries(role: Role): boolean {
  return role === "OWNER" || role === "MANAGER";
}

// Helper to check if session has required role
export function hasRole(session: SessionData | null, allowedRoles: Role[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}

// Get user-friendly role display name
export function getRoleDisplayName(role: Role): string {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "MANAGER":
      return "Manager";
    case "EMPLOYEE":
      return "Employee";
    default:
      return role;
  }
}