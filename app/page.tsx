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
      <section className="l-section-hero">
        <div className="wrap">
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>Partner Intelligence Platform</p>
          <h1 className="l-heading-xl l-color-primary">
The intelligence layer<br />for your partner business.
          </h1>
          <p className="l-muted l-subtitle">
            Discover which partners are driving revenue across your pipeline —
            then run your entire partner program on top of that foundation.
            Attribution, commissions, deal registration, a partner portal,
            incentives — one platform for the whole motion.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Early Access <span>→</span></Link>
            <Link href="/dashboard?demo=true" className="l-btn-outline">Try the demo <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
        </div>
      </section>

      {/* ── HOW THE INTELLIGENCE LAYER WORKS ─────────────── */}
      <section className="l-section l-section-border-t l-section-border-b">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "3rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>
              What Covant does
            </p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              Discover partner relationships.<br />Then run the whole program.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
              Covant finds partner influence across your pipeline — touchpoints, introductions,
              deal registrations, co-sells — and builds a living record of who&apos;s driving what.
              From there, everything else runs on top: commission calculations, payout workflows,
              deal registration, revenue tracking, incentive programs, and a branded portal where
              partners see it all.
            </p>
          </div>

          {/* Attribution Engine — hero card */}
          <div className="l-engine-card">
            <div className="l-engine-badge">
              Core Engine
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
              <div>
                <span className="l-engine-label">
                  <span className="l-dot" />
                  Attribution Engine
                </span>
                <h3 className="l-heading-md">
                  Discovers partner influence across your entire pipeline.
                </h3>
                <p className="l-body">
                  The foundation your program runs on. Connects to Salesforce or HubSpot, ingests every partner interaction — referrals, deal registrations, co-sells, introductions — and applies multi-touch attribution models to determine who gets credit. Full audit trail on every deal.
                </p>
              </div>
              <div className="l-flex-col" style={{ gap: ".5rem" }}>
                {[
                  { label: "Full partner history", desc: "Every touchpoint, deal, and interaction — searchable, timestamped, auditable" },
                  { label: "Multi-touch attribution", desc: "First-touch, last-touch, time-decay, role-based, equal-split — runs on every deal automatically" },
                  { label: "CRM integration", desc: "Syncs closed-won deals from Salesforce and HubSpot with automatic partner matching" },
                  { label: "Customer + partner view", desc: "See the full relationship between any customer and any partner across all time" },
                ].map((f, i) => (
                  <div key={i} className="l-feature-chip">
                    <span className="l-feature-chip-icon">✦</span>
                    <div>
                      <div className="l-feature-chip-title">{f.label}</div>
                      <div className="l-feature-chip-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commission Engine + Portal */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", marginBottom: "2rem" }}>
            <div className="l-rec-card-panel" style={{ borderRadius: "0 0 0 16px" }}>
              <div>
                <span className="l-engine-label" style={{ color: "#22c55e", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  Commission Engine
                </span>
                <h3 className="l-heading-sm">
                  Rules that match reality. Payouts that happen automatically.
                </h3>
                <p style={{ fontSize: ".85rem", color: "#6b7280", lineHeight: 1.65 }}>
                  Configure commission rules by partner tier, deal size, product line, or geography.
                  Stack rules with priority ordering. The engine reads attribution data, calculates
                  what&apos;s owed, and queues payouts for approval. Every commission links back to the
                  deal, the attribution, and the rule that triggered it.
                </p>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "auto" }}>
                {["Tiered rates", "Bulk payout approval", "Stripe integration"].map((t) => (
                  <span key={t} className="l-pill" style={{ border: "1px solid rgba(34,197,94,.3)", color: "#22c55e", background: "rgba(34,197,94,.1)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Built-in capabilities */}
            <div className="l-rec-card-panel" style={{ borderRadius: "0 0 16px 0", gap: "1.25rem" }}>
              <p className="l-tag-muted" style={{ margin: 0 }}>Also included</p>
              {[
                {
                  accent: "#818cf8",
                  name: "Deal Registration",
                  desc: "Partners register deals through their portal. You approve from the dashboard. Attribution and commission rules trigger automatically.",
                },
                {
                  accent: "#f59e0b",
                  name: "Partner Scoring & Tiers",
                  desc: "Health scores based on revenue, activity, win rate, and deal velocity. Automatic tier progression from Bronze to Platinum.",
                },
                {
                  accent: "#38bdf8",
                  name: "Incentive Programs",
                  desc: "SPIFs, MDF budgets, bonuses, and accelerators — configured per tier, tracked per partner, approved through workflows.",
                },
              ].map((c) => (
                <div key={c.name} className="l-cap-item">
                  <span className="l-dot-sm" style={{ background: c.accent, marginTop: 6 }} />
                  <div>
                    <div className="l-cap-title">{c.name}</div>
                    <div className="l-cap-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal strip */}
          <div className="l-portal-strip">
            <div className="l-portal-strip-inner">
              <span className="l-free-badge">
                Always Free
              </span>
              <span style={{ color: "#0a0a0a", fontSize: ".9rem", fontWeight: 600 }}>Partner Portal</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>—</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>Branded self-service workspace. Deal tracking, commission visibility, performance dashboards. Included with every plan.</span>
            </div>
            <Link href="/pricing" className="l-link-arrow">
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: ATTRIBUTION ENGINE ───────────────── */}
      <section className="l-section" style={{ padding: "7rem 0" }}>
        <div className="wrap-wide l-grid-2">
          <div>
            <span className="l-label">Attribution Engine</span>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1.2rem" }}>
              Every deal. Every partner. Every touchpoint. One audit trail.
            </h2>
            <p className="l-muted l-body-lg">
              The Attribution Engine is the foundation. It ingests partner activity from your CRM and deal registrations, applies your chosen attribution model, and builds a complete record of who influenced what. When someone questions a number, you open the audit trail — not a spreadsheet.
            </p>
          </div>
          <div className="l-card">
            <h4 style={{ marginBottom: "1.2rem", fontWeight: 600, color: "#0a0a0a" }}>Deal: Acme Corp · $50,000</h4>
            <div className="l-bar-row">
              <span>TechStar (Reseller)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "55%" }}></div></div>
              <span className="l-font-600">55%</span>
            </div>
            <div className="l-bar-row">
              <span>CloudBridge (Referral)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "30%" }}></div></div>
              <span className="l-font-600">30%</span>
            </div>
            <div className="l-bar-row">
              <span>DataPipe (Integration)</span>
              <div className="l-bar-track"><div className="l-bar-fill" style={{ width: "15%" }}></div></div>
              <span className="l-font-600">15%</span>
            </div>
            <div className="l-note">
              <strong style={{ color: "#374151" }}>Time-decay model applied</strong> — 3 partners with touchpoints on this deal. Credit weighted by recency. Full calculation visible in audit trail.
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: COMMISSION ENGINE ─────────────────── */}
      <section className="l-section-alt" style={{ padding: "7rem 0" }}>
        <div className="wrap-wide l-grid-2">
          <div style={{ order: 2 }}>
            <span className="l-label">Commission Engine</span>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1.2rem" }}>
              From attribution to payout — no spreadsheet in between.
            </h2>
            <p className="l-muted l-body-lg" style={{ marginBottom: "1.2rem" }}>
              Once attribution is calculated, the Commission Engine applies your rules — tiered rates, product-line splits, new partner bonuses, geography overrides — and computes what every partner is owed. Approve payouts in bulk. Pay via Stripe. Every dollar traces back to a deal.
            </p>
            <div className="l-flex-col" style={{ gap: ".6rem" }}>
              {[
                "Commission rules by tier, deal size, product line, or geography",
                "Stack and prioritize rules — the engine resolves conflicts",
                "Bulk approve payouts at end of quarter with one click",
                "Stripe Connect integration — partners get paid directly",
              ].map((f, i) => (
                <div key={i} className="l-bullet-item">
                  <span className="l-bullet-icon" style={{ color: "#34d399" }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="l-card" style={{ order: 1 }}>
            <div className="l-tag-muted" style={{ marginBottom: "1rem" }}>Commission Rules</div>
            {[
              {
                name: "Enterprise Reseller",
                condition: "Deal > $100K + Gold tier",
                rate: "18%",
                active: true,
              },
              {
                name: "Standard Referral",
                condition: "All referral partners",
                rate: "12%",
                active: true,
              },
              {
                name: "New Partner Bonus",
                condition: "First 3 deals, any tier",
                rate: "20%",
                active: true,
              },
            ].map((r, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#374151" }}>{r.name}</span>
                  <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#22c55e" }}>{r.rate}</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af", lineHeight: 1.5 }}>{r.condition}</div>
              </div>
            ))}
            <div style={{ marginTop: "1rem", padding: "10px 12px", background: "rgba(34,197,94,.06)", borderRadius: 8, border: "1px solid rgba(34,197,94,.15)" }}>
              <span style={{ fontSize: ".78rem", color: "#374151" }}>
                <strong>Q1 payouts:</strong> $38,400 across 12 partners · <span style={{ color: "#22c55e", fontWeight: 600 }}>Approved & paid via Stripe</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE: PARTNER PORTAL ────────────────────── */}
      <section className="l-section" style={{ padding: "7rem 0" }}>
        <div className="wrap-wide l-grid-2">
          <div>
            <span className="l-label">Partner Portal · Always Free</span>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1.2rem" }}>
              Give every partner a seat at the table.
            </h2>
            <p className="l-muted l-body-lg" style={{ marginBottom: "1.2rem" }}>
              Every partner gets a branded workspace where they register deals, track commissions, see their tier status, and monitor performance. No more emailing spreadsheets. No more &ldquo;where&apos;s my payout?&rdquo; Partners see exactly what they&apos;ve earned and why. Free with every plan.
            </p>
            <div className="l-flex-col" style={{ gap: ".6rem" }}>
              {[
                "Deal registration with approval workflow",
                "Commission tracking with full audit trail",
                "Performance dashboards and tier progression",
                "White-labeled to your brand in under 10 minutes",
              ].map((f, i) => (
                <div key={i} className="l-bullet-item">
                  <span className="l-bullet-icon" style={{ color: "#818cf8" }}>✦</span>
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
                { label: "Win Rate", val: "38%" },
              ].map((s) => (
                <div key={s.label} className="l-stat-mini">
                  <p className="l-stat-mini-label">{s.label}</p>
                  <p className="l-stat-mini-value">{s.val}</p>
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

      {/* ── CRM INTEGRATION ──────────────────────────────── */}
      <section className="l-section-alt" style={{ padding: "7rem 0" }}>
        <div className="wrap-wide l-grid-2">
          <div style={{ order: 2 }}>
            <span className="l-label">CRM Integration</span>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1.2rem" }}>
              Your CRM has the deals.<br />Covant adds the intelligence.
            </h2>
            <p className="l-muted l-body-lg" style={{ marginBottom: "1.2rem" }}>
              Connect Salesforce or HubSpot in minutes. Covant syncs closed-won deals, matches them to partners automatically by contact, domain, or custom field, and feeds everything into the Attribution Engine. No CSV imports. No manual data entry.
            </p>
            <div className="l-flex-col" style={{ gap: ".6rem" }}>
              {[
                "Salesforce and HubSpot — OAuth connect in 2 clicks",
                "Automatic partner matching by email, domain, or custom field",
                "Bi-directional sync — deal updates flow both ways",
                "Webhook support for custom CRM or homegrown systems",
              ].map((f, i) => (
                <div key={i} className="l-bullet-item">
                  <span className="l-bullet-icon" style={{ color: "#3b82f6" }}>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="l-card" style={{ order: 1 }}>
            <div className="l-tag-muted" style={{ marginBottom: "1rem" }}>Integration Status</div>
            {[
              {
                name: "Salesforce",
                status: "Connected",
                detail: "Last sync: 2 hours ago · 847 deals imported",
                color: "#22c55e",
              },
              {
                name: "HubSpot",
                status: "Connected",
                detail: "Last sync: 4 hours ago · 312 deals imported",
                color: "#22c55e",
              },
              {
                name: "Custom Webhook",
                status: "Active",
                detail: "3 sources configured · 94 events this month",
                color: "#3b82f6",
              },
            ].map((r, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#374151" }}>{r.name}</span>
                  <span style={{ fontSize: ".72rem", fontWeight: 700, color: r.color, background: `${r.color}15`, padding: "2px 7px", borderRadius: 8 }}>{r.status}</span>
                </div>
                <div style={{ fontSize: ".75rem", color: "#9ca3af", lineHeight: 1.5 }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM (replaces fake quote) ────────────── */}
      <section className="l-quote-section">
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p className="l-tag" style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>The problem we solve</p>
          <p className="l-quote">
            Sales has Salesforce. Marketing has HubSpot. Finance has NetSuite.
            Partner teams have a shared Google Sheet and a quarterly argument about who drove what.
          </p>
          <p className="l-quote-attr">
            Covant replaces the spreadsheet with a system of record — so every attribution decision,
            every commission, and every payout has a paper trail.
          </p>
        </div>
      </section>

      {/* ── ROADMAP TEASER ───────────────────────────────── */}
      <section className="l-section" style={{ padding: "4rem 0" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="l-center" style={{ marginBottom: "2rem" }}>
            <p className="l-tag" style={{ marginBottom: ".5rem" }}>On the roadmap</p>
            <h3 className="l-heading-sm" style={{ color: "#374151" }}>Coming next</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { name: "Account Mapping", desc: "Share prospect lists with partners. Surface overlaps. Find the warm intro." },
              { name: "Workflow Builder", desc: "Trigger → condition → action automations for program logic." },
              { name: "QBR Automation", desc: "Define metrics once. Reports generate on your schedule." },
            ].map((item) => (
              <div key={item.name} style={{ padding: "1.25rem", borderRadius: 12, border: "1px dashed #d1d5db", background: "#fafafa" }}>
                <div style={{ fontSize: ".9rem", fontWeight: 700, color: "#374151", marginBottom: 6 }}>{item.name}</div>
                <div style={{ fontSize: ".8rem", color: "#9ca3af", lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap l-center">
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            Your partners are driving revenue.<br />Start proving it.
          </h2>
          <p className="l-muted l-subtitle" style={{ maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Free for up to 5 partners. No credit card required.
          </p>
          <form onSubmit={handleWaitlist} className="l-cta-form">
            <div className="l-cta-form-input">
              <input
                type="email"
                placeholder="Enter your work email"
                className="l-input"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                required
              />
              {emailError && (
                <p className="l-email-error">{emailError}</p>
              )}
            </div>
            <button type="submit" className="l-btn" disabled={submitted} style={{ whiteSpace: "nowrap" }}>
              {submitted ? "We'll be in touch!" : "Get Early Access"}
            </button>
          </form>
          {submitted && (
            <p className="l-success-msg">We&apos;ll reach out within 24 hours.</p>
          )}
        </div>
      </section>

    </div>
  );
}
