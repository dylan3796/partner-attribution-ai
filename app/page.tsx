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
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>AI-Native Partner OS</p>
          <h1 className="l-heading-xl l-color-primary">
Run your entire partner program<br />from one AI copilot.
          </h1>
          <p className="l-muted l-subtitle">
            Covant is the AI-native operating system for partnerships. Uncover the revenue already moving through your program. Build stronger relationships with every partner. Unlock the opportunity that&apos;s still ahead — all from one AI copilot connected to your CRM, email, and partner activity.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Early Access <span>→</span></Link>
            <Link href="/demo" className="l-btn-outline">Try it live <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ─────────────────────────────────── */}
      <section className="l-quote-section">
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p className="l-tag" style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>The idea behind Covant</p>
          <p className="l-quote">
            Every partner program has more revenue in it than anyone can see. Touchpoints that never got logged. Relationships that never got mapped. Deals that were influenced and never credited. Until recently, surfacing that signal wasn&apos;t possible. Now it is.
          </p>
          <p className="l-quote-attr">
            Covant is the AI layer that sits across your CRM, email, and partner activity — uncovering the revenue already moving through your program, strengthening the relationships that drive it, and pointing you at the opportunity that&apos;s still ahead.
          </p>
        </div>
      </section>

      {/* ── WHAT COVANT DOES ─────────────────────────────── */}
      <section className="l-section l-section-border-t l-section-border-b">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "3rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>
              What Covant does
            </p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              Ask Covant anything.<br />It knows your whole program.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
              Covant&apos;s AI reads your CRM, email, and partner activity to maintain a living record of
              who&apos;s driving what. Ask it who to bring into a deal, who&apos;s at risk, or why a partner got
              paid what they got paid. It answers from your data — and can draft the QBR, route the
              commission, and notify the partner when you&apos;re done.
            </p>
          </div>

          {/* AI Copilot — hero card */}
          <div className="l-engine-card">
            <div className="l-engine-badge">
              Core Engine
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
              <div>
                <span className="l-engine-label">
                  <span className="l-dot" />
                  AI Copilot
                </span>
                <h3 className="l-heading-md">
                  One conversational interface across your entire partner program.
                </h3>
                <p className="l-body">
                  Covant&apos;s AI copilot is the primary interface for your program — connected to Salesforce, HubSpot, Gmail, and Slack, grounded in your real data, and able to read, reason, and act. Ask it in plain language. Every answer is cited. Every recommendation is one click from done.
                </p>
              </div>
              <div className="l-flex-col" style={{ gap: ".5rem" }}>
                {[
                  { label: "Ask anything", desc: "Natural-language questions across your whole program. Every answer cites the data. Every claim is traceable back to the source." },
                  { label: "AI Influence Inbox", desc: "Ambient touchpoint capture from CRM, email, and Slack. Covant proposes partner touchpoints — you bulk-accept in seconds." },
                  { label: "AI-weighted attribution", desc: "Six models including one that LLM-scores each touchpoint by signal strength. CFO-ready methodology page included." },
                  { label: "AI Partner-Deal Matcher", desc: "Every open opportunity gets a partner recommendation. Parameters you set. Rules you tune. Decisions you make." },
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

          {/* Commission Engine + Built-in capabilities */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", marginBottom: "2rem" }}>
            <div className="l-rec-card-panel" style={{ borderRadius: "0 0 0 16px" }}>
              <div>
                <span className="l-engine-label" style={{ color: "#22c55e", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  AI Rule Builder
                </span>
                <h3 className="l-heading-sm">
                  Describe your commission program in plain English. Covant builds the rules.
                </h3>
                <p style={{ fontSize: ".85rem", color: "#6b7280", lineHeight: 1.65 }}>
                  Covant turns natural language into executable commission rules, then simulates them
                  against your historical deals before you activate. Handle tiers, territories,
                  product-line exceptions, clawbacks, and stacking without a spreadsheet in sight.
                  Every change is versioned. Every payout is explainable to the partner in one click.
                </p>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "auto" }}>
                {["Natural-language rules", "Historical simulation", "Versioned & explainable"].map((t) => (
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
                  name: "AI Deal Conflict Detection",
                  desc: "Partners register through the portal. Covant flags overlapping touchpoints from other partners in real time, with AI-recommended resolution — before the dispute happens.",
                },
                {
                  accent: "#f59e0b",
                  name: "AI Partner Health Scores",
                  desc: "Composite signal from pipeline velocity, touchpoint cadence, dispute rate, and response time. Surfaces at-risk partners before they go dark — with a weekly brief per partner.",
                },
                {
                  accent: "#38bdf8",
                  name: "AI Program Simulator",
                  desc: "Change a commission rate, add a SPIF, adjust a tier — Covant simulates what happens against your historical data before you ship the change to production.",
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
                Multi-Vendor
              </span>
              <span style={{ color: "#0a0a0a", fontSize: ".9rem", fontWeight: 600 }}>Partner Portal</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>—</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>One login across every vendor a partner works with. AI co-sell assistant. Real-time commissions. Where partners see everything that matters to them — free for every partner, always.</span>
            </div>
            <Link href="/pricing" className="l-link-arrow">
              See pricing →
            </Link>
          </div>

          {/* Platform link */}
          <div className="l-center" style={{ marginTop: "2.5rem" }}>
            <Link href="/platform" style={{ fontSize: ".95rem", fontWeight: 600, color: "#6366f1", textDecoration: "none" }}>
              See everything Covant does →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "7rem 0" }}>
        <div className="wrap l-center">
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            See what&apos;s already in<br />your partner program.
          </h2>
          <p className="l-muted l-subtitle" style={{ maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Connect Salesforce or HubSpot in ten minutes. Covant surfaces the partner activity already in your data — touchpoints, relationships, influence — and gives you a way to act on it. Free for up to 5 partners. No credit card required.
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
