"use client";

export default function PricingTiers() {
  const tiers = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small teams getting started",
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
      price: "$199",
      period: "/month",
      description: "For growing partner programs",
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
      price: "$499",
      period: "/month",
      description: "For mature partner ecosystems",
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
      price: "Custom",
      period: "",
      description: "For complex multi-tier programs",
      features: [
        "Everything in Business, plus:",
        "SSO (SAML, OIDC)",
        "Custom SLAs",
        "Dedicated CSM",
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

  return (
    <section className="pricing-section" id="pricing">
      <div className="wrap">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p className="subtitle">Start free. Scale as you grow. No hidden fees.</p>
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
                  <span className="amount">{tier.price}</span>
                  {tier.period && <span className="period">{tier.period}</span>}
                </div>
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
          <p>💳 All plans include 14-day free trial • No credit card required</p>
          <p>🔒 SOC 2 Type II in progress (target Q2 2026) • Your data is never used to train models</p>
        </div>
      </div>

      <style jsx>{`
        .pricing-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #a0a0a0;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .pricing-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
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
          background: #1a1a1a;
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
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tier-header {
          margin-bottom: 2rem;
        }

        .tier-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .price {
          margin-bottom: 1rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
        }

        .period {
          font-size: 1rem;
          color: #666;
          margin-left: 0.25rem;
        }

        .tier-description {
          color: #a0a0a0;
          font-size: 0.875rem;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          flex: 1;
        }

        .features li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .features li svg {
          flex-shrink: 0;
          margin-top: 0.25rem;
          color: #10b981;
        }

        .features li strong {
          display: block;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .tier-cta {
          display: block;
          text-align: center;
          padding: 0.875rem;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .tier-cta.primary {
          background: #fff;
          color: #000;
        }

        .tier-cta.primary:hover {
          background: #f0f0f0;
        }

        .tier-cta.secondary {
          background: transparent;
          border: 1px solid #333;
          color: #fff;
        }

        .tier-cta.secondary:hover {
          border-color: #fff;
          background: #1a1a1a;
        }

        .pricing-footer {
          text-align: center;
          font-size: 0.875rem;
          color: #666;
        }

        .pricing-footer p {
          margin: 0.5rem 0;
        }

        @media (max-width: 1200px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
