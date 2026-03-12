import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impartner Alternatives in 2026 — Covant vs Impartner PRM",
  description: "Impartner requires months of implementation and enterprise pricing. Covant gives you partner attribution, commission automation, and a partner portal — live in 15 minutes.",
  openGraph: {
    title: "Impartner Alternatives in 2026 — Covant vs Impartner PRM",
    description: "Impartner requires months of implementation and enterprise pricing. Covant gives you partner attribution, commission automation, and a partner portal — live in 15 minutes.",
  },
};

export default function ImpartnerAlternativePage() {
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
            The Impartner alternative that takes 15 minutes, not 6 months.
          </h1>
          <p className="l-muted" style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            maxWidth: 680,
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            color: "#6b7280"
          }}>
            Impartner is the enterprise PRM. If your program does not have 6 months and $50K for implementation — Covant gets you live today.
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

      {/* What Impartner does well */}
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
            What Impartner does well
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Enterprise scale
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Built for Fortune 1000 channel programs with 200+ partners. Deep compliance, audit trails, and enterprise security certifications.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Deep Salesforce integration
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Native SFDC objects, no middleware required. The deepest Salesforce PRM integration on the market.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Compliance and certifications
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                SOC 2, enterprise security, and the compliance requirements that large companies need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where Impartner falls short */}
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
            Where Impartner falls short
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Months of implementation
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                6–12 months typical for full deployment. Requires an implementation partner and dedicated project team.
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
                Typically $30K–$100K/year with custom contracts. No free tier, no self-serve, no monthly billing.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Complex to configure
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Needs a dedicated admin or SI partner. Self-service is limited. Configuration changes require expertise.
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
                  <th style={{ padding: "1.2rem 1.5rem", textAlign: "center", fontWeight: 700, color: "#0a0a0a" }}>Impartner</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Multi-touch attribution", covant: "✓", impartner: "Partial" },
                  { feature: "Setup time", covant: "15 minutes", impartner: "3–6 months" },
                  { feature: "Free tier", covant: "✓", impartner: "✗" },
                  { feature: "Self-serve onboarding", covant: "✓", impartner: "✗" },
                  { feature: "AI-powered setup", covant: "✓", impartner: "✗" },
                  { feature: "Partner portal", covant: "✓", impartner: "✓" },
                  { feature: "Deal registration", covant: "✓", impartner: "✓" },
                  { feature: "Commission automation", covant: "✓", impartner: "✓" },
                  { feature: "MDF management", covant: "✓", impartner: "✓" },
                  { feature: "Salesforce integration", covant: "✓", impartner: "✓ (native)" },
                  { feature: "Starting price", covant: "Free", impartner: "$30K+/year" },
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
                      color: row.impartner.startsWith("✓") ? "#16a34a" : row.impartner === "✗" ? "#9ca3af" : row.impartner === "Partial" ? "#d97706" : "#0a0a0a",
                      fontWeight: 500
                    }}>
                      {row.impartner}
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
            Who should choose Covant over Impartner
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You need to be live in days, not months
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Covant takes 15 minutes to set up. No implementation partner, no SFDC admin, no 6-month project plan.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                Your program has fewer than 200 partners
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Impartner is built for massive programs. Covant is built for VPs running 10–150 strategic partners with depth over volume.
              </p>
            </div>
            <div className="l-card" style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "2rem",
              border: "1px solid #e5e7eb"
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: ".75rem", fontSize: "1.15rem", color: "#0a0a0a" }}>
                You are a Series A–C company
              </h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6, fontSize: ".95rem" }}>
                Without a dedicated channel ops team. Impartner requires enterprise resources. Covant works for lean teams.
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
