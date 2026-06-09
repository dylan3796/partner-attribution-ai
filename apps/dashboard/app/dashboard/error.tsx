"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: "#ef444418",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: "#ef4444",
        }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: ".5rem" }}>Something went wrong</h2>
        <p className="muted" style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
          An unexpected error occurred while loading this page.
          {error.digest && <span style={{ display: "block", fontSize: ".75rem", marginTop: 4, fontFamily: "monospace" }}>Error ID: {error.digest}</span>}
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
          <button onClick={reset} className="btn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RefreshCw size={16} /> Try Again
          </button>
          <Link href="/dashboard" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Home size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
