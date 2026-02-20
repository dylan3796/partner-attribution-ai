"use client";

import Link from "next/link";
import { useState } from "react";

const COMPANY_NAME = "Covant";

const tiers = [
  {
    name: "Bronze",
    icon: "🥉",
    color: "#cd7f32",
    requirement: "1+ deal/quarter",
    commission: "10%",
    benefits: ["Partner portal access", "Deal registration", "Marketing resources", "Email support"],
    featured: false,
  },
  {
    name: "Silver",
    icon: "🥈",
    color: "#c0c0c0",
    requirement: "3+ deals/quarter or $50k revenue",
    commission: "12%",
    benefits: ["All Bronze benefits", "Co-branded collateral", "Quarterly business reviews", "Priority support"],
    featured: false,
  },
  {
    name: "Gold",
    icon: "🥇",
    color: "#ffd700",
    requirement: "8+ deals/quarter or $150k revenue",
    commission: "15%",
    benefits: ["All Silver benefits", "Co-sell support", "MDF budget ($5k/quarter)", "Partner success manager"],
    featured: false,
  },
  {
    name: "Platinum",
    icon: "💎",
    color: "#e5e4e2",
    requirement: "15+ deals/quarter or $300k revenue",
    commission: "20%",
    benefits: ["All Gold benefits", "Dedicated partner manager", "MDF budget ($15k/quarter)", "Executive sponsor", "Joint marketing campaigns", "Early access to new features"],
    featured: true,
  },
];

const steps = [
  { icon: "📝", title: "Apply", description: "Fill out a simple application form. Takes about 5 minutes." },
  { icon: "✅", title: "Get Approved", description: "Our team reviews and approves qualified partners within 48 hours." },
  { icon: "🚀", title: "Start Selling", description: "Access your portal, register deals, and get full co-sell support." },
  { icon: "💰", title: "Get Paid", description: "Commissions calculated automatically. Paid monthly, on time, every time." },
];

const faqs = [
  {
    question: "How do I register a deal?",
    answer: "Simply log into your partner portal and click 'Register Deal'. Enter the customer details and opportunity information. Deals are typically approved within 24 hours, giving you protection and credit for the opportunity.",
  },
  {
    question: "When do I get paid?",
    answer: "Commissions are calculated automatically when a deal closes and paid out monthly. Most partners receive payment within 30 days of deal closure. You can track pending commissions in your portal in real-time.",
  },
  {
    question: "How is attribution calculated?",
    answer: "We use transparent, rules-based attribution. The partner who registers the deal gets primary credit. If multiple partners contribute, we use role-based attribution that you can see and verify in your portal.",
  },
  {
    question: "What support do I get?",
    answer: "All partners get access to marketing resources, product documentation, and email support. Silver and above get dedicated training, co-branded materials, and priority support. Gold and Platinum partners get a dedicated partner success manager.",
  },
  {
    question: "Can I see my commission before the deal closes?",
    answer: "Yes! Your partner portal shows projected commissions for all active deals in real-time. As deals progress through stages, you'll see updated estimates based on deal value and your current tier.",
  },
  {
    question: "How do I move up to a higher tier?",
    answer: "Tier status is evaluated quarterly based on your performance. Your portal shows your current progress toward the next tier, including deals closed and revenue generated. Hit the threshold and you'll automatically be upgraded.",
  },
];

