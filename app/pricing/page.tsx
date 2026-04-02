"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check, Zap, Building2, Rocket, ArrowRight, Loader2,
  ChevronDown, ChevronUp, Cpu, DollarSign, Brain, Database, Layers, Users,
} from "lucide-react";

/* ── Types ── */
type Tier = "starter" | "growth" | "scale";
type EngineKey = "attribution" | "incentives" | "intelligence" | "crm" | "bundle";

interface EngineData {
  name: string;
  description: string;
  icon: React.ReactNode;
  prices: Record<Tier, number>;
}

interface FAQ { q: string; a: string; }

/* ── Engine pricing data ── */
const ENGINES: Record<EngineKey, EngineData> = {
  attribution: {
    name: "Attribution Engine",
    description: "Track touchpoints, calculate deal credit, multi-touch attribution models",
    icon: <Cpu size={20} />,
    prices: { starter: 99, growth: 249, scale: 599 },
  },
  incentives: {
    name: "Incentives Engine",
    description: "Commission rules, payout workflows, approval chains, reconciliation",
    icon: <DollarSign size={20} />,
    prices: { starter: 149, growth: 349, scale: 799 },
  },
  intelligence: {
    name: "Intelligence Engine",
    description: "Partner health scores, recommendations, QBR reports, analytics",
    icon: <Brain size={20} />,
    prices: { starter: 99, growth: 199, scale: 449 },
  },
  crm: {
    name: "CRM Engine",
    description: "Salesforce & HubSpot sync, bi-directional data flow, field mapping",
    icon: <Database size={20} />,
    prices: { starter: 99, growth: 199, scale: 449 },
  },
  bundle: {
    name: "All Engines Bundle",
    description: "Every engine included — full platform power at the best price",
    icon: <Layers size={20} />,
    prices: { starter: 399, growth: 899, scale: 1999 },
  },
};

const TIER_LABELS: Record<Tier, { name: string; partners: string }> = {
  starter: { name: "Starter", partners: "≤25 partners" },
  growth: { name: "Growth", partners: "≤100 partners" },
  scale: { name: "Scale", partners: "Unlimited partners" },
};

/* ── Calculate bundle savings ── */
function getBundleSavings(tier: Tier): number {
  const individual = ENGINES.attribution.prices[tier] +
    ENGINES.incentives.prices[tier] +
    ENGINES.intelligence.prices[tier] +
    ENGINES.crm.prices[tier];
  return individual - ENGINES.bundle.prices[tier];
}

/* ── FAQs updated for engine model ── */
const FAQS: FAQ[] = [
  {
    q: "What is an Engine?",
    a: "Engines are AI-powered modules that run specific parts of your partner program at scale. Attribution Engine tracks deal credit, Incentives Engine handles commissions, Intelligence Engine provides health scores and insights, and CRM Engine syncs with Salesforce/HubSpot. Mix and match or bundle them all.",
  },
  {
    q: "What's included in the free tier?",
    a: "Free includes the Partner Portal (always free with any plan), basic deal tracking, and up to 5 active partners. No engines are included — you add those when you need automation and scale.",
  },
  {
    q: "How do partner limits work?",
    a: "Starter tier supports up to 25 active partners, Growth up to 100, and Scale is unlimited. An active partner is one with deals, touchpoints, or portal activity in the billing period.",
  },
  {
    q: "Can I start with one engine and add more later?",
    a: "Yes. Many teams start with Attribution Engine, then add Incentives when they need automated payouts, and Intelligence for QBR reporting. You're billed per-engine per-month.",
  },
  {
    q: "What's the savings on the All Engines Bundle?",
    a: "The bundle saves you $46/mo on Starter, $98/mo on Growth, and $297/mo on Scale compared to buying all four engines separately.",
  },
  {
    q: "Is the Partner Portal really free?",
    a: "Yes. The Partner Portal — where partners register deals, view commissions, and track performance — is included free with any plan, even the free tier. No branding limits, no partner caps on portal access.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual billing saves ~20%. Contact billing@covant.ai to switch. Enterprise custom pricing is also available for large programs.",
  },
  {
    q: "Can I switch tiers or engines anytime?",
    a: "Yes. Upgrades are prorated immediately. Downgrades take effect at the next billing date. Add or remove engines anytime from the billing settings.",
  },
];

