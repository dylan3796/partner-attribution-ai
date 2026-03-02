"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check, X, Zap, Building2, Rocket, Crown, ArrowRight, Loader2,
  ChevronDown, ChevronUp,
} from "lucide-react";

/* ── Types ── */
interface Feature { name: string; free: string | boolean; pro: string | boolean; scale: string | boolean; enterprise: string | boolean; }
interface FAQ { q: string; a: string; }

/* ── Feature table ── */
const FEATURES: Feature[] = [
  { name: "Active partners",          free: "Up to 5",      pro: "Up to 25",     scale: "Up to 100",   enterprise: "Unlimited" },
  { name: "Overage",                  free: "Hard cap",     pro: "+$5/partner",  scale: "+$4/partner", enterprise: "Negotiated" },
  { name: "Commission rules",         free: "3",            pro: "15",           scale: "Unlimited",   enterprise: "Unlimited" },
  { name: "Internal users",           free: "2",            pro: "5",            scale: "15",          enterprise: "Unlimited" },
  { name: "Deal registrations",       free: "20/mo",        pro: true,           scale: true,          enterprise: true },
  { name: "Partner portal",           free: "Basic",        pro: "Branded",      scale: "Branded",     enterprise: "Full white-label" },
  { name: "Attribution model",        free: "Last-touch",   pro: "Multi-touch",  scale: "Multi-touch + custom", enterprise: "Custom" },
  { name: "Audit log retention",      free: "30 days",      pro: "90 days",      scale: "1 year",      enterprise: "Unlimited + export" },
  { name: "AI program setup",         free: true,           pro: true,           scale: true,          enterprise: "✓ + dedicated onboarding" },
  { name: "Reconciliation + payouts", free: "CSV export",   pro: true,           scale: "✓ + approval workflows", enterprise: "✓ + ERP integration" },
  { name: "Salesforce / HubSpot",     free: false,          pro: true,           scale: true,          enterprise: true },
  { name: "Webhooks + API",           free: false,          pro: false,          scale: true,          enterprise: true },
  { name: "SSO / SAML",              free: false,          pro: false,          scale: false,         enterprise: true },
  { name: "Multi-program",            free: false,          pro: false,          scale: "2 programs",  enterprise: "Unlimited" },
  { name: "Support",                  free: "Community",    pro: "Email (48h)",  scale: "Email (24h) + Slack", enterprise: "Dedicated CSM" },
  { name: "SOC 2 / DPA",             free: true,           pro: true,           scale: true,          enterprise: true },
];

const FAQS: FAQ[] = [
  {
    q: "What counts as an 'active partner'?",
    a: "Any partner with at least one deal, commission, or portal login in the current billing month. Archived or inactive partners don't count toward your limit.",
  },
  {
    q: "Is the free tier really free forever?",
    a: "Yes. No time limit, no credit card required. Free is capped at 5 partners and 3 commission rules — enough to run a real small referral program. You upgrade when your program grows, not before.",
  },
  {
    q: "What happens when I exceed my partner limit?",
    a: "On Pro, additional partners are $5/partner/mo (billed monthly). On Scale, $4/partner/mo. On Free, the 6th partner is blocked until you upgrade — we'll warn you at 4.",
  },
  {
    q: "Why is Salesforce gated to Pro?",
    a: "Salesforce sync requires ongoing API calls, field mapping maintenance, and support — it costs us real money to run. Pro at $99/mo is priced to make that worthwhile for both sides.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes, any time. Upgrades are prorated immediately. Downgrades take effect at the next billing date. Data is always preserved.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual billing saves ~20% (Pro: $79/mo, Scale: $279/mo). Contact us at billing@covant.ai to switch.",
  },
  {
    q: "What's included in Enterprise?",
    a: "Custom partner limits, SSO/SAML, unlimited programs, ERP payout integration, dedicated CSM, SLA, and a countersigned DPA. Starts around $1,200/mo depending on program size.",
  },
  {
    q: "Is there a setup fee or long-term contract?",
    a: "No setup fees on any plan. Free and Pro are month-to-month. Scale is month-to-month with optional annual discount. Enterprise is annual.",
  },
];

