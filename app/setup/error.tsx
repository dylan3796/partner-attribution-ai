"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SetupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Setup error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, background: "#ef444418",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", color: "#ef4444",
        }}>
          <AlertTriangle size={32} />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: ".5rem" }}>Setup hit a snag</h2>
        <p className="muted" style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Something went wrong during setup. Your progress may have been saved — try again or start fresh.
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
          <button onClick={reset} className="btn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RefreshCw size={16} /> Retry
          </button>
          <Link href="/" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
