"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OnboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Onboard error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: "2rem" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: "#f59e0b18",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: "#f59e0b",
        }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: ".5rem" }}>
          Couldn&apos;t set up your account
        </h2>
        <p style={{ color:'#6b7280', marginBottom: "2rem", lineHeight: 1.6 }}>
          We hit an issue provisioning your organization. Please try again — if the problem persists, reach out to support.
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 8, background: "#fff", color: "#000",
              fontWeight: 600, fontSize: ".9rem", border: "none", cursor: "pointer",
            }}
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 8, border: "1px solid #333",
              color: "#999", fontWeight: 600, fontSize: ".9rem", textDecoration: "none",
            }}
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
