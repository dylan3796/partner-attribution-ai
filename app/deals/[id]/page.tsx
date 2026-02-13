"use client";

import Link from "next/link";

export default function DealDetailPage() {
  // Demo mode: no deals exist yet
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Deal Details</h1>
      <p className="muted">Demo mode: Deal details unavailable. Request a demo to see the full approval workflow.</p>
      <Link href="/deals" className="btn" style={{ marginTop: "1rem" }}>Back to Deals</Link>
    </div>
  );
}
