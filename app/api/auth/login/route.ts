import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
