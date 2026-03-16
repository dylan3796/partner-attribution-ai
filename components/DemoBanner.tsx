"use client";

import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DemoBanner() {
  const pathname = usePathname();

  // Don't show on auth or onboarding pages
  if (
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/onboard") ||
    pathname?.startsWith("/setup")
  ) {
    return null;
  }

  return (
    <SignedOut>
      <div style={{
        background: "#1a1a1a",
        color: "#e5e5e5",
        borderBottom: "1px solid #333",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "0.85rem",
      }}>
        You&apos;re viewing a demo.{" "}
        <Link href="/sign-in" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "underline" }}>
          Sign in
        </Link>{" "}
        to save your data.
      </div>
    </SignedOut>
  );
}
