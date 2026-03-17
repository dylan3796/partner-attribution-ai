import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Partner Platform — Covant",
  description:
    "Partner programs run on spreadsheets, gut calls, and email threads. Covant is the intelligence layer that replaces all of it — attribution, commissions, deal flow, and partner experience in one system.",
  openGraph: {
    title: "The Partner Platform — Covant",
    description:
      "Know which partners drive revenue. Automate commissions. Give partners a portal they'll actually use.",
  },
};

const PROBLEMS = [
  {
    before: "Who closed this deal?",
    after: "Attribution engine answers it automatically — every deal, every time.",
  },
  {
    before: "When do partners get paid?",
    after: "Commission rules run on close. Payouts are scheduled, not chased.",
  },
  {
    before: "Why did that partner go quiet?",
    after: "Health scoring flags at-risk partners before they churn.",
  },
  {
    before: "Where do I track deal registrations?",
    after: "Partners register in the portal. Conflicts auto-detected. No spreadsheets.",
  },
];

const PILLARS = [
  {
    number: "01",
    title: "Attribution",
    description:
      "Every deal gets a source. Multi-partner splits, deal registration protection, and a full audit trail — so nobody disputes who drove what.",
  },
  {
    number: "02",
    title: "Commission Engine",
    description:
      "Tiered rates, product-specific rules, accelerators, SPIFs. Set the rules once. Covant calculates and queues payouts automatically.",
  },
  {
    number: "03",
    title: "Partner Portal",
    description:
      "A branded self-service view for your partners: their deals, their commissions, their performance. No more 'where do I check my status?' emails.",
  },
  {
    number: "04",
    title: "Deal Registration",
    description:
      "Partners register deals in minutes. Conflict detection runs instantly. Approval workflows run on your rules, not your inbox.",
  },
  {
    number: "05",
    title: "Revenue Intelligence",
    description:
      "Win/loss by partner. Health scores. Pipeline trends. QBR reports that write themselves. Stop flying blind on which partners are performing.",
  },
  {
    number: "06",
    title: "Program Management",
    description:
      "Tier management, onboarding tracking, certifications, announcements. Everything a channel team needs to run a program — not just track it.",
  },
];

const WHO = [
  {
    role: "VP of Partnerships",
    pain: "Runs a $10M+ indirect channel on spreadsheets and hope.",
    after: "Finally has a system of record that shows exactly what's working.",
  },
  {
    role: "Channel Sales Manager",
    pain: "Spends 40% of time resolving commission disputes and chasing deal status.",
    after: "Disputes drop. Partner satisfaction goes up. Time goes back to selling.",
  },
  {
    role: "Head of Alliances",
    pain: "Can't prove partner ROI to the board, so budget stays flat.",
    after: "Has the attribution data to show partner-sourced revenue clearly.",
  },
];

