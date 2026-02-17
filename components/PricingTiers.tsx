"use client";

import { useState } from "react";

export default function PricingTiers() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const annual = billing === "annual";

  const tiers = [
    {
      name: "Starter",
      monthly: 49,
      description: "For small teams getting started with partner attribution",
      features: [
        "Up to 5 partners",
        "Basic deal attribution",
        "Simple commission payouts",
        "Partner directory & contacts",
        "Email support",
        "14-day free trial"
      ],
      cta: "Start free trial",
      href: "/dashboard",
      popular: false
    },
    {
      name: "Professional",
      monthly: 199,
      description: "For growing partner programs that need real intelligence",
      features: [
        "Up to 25 partners",
        "5 AI attribution models",
        "Partner self-service portal",
        "Automated payout scheduling",
        "Custom commission structures",
        "Priority email support",
        "API access"
      ],
      cta: "Start free trial",
      href: "/dashboard",
      popular: true
    },
    {
      name: "Business",
      monthly: 499,
      description: "For mature partner ecosystems with complex programs",
      features: [
        "Unlimited partners",
        "Custom attribution models",
        "White-label partner portal",
        "Multi-currency payouts",
        "Advanced API & webhooks",
        "Salesforce managed package",
        "Slack/Discord support",
        "Quarterly business reviews"
      ],
      cta: "Start free trial",
      href: "/dashboard",
      popular: false
    },
    {
      name: "Enterprise",
      monthly: null,
      description: "For complex multi-tier programs at scale",
      features: [
        "Everything in Business, plus:",
        "SSO (SAML, OIDC)",
        "Custom SLAs & uptime guarantee",
        "Dedicated Customer Success Manager",
        "Multi-tenancy",
        "Custom integrations",
        "On-premise deployment option",
        "Legal & security review support"
      ],
      cta: "Contact sales",
      href: "mailto:sales@partnerbase.app",
      popular: false
    }
  ];

  function formatPrice(monthly: number | null): string {
    if (monthly === null) return "Custom";
    if (annual) return `$${Math.round(monthly * 0.8)}`;
    return `$${monthly}`;
  }

  return (
    <section className="pricing-section" id="pricing">
      <div className="wrap">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p className="subtitle">Start free. Scale as you grow. No hidden fees.</p>
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
          {annual && (
            <span style={{ fontSize: ".8rem", color: "#10b981", fontWeight: 600 }}>
              ✓ Save 20% with annual billing
            </span>
          )}
          {!annual && (
            <span style={{ fontSize: ".8rem", color: "#a0a0a0" }}>
              Save 20% with annual billing →
            </span>
          )}
        </div>

        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card ${tier.popular ? 'popular' : ''}`}
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
                  <p style={{ fontSize: ".8rem", color: "#a0a0a0", marginBottom: ".5rem" }}>
                    was ${tier.monthly}/mo
                  </p>
                )}
                <p className="tier-description">{tier.description}</p>
              </div>

              <ul className="features">
                {tier.features.map((feature, i) => (
                  <li key={i}>
                    {feature.endsWith(':') ? (
                      <strong>{feature}</strong>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {feature}
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`tier-cta ${tier.popular ? 'primary' : 'secondary'}`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p>💳 All plans include 14-day free trial · No credit card required</p>
          <p>🔒 SOC 2 Type II in progress (target Q2 2026) · Your data is never used to train models</p>
          <p style={{ marginTop: ".5rem" }}>
            Need a custom plan?{" "}
            <a href="mailto:sales@partnerbase.app" style={{ color: "#a0a0a0", textDecoration: "underline" }}>
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

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #fff;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #a0a0a0;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .pricing-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          border-color: #333;
          transform: translateY(-4px);
        }

        .pricing-card.popular {
          border-color: #fff;
          background: #141414;
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          color: #000;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .tier-header {
          margin-bottom: 1.5rem;
        }

        .tier-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #a0a0a0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .price {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .amount {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1;
          color: #fff;
        }

        .period {
          font-size: 0.875rem;
          color: #555;
        }

        .tier-description {
          color: #666;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex: 1;
          border-top: 1px solid #1a1a1a;
          padding-top: 1.25rem;
        }

        .features li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.65rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #ccc;
        }

        .features li svg {
          flex-shrink: 0;
          margin-top: 0.25rem;
          color: #10b981;
        }

        .features li strong {
          display: block;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
          color: #fff;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tier-cta {
          display: block;
          text-align: center;
          padding: 0.875rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .tier-cta.primary {
          background: #fff;
          color: #000;
        }

        .tier-cta.primary:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }

        .tier-cta.secondary {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #aaa;
        }

        .tier-cta.secondary:hover {
          border-color: #555;
          color: #fff;
        }

        .pricing-footer {
          text-align: center;
          font-size: 0.875rem;
          color: #555;
          border-top: 1px solid #1a1a1a;
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
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}
