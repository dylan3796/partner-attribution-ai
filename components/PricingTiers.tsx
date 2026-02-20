"use client";

import { useState } from "react";

export default function PricingTiers() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const annual = billing === "annual";

  const tiers = [
    {
      name: "Launch",
      monthly: 299,
      basis: "Up to $1M tracked partner ARR",
      partnerLimit: 10,
      description: "For teams launching their first structured partner program",
      features: [
        "Up to 10 partners",
        "Core attribution engine",
        "5 AI attribution models",
        "Basic partner portal",
        "Email support",
        "14-day free trial"
      ],
      cta: "Get Early Access",
      href: "/dashboard",
      popular: false
    },
    {
      name: "Scale",
      monthly: 799,
      basis: "Up to $10M tracked partner ARR",
      partnerLimit: 50,
      description: "For growing programs that need real intelligence and automation",
      features: [
        "Up to 50 partners",
        "Custom attribution rules",
        "Commission automation",
        "MDF management",
        "Partner self-service portal",
        "Slack integration",
        "Priority support"
      ],
      cta: "Get Early Access",
      href: "/dashboard",
      popular: true
    },
    {
      name: "Program",
      monthly: 1999,
      basis: "Up to $50M tracked partner ARR",
      partnerLimit: null,
      description: "For mature ecosystems running complex, multi-tier programs",
      features: [
        "Unlimited partners",
        "Everything in Scale, plus:",
        "Custom AI attribution models",
        "SPIF builder",
        "Volume rebate management",
        "White-label partner portal",
        "Dedicated CSM",
        "API access & webhooks"
      ],
      cta: "Get Early Access",
      href: "/dashboard",
      popular: false
    },
    {
      name: "Enterprise",
      monthly: null,
      basis: "$50M+ tracked partner ARR",
      partnerLimit: null,
      description: "For complex global programs with security, compliance, and scale requirements",
      features: [
        "Everything in Program, plus:",
        "SSO / SAML / OIDC",
        "Custom integrations",
        "Enterprise SLA & uptime guarantee",
        "On-premise deployment option",
        "Multi-currency payouts",
        "Dedicated infrastructure",
        "Legal & security review support"
      ],
      cta: "Contact sales",
      href: "mailto:sales@covant.ai",
      popular: false
    }
  ];

  function monthlyPrice(monthly: number | null): number | null {
    if (monthly === null) return null;
    return annual ? Math.round(monthly * 0.8) : monthly;
  }

  function formatPrice(monthly: number | null): string {
    if (monthly === null) return "Custom";
    const p = monthlyPrice(monthly)!;
    return `$${p.toLocaleString("en-US")}`;
  }

  function annualTotal(monthly: number): string {
    return `$${Math.round(monthly * 0.8 * 12).toLocaleString("en-US")}/yr`;
  }

  return (
    <section className="pricing-section" id="pricing">
      <div className="wrap">
        <div className="section-header">
          <div className="section-eyebrow">Pricing</div>
          <h2>Priced on the value you track,<br />not the seats you buy</h2>
          <p className="subtitle">
            Pay based on your tracked partner ARR — not partner count or users.
            Grow your program without watching a seat counter.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="pricing-toggle">
          <div className="pricing-toggle-pill">
            <button
              className={`pricing-toggle-btn ${!annual ? "active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`pricing-toggle-btn ${annual ? "active" : ""}`}
              onClick={() => setBilling("annual")}
            >
              Annual
            </button>
          </div>
          {annual ? (
            <span className="toggle-badge save">✓ Save 20% with annual billing</span>
          ) : (
            <span className="toggle-badge hint">Switch to annual and save 20% →</span>
          )}
        </div>

        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card ${tier.popular ? "popular" : ""}`}
            >
              {tier.popular && <div className="popular-badge">Most Popular</div>}

              <div className="tier-header">
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="amount">{formatPrice(tier.monthly)}</span>
                  {tier.monthly !== null && (
                    <span className="period">/mo{annual ? " · billed annually" : ""}</span>
                  )}
                </div>
                {annual && tier.monthly !== null && (
                  <p className="annual-total">{annualTotal(tier.monthly)} total</p>
                )}
                {!annual && tier.monthly !== null && (
                  <p className="annual-hint">or {annualTotal(tier.monthly)} billed annually</p>
                )}
                <div className="arr-basis">{tier.basis}</div>
                <p className="tier-description">{tier.description}</p>
              </div>

              <ul className="features">
                {tier.features.map((feature, i) => (
                  <li key={i}>
                    {feature.endsWith(":") ? (
                      <strong>{feature}</strong>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M13.5 4L6 11.5L2.5 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`tier-cta ${tier.popular ? "primary" : "secondary"}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Portal seat pricing note */}
        <div className="pricing-addons">
          <div className="addon-note">
            <span className="addon-icon">🏢</span>
            <div>
              <strong>Partner portal seats</strong> — Included for up to your tier's partner
              limit. Additional portal seats: <strong>$9/partner/month</strong>.
            </div>
          </div>
          <div className="addon-note">
            <span className="addon-icon">🤖</span>
            <div>
              <strong>AI credits</strong> — All plans include <strong>500 AI credits/month</strong>.
              Additional credits: <strong>$0.01/credit</strong>. Credits power Ask Covant,
              smart attribution recommendations, and partner matching.
            </div>
          </div>
        </div>

        <div className="pricing-footer">
          <p>💳 All plans include 14-day free trial · No credit card required</p>
          <p>🔒 SOC 2 Type II in progress (target Q2 2026) · Your data is never used to train models</p>
          <p style={{ marginTop: ".5rem" }}>
            Need a custom plan?{" "}
            <a href="mailto:sales@covant.ai" style={{ color: "#a0a0a0", textDecoration: "underline" }}>
              Talk to sales
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .pricing-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #555;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 2.75rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #fff;
          line-height: 1.15;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #666;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .pricing-toggle {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .pricing-toggle-pill {
          display: flex;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 3px;
        }

        .pricing-toggle-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #666;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pricing-toggle-btn.active {
          background: #fff;
          color: #000;
          font-weight: 600;
        }

        .toggle-badge {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .toggle-badge.save {
          color: #10b981;
        }

        .toggle-badge.hint {
          color: #555;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          align-items: start;
        }

        .pricing-card {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          border-color: #2a2a2a;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .pricing-card.popular {
          border-color: #fff;
          background: #111;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .popular-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          color: #000;
          padding: 0.3rem 1.1rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .tier-header {
          margin-bottom: 1.5rem;
        }

        .tier-header h3 {
          font-size: 0.75rem;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .pricing-card.popular .tier-header h3 {
          color: #aaa;
        }

        .price {
          margin-bottom: 0.25rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          color: #fff;
          letter-spacing: -0.03em;
        }

        .period {
          font-size: 0.875rem;
          color: #444;
        }

        .annual-total {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .annual-hint {
          font-size: 0.75rem;
          color: #444;
          margin-bottom: 0.75rem;
        }

        .arr-basis {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #555;
          background: #1a1a1a;
          border: 1px solid #222;
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
          margin-bottom: 0.75rem;
        }

        .pricing-card.popular .arr-basis {
          background: #1e1e1e;
          border-color: #333;
          color: #777;
        }

        .tier-description {
          color: #555;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex: 1;
          border-top: 1px solid #1a1a1a;
          padding-top: 1.25rem;
        }

        .pricing-card.popular .features {
          border-top-color: #222;
        }

        .features li {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          margin-bottom: 0.6rem;
          font-size: 0.85rem;
          line-height: 1.45;
          color: #aaa;
        }

        .features li svg {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: #10b981;
        }

        .features li strong {
          display: block;
          margin-top: 0.6rem;
          margin-bottom: 0.25rem;
          color: #fff;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tier-cta {
          display: block;
          text-align: center;
          padding: 0.875rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
          margin-top: auto;
        }

        .tier-cta.primary {
          background: #fff;
          color: #000;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
        }

        .tier-cta.primary:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }

        .tier-cta.secondary {
          background: transparent;
          border: 1px solid #222;
          color: #777;
        }

        .tier-cta.secondary:hover {
          border-color: #444;
          color: #fff;
        }

        /* Add-on notes */
        .pricing-addons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding: 1.5rem 2rem;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
        }

        .addon-note {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }

        .addon-note strong {
          color: #aaa;
        }

        .addon-icon {
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }

        .pricing-footer {
          text-align: center;
          font-size: 0.875rem;
          color: #444;
          border-top: 1px solid #111;
          padding-top: 2rem;
        }

        .pricing-footer p {
          margin: 0.4rem 0;
        }

        @media (max-width: 1200px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 1.85rem;
          }

          .pricing-addons {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
