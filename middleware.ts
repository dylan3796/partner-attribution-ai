import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "crypto";

const PROTECTED_PATHS = ["/dashboard", "/admin", "/portal/admin"];
const AUTH_COOKIE = "pb_auth";
const LOGIN_PATH = "/login";

function hashPassword(password: string): string {
  const secret = process.env.AUTH_SECRET || "covant-session-secret-2026";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const dashboardPassword = process.env.DASHBOARD_PASSWORD;

  if (!dashboardPassword) {
    // No password configured — allow access (dev fallback only)
    return NextResponse.next();
  }

  const expectedToken = hashPassword(dashboardPassword);

  if (authCookie?.value === expectedToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/portal/admin/:path*"],
};
