"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function SalesforceLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3 7.2C14.3 5.9 15.9 5 17.7 5c2.5 0 4.7 1.6 5.5 3.9.6-.3 1.3-.5 2-.5 2.6 0 4.8 2.1 4.8 4.8 0 .5-.1 1-.2 1.4C31 15.2 32 16.8 32 18.6c0 2.7-2.2 4.8-4.8 4.8H8.8C5.6 23.4 3 20.8 3 17.6c0-2.5 1.6-4.6 3.8-5.4-.1-.4-.1-.8-.1-1.2 0-3.3 2.7-6 6-6 .6 0 .4.1.6.2z" fill="#00A1E0"/>
    </svg>
  );
}
function HubSpotLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.5V9.2c.9-.4 1.5-1.3 1.5-2.4 0-1.4-1.1-2.6-2.5-2.6S17.5 5.4 17.5 6.8c0 1.1.6 2 1.5 2.4v3.3c-1.4.2-2.7.8-3.7 1.8L6.7 8.4c.1-.2.1-.4.1-.6C6.8 6.3 5.7 5 4.3 5 2.9 5 1.8 6.1 1.8 7.6c0 1.5 1.1 2.6 2.5 2.6.4 0 .8-.1 1.1-.3l8.4 5.7C13.3 16.4 13 17.2 13 18c0 .9.3 1.8.8 2.5L9.5 24.8c-.3-.1-.6-.2-.9-.2-1.5 0-2.6 1.2-2.6 2.6 0 1.4 1.2 2.6 2.6 2.6 1.4 0 2.6-1.2 2.6-2.6 0-.4-.1-.8-.3-1.1l4.1-4.4c.9.5 1.9.8 3 .8 3.3 0 5.9-2.7 5.9-6S24.3 10.5 21 12.5z" fill="#FF7A59"/>
    </svg>
  );
}
function PipedriveLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#172432"/>
      <path d="M13 8h3.5c3.6 0 6 2.2 6 5.5S20.1 19 16.5 19H16v5h-3V8zm3 8.2c1.8 0 3-.9 3-2.7s-1.2-2.7-3-2.7H16v5.4h0z" fill="#26D068"/>
    </svg>
  );
}
function SlackLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 20a2.25 2.25 0 1 1-2.25-2.25H6.75V20zM8.25 20a2.25 2.25 0 1 1 4.5 0v5.75a2.25 2.25 0 1 1-4.5 0V20zM12 6.75a2.25 2.25 0 1 1 2.25-2.25V6.75H12zM12 8.25a2.25 2.25 0 1 1 0 4.5H6.25a2.25 2.25 0 1 1 0-4.5H12zM25.25 12a2.25 2.25 0 1 1 2.25 2.25H25.25V12zM23.75 12a2.25 2.25 0 1 1-4.5 0V6.25a2.25 2.25 0 1 1 4.5 0V12zM20 25.25a2.25 2.25 0 1 1-2.25 2.25V25.25H20zM20 23.75a2.25 2.25 0 1 1 0-4.5h5.75a2.25 2.25 0 1 1 0 4.5H20z" fill="#E01E5A"/>
    </svg>
  );
}

