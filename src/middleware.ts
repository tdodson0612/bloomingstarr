import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;
  
  const isAuthRoute = pathname.startsWith("/login");
  const isPublicRoute = pathname.startsWith("/api") || 
                        pathname.startsWith("/_next") || 
                        pathname === "/favicon.ico";

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no session and trying to access protected route, redirect to login
  if (!sessionCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If has session and trying to access login, redirect to home
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/plant-intake/:path*",
    "/product-intake/:path*",
    "/transplant-log/:path*",
    "/treatment-tracking/:path*",
    "/fertilizer-log/:path*",
    "/overhead-expenses/:path*",
    "/pricing/:path*",
    "/sales/:path*",
    "/settings/:path*",
    "/time-clock/:path*",
    "/login",
  ],
};