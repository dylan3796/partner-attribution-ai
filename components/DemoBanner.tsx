"use client";

import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function DemoBanner() {
  return (
    <SignedOut>
      <div style={{
        background: "linear-gradient(90deg, #1a1a2e, #16213e)",
        color: "#a5b4fc",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "0.85rem",
        borderBottom: "1px solid rgba(165, 180, 252, 0.15)",
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
