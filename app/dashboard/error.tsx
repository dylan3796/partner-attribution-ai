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
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: "#ef444418",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: "#ef4444",
        }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: ".5rem" }}>Something went wrong</h2>
        <div style={{
          background: "#111", border: "1px solid #222", borderRadius: 10,
          padding: "1rem", marginBottom: "1.5rem", textAlign: "left",
        }}>
          <p style={{ fontFamily: "monospace", fontSize: ".75rem", color: "#f87171", wordBreak: "break-all", margin: 0 }}>
            {error?.message || "Unknown error"}
          </p>
          {error?.stack && (
            <pre style={{ fontFamily: "monospace", fontSize: ".65rem", color: "#666", marginTop: ".5rem", overflow: "auto", maxHeight: 120, margin: ".5rem 0 0" }}>
              {error.stack.split("\n").slice(0, 5).join("\n")}
            </pre>
          )}
          {error?.digest && (
            <p style={{ fontFamily: "monospace", fontSize: ".7rem", color: "#555", marginTop: ".5rem", marginBottom: 0 }}>
              digest: {error.digest}
            </p>
          )}
        </div>
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
