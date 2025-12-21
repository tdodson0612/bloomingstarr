import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

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