"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ROICalculator from "@/components/ROICalculator";

export default function ROIPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.15rem", color: "#fff", textDecoration: "none" }}>Covant</Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/pricing" style={{ color: "#9ca3af", fontSize: ".85rem", textDecoration: "none" }}>Pricing</Link>
          <Link href="/sign-up" style={{ background: "#fff", color: "#000", padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: ".85rem", textDecoration: "none" }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "5rem 1.5rem 2rem", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20,
          background: "rgba(16,185,129,.12)", color: "#10b981", fontSize: ".78rem",
          fontWeight: 600, marginBottom: 20, border: "1px solid rgba(16,185,129,.2)",
        }}>
          ROI Calculator
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px" }}>
          Calculate what Covant<br />is worth to your program
        </h1>
        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.55)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Most partner programs waste 30–40 hours per month on manual attribution, commission disputes, and spreadsheet reconciliation. See what you&apos;d save.
        </p>
      </section>

      {/* Calculator */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <ROICalculator />
      </section>

      {/* Context cards */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
          <div style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 12, padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", marginBottom: ".5rem" }}>30–40 hrs</div>
            <div style={{ fontSize: ".85rem", color: "#888", lineHeight: 1.6 }}>
              Average monthly time VPs of Partnerships spend on manual attribution and commission tracking
            </div>
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 12, padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#818cf8", marginBottom: ".5rem" }}>8–12×</div>
            <div style={{ fontSize: ".85rem", color: "#888", lineHeight: 1.6 }}>
              Typical first-year ROI from automated attribution, reduced disputes, and better partner targeting
            </div>
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 12, padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", marginBottom: ".5rem" }}>70%</div>
            <div style={{ fontSize: ".85rem", color: "#888", lineHeight: 1.6 }}>
              Of commission disputes eliminated when partners can see attribution logic in real time
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "4rem 1.5rem 6rem", borderTop: "1px solid #111" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 12 }}>Ready to stop guessing?</h2>
        <p style={{ color: "#6b7280", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
          Start free with up to 5 partners. See real attribution data in 15 minutes.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/sign-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", color: "#000", padding: "14px 28px",
            borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none",
          }}>
            Get Started Free →
          </Link>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "transparent", color: "#e5e5e5", padding: "14px 28px",
            borderRadius: 8, fontWeight: 600, fontSize: "1rem", textDecoration: "none",
            border: "1px solid #333",
          }}>
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
