"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Handshake,
  Wrench,
  Layers,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/Footer";
import { MockWindow, StatCard, Badge, TourSection } from "@/components/PlatformMockHelpers";

const WEDGE = [
  {
    title: "Generic AI CRMs are built for direct sellers.",
    desc: "Monaco and Day AI run on the email graph — who emailed whom, when. Channel revenue runs on a different graph: who registered, who influenced, who delivered, who got paid.",
  },
  {
    title: "A partner-specialist AI knows the difference between a deal-reg conflict and a co-sell.",
    desc: "The shape of channel work — registrations, tier thresholds, MDF, certifications, rebate math — is invisible to a CRM that wasn't built for it. The agent gets it wrong because the data model gets it wrong.",
  },
  {
    title: "Two-sided by design.",
    desc: "Vendor agents on one side, partner agents on the other, one ledger between them. If 30% of revenue is indirect, 30% of the AI shouldn't be from a tool that ignores partners.",
  },
];

const TRUST = [
  {
    title: "Per-signal sharing controls",
    desc: "The vendor only sees what they're permissioned to see. Your other-vendor pipeline never crosses over. Antitrust-safe by construction.",
  },
  {
    title: "Inference, not tagging",
    desc: "Your specialization is inferred from your closed-won mix and certifications — not a self-selected field a vendor could dispute.",
  },
  {
    title: "Full audit trail",
    desc: "Every partner-visible surface writes to the log. You can prove exactly what was shared, when, and on whose authority.",
  },
];

