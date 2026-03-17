"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LandingPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const leadsCountRaw = useQuery(api.leads.getLeadsCount);
  const leadsCount = typeof leadsCountRaw === "number" ? leadsCountRaw : 0;
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

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: "9rem 0 7rem", textAlign: "center", background: "#ffffff" }}>
        <div className="wrap">
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>Partner Intelligence Platform</p>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-.03em",
            marginBottom: "1.5rem",
            color: "#0a0a0a",
          }}>
            The intelligence layer<br />for your partner program.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
            maxWidth: 580,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
          }}>
            Know which partners drive revenue. Automate commissions. Give partners a portal they'll actually use.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Started Free <span>→</span></Link>
            <Link href="/demo" className="l-btn-outline">See it in action <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
        </div>
      </section>

      {/* ── PLATFORM PILLARS ─────────────────────────────── */}
      <section style={{ padding: "4rem 0", background: "#f9fafb", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
                title: "Attribution", desc: "Who drove the deal."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                title: "Incentives", desc: "Tiers, SPIFFs, MDF."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1 2-2.5 3s-2.5 1.5-2.5 3a2.5 2.5 0 0 0 5 0"/></svg>,
                title: "Commissions", desc: "Calculated automatically."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: "Partner Portal", desc: "Self-service for partners."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
                title: "Revenue Intel", desc: "Pipeline by partner."
              },
            ].map((p) => (
              <div key={p.title} style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "1.25rem",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: ".6rem", color: "#374151" }}>{p.icon}</div>
                <p style={{ fontWeight: 700, fontSize: ".88rem", color: "#0a0a0a", marginBottom: ".3rem" }}>{p.title}</p>
                <p className="l-muted" style={{ fontSize: ".78rem", lineHeight: 1.4 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: ATTRIBUTION ───────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#ffffff" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Attribution</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Attribution that partners actually trust
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              First-touch, last-touch, or multi-touch — configure once, apply automatically. Every calculation is explainable. Attribution disputes disappear.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.2rem", fontWeight: 600, color: "#0a0a0a" }}>Deal: Acme Corp · $50,000</h4>
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
            <p className="l-muted" style={{ marginTop: "1rem", fontSize: ".85rem" }}>Model: Role-Based · custom weights</p>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: PARTNER PORTAL ────────────────────── */}
      <section style={{ padding: "7rem 0", background: "#f9fafb" }}>
        <div className="wrap-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "center" }}>
          <div>
            <span className="l-label">Partner Portal</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              Give partners a home — not a spreadsheet
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65 }}>
              Every partner gets their own portal. Register deals, track pipeline, see commissions, download resources — no email chains, no manual updates.
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
                  <p className="l-muted" style={{ fontSize: ".72rem", marginBottom: ".25rem" }}>{s.label}</p>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0a0a0a", margin: 0 }}>{s.val}</p>
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

      {/* ── QUOTE ────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "#ffffff" }}>
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p style={{ fontSize: "clamp(1.15rem, 2vw, 1.4rem)", lineHeight: 1.65, color: "#374151", fontStyle: "italic", marginBottom: "1.25rem" }}>
            &ldquo;Every QBR turns into a fight about attribution. Nobody trusts the spreadsheet. I need something my CFO and my partners both believe.&rdquo;
          </p>
          <p className="l-muted" style={{ fontSize: ".85rem", fontWeight: 600 }}>VP of Partnerships · Series B SaaS</p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            Your partners are driving revenue.<br />Start proving it.
          </h2>
          <p className="l-muted" style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Free for up to 5 partners. No credit card required.
          </p>
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: ".75rem", maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ flex: "1 1 260px", position: "relative" }}>
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
            <p style={{ marginTop: "1.5rem", fontSize: ".9rem", color: "#059669", fontWeight: 500 }}>We&apos;ll reach out within 24 hours.</p>
          )}
        </div>
      </section>

    </div>
  );
}
