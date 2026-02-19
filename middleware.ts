import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* with HTTP Basic Auth
  if (pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Basic ")) {
      const decoded = atob(authHeader.slice(6));
      const password = decoded.split(":").slice(1).join(":"); // everything after first colon
      const secret = process.env.ADMIN_SECRET?.trim();

      if (secret && password === secret) {
        return NextResponse.next();
      }
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Covant Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