/* ── Component ── */
export default function PricingPage() {
  const [tier, setTier] = useState<Tier>("growth");
  const [selectedEngines, setSelectedEngines] = useState<Set<EngineKey>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleEngine = (key: EngineKey) => {
    const next = new Set(selectedEngines);
    if (key === "bundle") {
      // Bundle is exclusive — clears individual selections
      if (next.has("bundle")) {
        next.delete("bundle");
      } else {
        next.clear();
        next.add("bundle");
      }
    } else {
      // Individual engine — remove bundle if selected
      next.delete("bundle");
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }
    setSelectedEngines(next);
  };

  const totalPrice = Array.from(selectedEngines).reduce(
    (sum, key) => sum + ENGINES[key].prices[tier],
    0
  );

  async function handleCheckout() {
    if (selectedEngines.size === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engines: Array.from(selectedEngines),
          tier,
          interval: "month",
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) router.push(data.url);
      else console.error("Checkout error:", data.error);
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-page">

      {/* ── Nav ── */}
      <nav className="p-nav">
        <Link href="/" className="p-nav-logo">Covant</Link>
        <Link href="/sign-up" className="p-nav-cta">Get Started Free</Link>
      </nav>

      {/* ── Hero ── */}
      <section className="p-hero">
        <div className="p-hero-badge">
          Engine-based pricing
        </div>
        <h1 className="p-hero-title">
          Pay for the engines you use.
        </h1>
        <p className="p-hero-desc">
          Partner Portal is always free. Add AI engines to automate attribution, commissions, insights, and CRM sync — individually or bundled.
        </p>
      </section>

      {/* ── Tier Toggle ── */}
      <section className="p-tier-toggle">
        <div className="p-tier-bar">
          {(["starter", "growth", "scale"] as Tier[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="p-tier-btn"
              style={{
                background: tier === t ? "#ffffff" : "transparent",
                color: tier === t ? "#0a0a0a" : "#6b7280",
              }}
            >
              {TIER_LABELS[t].name}
              <span
                className="p-tier-btn-label"
                style={{ color: tier === t ? "#6b7280" : "#9ca3af" }}
              >
                {TIER_LABELS[t].partners}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Partner Portal — Always Free ── */}
      <section className="p-section p-section-mb">
        <div className="p-portal-card">
          <div className="p-always-free-badge">
            Always Free
          </div>
          <div className="p-portal-header">
            <div className="p-portal-icon">
              <Users size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "#0a0a0a" }}>Partner Portal</div>
              <div style={{ fontSize: ".85rem", color: "#6b7280" }}>
                A branded workspace every partner will actually use — free, forever, for every plan.
              </div>
            </div>
          </div>
          <div className="p-portal-features">
            {[
              { icon: "✦", text: "AI-powered Q&A on their pipeline and commissions" },
              { icon: "⇄", text: "Bi-directional deal sync — no manual re-entry" },
              { icon: "🎨", text: "Fully customizable and white-labeled per partner" },
              { icon: "📊", text: "Deal registration, commission tracking, tier status" },
              { icon: "🔒", text: "Permission-scoped data — partners see only their own" },
              { icon: "⚡", text: "Invite link to live in under 10 minutes" },
            ].map((f, i) => (
              <div key={i} className="p-portal-feature">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className="p-portal-footer">
            <p className="p-free-note-text" style={{ margin: 0 }}>
              No engine subscription required. Portal is included with every plan, including the free tier.
            </p>
            <Link href="/sign-up" className="p-nav-cta" style={{ flexShrink: 0 }}>
              Start Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Free Tier Note ── */}
      <section className="p-section p-section-mb-sm">
        <div className="p-free-note">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Rocket size={18} color="#10b981" />
            <span style={{ fontSize: ".85rem", color: "#6b7280" }}>
              <strong style={{ color: "#374151" }}>Free tier:</strong> Portal + basic tracking · Up to 5 partners · No engines required
            </span>
          </div>
          <Link href="/sign-up" className="p-free-note-cta">
            Get Started
          </Link>
        </div>
      </section>

      {/* ── Engine Cards ── */}
      <section className="p-section p-section-mb-sm">
        <h2 className="p-engine-heading">
          Select Engines
        </h2>
        <div className="p-engine-grid">
          {(["attribution", "incentives", "intelligence", "crm"] as EngineKey[]).map((key) => {
            const engine = ENGINES[key];
            const isSelected = selectedEngines.has(key);
            const disabled = selectedEngines.has("bundle");
            return (
              <button
                key={key}
                onClick={() => !disabled && toggleEngine(key)}
                disabled={disabled}
                className="p-engine-btn"
                style={{
                  background: isSelected ? "rgba(99,102,241,.08)" : "#ffffff",
                  borderColor: isSelected ? "rgba(99,102,241,.4)" : "#e5e7eb",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <div className="p-engine-btn-header">
                  <div
                    className="p-engine-icon"
                    style={{
                      background: isSelected ? "rgba(99,102,241,.15)" : "#f9fafb",
                      color: isSelected ? "#818cf8" : "#6b7280",
                    }}
                  >
                    {engine.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: ".95rem", color: "#0a0a0a" }}>{engine.name}</div>
                </div>
                <p className="p-engine-desc">
                  {engine.description}
                </p>
                <div style={{ fontWeight: 700, fontSize: "1.25rem", color: isSelected ? "#818cf8" : "#0a0a0a" }}>
                  ${engine.prices[tier]}<span style={{ fontSize: ".8rem", fontWeight: 400, color: "#6b7280" }}>/mo</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Bundle Card ── */}
      <section className="p-section p-section-mb">
        <button
          onClick={() => toggleEngine("bundle")}
          className="p-bundle-btn"
          style={{
            background: selectedEngines.has("bundle") ? "rgba(99,102,241,.1)" : "#f9fafb",
            borderColor: selectedEngines.has("bundle") ? "#6366f1" : "#e5e7eb",
          }}
        >
          <div className="p-bundle-save">
            Save ${getBundleSavings(tier)}/mo
          </div>
          <div className="p-bundle-header">
            <div
              className="p-bundle-icon"
              style={{
                background: selectedEngines.has("bundle") ? "rgba(99,102,241,.2)" : "#ffffff",
                color: selectedEngines.has("bundle") ? "#818cf8" : "#6b7280",
              }}
            >
              <Layers size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0a0a0a" }}>All Engines Bundle</div>
              <div style={{ fontSize: ".82rem", color: "#6b7280" }}>Attribution + Incentives + Intelligence + CRM</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: "2rem", color: selectedEngines.has("bundle") ? "#818cf8" : "#0a0a0a" }}>
              ${ENGINES.bundle.prices[tier]}
            </span>
            <span style={{ fontSize: ".9rem", color: "#6b7280" }}>/mo</span>
            <span style={{ fontSize: ".85rem", color: "#9ca3af", marginLeft: 8, textDecoration: "line-through" }}>
              ${ENGINES.attribution.prices[tier] + ENGINES.incentives.prices[tier] + ENGINES.intelligence.prices[tier] + ENGINES.crm.prices[tier]}
            </span>
          </div>
        </button>
      </section>

      {/* ── Summary & Checkout ── */}
      {selectedEngines.size > 0 && (
        <section className="p-sticky-bar">
          <div>
            <div style={{ fontSize: ".85rem", color: "#6b7280" }}>
              {selectedEngines.has("bundle")
                ? "All Engines Bundle"
                : `${selectedEngines.size} engine${selectedEngines.size > 1 ? "s" : ""} selected`}
              {" · "}
              {TIER_LABELS[tier].name} tier
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.5rem" }}>
              ${totalPrice}<span style={{ fontSize: ".9rem", fontWeight: 400, color: "#6b7280" }}>/mo</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="p-checkout-btn"
            style={{
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Redirecting…" : "Continue to Checkout"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </section>
      )}

      {/* ── Portal Always Free ── */}
      <section className="p-portal-free-section">
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>Partner Portal — Always Free</h2>
        <p style={{ fontSize: ".9rem", color: "#888", lineHeight: 1.7, marginBottom: 20 }}>
          Every plan includes a white-labeled portal where partners register deals, view commissions, and track performance.
          No limits on portal access. No extra charge.
        </p>
        <div className="p-portal-free-features">
          {["Deal registration", "Commission tracking", "Performance dashboard", "Branded experience"].map((f) => (
            <div key={f} className="p-portal-free-chip">
              <Check size={12} color="#10b981" />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* ── Engine Comparison Table ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Engine Pricing by Tier</h2>
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "12px", color: "#6b7280", fontWeight: 500 }}>Engine</th>
                {(["starter", "growth", "scale"] as Tier[]).map((t) => (
                  <th key={t} style={{
                    textAlign: "center", padding: "12px",
                    color: tier === t ? "#818cf8" : "#6b7280",
                    fontWeight: tier === t ? 700 : 500,
                  }}>
                    {TIER_LABELS[t].name}
                    <div style={{ fontSize: ".7rem", fontWeight: 400, color: "#9ca3af" }}>{TIER_LABELS[t].partners}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["attribution", "incentives", "intelligence", "crm", "bundle"] as EngineKey[]).map((key, i) => {
                const engine = ENGINES[key];
                const isBundle = key === "bundle";
                return (
                  <tr key={key} style={{
                    borderBottom: "1px solid #f3f4f6",
                    background: isBundle ? "rgba(99,102,241,.04)" : i % 2 === 0 ? "transparent" : "#fafafa",
                  }}>
                    <td style={{ padding: "14px 12px", color: "#1f2937", fontWeight: isBundle ? 700 : 400 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {engine.icon}
                        {engine.name}
                      </div>
                    </td>
                    {(["starter", "growth", "scale"] as Tier[]).map((t) => (
                      <td key={t} style={{ textAlign: "center", padding: "14px 12px" }}>
                        <span style={{ fontWeight: 700, color: tier === t ? "#0a0a0a" : "#6b7280" }}>
                          ${engine.prices[t]}
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: ".75rem" }}>/mo</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 680, margin: "0 auto 6rem", padding: "0 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Common questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="p-faq-btn"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
              </button>
              {openFaq === i && (
                <p className="p-faq-answer">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="p-bottom-cta">
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 12 }}>Start free. Add engines as you grow.</h2>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>Portal included free. Up to 5 partners, no credit card.</p>
        <Link href="/sign-up" className="p-bottom-cta-btn">
          Get Started Free <ArrowRight size={16} />
        </Link>
        <p className="p-enterprise-note">
          Enterprise? <a href="mailto:sales@covant.ai" style={{ color: "#6366f1" }}>Talk to sales →</a>
        </p>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
