"use client";

import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function DemoBanner() {
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