export default function PlatformPage() {
  return (
    <div style={{ background: "#fff", color: "#0a0a0a", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 0 6rem", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p style={{
            fontSize: ".8rem",
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}>
            Partner Intelligence Platform
          </p>
          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-.03em",
            marginBottom: "1.75rem",
          }}>
            Your partner program<br />deserves a real platform.
          </h1>
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "#4b5563",
            maxWidth: 560,
            margin: "0 auto 2.5rem",
            lineHeight: 1.65,
          }}>
            Most partner programs run on spreadsheets, email threads, and gut instinct.
            Covant is the intelligence layer that replaces all of it — so you know what's
            working, automate what's manual, and give partners an experience worth showing up for.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/demo" className="l-btn">See it in action →</Link>
            <Link href="/sign-up" className="l-btn-outline">Get started free →</Link>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ───────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#0a0a0a", color: "#fff" }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <p style={{
            fontSize: ".8rem",
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: "1rem",
            textAlign: "center",
          }}>
            The problem
          </p>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.025em",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            Partner ops is the last function<br />still running on spreadsheets.
          </h2>
          <p style={{
            color: "#9ca3af",
            fontSize: "1.1rem",
            textAlign: "center",
            maxWidth: 560,
            margin: "0 auto 3.5rem",
            lineHeight: 1.65,
          }}>
            Sales has Salesforce. Marketing has HubSpot. Finance has NetSuite.
            Partners have a shared Google Sheet and a prayer.
          </p>

          <div style={{ display: "grid", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#0a0a0a",
              }}>
                <div style={{
                  padding: "1.5rem 2rem",
                  borderRight: "1px solid #1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <span style={{ color: "#374151", fontSize: "1rem" }}>✗</span>
                  <span style={{ color: "#6b7280", fontSize: ".95rem", lineHeight: 1.5 }}>{p.before}</span>
                </div>
                <div style={{
                  padding: "1.5rem 2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <span style={{ color: "#22c55e", fontSize: "1rem" }}>✓</span>
                  <span style={{ color: "#d1d5db", fontSize: ".95rem", lineHeight: 1.5 }}>{p.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT COVANT IS ────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <p style={{
                fontSize: ".8rem",
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#6b7280",
                marginBottom: "1rem",
              }}>
                What Covant is
              </p>
              <h2 style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-.025em",
                marginBottom: "1.25rem",
              }}>
                The rules engine between<br />"someone did something"<br />and "someone gets paid."
              </h2>
              <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "1rem", marginBottom: "1.25rem" }}>
                Covant sits in the middle of your partner motion. It watches deal activity, 
                applies your attribution rules, calculates commissions, and makes sure the 
                right partner gets credit — automatically.
              </p>
              <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "1rem" }}>
                Think of it as the infrastructure layer for partner economics. 
                The rules are yours. The execution is Covant.
              </p>
            </div>
            <div style={{
              background: "#0a0a0a",
              borderRadius: 16,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              {[
                { label: "Partner-sourced revenue", value: "$1.2M", trend: "+24% QoQ", color: "#22c55e" },
                { label: "Active partners", value: "47", trend: "12 pending onboard", color: "#3b82f6" },
                { label: "Commissions owed", value: "$38,400", trend: "Payout scheduled Apr 1", color: "#a78bfa" },
                { label: "Open deal registrations", value: "9", trend: "3 need review", color: "#f59e0b" },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "#111",
                  borderRadius: 10,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #1a1a1a",
                }}>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: ".75rem", marginBottom: "0.25rem" }}>{stat.label}</div>
                    <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{stat.value}</div>
                  </div>
                  <div style={{ color: stat.color, fontSize: ".75rem", textAlign: "right" }}>{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SIX PILLARS ───────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap" style={{ maxWidth: 960 }}>
          <p style={{
            fontSize: ".8rem",
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            What's inside
          </p>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.025em",
            textAlign: "center",
            marginBottom: "3.5rem",
          }}>
            Six pillars. One platform.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {PILLARS.map((p) => (
              <div key={p.number} style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "1.75rem",
              }}>
                <div style={{
                  fontSize: ".75rem",
                  fontWeight: 700,
                  color: "#d1d5db",
                  letterSpacing: ".08em",
                  marginBottom: "0.75rem",
                }}>
                  {p.number}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.6rem" }}>{p.title}</h3>
                <p style={{ color: "#6b7280", fontSize: ".9rem", lineHeight: 1.65 }}>{p.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/product" style={{ color: "#6b7280", fontSize: ".9rem", textDecoration: "underline" }}>
              See the full product tour →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ──────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p style={{
            fontSize: ".8rem",
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1rem",
          }}>
            Who it's for
          </p>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.025em",
            textAlign: "center",
            marginBottom: "3.5rem",
          }}>
            Built for the people who run partner programs.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {WHO.map((w) => (
              <div key={w.role} style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <div style={{ background: "#0a0a0a", padding: "1.25rem 1.75rem" }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>{w.role}</div>
                </div>
                <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: ".7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "0.4rem" }}>Before Covant</div>
                    <p style={{ color: "#6b7280", fontSize: ".9rem", lineHeight: 1.6 }}>{w.pain}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: ".7rem", fontWeight: 600, color: "#22c55e", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "0.4rem" }}>After Covant</div>
                    <p style={{ color: "#374151", fontSize: ".9rem", lineHeight: 1.6 }}>{w.after as string}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", background: "#0a0a0a", textAlign: "center" }}>
        <div className="wrap" style={{ maxWidth: 600 }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-.025em",
            color: "#fff",
            marginBottom: "1.25rem",
          }}>
            Ready to run your partner program<br />on something real?
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "1.05rem", marginBottom: "2rem", lineHeight: 1.65 }}>
            Free for up to 5 partners. No credit card required.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{
              background: "#fff",
              color: "#0a0a0a",
              padding: ".85rem 2rem",
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: ".95rem",
            }}>
              Get started free →
            </Link>
            <Link href="/demo" style={{
              border: "1px solid #333",
              color: "#fff",
              padding: ".85rem 2rem",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: ".95rem",
            }}>
              See the demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
