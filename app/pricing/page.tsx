"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Building2,
  Rocket,
  Crown,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ── Types ── */
interface Plan {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number | null;
  priceAnnual: number | null;
  priceLabel?: string;
  description: string;
  cta: string;
  ctaHref: string;
  popular?: boolean;
  features: { name: string; included: boolean; note?: string }[];
}

interface FAQ {
  q: string;
  a: string;
}

/* ── Data ── */
const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: <Rocket size={22} />,
    price: 299,
    priceAnnual: 249,
    description: "For companies launching their first partner program",
    cta: "Start Free Trial",
    ctaHref: "/setup",
    features: [
      { name: "Up to 50 partners", included: true },
      { name: "Basic attribution tracking", included: true },
      { name: "Commission automation", included: true },
      { name: "Partner portal", included: true },
      { name: "Referral link tracking", included: true },
      { name: "Email notifications", included: true },
      { name: "CSV export", included: true },
      { name: "Multi-touch attribution", included: false },
      { name: "Revenue forecasting", included: false },
      { name: "Custom commission tiers", included: false },
      { name: "API access", included: false },
      { name: "SSO / SAML", included: false },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    icon: <Zap size={22} />,
    price: 799,
    priceAnnual: 649,
    description: "For scaling programs with advanced attribution needs",
    cta: "Start Free Trial",
    ctaHref: "/setup",
    popular: true,
    features: [
      { name: "Up to 500 partners", included: true },
      { name: "Multi-touch attribution", included: true },
      { name: "Commission automation", included: true },
      { name: "Partner portal", included: true },
      { name: "Referral link tracking", included: true },
      { name: "Revenue forecasting", included: true },
      { name: "Custom commission tiers", included: true },
      { name: "Cohort analytics", included: true },
      { name: "API access", included: true },
      { name: "CRM integrations", included: true, note: "Salesforce, HubSpot" },
      { name: "Slack & Teams alerts", included: true },
      { name: "SSO / SAML", included: false },
      { name: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: <Crown size={22} />,
    price: null,
    priceAnnual: null,
    priceLabel: "Custom",
    description: "For large programs with complex partner ecosystems",
    cta: "Contact Sales",
    ctaHref: "/partners/apply",
    features: [
      { name: "Unlimited partners", included: true },
      { name: "Multi-touch attribution", included: true },
      { name: "Commission automation", included: true },
      { name: "Partner portal (white-label)", included: true },
      { name: "Referral link tracking", included: true },
      { name: "Revenue forecasting", included: true },
      { name: "Custom commission tiers", included: true },
      { name: "Cohort analytics", included: true },
      { name: "API access", included: true },
      { name: "All integrations", included: true },
      { name: "SSO / SAML", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom SLA & onboarding", included: true },
    ],
  },
];

const FAQS: FAQ[] = [
  { q: "How long is the free trial?", a: "14 days, full access, no credit card required. You can upgrade or cancel anytime during the trial." },
  { q: "Can I switch plans later?", a: "Yes — upgrade or downgrade at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. Downgrades take effect at the next billing date." },
  { q: "What counts as a 'partner'?", a: "Any active partner account in your program. Inactive or archived partners don't count toward your limit." },
  { q: "Do you support international payouts?", a: "Yes. We support ACH, wire transfers, and PayPal in 40+ currencies. Enterprise plans include custom payout rails." },
  { q: "What integrations are included?", a: "Growth plans include Salesforce, HubSpot, Stripe, and Slack. Enterprise includes custom integrations via our API and webhooks." },
  { q: "Is there a setup fee?", a: "No setup fees on any plan. Enterprise customers get complimentary white-glove onboarding." },
  { q: "How does attribution tracking work?", a: "Covant uses first-touch, last-touch, and multi-touch models. We track partner referral links, UTM parameters, and CRM deal data to attribute revenue accurately." },
  { q: "Can I cancel anytime?", a: "Yes. No long-term contracts on Starter or Growth. Enterprise contracts are annual but include an early-exit clause." },
];

/* ── Component ── */
export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      {/* Hero */}
      <section style={{ padding: "8rem 1.5rem 4rem", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20,
          background: "rgba(99,102,241,.15)", color: "#818cf8", fontSize: ".78rem",
          fontWeight: 600, marginBottom: 16, border: "1px solid rgba(99,102,241,.25)",
        }}>
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 16px" }}>
          Pay for what you use.<br />Scale when you&apos;re ready.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,.55)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Every plan includes commission automation, partner portal, and attribution tracking. No hidden fees. 14-day free trial on all plans.
        </p>

        {/* Billing toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "4px 6px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}>
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: "8px 20px", borderRadius: 8, fontSize: ".85rem", fontWeight: 600,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: !annual ? "#fff" : "transparent",
              color: !annual ? "#000" : "rgba(255,255,255,.5)",
              transition: "all .2s",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: "8px 20px", borderRadius: 8, fontSize: ".85rem", fontWeight: 600,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: annual ? "#fff" : "transparent",
              color: annual ? "#000" : "rgba(255,255,255,.5)",
              transition: "all .2s",
            }}
          >
            Annual
            <span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 6, background: "#22c55e", color: "#fff", fontSize: ".65rem", fontWeight: 700 }}>
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Plan Cards */}
      <section style={{ padding: "0 1.5rem 6rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
          {PLANS.map((plan) => {
            const price = annual ? plan.priceAnnual : plan.price;
            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: 16,
                  border: plan.popular ? "2px solid #6366f1" : "1px solid rgba(255,255,255,.1)",
                  background: plan.popular ? "rgba(99,102,241,.06)" : "rgba(255,255,255,.03)",
                  padding: 32,
                  position: "relative",
                  transition: "transform .2s, box-shadow .2s",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", borderRadius: 20, background: "#6366f1", color: "#fff",
                    fontSize: ".72rem", fontWeight: 700, letterSpacing: ".03em",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: plan.popular ? "#818cf8" : "rgba(255,255,255,.4)" }}>{plan.icon}</span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>{plan.name}</h3>
                </div>
                <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,.45)", marginBottom: 20, lineHeight: 1.5 }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: 24 }}>
                  {price !== null ? (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: "2.8rem", fontWeight: 800 }}>${price}</span>
                      <span style={{ fontSize: ".9rem", color: "rgba(255,255,255,.4)" }}>/mo</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>{plan.priceLabel}</div>
                  )}
                  {annual && price !== null && (
                    <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.35)", marginTop: 2 }}>
                      Billed annually (${price * 12}/yr)
                    </div>
                  )}
                </div>

                <Link
                  href={plan.ctaHref}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: ".9rem",
                    textDecoration: "none", marginBottom: 24, transition: "opacity .2s",
                    background: plan.popular ? "#6366f1" : "#fff",
                    color: plan.popular ? "#fff" : "#000",
                  }}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>

                <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 20 }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: ".82rem" }}>
                      {f.included ? (
                        <Check size={15} color="#22c55e" style={{ flexShrink: 0 }} />
                      ) : (
                        <X size={15} color="rgba(255,255,255,.15)" style={{ flexShrink: 0 }} />
                      )}
                      <span style={{ color: f.included ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.25)" }}>
                        {f.name}
                        {f.note && <span style={{ color: "rgba(255,255,255,.3)", marginLeft: 4 }}>({f.note})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <p style={{ textAlign: "center", marginTop: 32, fontSize: ".82rem", color: "rgba(255,255,255,.35)" }}>
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </p>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 900, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "center", marginBottom: 32 }}>
          Compare Plans
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: 700, color: "rgba(255,255,255,.5)" }}>Feature</th>
                {PLANS.map((p) => (
                  <th key={p.id} style={{ textAlign: "center", padding: "12px 10px", fontWeight: 700 }}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Partners", values: ["50", "500", "Unlimited"] },
                { feature: "Attribution Model", values: ["First/Last touch", "Multi-touch", "Multi-touch + Custom"] },
                { feature: "Commission Automation", values: ["✓", "✓", "✓"] },
                { feature: "Partner Portal", values: ["✓", "✓", "White-label"] },
                { feature: "Revenue Forecasting", values: ["—", "✓", "✓"] },
                { feature: "Cohort Analytics", values: ["—", "✓", "✓"] },
                { feature: "API Access", values: ["—", "✓", "✓"] },
                { feature: "Integrations", values: ["—", "Core CRMs", "All + Custom"] },
                { feature: "SSO / SAML", values: ["—", "—", "✓"] },
                { feature: "Support", values: ["Email", "Priority email", "Dedicated AM"] },
                { feature: "SLA", values: ["—", "99.9%", "Custom"] },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  <td style={{ padding: "10px", fontWeight: 600 }}>{row.feature}</td>
                  {row.values.map((v, j) => (
                    <td key={j} style={{ padding: "10px", textAlign: "center", color: v === "—" ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.7)" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "4rem 1.5rem 6rem", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
          <HelpCircle size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />
          Frequently Asked Questions
        </h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.4)", fontSize: ".85rem", marginBottom: 32 }}>
          Can&apos;t find what you&apos;re looking for? <Link href="/portal/support" style={{ color: "#818cf8" }}>Contact us</Link>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.08)",
                background: openFaq === i ? "rgba(255,255,255,.04)" : "transparent",
                overflow: "hidden",
                transition: "background .2s",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", color: "#fff", fontSize: ".9rem", fontWeight: 600, textAlign: "left",
                }}
              >
                {faq.q}
                {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 16px", fontSize: ".85rem", color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 1.5rem 6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
          Ready to automate your partner payouts?
        </h2>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: "1rem", marginBottom: 24 }}>
          Start your 14-day free trial. No credit card required.
        </p>
        <Link
          href="/setup"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 10, background: "#6366f1", color: "#fff",
            fontWeight: 700, fontSize: "1rem", textDecoration: "none",
          }}
        >
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
