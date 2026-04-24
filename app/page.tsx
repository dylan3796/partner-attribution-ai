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
            Covant is the system of record for partner attribution — one ledger for every touchpoint, a branded portal for every partner, and partner agents that read the record and surface the moves worth making this week.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/beta" className="l-btn">Become a design partner <span>→</span></Link>
            <Link href="/platform" className="l-btn-outline">See the platform <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for design partners · Works from day one"}
          </p>
        </div>

        {/* Hero product mockup — one anchor image */}
        <div className="wrap l-hero-mock-wrap">
          <div className="l-hero-mock">
            <div className="l-hero-mock-bar">
              <span className="l-hero-mock-dot" />
              <span className="l-hero-mock-dot" />
              <span className="l-hero-mock-dot" />
              <span className="l-hero-mock-path">covant.ai / dashboard / agents</span>
            </div>
            <div className="l-hero-mock-body">
              <div className="l-hero-mock-head">
                <div>
                  <div className="l-hero-mock-eyebrow">Today&apos;s feed</div>
                  <div className="l-hero-mock-title">4 actions your agents found</div>
                </div>
                <div className="l-hero-mock-stat">
                  <span className="l-hero-mock-stat-label">Partner pipeline</span>
                  <span className="l-hero-mock-stat-value">$2.4M</span>
                  <span className="l-hero-mock-stat-delta">↑ 18% QoQ</span>
                </div>
              </div>
              <div className="l-hero-mock-list">
                {[
                  { agent: "PSM", title: "Coverage gap in APAC", detail: "4 enterprise deals in-flight, no active partner. TechBridge & Apex both qualify." },
                  { agent: "PAM", title: "4 partners within 1 deal of tier-up", detail: "TechBridge, Stackline, NexaCloud, Ridgeway — Platinum unlocks co-sell benefits." },
                  { agent: "Program", title: "NPI launch adoption below bar", detail: "Cloud Connect: 3 of 28 partners trained. Target is 70% by end of quarter." },
                  { agent: "Ops", title: "12 CRM sync conflicts", detail: "Partner field mismatch between Salesforce and the registration form. Auto-merge ready." },
                ].map((r) => (
                  <div key={r.agent} className="l-hero-mock-row">
                    <span className="l-hero-mock-tag">{r.agent}</span>
                    <div className="l-hero-mock-row-body">
                      <div className="l-hero-mock-row-title">{r.title}</div>
                      <div className="l-hero-mock-row-detail">{r.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE'RE ADDRESSING ────────────────────────── */}
      <section className="l-section l-section-border-t">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div style={{ marginBottom: "3.5rem", maxWidth: 640 }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>What we&apos;re addressing</p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              The tensions partner teams live with.
            </h2>
          </div>

          <ol className="l-tensions-list">
            {[
              {
                title: "Partner programs running on gut feel",
                desc: "Revenue decisions about which partners to invest in get made without a defensible, evidence-backed view of who's actually driving pipeline.",
              },
              {
                title: "Partners operating in the dark",
                desc: "Partners can't see which specific moves would grow their business with you, so they wait for a QBR that never quite tells them.",
              },
              {
                title: "New-product launches that never reach the right partners",
                desc: "Every launch starts over from scratch, with no memory of which partners have the history or specialization to carry it.",
              },
              {
                title: "Too many dashboards, too few actions",
                desc: "The teams touching partners open six surfaces every morning and still miss the moments that mattered yesterday.",
              },
              {
                title: "Partner touchpoints that vanish",
                desc: "The work partners do between registered deals — intros, co-sells, technical assists — rarely gets recorded in a way anyone can act on later.",
              },
            ].map((t, i) => (
              <li key={t.title} className="l-tension-row">
                <span className="l-tension-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="l-tension-body">
                  <div className="l-tension-title">{t.title}</div>
                  <div className="l-tension-desc">{t.desc}</div>
                </div>
              </li>
            ))}
          </ol>

          <p className="l-muted" style={{ marginTop: "2.5rem", fontSize: ".95rem", fontWeight: 500 }}>
            If any of these sound like your week, you&apos;re who Covant is built for.
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ─────────────────────────────────── */}
      <section className="l-quote-section">
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <p className="l-tag" style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>The problem we solve</p>
          <p className="l-quote">
            Sales has Salesforce. Marketing has HubSpot. Finance has NetSuite.
            Partner teams have a spreadsheet and a quarterly argument about who drove what.
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
              The platform. Then the agents.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 580, margin: "0 auto", lineHeight: 1.65 }}>
              First, one ledger records every partner touchpoint and a branded portal
              captures every deal the moment a partner registers it — the system of
              record partner teams have been missing. Then partner agents read that
              record and surface the moves worth making this week.
            </p>
          </div>

          <p className="l-tag" style={{ marginBottom: "1rem" }}>01 &middot; The Platform</p>

          {/* The Ledger — hero card */}
          <div className="l-engine-card">
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

          {/* Measurement — full width below the ledger */}
          <div className="l-rec-card-panel" style={{ borderRadius: "0 0 16px 16px", marginBottom: "1.5rem" }}>
            <div>
              <span className="l-engine-label" style={{ marginBottom: ".75rem" }}>
                <span className="l-dot-sm" style={{ background: "#0a0a0a" }} />
                Monitor &amp; Measure
              </span>
              <h3 className="l-heading-sm">
                Every partner dollar, traceable end-to-end.
              </h3>
              <p style={{ fontSize: ".9rem", color: "#6b7280", lineHeight: 1.65 }}>
                Know exactly who drove what, how much, and why. Attribution runs on every deal;
                health scores run on every partner; revenue rolls up by program, tier, partner,
                and as a share of total pipeline. Your team gets defensible numbers. Your
                partners get transparent visibility into their own contribution.
              </p>
            </div>
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginTop: "1rem" }}>
              {["Multi-touch attribution", "Partner health", "Revenue rollups", "CRM bidirectional sync"].map((t) => (
                <span key={t} className="l-pill l-pill-mono">{t}</span>
              ))}
            </div>
          </div>

          {/* Portal — quiet inline note, closes the Platform block */}
          <div className="l-portal-inline">
            <div>
              <div className="l-portal-inline-title">Partner Portal</div>
              <div className="l-portal-inline-desc">
                Branded self-service workspace — deal registration, revenue visibility, MDF requests, certifications. Unlimited partner seats, free with every plan.
              </div>
            </div>
            <Link href="/platform" className="l-link-arrow">
              See the platform →
            </Link>
          </div>

          {/* ── 02 · The Agents ─────────────────────────────── */}
          <div style={{ marginTop: "5rem" }}>
            <p className="l-tag" style={{ marginBottom: "1rem" }}>02 &middot; The Agents</p>
            <div style={{ marginBottom: "2rem", maxWidth: 620 }}>
              <h3 className="l-heading-md" style={{ marginBottom: ".75rem" }}>
                Leverage for your partner team.
              </h3>
              <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.65 }}>
                Partner agents read the attributed record and surface the handful of moves
                worth making this week — coverage gaps, tier-up nudges, stale registrations,
                CRM hygiene. The work a partner team already does, amplified. PSM, PAM,
                Program, and Ops to start; more ship as we learn.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              {[
                {
                  name: "PSM Agent",
                  desc: "Partner Sales Manager. Finds co-sell overlap across open deals and drafts the warm intro.",
                },
                {
                  name: "PAM Agent",
                  desc: "Partner Account Manager. Watches partner health, flags churn risk, writes the weekly check-in.",
                },
                {
                  name: "Program Agent",
                  desc: "Program lead. Spots tier and incentive drift early and proposes fixes with a 90-day dry-run before anything ships.",
                },
                {
                  name: "Ops Agent",
                  desc: "Partner Ops. Reconciles attribution across every deal, flags disputes early, and answers every ‘where did this revenue come from?’ question.",
                },
              ].map((c) => (
                <div key={c.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".75rem" }}>
                    <span className="l-dot-sm" style={{ background: "#0a0a0a" }} />
                    <div className="l-cap-title" style={{ margin: 0 }}>{c.name}</div>
                  </div>
                  <div className="l-cap-desc">{c.desc}</div>
                </div>
              ))}
            </div>

            <div className="l-portal-inline" style={{ marginTop: "2rem" }}>
              <div>
                <div className="l-portal-inline-title">See how the agents work</div>
                <div className="l-portal-inline-desc">
                  Monday-morning walkthrough, example recommendations, and how agents stay antitrust-safe by construction.
                </div>
              </div>
              <Link href="/agents" className="l-link-arrow">
                See the agents →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BY CONSTRUCTION ───────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "2.5rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>Trust by construction</p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              Antitrust-safe. Partner-visible by permission only.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {[
              {
                title: "Per-signal sharing controls",
                desc: "Everything an agent surfaces is internal-only by default. A signal can only be shown to partners after an explicit compliance review.",
              },
              {
                title: "Inference, not tagging",
                desc: "Partner specialization comes from deal history and certifications — never a field the partner self-selects and you can't defend.",
              },
              {
                title: "Full audit trail",
                desc: "Every partner-visible surface writes to the log, with the user and signal kind that authorized it.",
              },
            ].map((t) => (
              <div key={t.title} className="l-feature-chip" style={{ alignItems: "flex-start" }}>
                <span className="l-feature-chip-icon">✦</span>
                <div>
                  <div className="l-feature-chip-title">{t.title}</div>
                  <div className="l-feature-chip-desc">{t.desc}</div>
                </div>
              </div>
            ))}
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
            Free for design partners. Hands-on onboarding with our team.
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
