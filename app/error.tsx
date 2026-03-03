"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh", background: "#000", color: "#e5e5e5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, background: "#ef444418",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: "#ef4444",
        }}>
          <AlertTriangle size={36} />
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginBottom: ".5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem", lineHeight: 1.6 }}>
          An unexpected error occurred. This has been logged automatically.
          {error.digest && (
            <span style={{ display: "block", fontSize: ".75rem", marginTop: 8, fontFamily: "monospace", color: "#444" }}>
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
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
