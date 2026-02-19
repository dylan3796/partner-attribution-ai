import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function computeToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", enc.encode("covant:" + password));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.DASHBOARD_PASSWORD?.trim();

  if (!expected || password.trim() !== expected) {
    await new Promise(r => setTimeout(r, 300));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionToken = await computeToken(expected);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("pb_auth", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
