import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/admin", "/portal/admin"];
const AUTH_COOKIE = "pb_auth";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected path
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE);
  const dashboardPassword = process.env.DASHBOARD_PASSWORD;

  if (!dashboardPassword) {
    // No password set — allow access (dev fallback)
    return NextResponse.next();
  }

  if (authCookie?.value === dashboardPassword) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to login
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/portal/admin/:path*"],
};
