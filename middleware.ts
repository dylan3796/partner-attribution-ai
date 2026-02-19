import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/admin", "/portal/admin"];
const AUTH_COOKIE = "pb_auth";
const LOGIN_PATH = "/login";
// Internal salt — never exposed to client. Security comes from DASHBOARD_PASSWORD itself.
const SALT = "covant-auth-v1-2026";

async function computeToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SALT),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const dashboardPassword = process.env.DASHBOARD_PASSWORD;

  if (!dashboardPassword) return NextResponse.next(); // dev fallback

  const expectedToken = await computeToken(dashboardPassword);

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