/* ── Component ── */
export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  async function handleCheckout(plan: "pro" | "scale") {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: "month" }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) router.push(data.url);
      else console.error("Checkout error:", data.error);
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, sans-serif" }}>

      {/* ── Nav ── */}
      <nav style={{ padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: "1.15rem", color: "#fff", textDecoration: "none" }}>Covant</Link>
        <Link href="/setup" style={{ background: "#fff", color: "#000", padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: ".85rem", textDecoration: "none" }}>Get Started Free</Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: "6rem 1.5rem 3rem", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20,
          background: "rgba(99,102,241,.12)", color: "#818cf8", fontSize: ".78rem",
          fontWeight: 600, marginBottom: 20, border: "1px solid rgba(99,102,241,.2)",
        }}>
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px" }}>
          Priced by partners,<br />not by seats.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.55)", maxWidth: 520, margin: "0 auto 12px", lineHeight: 1.7 }}>
          Start free with up to 5 partners. Pay more as your program grows — and earns more.
          No time-limited trials. No surprise overages.
        </p>
        <p style={{ fontSize: ".88rem", color: "#6b7280" }}>Annual billing saves ~20% · <a href="mailto:billing@covant.ai" style={{ color: "#6366f1" }}>Contact us to switch</a></p>
      </section>

      {/* ── Cards ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>

        {/* Free */}
        <PlanCard
          icon={<Rocket size={20} />}
          name="Free"
          price="$0"
          period=""
          description="Run a real partner program. No card required."
          partners="Up to 5 active partners"
          cta="Get Started Free"
          ctaAction={() => router.push("/setup")}
          loading={false}
          highlight={false}
          features={[
            "5 partners · 3 commission rules",
            "Partner portal (basic)",
            "20 deal registrations/mo",
            "Last-touch attribution",
            "CSV export",
            "30-day audit log",
            "AI program setup",
            "2 internal users",
          ]}
          missing={["Salesforce / HubSpot", "Multi-touch attribution", "Approval workflows"]}
        />

        {/* Pro */}
        <PlanCard
          icon={<Zap size={20} />}
          name="Pro"
          price="$99"
          period="/mo"
          description="Growing programs that need CRM sync and real attribution."
          partners="Up to 25 active partners"
          cta={loadingPlan === "pro" ? "Redirecting…" : "Start Pro"}
          ctaAction={() => handleCheckout("pro")}
          loading={loadingPlan === "pro"}
          highlight={true}
          badge="Most popular"
          features={[
            "25 partners (+$5/extra)",
            "15 commission rules",
            "Branded partner portal",
            "Unlimited deal registrations",
            "Multi-touch attribution",
            "Salesforce + HubSpot",
            "90-day audit log",
            "5 internal users",
            "Email support (48h)",
          ]}
          missing={["Webhooks + API", "Multi-program", "SSO / SAML"]}
        />

        {/* Scale */}
        <PlanCard
          icon={<Building2 size={20} />}
          name="Scale"
          price="$349"
          period="/mo"
          description="Complex programs with multiple partner types and approval workflows."
          partners="Up to 100 active partners"
          cta={loadingPlan === "scale" ? "Redirecting…" : "Start Scale"}
          ctaAction={() => handleCheckout("scale")}
          loading={loadingPlan === "scale"}
          highlight={false}
          features={[
            "100 partners (+$4/extra)",
            "Unlimited commission rules",
            "Custom attribution models",
            "Approval workflows",
            "Webhooks + full API",
            "2 separate programs",
            "1-year audit log",
            "15 internal users",
            "Slack + email (24h) support",
          ]}
          missing={["SSO / SAML", "ERP integration", "Dedicated CSM"]}
        />

        {/* Enterprise */}
        <PlanCard
          icon={<Crown size={20} />}
          name="Enterprise"
          price="Custom"
          period=""
          description="Unlimited programs, SSO, ERP payouts, and a dedicated CSM."
          partners="Unlimited partners"
          cta="Talk to Sales"
          ctaAction={() => window.location.href = "mailto:sales@covant.ai?subject=Enterprise inquiry"}
          loading={false}
          highlight={false}
          features={[
            "Unlimited partners (negotiated overage)",
            "Unlimited commission rules",
            "Full white-label portal",
            "Custom attribution models",
            "ERP payout integration",
            "Unlimited programs",
            "Unlimited audit log + export",
            "SSO / SAML",
            "Dedicated CSM + SLA",
            "Countersigned DPA",
          ]}
          missing={[]}
        />
      </section>

      {/* ── Feature comparison ── */}
      <section style={{ maxWidth: 900, margin: "0 auto 6rem", padding: "0 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2.5rem" }}>Full comparison</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontWeight: 500 }}>Feature</th>
                {["Free", "Pro", "Scale", "Enterprise"].map(h => (
                  <th key={h} style={{ textAlign: "center", padding: "10px 12px", color: h === "Pro" ? "#818cf8" : "#aaa", fontWeight: h === "Pro" ? 700 : 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.name} style={{ borderBottom: "1px solid #111", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.015)" }}>
                  <td style={{ padding: "10px 12px", color: "#e5e5e5" }}>{f.name}</td>
                  {([f.free, f.pro, f.scale, f.enterprise] as (string | boolean)[]).map((v, ci) => (
                    <td key={ci} style={{ textAlign: "center", padding: "10px 12px" }}>
                      {v === true ? <Check size={14} color="#10b981" style={{ margin: "0 auto" }} /> :
                       v === false ? <X size={14} color="#333" style={{ margin: "0 auto" }} /> :
                       <span style={{ color: "#aaa", fontSize: ".8rem" }}>{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 680, margin: "0 auto 6rem", padding: "0 1.5rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Common questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "1rem 0", cursor: "pointer", display: "flex", justifyContent: "space-between",
                  alignItems: "center", gap: 16, color: "#fff", fontFamily: "inherit",
                  fontSize: ".9rem", fontWeight: 500,
                }}
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
              </button>
              {openFaq === i && (
                <p style={{ margin: "0 0 1rem", color: "#aaa", fontSize: ".88rem", lineHeight: 1.7 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ textAlign: "center", padding: "4rem 1.5rem 6rem", borderTop: "1px solid #111" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 12 }}>Start free. No credit card.</h2>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>Up to 5 partners, forever. Upgrade when your program grows.</p>
        <Link href="/setup" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#fff", color: "#000", padding: "14px 28px",
          borderRadius: 8, fontWeight: 700, fontSize: "1rem", textDecoration: "none",
        }}>
          Get Started Free <ArrowRight size={16} />
        </Link>
        <p style={{ marginTop: 16, fontSize: ".85rem", color: "#444" }}>
          Enterprise? <a href="mailto:sales@covant.ai" style={{ color: "#6366f1" }}>Talk to sales →</a>
        </p>
      </section>

    </div>
  );
}

/* ── PlanCard ── */
function PlanCard({
  icon, name, price, period, description, partners, cta, ctaAction, loading, highlight, badge, features, missing
}: {
  icon: React.ReactNode; name: string; price: string; period: string;
  description: string; partners: string; cta: string; ctaAction: () => void;
  loading: boolean; highlight: boolean; badge?: string;
  features: string[]; missing: string[];
}) {
  return (
    <div style={{
      background: highlight ? "rgba(99,102,241,.06)" : "#0d0d0d",
      border: `1px solid ${highlight ? "rgba(99,102,241,.4)" : "#1f1f1f"}`,
      borderRadius: 14, padding: "1.75rem", display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {badge && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "#6366f1", color: "#fff", fontSize: ".72rem", fontWeight: 700,
          padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap",
        }}>{badge}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: highlight ? "#818cf8" : "#aaa" }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>{name}</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff" }}>{price}</span>
        {period && <span style={{ color: "#6b7280", fontSize: ".9rem" }}>{period}</span>}
      </div>
      <p style={{ fontSize: ".78rem", color: "#6b7280", margin: "0 0 4px" }}>{partners}</p>
      <p style={{ fontSize: ".83rem", color: "#888", margin: "0 0 20px", lineHeight: 1.5 }}>{description}</p>

      <button
        onClick={ctaAction}
        disabled={loading}
        style={{
          width: "100%", padding: "11px 0", borderRadius: 8, fontWeight: 600,
          fontSize: ".88rem", cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
          border: highlight ? "none" : "1px solid #333",
          background: highlight ? "#6366f1" : "transparent",
          color: highlight ? "#fff" : "#e5e5e5",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          marginBottom: "1.5rem", transition: "opacity .15s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
        {cta}
      </button>

      <div style={{ flex: 1 }}>
        {features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <Check size={13} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: ".82rem", color: "#ccc", lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
        {missing.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <X size={13} color="#333" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: ".82rem", color: "#444", lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
