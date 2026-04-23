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
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>AI-native partner platform</p>
          <h1 className="l-heading-xl l-color-primary">
Unlock channel revenue.
          </h1>
          <p className="l-muted l-subtitle">
            The platform your partner team runs on — with four agents that record every touchpoint, capture every deal, action every partner, and unlock the channel revenue you already have. Monitor it. Measure it. One ledger for your team. A branded portal for every partner.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/beta" className="l-btn">Become a design partner <span>→</span></Link>
            <Link href="/platform" className="l-btn-outline">See the platform <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for design partners · Locked-in pricing at GA"}
          </p>
          <p className="l-muted" style={{ fontSize: ".85rem", fontWeight: 500, marginTop: ".35rem" }}>
            Works from day one — opportunities only, CRM optional
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ─────────────────────────────────── */}
      <section className="l-quote-section">
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p className="l-tag" style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>The problem we solve</p>
          <p className="l-quote">
            Sales has Salesforce. Marketing has HubSpot. Finance has NetSuite.
            Partner teams have a shared Google Sheet and a quarterly argument about who drove what.
          </p>
          <p className="l-quote-attr">
            Covant replaces the spreadsheet with a system of record — so every touchpoint,
            every partner contribution, and every dollar of channel revenue has a paper trail.
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
              Record. Capture. Action. Unlock.<br />The four jobs of a partner program.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
              One ledger records every partner touchpoint. A branded portal captures
              every deal the moment a partner registers it. Four in-product agents
              (PSM, PAM, Program, Ops) take action on every partner — the team you
              haven&apos;t hired yet. Channel revenue gets unlocked, monitored, and
              measured end-to-end.
            </p>
          </div>

          {/* The Ledger — hero card */}
          <div className="l-engine-card">
            <div className="l-engine-badge">
              The Platform
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
              <div>
                <span className="l-engine-label">
                  <span className="l-dot" />
                  The Ledger
                </span>
                <h3 className="l-heading-md">
                  Every partner touchpoint in one system of record.
                </h3>
                <p className="l-body">
                  The single source of truth for channel activity — portal submissions, deal registrations, CRM-synced opps, manual touchpoints. Configure the attribution model your team already agreed on; the ledger runs it end-to-end. Every dollar traces back to the deal, the touchpoint, and the partner who drove it.
                </p>
              </div>
              <div className="l-flex-col" style={{ gap: ".5rem" }}>
                {[
                  { label: "One ledger", desc: "Every touchpoint, every partner, every deal — searchable, timestamped, auditable" },
                  { label: "Attribution your way", desc: "First-touch, last-touch, time-decay, role-based, equal-split — whichever model your team agreed on" },
                  { label: "Branded partner portal", desc: "Free, unlimited partner seats. Deal reg, revenue visibility, MDF requests, certifications" },
                  { label: "Explainable by construction", desc: "Every number on every report traces back to a deal, a touchpoint, and a rule" },
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

          {/* Measurement + Agents */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", marginBottom: "2rem" }}>
            <div className="l-rec-card-panel" style={{ borderRadius: "0 0 0 16px" }}>
              <div>
                <span className="l-engine-label" style={{ color: "#22c55e", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  Monitor &amp; Measure
                </span>
                <h3 className="l-heading-sm">
                  Every partner dollar, traceable end-to-end.
                </h3>
                <p style={{ fontSize: ".85rem", color: "#6b7280", lineHeight: 1.65 }}>
                  Know exactly who drove what, how much, and why. Attribution runs on every deal;
                  health scores run on every partner; revenue rolls up by program, tier, and partner.
                  Your team gets defensible numbers. Your partners get transparent visibility. Take
                  whichever commission export your finance team needs — Covant keeps the receipts,
                  not the bank rails.
                </p>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "auto" }}>
                {["Multi-touch attribution", "Partner health", "Revenue rollups"].map((t) => (
                  <span key={t} className="l-pill" style={{ border: "1px solid rgba(34,197,94,.3)", color: "#22c55e", background: "rgba(34,197,94,.1)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div className="l-rec-card-panel" style={{ borderRadius: "0 0 16px 0", gap: "1.25rem" }}>
              <p className="l-tag-muted" style={{ margin: 0 }}>The team you haven&apos;t hired</p>
              {[
                {
                  accent: "#818cf8",
                  name: "PSM Agent",
                  desc: "Partner Sales Manager. Finds co-sell overlap across open deals and drafts the warm intro.",
                },
                {
                  accent: "#f59e0b",
                  name: "PAM Agent",
                  desc: "Partner Account Manager. Watches partner health, flags churn risk, writes the weekly check-in.",
                },
                {
                  accent: "#38bdf8",
                  name: "Program Agent",
                  desc: "Program lead. Spots tier and incentive drift early and proposes fixes with a 90-day dry-run before anything ships.",
                },
                {
                  accent: "#22c55e",
                  name: "Ops Agent",
                  desc: "Partner Ops. Reconciles attribution across every deal, flags disputes early, and answers every 'where did this revenue come from?' question.",
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
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>Branded self-service workspace. Deal registration, commission visibility, MDF requests, certifications. Unlimited partner seats.</span>
            </div>
            <Link href="/beta" className="l-link-arrow">
              Become a design partner →
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
            Your partners are driving revenue.<br />Start unlocking it.
          </h2>
          <p className="l-muted l-subtitle" style={{ maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Free for design partners. Locked-in pricing at GA.
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
