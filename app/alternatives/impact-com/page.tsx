import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact.com Alternatives in 2026 — Covant vs Impact",
  description: "Impact.com is built for enterprise affiliate programs. Covant is built for B2B partner programs with deal registration, multi-touch attribution, and commission intelligence.",
  openGraph: {
    title: "Impact.com Alternatives in 2026 — Covant vs Impact",
    description: "Impact.com is built for enterprise affiliate programs. Covant is built for B2B partner programs with deal registration, multi-touch attribution, and commission intelligence.",
  },
};

export default function ImpactComAlternativePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      {/* Hero */}
      <section style={{ padding: "8rem 0 5rem", background: "#ffffff" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.03em",
            marginBottom: "1.5rem",
            color: "#0a0a0a"
          }}>
            The impact.com alternative built for B2B partner programs.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            maxWidth: 680,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            color: "#6b7280"
          }}>
            Impact.com excels at affiliate and influencer tracking. If you run a B2B reseller, referral, or co-sell program — Covant is purpose-built for you.
          </p>
          <Link href="/sign-up" className="l-btn" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "#0a0a0a",
            color: "#ffffff",
            padding: ".9rem 2rem",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            transition: "transform .2s, opacity .2s"
          }}>
            Get Started Free <span>→</span>
          </Link>
        </div>
      </section>

      {/* What impact.com does well */}
      <section style={{ padding: "6rem 0", background: "#f9fafb" }}>
        <div className="wrap">
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            marginBottom: "3rem",
            color: "#0a0a0a",
            textAlign: "center"
          }}>
            What impact.com does well
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Enterprise affiliate at scale
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Massive affiliate network and influencer management. 220+ country payout support. Built for enterprise scale.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Fraud detection
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Advanced fraud prevention for affiliate programs. Protects against click fraud, attribution manipulation, and fake conversions.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Contract management
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Partnership contracts and compliance workflows. Terms management, legal compliance, and contract lifecycle management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where impact.com falls short for B2B */}
      <section style={{ padding: "6rem 0", background: "#ffffff" }}>
        <div className="wrap">
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            marginBottom: "3rem",
            color: "#0a0a0a",
            textAlign: "center"
          }}>
            Where impact.com falls short for B2B
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Built for affiliate/influencer, not B2B resellers
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Architecture optimized for consumer affiliate programs. Deal registration and reseller workflows feel bolted on.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Enterprise pricing
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Typically $30K+/year with annual contracts. No self-serve, no free tier, no monthly billing option.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                No deal registration workflow
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Link tracking and affiliate attribution. Traditional B2B deal reg with approval workflows is not a core feature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section style={{ padding: "6rem 0", background: "#f9fafb" }}>
        <div className="wrap">
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            marginBottom: "3rem",
            color: "#0a0a0a",
            textAlign: "center"
          }}>
            Feature comparison
          </h2>
          <div style={{ overflowX: "auto", background: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "1.2rem 1.5rem", textAlign: "left", fontWeight: 700, color: "#0a0a0a" }}>Feature</th>
                  <th style={{ padding: "1.2rem 1.5rem", textAlign: "center", fontWeight: 700, color: "#0a0a0a" }}>Covant</th>
                  <th style={{ padding: "1.2rem 1.5rem", textAlign: "center", fontWeight: 700, color: "#0a0a0a" }}>impact.com</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Multi-touch attribution (B2B)", covant: "✓", impact: "Partial" },
                  { feature: "Deal registration workflow", covant: "✓", impact: "Partial" },
                  { feature: "B2B reseller programs", covant: "✓", impact: "Partial" },
                  { feature: "Partner health scoring", covant: "✓", impact: "✗" },
                  { feature: "QBR report generation", covant: "✓", impact: "✗" },
                  { feature: "AI-powered setup", covant: "✓", impact: "✗" },
                  { feature: "Setup time", covant: "15 minutes", impact: "4–12 weeks" },
                  { feature: "Affiliate marketplace", covant: "✗", impact: "✓" },
                  { feature: "Influencer management", covant: "✗", impact: "✓" },
                  { feature: "Fraud detection", covant: "✗", impact: "✓" },
                  { feature: "Free tier", covant: "✓ (up to 5 partners)", impact: "✗" },
                  { feature: "Starting price", covant: "Free", impact: "$30K+/year" },
                ].map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: i % 2 === 0 ? "#ffffff" : "#f9fafb"
                  }}>
                    <td style={{ padding: "1rem 1.5rem", color: "#0a0a0a" }}>{row.feature}</td>
                    <td style={{
                      padding: "1rem 1.5rem",
                      textAlign: "center",
                      color: row.covant.startsWith("✓") ? "#16a34a" : row.covant === "✗" ? "#9ca3af" : row.covant === "Partial" ? "#d97706" : "#0a0a0a",
                      fontWeight: 500
                    }}>
                      {row.covant}
                    </td>
                    <td style={{
                      padding: "1rem 1.5rem",
                      textAlign: "center",
                      color: row.impact.startsWith("✓") ? "#16a34a" : row.impact === "✗" ? "#9ca3af" : row.impact === "Partial" ? "#d97706" : "#0a0a0a",
                      fontWeight: 500
                    }}>
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Who should choose Covant */}
      <section style={{ padding: "6rem 0", background: "#ffffff" }}>
        <div className="wrap">
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            marginBottom: "3rem",
            color: "#0a0a0a",
            textAlign: "center"
          }}>
            Who should choose Covant
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Your program is B2B, not affiliate
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Resellers, referral partners, technology partners, co-sell programs. Not affiliate marketing or influencers.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You need to be live this quarter
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                15 minutes to first report. No implementation team, no 12-week project plan, no training required.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You want intelligence, not just tracking
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Partner health scores, forecasting, win/loss analysis, QBR generation. Impact.com tracks. Covant analyzes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 0", background: "#f9fafb" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-.02em",
            marginBottom: "1.5rem",
            color: "#0a0a0a"
          }}>
            Ready to switch?
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#6b7280",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6
          }}>
            Get Covant up and running in 15 minutes. Free for up to 5 partners. No credit card required.
          </p>
          <Link href="/sign-up" className="l-btn" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "#0a0a0a",
            color: "#ffffff",
            padding: ".9rem 2rem",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            transition: "transform .2s, opacity .2s"
          }}>
            Get Started Free <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
