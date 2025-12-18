import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  const isLogin = req.nextUrl.pathname.startsWith("/login");

  if (!userId && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
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
    "/settings/:path*",
    "/time-clock/:path*",
  ],
};
