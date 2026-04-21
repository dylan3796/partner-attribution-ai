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
Channel sales,<br />without the tape.
          </h1>
          <p className="l-muted l-subtitle">
            The platform your partner team runs on — sales, managers, ops, and programs leads. Unlock channel revenue without the tape: register deals, configure attribution your way, automate commissions and payouts through Stripe. Spin up a program in a weekend, not a quarter.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/sign-up" className="l-btn">Get Early Access <span>→</span></Link>
            <Link href="/demo" className="l-btn-outline">Try it live <span>→</span></Link>
          </div>
          <p className="l-muted" style={{ fontSize: ".9rem", fontWeight: 500 }}>
            {leadsCount > 0 ? `${leadsCount} ${leadsCount === 1 ? "team" : "teams"} on the waitlist` : "Free for up to 5 partners · No credit card required"}
          </p>
          <p className="l-muted" style={{ fontSize: ".85rem", fontWeight: 500, marginTop: ".35rem" }}>
            Works from day one — just connect your CRM
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
            Covant replaces the spreadsheet with a system of record — so every attribution decision,
            every commission, and every payout has a paper trail.
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

          {/* Commission Engine + Built-in capabilities */}
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
