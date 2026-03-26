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
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#0a0a0a", fontFamily: "Inter, sans-serif" }}>

      {/* ── Nav ── */}
      <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.15rem", color: "#0a0a0a", textDecoration: "none" }}>Covant</Link>
        <Link href="/sign-up" style={{ background: "#0a0a0a", color: "#ffffff", padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: ".85rem", textDecoration: "none" }}>Get Started Free</Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: "5rem 1.5rem 2rem", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20,
          background: "rgba(99,102,241,.12)", color: "#818cf8", fontSize: ".78rem",
          fontWeight: 600, marginBottom: 20, border: "1px solid rgba(99,102,241,.2)",
        }}>
          Engine-based pricing
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px" }}>
          Pay for the engines you use.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#6b7280", maxWidth: 560, margin: "0 auto 12px", lineHeight: 1.7 }}>
          Partner Portal is always free. Add AI engines to automate attribution, commissions, insights, and CRM sync — individually or bundled.
        </p>
      </section>

      {/* ── Tier Toggle ── */}
      <section style={{ maxWidth: 500, margin: "0 auto 3rem", padding: "0 1.5rem" }}>
        <div style={{
          display: "flex", background: "#f9fafb", borderRadius: 10, padding: 4,
          border: "1px solid #e5e7eb",
        }}>
          {(["starter", "growth", "scale"] as Tier[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                background: tier === t ? "#ffffff" : "transparent",
                color: tier === t ? "#0a0a0a" : "#6b7280",
                fontWeight: 600, fontSize: ".85rem", cursor: "pointer",
                fontFamily: "inherit", transition: "all .15s",
              }}
            >
              {TIER_LABELS[t].name}
              <span style={{ display: "block", fontSize: ".7rem", fontWeight: 400, color: tier === t ? "#6b7280" : "#9ca3af", marginTop: 2 }}>
                {TIER_LABELS[t].partners}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Partner Portal — Always Free ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 3rem", padding: "0 1.5rem" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,.06) 0%, rgba(16,185,129,.04) 100%)",
          border: "1px solid rgba(99,102,241,.2)",
          borderRadius: 16,
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 14, right: 16,
            background: "#10b981", color: "#ffffff", fontSize: ".72rem", fontWeight: 700,
            padding: "4px 12px", borderRadius: 20,
          }}>
            Always Free
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "rgba(99,102,241,.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Users size={24} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "#0a0a0a" }}>Partner Portal</div>
              <div style={{ fontSize: ".85rem", color: "#6b7280" }}>
                A branded workspace every partner will actually use — free, forever, for every plan.
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".65rem", marginBottom: "1.5rem" }}>
            {[
              { icon: "✦", text: "AI-powered Q&A on their pipeline and commissions" },
              { icon: "⇄", text: "Bi-directional deal sync — no manual re-entry" },
              { icon: "🎨", text: "Fully customizable and white-labeled per partner" },
              { icon: "📊", text: "Deal registration, commission tracking, tier status" },
              { icon: "🔒", text: "Permission-scoped data — partners see only their own" },
              { icon: "⚡", text: "Invite link to live in under 10 minutes" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".83rem", color: "#374151" }}>
                <span style={{ flexShrink: 0, fontSize: ".9rem", marginTop: 1 }}>{f.icon}</span>
                <span style={{ lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: ".82rem", color: "#6b7280", margin: 0 }}>
              No engine subscription required. Portal is included with every plan, including the free tier.
            </p>
            <Link
              href="/sign-up"
              style={{
                padding: "10px 22px", borderRadius: 8,
                background: "#0a0a0a", color: "#ffffff", fontWeight: 600,
                fontSize: ".85rem", textDecoration: "none", flexShrink: 0,
              }}
            >
              Start Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Free Tier Note ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 2rem", padding: "0 1.5rem" }}>
        <div style={{
          background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12,
          padding: "1rem 1.5rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Rocket size={18} color="#10b981" />
            <span style={{ fontSize: ".85rem", color: "#6b7280" }}>
              <strong style={{ color: "#374151" }}>Free tier:</strong> Portal + basic tracking · Up to 5 partners · No engines required
            </span>
          </div>
          <Link
            href="/sign-up"
            style={{
              padding: "8px 18px", borderRadius: 8, border: "1px solid #d1d5db",
              background: "transparent", color: "#374151", fontWeight: 600,
              fontSize: ".82rem", textDecoration: "none",
            }}
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ── Engine Cards ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 2rem", padding: "0 1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#6b7280", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: ".05em" }}>
          Select Engines
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {(["attribution", "incentives", "intelligence", "crm"] as EngineKey[]).map((key) => {
            const engine = ENGINES[key];
            const isSelected = selectedEngines.has(key);
            const disabled = selectedEngines.has("bundle");
            return (
              <button
                key={key}
                onClick={() => !disabled && toggleEngine(key)}
                disabled={disabled}
                style={{
                  background: isSelected ? "rgba(99,102,241,.08)" : "#ffffff",
                  border: `1px solid ${isSelected ? "rgba(99,102,241,.4)" : "#e5e7eb"}`,
                  borderRadius: 12, padding: "1.25rem", textAlign: "left",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                  transition: "all .15s", fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: isSelected ? "rgba(99,102,241,.15)" : "#f9fafb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isSelected ? "#818cf8" : "#6b7280",
                  }}>
                    {engine.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: ".95rem", color: "#0a0a0a" }}>{engine.name}</div>
                </div>
                <p style={{ fontSize: ".82rem", color: "#6b7280", margin: "0 0 12px", lineHeight: 1.5 }}>
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
      <section style={{ maxWidth: 900, margin: "0 auto 3rem", padding: "0 1.5rem" }}>
        <button
          onClick={() => toggleEngine("bundle")}
          style={{
            width: "100%",
            background: selectedEngines.has("bundle") ? "rgba(99,102,241,.1)" : "#f9fafb",
            border: `2px solid ${selectedEngines.has("bundle") ? "#6366f1" : "#e5e7eb"}`,
            borderRadius: 14, padding: "1.5rem", textAlign: "left",
            cursor: "pointer", transition: "all .15s", fontFamily: "inherit",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 12, right: 16,
            background: "#10b981", color: "#ffffff", fontSize: ".72rem", fontWeight: 700,
            padding: "4px 10px", borderRadius: 20,
          }}>
            Save ${getBundleSavings(tier)}/mo
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: selectedEngines.has("bundle") ? "rgba(99,102,241,.2)" : "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: selectedEngines.has("bundle") ? "#818cf8" : "#6b7280",
            }}>
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
        <section style={{
          position: "sticky", bottom: 0, background: "#ffffff",
          borderTop: "1px solid #e5e7eb", padding: "1rem 1.5rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16, zIndex: 100,
        }}>
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
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 8, border: "none",
              background: "#6366f1", color: "#ffffff", fontWeight: 700,
              fontSize: ".95rem", cursor: loading ? "wait" : "pointer",
              fontFamily: "inherit", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Redirecting…" : "Continue to Checkout"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </section>
      )}

      {/* ── Portal Always Free ── */}
      <section style={{ maxWidth: 680, margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>Partner Portal — Always Free</h2>
        <p style={{ fontSize: ".9rem", color: "#888", lineHeight: 1.7, marginBottom: 20 }}>
          Every plan includes a white-labeled portal where partners register deals, view commissions, and track performance.
          No limits on portal access. No extra charge.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
          {["Deal registration", "Commission tracking", "Performance dashboard", "Branded experience"].map((f) => (
            <div key={f} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", background: "#f9fafb", borderRadius: 20,
              fontSize: ".8rem", color: "#6b7280",
            }}>
              <Check size={12} color="#10b981" />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* ── Engine Comparison Table ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Engine Pricing by Tier</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
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
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "1rem 0", cursor: "pointer", display: "flex", justifyContent: "space-between",
                  alignItems: "center", gap: 16, color: "#0a0a0a", fontFamily: "inherit",
                  fontSize: ".9rem", fontWeight: 500,
                }}
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
              </button>
              {openFaq === i && (
                <p style={{ margin: "0 0 1rem", color: "#6b7280", fontSize: ".88rem", lineHeight: 1.7 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ textAlign: "center", padding: "4rem 1.5rem 6rem", borderTop: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 12 }}>Start free. Add engines as you grow.</h2>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>Portal included free. Up to 5 partners, no credit card.</p>
        <Link href="/sign-up" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#0a0a0a", color: "#ffffff", padding: "14px 28px",
          borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none",
        }}>
          Get Started Free <ArrowRight size={16} />
        </Link>
        <p style={{ marginTop: 16, fontSize: ".85rem", color: "#9ca3af" }}>
          Enterprise? <a href="mailto:sales@covant.ai" style={{ color: "#6366f1" }}>Talk to sales →</a>
        </p>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