export default function LandingPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const leadsCount = useQuery(api.leads.getLeadsCount) ?? 0;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setEmailError("Please enter your email"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Please enter a valid email"); return; }
    setEmailError("");
    try {
      await captureLead({ email, source: "landing_hero" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  return (
    <div className="landing">

      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section style={{ padding: "9rem 0 7rem", textAlign: "center", background: "#ffffff" }}>
        <div className="wrap">
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>Partner Intelligence Platform</p>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            marginBottom: "1.5rem",
            color: "#0a0a0a"
          }}>
            The intelligence layer<br />for your partner program.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6
          }}>
            Attribution, commissions, incentives, partner portal, and revenue intelligence — in one platform built for how modern partner programs actually run.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Started Free <span>→</span></Link>
            <Link href="/demo" className="l-btn-outline">Try with sample data <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} teams on the waitlist` : "Join early access"}
          </p>
        </div>
      </section>

      {/* ── 2. PLATFORM PILLARS ──────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "#f9fafb", borderTop: "1px solid #f3f4f6" }}>
        <div className="wrap">
          <p style={{ textAlign: "center", fontSize: ".85rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "3rem" }}>
            Everything your partner program needs
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "◎", title: "Attribution", desc: "First, last, or multi-touch. Your rules." },
              { icon: "⬡", title: "Incentives", desc: "Tiers, SPIFFs, MDF, volume bonuses." },
              { icon: "◈", title: "Commissions", desc: "Auto-calculated. Zero disputes." },
              { icon: "⊞", title: "Partner Portal", desc: "Self-service for every partner." },
              { icon: "◫", title: "Revenue Intel", desc: "Pipeline by partner, channel, tier." },
            ].map((p) => (
              <div key={p.title} style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: ".75rem", color: "#374151" }}>{p.icon}</div>
                <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#0a0a0a", marginBottom: ".4rem" }}>{p.title}</p>
                <p className="l-muted" style={{ fontSize: ".82rem", lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SOCIAL PROOF ──────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "#ffffff" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>VP of Partnerships, Series B SaaS</p>
            </div>
            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;Partners have no visibility into their pipeline. They chase us for updates all day.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>Director of Channel Sales</p>
            </div>
            <div className="l-card">
              <p style={{ fontStyle: "italic", fontSize: ".95rem", lineHeight: 1.6, marginBottom: "1rem", color: "#374151" }}>
                &ldquo;Commission disputes are killing partner trust. I&apos;m a referee, not a program manager.&rdquo;
              </p>
              <p className="l-muted" style={{ fontSize: ".8rem" }}>Head of Partner Programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. DEEP-DIVE: ATTRIBUTION ────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Attribution</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Attribution that partners actually trust
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              First-touch, last-touch, or multi-touch — configure once, apply automatically. Every calculation is explainable to partners and to finance. Attribution disputes disappear.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.2rem", fontWeight: 600, color: "#0a0a0a" }}>Deal: TechStar × CloudBridge</h4>
            <div className="l-bar-row">
              <span>TechStar (Reseller)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "55%" }}></div></div>
              <span style={{ fontWeight: 600 }}>55%</span>
            </div>
            <div className="l-bar-row">
              <span>CloudBridge (Referral)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "30%" }}></div></div>
              <span style={{ fontWeight: 600 }}>30%</span>
            </div>
            <div className="l-bar-row">
              <span>DataPipe (Integration)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "15%" }}></div></div>
              <span style={{ fontWeight: 600 }}>15%</span>
            </div>
            <p className="l-muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>Model: Role-Based (custom weights)</p>
          </div>
        </div>
      </section>

      {/* ── 5. DEEP-DIVE: INCENTIVES ─────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.25rem", fontWeight: 600, color: "#0a0a0a" }}>Incentive Programs</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {[
                { badge: "Gold", desc: "20% base commission + 5% accelerator above $50k/qtr", color: "#f59e0b" },
                { badge: "SPIFF", desc: "2× multiplier on CloudSecure deals through Q2", color: "#8b5cf6" },
                { badge: "MDF", desc: "$5,000 co-marketing budget for TechStar — $3,200 remaining", color: "#3b82f6" },
                { badge: "Bonus", desc: "$2,500 one-time new logo bonus for first 3 enterprise logos", color: "#10b981" },
              ].map((item) => (
                <div key={item.badge} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
                  <span style={{
                    background: item.color + "20",
                    color: item.color,
                    borderRadius: "6px",
                    padding: ".2rem .55rem",
                    fontSize: ".75rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    marginTop: ".1rem"
                  }}>{item.badge}</span>
                  <p style={{ fontSize: ".88rem", lineHeight: 1.5, color: "#374151", margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="l-label">Incentives</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Build programs partners actually work harder for
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Tiers, SPIFFs, MDF budgets, volume accelerators, new logo bonuses — all configurable, all tracked automatically. If a partner earns it, Covant calculates it.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. DEEP-DIVE: PARTNER PORTAL ─────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Partner Portal</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Give partners a home — not a spreadsheet
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Every partner gets their own portal. Register deals, track pipeline, see commissions, download resources — no email chains, no manual updates. Partners stay in the program because they actually like using it.
            </p>
          </div>
          <div className="l-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h4 style={{ fontWeight: 600, color: "#0a0a0a", margin: 0 }}>TechStar · Partner Portal</h4>
              <span style={{ fontSize: ".75rem", color: "#059669", fontWeight: 600, background: "#d1fae5", padding: ".2rem .55rem", borderRadius: "6px" }}>Gold Tier</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Commissions (Q1)", val: "$24,320" },
                { label: "Open Deals", val: "8" },
                { label: "Pending Payout", val: "$6,150" },
                { label: "MDF Remaining", val: "$3,200" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#f9fafb", borderRadius: "8px", padding: ".75rem 1rem" }}>
                  <p className="l-muted" style={{ fontSize: ".75rem", marginBottom: ".25rem" }}>{s.label}</p>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0a0a0a", margin: 0 }}>{s.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#0a0a0a", color: "#fff", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>Register Deal</button>
              <button style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>View Pipeline</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. DEEP-DIVE: REVENUE INTELLIGENCE ───────────── */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.25rem", fontWeight: 600, color: "#0a0a0a" }}>Partner Revenue · Q1 2026</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.25rem" }}>
              {[
                { name: "TechStar Solutions", arr: "$142K", pct: 88, trend: "+12%" },
                { name: "CloudBridge Partners", arr: "$98K", pct: 61, trend: "+31%" },
                { name: "DataPipe Agency", arr: "$67K", pct: 42, trend: "+8%" },
                { name: "NovaSys Group", arr: "$44K", pct: 27, trend: "New" },
              ].map((r) => (
                <div key={r.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
                    <span style={{ fontSize: ".85rem", color: "#374151", fontWeight: 500 }}>{r.name}</span>
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                      <span style={{ fontSize: ".75rem", color: "#059669", fontWeight: 600 }}>{r.trend}</span>
                      <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#0a0a0a" }}>{r.arr}</span>
                    </div>
                  </div>
                  <div className="l-bar-track">
                    <div className="l-bar-fill" style={{ width: `${r.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="l-muted" style={{ fontSize: ".8rem" }}>Total partner-sourced ARR: $351K · Up 18% QoQ</p>
          </div>
          <div>
            <span className="l-label">Revenue Intelligence</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Know which partners drive revenue — before the QBR
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Partner-sourced pipeline by tier, channel, and region. Trend data that proves partner ROI to your CFO. No more &ldquo;we think partners are driving value&rdquo; — you&apos;ll know exactly.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. INTEGRATIONS ──────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#ffffff" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: ".75rem", color: "#0a0a0a" }}>
            Works with what you already use
          </h2>
          <p className="l-muted" style={{ fontSize: "1.05rem", maxWidth: 560, margin: "0 auto 3rem", lineHeight: 1.6 }}>
            Connects in minutes. No rip-and-replace required.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div className="l-logo-box"><SalesforceLogo /><span className="l-logo-name">Salesforce</span></div>
            <div className="l-logo-box"><HubSpotLogo /><span className="l-logo-name">HubSpot</span></div>
            <div className="l-logo-box"><PipedriveLogo /><span className="l-logo-name">Pipedrive</span></div>
            <div className="l-logo-box"><SlackLogo /><span className="l-logo-name">Slack</span></div>
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ─────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            Your partners are driving revenue.<br />Start proving it.
          </h2>
          <p className="l-muted" style={{ fontSize: "clamp(1.05rem, 2vw, 1.2rem)", maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Attribution, incentives, commissions, portal, and intelligence — one platform, up in an afternoon.
          </p>
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".75rem", maxWidth: 480, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 280px", position: "relative" }}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="l-input"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                required
              />
              {emailError && (
                <p style={{ position: "absolute", bottom: -20, left: 0, fontSize: ".75rem", color: "#dc2626" }}>{emailError}</p>
              )}
            </div>
            <button type="submit" className="l-btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
              {submitted ? "✓ We'll be in touch!" : "Get Early Access"}
            </button>
          </form>
          {submitted && (
            <p style={{ marginTop: "1.5rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>
              We&apos;ll reach out within 24 hours.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
