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
Unlock channel revenue<br />without the usual channel problems.
          </h1>
          <p className="l-muted l-subtitle">
            Covant is the partner intelligence workspace where sales, partner, and ops teams see one prioritized feed of hygiene fixes and revenue opportunities — backed by a validated attribution record and governed for antitrust from day one.
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

      {/* ── WHAT WE'RE ADDRESSING ────────────────────────── */}
      <section className="l-section l-section-border-t">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "2.5rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>What we&apos;re addressing</p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              The tensions partner teams live with.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
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

          <p className="l-muted" style={{ textAlign: "center", fontSize: ".95rem", fontWeight: 500 }}>
            If any of these sound like your week, you&apos;re who Covant is built for.
          </p>
        </div>
      </section>

      {/* ── PROBLEM BRIDGE ──────────────────────────────── */}
      <section className="l-quote-section">
        <div className="wrap" style={{ maxWidth: 720, textAlign: "center" }}>
          <p className="l-quote">
            Sales has Salesforce Intelligence. Marketing has HubSpot. Revenue ops has Clari.
            Partner teams have a spreadsheet, a quarterly attribution argument, and a portal their partners dread opening.
          </p>
          <p className="l-quote-attr">
            Covant is the first surface built for how partner teams actually work —
            prioritized, evidence-backed, and safe to share.
          </p>
        </div>
      </section>

      {/* ── THE PARTNER INTELLIGENCE WORKSPACE ──────────── */}
      <section className="l-section l-section-border-t l-section-border-b">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "3rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>
              What we&apos;re building
            </p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              One feed for the work that actually matters.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 620, margin: "0 auto", lineHeight: 1.65 }}>
              Covant distills partner activity into a prioritized stream of things worth doing — across several signal families, with more shipping as we learn.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {/* Hygiene column */}
            <div className="l-rec-card-panel" style={{ borderRadius: "16px" }}>
              <div>
                <span className="l-engine-label" style={{ color: "#6366f1", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#6366f1", boxShadow: "0 0 6px #6366f1" }} />
                  Hygiene gains
                </span>
                <h3 className="l-heading-sm">The cleanup nobody has time for.</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "flex", flexDirection: "column", gap: ".55rem" }}>
                  {[
                    "Stale deal registrations",
                    "Open attribution conflicts",
                    "CRM sync gaps",
                    "Certs expiring on active-pipeline partners",
                    "Overdue tier reviews",
                  ].map((s) => (
                    <li key={s} style={{ fontSize: ".9rem", color: "#4b5563", lineHeight: 1.55, paddingLeft: "1.1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#6366f1" }}>·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunity column */}
            <div className="l-rec-card-panel" style={{ borderRadius: "16px" }}>
              <div>
                <span className="l-engine-label" style={{ color: "#22c55e", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                  Go-to-market opportunities
                </span>
                <h3 className="l-heading-sm">The plays hiding in your pipeline.</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "flex", flexDirection: "column", gap: ".55rem" }}>
                  {[
                    "Coverage gaps by territory",
                    "New-product intro candidates",
                    "Partners within reach of the next tier",
                    "Co-sell warm paths from shared account history",
                    "Dormant high-performers",
                  ].map((s) => (
                    <li key={s} style={{ fontSize: ".9rem", color: "#4b5563", lineHeight: 1.55, paddingLeft: "1.1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#22c55e" }}>·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Teaser / more-to-come column */}
            <div className="l-rec-card-panel" style={{ borderRadius: "16px", borderStyle: "dashed", opacity: 0.85 }}>
              <div>
                <span className="l-engine-label" style={{ color: "#9ca3af", marginBottom: ".75rem" }}>
                  <span className="l-dot-sm" style={{ background: "#9ca3af" }} />
                  More signal families
                </span>
                <h3 className="l-heading-sm" style={{ color: "#6b7280" }}>Coming as we learn.</h3>
                <p style={{ fontSize: ".9rem", color: "#6b7280", lineHeight: 1.6, marginTop: "1rem" }}>
                  Program health, relationship moves, enablement gaps, and more — shipped in response to what design partners tell us they need.
                </p>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: ".95rem", color: "#4b5563", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Every signal is a named rule with named inputs — no black-box answers. Sales, partner, and ops teams each pick the signals and KPIs for their lens.
          </p>
        </div>
      </section>

      {/* ── FOUNDATIONS ─────────────────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap">
          <div className="l-center" style={{ marginBottom: "3rem" }}>
            <p className="l-tag" style={{ marginBottom: ".75rem" }}>Foundations</p>
            <h2 className="l-heading-lg l-color-primary" style={{ marginBottom: "1rem" }}>
              The substrate the workspace runs on.
            </h2>
          </div>

          {/* Attribution Engine — hero card */}
          <div className="l-engine-card">
            <div className="l-engine-badge">
              Foundation
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "flex-start" }}>
              <div>
                <span className="l-engine-label">
                  <span className="l-dot" />
                  Attribution Engine
                </span>
                <h3 className="l-heading-md">
                  The evidence every signal cites.
                </h3>
                <p className="l-body">
                  Every hygiene alert and every revenue play links back to a specific touchpoint, deal registration, or co-sell record. Connects to Salesforce or HubSpot, runs eight attribution models, and keeps a full audit trail on every deal — so when a signal says &ldquo;nudge this partner,&rdquo; you can show exactly why.
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

          {/* Built-in capabilities */}
          <div className="l-rec-card-panel" style={{ borderRadius: "16px", gap: "1.25rem", marginBottom: "2rem" }}>
            <p className="l-tag-muted" style={{ margin: 0 }}>Also included</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {[
                {
                  accent: "#818cf8",
                  name: "Deal Registration",
                  desc: "Partners register deals through their portal. You approve from the dashboard. Attribution logic runs automatically.",
                },
                {
                  accent: "#f59e0b",
                  name: "Partner Scoring & Tiers",
                  desc: "Health scores based on revenue, activity, win rate, and deal velocity. Machine-readable tier requirements, so partners can actually see the gap.",
                },
                {
                  accent: "#38bdf8",
                  name: "Incentive Programs",
                  desc: "SPIFs, MDF budgets, and accelerators — configured per tier, tracked per partner, approved through workflows.",
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
                Included
              </span>
              <span style={{ color: "#0a0a0a", fontSize: ".9rem", fontWeight: 600 }}>Partner Portal</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>—</span>
              <span style={{ color: "#6b7280", fontSize: ".85rem" }}>The only partner view they&apos;ll actually open. Branded, read-only, governed so nothing leaves your four walls without approval.</span>
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
                desc: "Everything is internal-only by default. A signal can only be shown to partners after an explicit compliance review.",
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
