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
          <p className="l-label" style={{ marginBottom: "1.25rem" }}>The AI-native channel CRM</p>
          <h1 className="l-heading-xl l-color-primary">
The revenue engine for indirect sales.
          </h1>
          <p className="l-muted l-subtitle">
            Monaco and Day AI are CRMs for direct sellers. Channel revenue runs on a different graph. Covant is two-sided by design — vendor agents on your side, partner agents on theirs, one ledger between them.
          </p>
          <div className="l-flex-center" style={{ marginBottom: "1.5rem" }}>
            <Link href="/beta" className="l-btn">Become a design partner <span>→</span></Link>
            <Link href="/for-partners" className="l-btn-outline">For partners <span>→</span></Link>
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
                  <div style={{ display: "inline-flex", gap: 4, marginTop: 8, padding: 3, background: "#f3f4f6", borderRadius: 6, fontSize: ".68rem", fontWeight: 600 }}>
                    <span style={{ padding: "3px 8px", background: "#fff", borderRadius: 4, color: "#0a0a0a", boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>Vendor view</span>
                    <span style={{ padding: "3px 8px", color: "#9ca3af" }}>Partner view</span>
                  </div>
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
              What a channel-blind CRM misses.
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
            Day AI gives sales a context graph. Monaco gives sales an agent stack.
            Covant does both — for the half of revenue that runs through partners.
          </p>
          <p className="l-quote-attr">
            One ledger of every channel touchpoint. Vendor agents on your side, partner
            agents on theirs. The shape of channel work — registrations, tier thresholds,
            MDF, certifications, rebate math — is in the data model, not bolted on.
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
              The agents. On the ledger.
            </h2>
            <p style={{ fontSize: "1rem", color: "#6b7280", maxWidth: 620, margin: "0 auto", lineHeight: 1.65 }}>
              Agents on both sides of the channel — vendor agents on your side, partner
              agents inside your partners&apos; portal — running on one shared ledger of
              every channel touchpoint. The agents are the protagonists; the ledger is
              the substrate that lets them be specific instead of generic.
            </p>
          </div>

          <p className="l-tag" style={{ marginBottom: "1rem" }}>01 &middot; The Ledger</p>

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
            <p className="l-tag" style={{ marginBottom: "1rem" }}>02 &middot; The Agents (vendor + partner)</p>
            <div style={{ marginBottom: "2rem", maxWidth: 640 }}>
              <h3 className="l-heading-md" style={{ marginBottom: ".75rem" }}>
                Two-sided leverage. One ledger underneath.
              </h3>
              <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.65 }}>
                Vendor agents (PSM, PAM, Program, Ops) read the attributed record and
                surface the moves your partner team should make this week. Partner agents
                (Co-Sell, Delivery, Practice) run inside your partners&apos; portal — scoped
                to their own data — and surface the moves they should make back. The
                shape of channel work is in the data model, not bolted on.
              </p>
            </div>

            <p className="l-tag" style={{ marginBottom: ".75rem", color: "#6b7280", fontSize: ".7rem" }}>On your side</p>
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

            <p className="l-tag" style={{ marginTop: "2rem", marginBottom: ".75rem", color: "#6b7280", fontSize: ".7rem" }}>And, inside the partner portal</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              {[
                {
                  name: "Co-Sell Agent",
                  desc: "For resellers. Finds vendor-pipeline overlap on the partner's open accounts and drafts the warm reach-back to the vendor PSM.",
                },
                {
                  name: "Delivery Agent",
                  desc: "For implementation firms. Watches the implementation backlog, surfaces capacity and certification gaps before SOWs slip.",
                },
                {
                  name: "Practice Agent",
                  desc: "For services partners. Picks the next vendor SKU to add to the practice based on dollar lift and tier economics — not launch hype.",
                },
              ].map((c) => (
                <div key={c.name} style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 12, padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".75rem" }}>
                    <span className="l-dot-sm" style={{ background: "#6366f1" }} />
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
                  Monday-morning walkthrough, example recommendations on both sides, and how agents stay antitrust-safe by construction.
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
            Agents on both sides of the channel.<br />One ledger between them.
          </h2>
          <p className="l-muted l-subtitle" style={{ maxWidth: 540, margin: "0 auto 2.5rem", lineHeight: 1.5 }}>
            Free for design partners. Hands-on onboarding with our team.
            Are you a partner instead? <Link href="/for-partners" style={{ color: "#0a0a0a", textDecoration: "underline" }}>Start here →</Link>
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