export default function ProgramPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: "4rem" }}>
        <div className="wrap">
          <div className="tag">Partner Program</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            Partner with {COMPANY_NAME}
          </h1>
          <p className="subtitle" style={{ maxWidth: 700, margin: "0 auto 2rem" }}>
            Join our partner program and earn competitive commissions on every deal you close.
            Get the support, resources, and visibility you need to grow.
          </p>

          <Link href="/setup" className="btn btn-lg" style={{ textDecoration: "none" }}>
            Apply to become a partner →
          </Link>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            {[
              "4 partner tiers",
              "Up to 20% commission",
              "Paid monthly",
              "15 min onboarding",
            ].map((stat, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontSize: ".9rem",
                  color: "var(--muted)",
                }}
              >
                <span style={{ color: "#818cf8", fontSize: ".75rem" }}>●</span>
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section style={{ padding: "5rem 0", background: "rgba(255,255,255,.02)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="tag">Why Partner With Us</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.02em" }}>
              Everything you need to succeed
            </h2>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💰</div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.2rem" }}>
                Competitive commissions
              </h3>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Earn 10-20% on every closed deal, with accelerators for high performers.
                The more you sell, the more you earn.
              </p>
            </div>

            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤝</div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.2rem" }}>
                Full co-sell support
              </h3>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Dedicated partner success manager, co-branded materials, and joint selling support
                to help you close more deals.
              </p>
            </div>

            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📊</div>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.2rem" }}>
                Real-time visibility
              </h3>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                See your pipeline, commissions, and tier progress in your partner portal 24/7.
                No surprises, full transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section style={{ padding: "5rem 0" }}>
        <div className="wrap-wide">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="tag">Partner Tiers</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.02em" }}>
              Grow with us
            </h2>
            <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 600, margin: ".75rem auto 0" }}>
              Start at any tier and unlock more benefits as you scale. Progress is tracked automatically.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="card"
                style={{
                  padding: "2rem",
                  position: "relative",
                  border: tier.featured ? "2px solid #818cf8" : "1px solid var(--card-border)",
                  background: tier.featured ? "linear-gradient(180deg, rgba(129,140,248,.08) 0%, var(--card-bg) 100%)" : "var(--card-bg)",
                  transform: tier.featured ? "scale(1.02)" : "none",
                  boxShadow: tier.featured ? "0 8px 40px rgba(129,140,248,.15)" : "none",
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#818cf8",
                      color: "#fff",
                      padding: ".3rem 1rem",
                      borderRadius: 20,
                      fontSize: ".7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "2.5rem" }}>{tier.icon}</span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: ".5rem", color: tier.color }}>
                    {tier.name}
                  </h3>
                </div>

                <div
                  style={{
                    background: "var(--subtle)",
                    borderRadius: 12,
                    padding: "1rem",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {tier.commission}
                  </div>
                  <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: ".25rem" }}>
                    commission rate
                  </div>
                </div>

                <div style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--fg)" }}>Requirements:</strong> {tier.requirement}
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {tier.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: ".5rem",
                        fontSize: ".875rem",
                        color: "var(--muted)",
                        marginBottom: ".5rem",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: ".15rem" }}>
                        <path d="M13.5 4L6 11.5L2.5 8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "5rem 0", background: "rgba(255,255,255,.02)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="tag">How It Works</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.02em" }}>
              Get started in 4 simple steps
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2rem",
            }}
          >
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 40,
                      left: "60%",
                      right: "-40%",
                      height: 2,
                      background: "linear-gradient(90deg, var(--border) 0%, transparent 100%)",
                      display: "none",
                    }}
                    className="step-connector"
                  />
                )}

                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--subtle)",
                    border: "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    margin: "0 auto 1rem",
                    position: "relative",
                  }}
                >
                  {step.icon}
                  <span
                    style={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#818cf8",
                      color: "#fff",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 style={{ fontWeight: 700, marginBottom: ".5rem", fontSize: "1.1rem" }}>
                  {step.title}
                </h3>
                <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "5rem 0" }}>
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="tag">FAQ</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.02em" }}>
              Frequently asked questions
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color .2s",
                  borderColor: openFaq === i ? "rgba(129,140,248,.5)" : "var(--card-border)",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.25rem 1.5rem",
                    gap: "1rem",
                  }}
                >
                  <h3 style={{ fontWeight: 600, fontSize: "1rem", margin: 0 }}>
                    {faq.question}
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform .2s",
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div
                  style={{
                    maxHeight: openFaq === i ? 500 : 0,
                    overflow: "hidden",
                    transition: "max-height .3s ease",
                  }}
                >
                  <p
                    style={{
                      padding: "0 1.5rem 1.25rem",
                      color: "var(--muted)",
                      fontSize: ".95rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta" style={{ background: "linear-gradient(180deg, var(--bg) 0%, #111 100%)" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-.02em" }}>
            Ready to grow together?
          </h2>
          <p className="subtitle" style={{ maxWidth: 600, margin: "1rem auto 2.5rem" }}>
            Join {COMPANY_NAME}&apos;s partner program and start earning competitive commissions today.
            Our team will have you set up in 15 minutes.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/setup" className="btn btn-lg" style={{ textDecoration: "none" }}>
              Apply to become a partner →
            </Link>
            <Link href="/portal" className="btn-outline btn-lg" style={{ textDecoration: "none" }}>
              View partner portal demo
            </Link>
          </div>

          <p className="muted" style={{ marginTop: "1.5rem", fontSize: ".85rem" }}>
            Questions? Reach out at{" "}
            <a href="mailto:partners@covant.ai" style={{ color: "#818cf8", textDecoration: "underline" }}>
              partners@covant.ai
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="wrap-wide footer-grid">
          <div>
            <span className="logo" style={{ color: "black" }}>{COMPANY_NAME}</span>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".8rem", lineHeight: 1.6 }}>
              Partner with us.
              <br />
              Grow your business.
              <br />
              Get paid on time.
            </p>
            <p className="muted" style={{ marginTop: ".8rem", fontSize: ".75rem" }}>
              © 2026 {COMPANY_NAME}. Powered by Covant.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Partner Program</h4>
              <Link href="/program">Overview</Link>
              <Link href="/setup">Apply Now</Link>
              <Link href="/portal">Partner Portal</Link>
            </div>
            <div>
              <h4>Resources</h4>
              <a href="mailto:partners@covant.ai">Partner Support</a>
              <a href="#">Marketing Materials</a>
              <a href="#">Product Documentation</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="mailto:partners@covant.ai">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
