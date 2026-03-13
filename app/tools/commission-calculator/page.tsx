"use client";

import { useState } from "react";
import Link from "next/link";

const RATES: Record<string, Record<string, number>> = {
  Reseller:   { Gold: 0.20, Silver: 0.17, Bronze: 0.15, Registered: 0.12 },
  Referral:   { Gold: 0.15, Silver: 0.12, Bronze: 0.10, Registered: 0.08 },
  "Co-sell":  { Gold: 0.12, Silver: 0.10, Bronze: 0.08, Registered: 0.06 },
  Technology: { Gold: 0.10, Silver: 0.08, Bronze: 0.06, Registered: 0.04 },
};

const INCENTIVES_STARTER = 149;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function CommissionCalculator() {
  const [dealSize, setDealSize] = useState(25000);
  const [partnerType, setPartnerType] = useState("Reseller");
  const [tier, setTier] = useState("Gold");
  const [dealsPerMonth, setDealsPerMonth] = useState(5);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const rate = RATES[partnerType]?.[tier] ?? 0.10;
  const perDeal = dealSize * rate;
  const monthly = perDeal * dealsPerMonth;
  const annual = monthly * 12;
  const paybackMonths = Math.ceil(INCENTIVES_STARTER / monthly);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    console.log("Save calc for:", email, { dealSize, partnerType, tier, dealsPerMonth, rate, monthly, annual });
    setSaved(true);
  }

  const inputStyle = {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "8px",
    color: "#fff",
    padding: "0.6rem 0.9rem",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
  } as React.CSSProperties;

  const labelStyle = { color: "#888", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem", display: "block", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Covant.ai</Link>
        <Link href="/tools" style={{ color: "#888", textDecoration: "none", fontSize: "0.875rem" }}>← All tools</Link>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "inline-block", background: "#111", border: "1px solid #10b98133", color: "#10b981", fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "100px", marginBottom: "1rem", fontWeight: 500 }}>
            Incentives Engine
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Partner Commission Calculator
          </h1>
          <p style={{ color: "#888", fontSize: "1rem" }}>
            Calculate commissions by partner type and tier. Results update live.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Inputs */}
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "#ccc" }}>Your program</h2>

            <div>
              <label style={labelStyle}>Average deal size</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: "#888", fontSize: "0.9rem" }}>$</span>
                <input
                  type="number"
                  value={dealSize}
                  min={1000} max={1000000} step={1000}
                  onChange={(e) => setDealSize(Number(e.target.value))}
                  style={{ ...inputStyle, width: "120px" }}
                />
              </div>
              <input type="range" min={1000} max={500000} step={1000} value={dealSize}
                onChange={(e) => setDealSize(Number(e.target.value))}
                style={{ width: "100%", marginTop: "0.5rem", accentColor: "#10b981" }} />
            </div>

            <div>
              <label style={labelStyle}>Partner type</label>
              <select value={partnerType} onChange={(e) => setPartnerType(e.target.value)} style={inputStyle}>
                {Object.keys(RATES).map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Partner tier</label>
              <select value={tier} onChange={(e) => setTier(e.target.value)} style={inputStyle}>
                {["Gold", "Silver", "Bronze", "Registered"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Deals per month</label>
              <input
                type="number"
                value={dealsPerMonth}
                min={1} max={200}
                onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                style={{ ...inputStyle, width: "100px" }}
              />
              <input type="range" min={1} max={100} value={dealsPerMonth}
                onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                style={{ width: "100%", marginTop: "0.5rem", accentColor: "#10b981" }} />
            </div>
          </div>

          {/* Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Commission rate</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#10b981" }}>{(rate * 100).toFixed(0)}%</div>
              <div style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.25rem" }}>{partnerType} · {tier}</div>
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Per deal</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{fmt(perDeal)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Monthly</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{fmt(monthly)}</div>
              </div>
              <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ color: "#888", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Annual</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{fmt(annual)}</div>
              </div>
            </div>

            <div style={{ background: "#0d1a0d", border: "1px solid #10b98133", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>
                At this volume, the Incentives Engine pays for itself in{" "}
                <span style={{ fontSize: "1.1rem" }}>{paybackMonths === 0 ? "less than 1" : paybackMonths} month{paybackMonths !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "0.25rem" }}>Starter plan: {fmt(INCENTIVES_STARTER)}/mo</div>
            </div>
          </div>
        </div>

        {/* Email capture */}
        {!saved ? (
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "1.75rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.5rem" }}>Save your calculation</h3>
            <p style={{ color: "#666", fontSize: "0.875rem", margin: "0 0 1rem" }}>Get this report emailed to you.</p>
            <form onSubmit={handleSave} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputStyle, maxWidth: "280px", flex: 1 }}
              />
              <button type="submit" style={{ background: "#fff", color: "#000", border: "none", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                Send →
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "#0d1a0d", border: "1px solid #10b98133", borderRadius: "12px", padding: "1.25rem", marginTop: "2rem", color: "#10b981" }}>
            ✓ Saved. Check your inbox.
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid #111" }}>
          <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>Stop tracking this in spreadsheets.</p>
          <Link href="/pricing" style={{ background: "#10b981", color: "#000", padding: "0.85rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "1rem" }}>
            Automate this with the Incentives Engine →
          </Link>
        </div>
      </div>
    </div>
  );
}
