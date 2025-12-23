import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";
import { canEditData, canViewPricing } from "./roles";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-change-in-production"
);

const COOKIE_NAME = "session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export type SessionData = {
  userId: string;
  role: Role;
  name: string | null;
  employeeId: string | null;
  businessId: string; // ADDED
};

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify a password against a hash
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create a session (login)
export async function createSession(sessionData: SessionData): Promise<void> {
  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  (await cookies()).set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

// Get current session
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as SessionData;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// Destroy session (logout)
export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

// Require authentication (for use in server components/actions)
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

// Check if user has required role
export function hasRole(session: SessionData, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(session.role);
}

// ============================================
// SERVER ACTION AUTHORIZATION HELPERS
// ============================================

/**
 * Require edit permission (Manager/Owner only)
 * Use in Server Actions that create/update/delete data
 */
export async function requireEditAccess(): Promise<SessionData> {
  const session = await requireAuth();
  
  if (!canEditData(session.role)) {
    throw new Error("Unauthorized: Edit access required");
  }
  
  return session;
}

/**
 * Require pricing access (Manager/Owner only)
 * Use in pricing-related Server Actions
 */
export async function requirePricingAccess(): Promise<SessionData> {
  const session = await requireAuth();
  
  if (!canViewPricing(session.role)) {
    throw new Error("Unauthorized: Pricing access required");
  }
  
  return session;
}

/**
 * Ensure record belongs to user's business
 * Use after fetching a record to validate ownership
 */
export async function requireBusinessAccess(
  recordBusinessId: string
): Promise<SessionData> {
  const session = await requireAuth();
  
  if (session.businessId !== recordBusinessId) {
    throw new Error("Forbidden: Access denied");
  }
  
  return session;
}