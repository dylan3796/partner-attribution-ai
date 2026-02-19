"use client";

import Link from "next/link";

export default function DealDetailPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Deal Details</h1>
      <p className="muted">Deal not found.</p>
      <Link href="/deals" className="btn" style={{ marginTop: "1rem", display: "inline-block" }}>← Back to Deals</Link>
    </div>
  );
}
