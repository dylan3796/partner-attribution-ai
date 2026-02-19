import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash, randomBytes } from "crypto";

// Generate a signed session token — never store plaintext password in cookie
function hashPassword(password: string): string {
  const secret = process.env.AUTH_SECRET || "covant-session-secret-2026";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.DASHBOARD_PASSWORD?.trim();

  if (!expected || password.trim() !== expected) {
    // Constant-time-ish delay to slow brute force
    await new Promise(r => setTimeout(r, 300));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Store hashed token, not plaintext password
  const sessionToken = hashPassword(expected);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("pb_auth", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days (was 30 — shorter is safer)
    path: "/",
  });

  return response;
}