export default function ForPartnersPage() {
  const captureLead = useMutation(api.leads.captureLead);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setEmailError("Please enter your email"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Please enter a valid email"); return; }
    setEmailError("");
    try {
      await captureLead({ email, source: "for_partners_hero" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  }

  return (
    <div style={{ background: "#fff", color: "#0a0a0a" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="l-center l-section-border-b" style={{ padding: "8rem 0 4rem" }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p className="l-section-tag" style={{ marginBottom: "1.5rem" }}>For partners</p>
          <h1 className="l-heading-xl" style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)", marginBottom: "1.75rem" }}>
            An AI-native portal for the partners<br />you sell with.
          </h1>
          <p className="l-subtitle" style={{ color: "#4b5563", maxWidth: 640, margin: "0 auto" }}>
            Monaco and Day AI are CRMs for direct sellers. Channel revenue runs on a different graph.
            Covant is two-sided by design — vendor agents on one side, partner agents on the other,
            one ledger between them.
          </p>
          <div className="l-flex-center" style={{ marginTop: "2rem" }}>
            <a href="#resellers" className="l-btn">See how it works <ArrowRight size={14} /></a>
            <Link href="/agents" className="l-btn-outline">Meet the agents →</Link>
          </div>
        </div>

        {/* Audience tabs (visual only — anchors) */}
        <div className="wrap" style={{ marginTop: "3rem" }}>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { label: "Resellers / VARs", href: "#resellers", icon: Handshake },
              { label: "Implementation firms", href: "#implementation", icon: Wrench },
              { label: "Services partners", href: "#services", icon: Layers },
            ].map((l) => (
              <a key={l.href} href={l.href} className="l-tour-step" style={{ marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <l.icon size={13} />
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1. RESELLERS — CO-SELL AGENT ──────────────────────── */}
      <TourSection
        id="resellers"
        step="01 — Resellers / VARs"
        title="The Co-Sell Agent reads your pipeline and the vendor's."
        subtitle="Find every account where you and the vendor overlap."
        description="You carry 3–8 vendor relationships. The Co-Sell Agent runs a daily overlap scan across every open account in your pipeline against every open opportunity the vendor has shared with you — drafts the warm reach-back to their PSM, logs the touchpoint when you approve. No spreadsheet. No quarterly account-mapping call."
      >
        <MockWindow title="partners.covant.ai/co-sell">
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <StatCard label="Open overlap" value="6 accounts" trend="3 not yet registered" />
            <StatCard label="Tier progress" value="82%" trend="2 deals to Platinum" />
          </div>
          <div className="l-section-label" style={{ marginBottom: 10 }}>Today&apos;s proposals</div>
          {[
            { title: "Northwind — Cloud Connect overlap", detail: "Vendor opp at Proposal stage, no registered partner. You have 2 active contacts." },
            { title: "Lumen Series C — re-engage", detail: "You closed a similar Series C 60 days ago. Same SKU now in pipeline at Lumen." },
            { title: "Ridgeway — registered deal stalled", detail: "21 days no movement. Draft an update to the vendor PSM with your latest." },
          ].map((p, i, arr) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "flex-start" }}>
              <Handshake size={16} style={{ color: "#0a0a0a", marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ color: "#0a0a0a", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", background: "#f3f4f6", padding: "3px 7px", borderRadius: 4 }}>CO-SELL</span>
                  <span style={{ color: "#0a0a0a", fontSize: ".88rem", fontWeight: 600 }}>{p.title}</span>
                </div>
                <div style={{ color: "#6b7280", fontSize: ".82rem", lineHeight: 1.55 }}>{p.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={14} style={{ color: "#3b82f6", flexShrink: 0 }} />
            <span style={{ color: "#6b7280", fontSize: ".75rem", lineHeight: 1.5 }}>
              <strong style={{ color: "#374151" }}>Vendor-permissioned read</strong> — the agent only sees the slice the vendor has marked partner-visible. Your other-vendor pipeline stays yours.
            </span>
          </div>
        </MockWindow>
      </TourSection>

      {/* ── 2. IMPLEMENTATION — DELIVERY AGENT ────────────────── */}
      <TourSection
        id="implementation"
        step="02 — Implementation firms"
        title="The Delivery Agent watches the backlog before it slips."
        subtitle="Capacity, certifications, milestone risk — surfaced 14+ days early."
        description="You're running 6–20 active engagements and you're the last to find out when one's about to slip. The Delivery Agent reads your post-close deals, your roster of certified consultants, and your PSA burn rate — flags slip risk before milestones miss, and drafts the proactive update to the vendor PAM."
        reverse
      >
        <MockWindow title="partners.covant.ai/delivery">
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <StatCard label="Active engagements" value="14" trend="2 at slip risk" />
            <StatCard label="Cert coverage" value="92%" trend="2 expiring in 21d" />
          </div>
          <div className="l-section-label" style={{ marginBottom: 10 }}>Engagement watchlist</div>
          {[
            { name: "Acme Corp — Cloud Connect Phase 2", risk: "Cutover May 14 (18d)", detail: "Burn 1.4× plan; lead architect oversubscribed.", color: "#ef4444" },
            { name: "Lumen — platform rollout", risk: "On track", detail: "All milestones green; cert coverage healthy.", color: "#22c55e" },
            { name: "Ridgeway — pilot to prod", risk: "Cert expiry in 21d", detail: "2 of 4 engineers need Solution Architect renewal.", color: "#f59e0b" },
          ].map((e, i, arr) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#0a0a0a", fontSize: ".88rem", fontWeight: 600, marginBottom: 3 }}>{e.name}</div>
                <div style={{ color: "#6b7280", fontSize: ".8rem", lineHeight: 1.5 }}>{e.detail}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Badge text={e.risk} color={e.color} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 6 }}>
            <span style={{ color: "#374151", fontSize: ".78rem", lineHeight: 1.55 }}>
              ✦ Drafted update to vendor PAM on Acme: <em>&ldquo;Heads-up — pulling Tom in on architecture review starting Monday; requesting one extra week on cutover.&rdquo;</em>
            </span>
          </div>
        </MockWindow>
      </TourSection>

      {/* ── 3. SERVICES — PRACTICE AGENT ──────────────────────── */}
      <TourSection
        id="services"
        step="03 — Services partners"
        title="The Practice Agent picks the next SKU on dollar lift."
        subtitle="Economics-first, not enthusiasm-first."
        description="You've got 1–2 vendors and a dozen SKUs to choose between. The Practice Agent reads 12 months of your closed-won, the vendor's tier thresholds and rebate math, and your cert roster — surfaces which SKUs to add to the practice based on projected dollar lift, not vendor launch hype."
      >
        <MockWindow title="partners.covant.ai/practice">
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#0a0a0a", fontSize: "1rem", fontWeight: 700 }}>Recommendation: Add Cloud Connect</div>
                <div style={{ color: "#6b7280", fontSize: ".75rem" }}>Confidence 0.82 · Adjacency to existing closed-won mix</div>
              </div>
              <Badge text="Top pick" color="#22c55e" />
            </div>
          </div>
          <div className="l-section-label" style={{ marginBottom: 10 }}>Projected practice lift</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <StatCard label="Year 1" value="$42K/q" trend="6 of 8 verticals match" />
            <StatCard label="Year 2" value="$110K/q" trend="Bridges to Platinum (+6pt)" />
          </div>
          <div className="l-section-label" style={{ marginBottom: 8 }}>Required investment</div>
          {[
            { icon: TrendingUp, text: "4 consultants × 24h Solution Architect cert prep", color: "#3b82f6" },
            { icon: CheckCircle2, text: "1 lighthouse engagement under $50K to qualify for the SKU listing", color: "#a78bfa" },
            { icon: Clock, text: "Estimated time-to-first-revenue: ~10 weeks", color: "#f59e0b" },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <item.icon size={14} style={{ color: item.color, flexShrink: 0 }} />
              <span style={{ color: "#6b7280", fontSize: ".8rem" }}>{item.text}</span>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* ── WEDGE ──────────────────────────────────────────────── */}
      <section className="l-section-alt l-section-border-t l-section-border-b">
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div style={{ marginBottom: "3rem", maxWidth: 640 }}>
            <p className="l-section-tag">Why a partner-specialist AI</p>
            <h2 className="l-heading-lg">
              The wedge against generic AI CRMs.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {WEDGE.map((w) => (
              <div key={w.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: ".75rem", lineHeight: 1.35 }}>{w.title}</h3>
                <p style={{ color: "#6b7280", fontSize: ".88rem", lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ─────────────────────────────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div style={{ marginBottom: "2.5rem", maxWidth: 640 }}>
            <p className="l-section-tag">Antitrust-safe by construction</p>
            <h2 className="l-heading-lg">
              The vendor only sees what they&apos;re permissioned to see.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {TRUST.map((t) => (
              <div key={t.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".6rem" }}>
                  <Shield size={16} style={{ color: "#0a0a0a" }} />
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, margin: 0 }}>{t.title}</h3>
                </div>
                <p style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="l-section-light" style={{ padding: "6rem 0" }}>
        <div className="wrap l-center" style={{ maxWidth: 620 }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: "1rem", color: "#0a0a0a" }}>
            Is your vendor on Covant?
          </h2>
          <p className="l-muted l-subtitle" style={{ maxWidth: 520, margin: "0 auto 2rem", lineHeight: 1.55 }}>
            Drop your email — we&apos;ll tell you if any of your vendors are running a Covant program, and connect you to their team if they are.
          </p>
          <form onSubmit={handleSubmit} className="l-cta-form">
            <div className="l-cta-form-input">
              <input
                type="email"
                placeholder="you@your-partner-org.com"
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
              {submitted ? "We'll be in touch!" : "Check my vendors"}
            </button>
          </form>
          {submitted && (
            <p className="l-success-msg">We&apos;ll reach out within 24 hours.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
