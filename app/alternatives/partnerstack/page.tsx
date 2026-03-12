import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PartnerStack Alternatives in 2026 — Covant vs PartnerStack",
  description: "Looking for a PartnerStack alternative? Covant offers multi-touch attribution, deal registration, and partner intelligence that PartnerStack does not. Compare features and pricing.",
  openGraph: {
    title: "PartnerStack Alternatives in 2026 — Covant vs PartnerStack",
    description: "Looking for a PartnerStack alternative? Covant offers multi-touch attribution, deal registration, and partner intelligence that PartnerStack does not. Compare features and pricing.",
  },
};

export default function PartnerStackAlternativePage() {
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
            The PartnerStack alternative built for attribution, not just payouts.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            maxWidth: 680,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            color: "#6b7280"
          }}>
            PartnerStack is great for affiliate link tracking. If you need deal registration, multi-touch attribution, and partner intelligence — that is Covant.
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

      {/* What PartnerStack does well */}
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
            What PartnerStack does well
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Partner marketplace
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                80K+ partners for recruitment. PartnerStack's network is a genuine distribution advantage for high-volume programs.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Automated payouts
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Strong payout infrastructure with tax form collection, currency conversion, and global payment support.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                High-volume affiliate programs
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Built for thousands of affiliates. Link tracking and referral management at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where PartnerStack falls short */}
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
            Where PartnerStack falls short
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                No multi-touch attribution
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Only first-touch referral link credit. No attribution models, no deal-level visibility, no way to split overlapping partner contributions.
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
                Not built for reseller or co-sell programs. Traditional deal registration with approval workflows is an afterthought.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                No revenue intelligence
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Basic reporting. No QBR generation, no partner health scores, no forecasting. VPs still need spreadsheets for board decks.
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
                  <th style={{ padding: "1.2rem 1.5rem", textAlign: "center", fontWeight: 700, color: "#0a0a0a" }}>PartnerStack</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Multi-touch attribution", covant: "✓", partnerstack: "✗" },
                  { feature: "Deal registration", covant: "✓", partnerstack: "Partial" },
                  { feature: "Attribution audit trail", covant: "✓", partnerstack: "✗" },
                  { feature: "Commission rules engine", covant: "✓", partnerstack: "Partial" },
                  { feature: "Partner health scoring", covant: "✓", partnerstack: "✗" },
                  { feature: "MDF management", covant: "✓", partnerstack: "✗" },
                  { feature: "QBR report generation", covant: "✓", partnerstack: "✗" },
                  { feature: "Partner marketplace", covant: "✗", partnerstack: "✓" },
                  { feature: "Free tier", covant: "✓ (up to 5 partners)", partnerstack: "✗" },
                  { feature: "Setup time", covant: "15 minutes", partnerstack: "2–4 weeks" },
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
                      color: row.partnerstack.startsWith("✓") ? "#16a34a" : row.partnerstack === "✗" ? "#9ca3af" : row.partnerstack === "Partial" ? "#d97706" : "#0a0a0a",
                      fontWeight: 500
                    }}>
                      {row.partnerstack}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Who should switch */}
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
            Who should switch to Covant
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You run a reseller or co-sell program
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Not affiliate. Deal registration, partner collaboration, and multi-touch attribution are core to your program.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You need to prove partner ROI
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                To your CFO or board. PartnerStack shows payouts. Covant shows attribution, partner health, and revenue impact with audit trails.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You manage 10–100 strategic partners
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Not thousands of affiliates. You need depth, not breadth. Partner intelligence, not volume tracking.
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
