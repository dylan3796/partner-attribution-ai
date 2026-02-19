import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth disabled — will add Clerk/Auth.js when real users exist
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/portal/admin/:path*"],
};
