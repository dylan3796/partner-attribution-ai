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
            The best partner teams spend their time building relationships, not chasing data. Covant gives them the intelligence to do both.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Started Free <span>→</span></Link>
            <Link href="/dashboard?demo=true" className="l-btn-outline">Try it live <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
        </div>
      </section>

      {/* ── ENGINES ──────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#0a0a0a" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(129,140,248,.7)", marginBottom: ".75rem" }}>
              AI Engines
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.025em", color: "#ffffff", marginBottom: "1rem" }}>
              Four engines. Running your program 24/7.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.5)", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
              Not dashboards. Not reports. Active systems that discover relationships, automate attribution, facilitate your program, and tell you exactly what to do next.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "rgba(255,255,255,.08)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" }}>
            {[
              {
                accent: "#818cf8",
                label: "Attribution Engine",
                headline: "Discovers who drove every deal.",
                body: "Scans touchpoints, deal history, and registration data to surface partner relationships you know about — and the ones you didn't. Multi-touch models, full audit trail, zero disputes.",
                tags: ["Relationship discovery", "Multi-touch models", "Deal reg protection"],
              },
              {
                accent: "#34d399",
                label: "Incentives Engine",
                headline: "Turns program rules into automatic payouts.",
                body: "Define tiers, SPIFFs, MDF, and accelerators once. Every qualifying event runs through your ruleset and queues for payout. The gap between 'someone did something' and 'someone gets paid' closes permanently.",
                tags: ["Tier automation", "SPIFFs & MDF", "Bulk payout approval"],
              },
              {
                accent: "#fb923c",
                label: "Intelligence Engine",
                headline: "Tells you which partner to call next.",
                body: "Health scores, pipeline trends, at-risk alerts, and QBR reports that write themselves. Spots which partners are about to go dark and which ones are primed to close — before you have to ask.",
                tags: ["Health scoring", "Churn prediction", "QBR automation"],
              },
              {
                accent: "#38bdf8",
                label: "CRM Engine",
                headline: "Keeps partner data in sync, everywhere.",
                body: "Bi-directional Salesforce and HubSpot sync. Deal data flows in, partner attribution flows out. No manual re-entry, no gaps between your CRM and your partner program.",
                tags: ["Salesforce sync", "HubSpot sync", "Bi-directional"],
              },
            ].map((e) => (
              <div
                key={e.label}
                style={{
                  background: "#111111",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: ".72rem", fontWeight: 700, letterSpacing: ".06em",
                    textTransform: "uppercase", color: e.accent, marginBottom: ".75rem",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: e.accent, display: "inline-block", boxShadow: `0 0 6px ${e.accent}` }} />
                    {e.label}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.25, letterSpacing: "-.01em", marginBottom: ".65rem" }}>
                    {e.headline}
                  </h3>
                  <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)", lineHeight: 1.65 }}>
                    {e.body}
                  </p>
                </div>
                <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "auto" }}>
                  {e.tags.map((t) => (
                    <span key={t} style={{
                      fontSize: ".7rem", fontWeight: 600, padding: "3px 9px",
                      borderRadius: 20, border: `1px solid ${e.accent}30`,
                      color: e.accent, background: `${e.accent}10`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Portal strip */}
          <div style={{
            marginTop: "1px",
            background: "#111111",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "0 0 16px 16px",
            padding: "1.25rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#10b981", letterSpacing: ".06em", textTransform: "uppercase", background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", padding: "3px 10px", borderRadius: 20 }}>
                Always Free
              </span>
              <span style={{ color: "rgba(255,255,255,.7)", fontSize: ".9rem", fontWeight: 600 }}>Partner Portal</span>
              <span style={{ color: "rgba(255,255,255,.35)", fontSize: ".85rem" }}>—</span>
              <span style={{ color: "rgba(255,255,255,.45)", fontSize: ".85rem" }}>AI-powered workspace. Bi-directional syncs. Fully customizable. Included with every plan.</span>
            </div>
            <Link href="/pricing" style={{ fontSize: ".82rem", fontWeight: 600, color: "#818cf8", textDecoration: "none", flexShrink: 0 }}>
              See pricing →
            </Link>
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
            <span className="l-label">Partner Portal · Always Free</span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1.2rem", color: "#0a0a0a" }}>
              The portal partners have always wanted
            </h2>
            <p className="l-muted" style={{ fontSize: "1.05rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
              A fully branded workspace for every partner — deals, commissions, performance, and an AI layer that answers their questions instantly. Bi-directional syncs, customizable per-partner flows, white-labeled to your brand. Free, forever.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                `Ask AI: "What's my Q2 commission if I close these 3 deals?"`,
                "Bi-directional deal sync — no manual re-entry",
                "Customize portal views per partner tier or type",
                "White-labeled with your brand in under 10 minutes",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", fontSize: ".88rem", color: "#374151" }}>
                  <span style={{ color: "#818cf8", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
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
              <Link href="/dashboard/deals?demo=true" style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#0a0a0a", color: "#fff", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>Register Deal</Link>
              <Link href="/dashboard/deals?demo=true" style={{ flex: 1, padding: ".55rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>View Pipeline</Link>
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
