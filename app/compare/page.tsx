import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckCircle2, XCircle, MinusCircle, ArrowRight,
  Brain, Zap, Shield, Users, BarChart3, DollarSign,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why Covant — Compare Partner Attribution Tools",
  description:
    "See how Covant compares to spreadsheets, legacy PRMs, and ecosystem tools for partner attribution, commission automation, and program intelligence.",
  openGraph: {
    title: "Covant vs. The Alternatives — Partner Intelligence Comparison",
    description:
      "Spreadsheets, Impartner, Crossbeam, Salesforce PRM — see where Covant fits and why VPs of Partnerships are switching.",
  },
};

type FeatureRow = {
  feature: string;
  covant: "yes" | "partial" | "no";
  spreadsheets: "yes" | "partial" | "no";
  legacyPrm: "yes" | "partial" | "no";
  ecosystem: "yes" | "partial" | "no";
  tooltip?: string;
};

const FEATURES: FeatureRow[] = [
  { feature: "Multi-touch attribution", covant: "yes", spreadsheets: "no", legacyPrm: "no", ecosystem: "no" },
  { feature: "Automated commission calculation", covant: "yes", spreadsheets: "no", legacyPrm: "partial", ecosystem: "no" },
  { feature: "Partner portal (self-serve)", covant: "yes", spreadsheets: "no", legacyPrm: "yes", ecosystem: "no" },
  { feature: "Deal registration workflow", covant: "yes", spreadsheets: "partial", legacyPrm: "yes", ecosystem: "no" },
  { feature: "Attribution audit trail", covant: "yes", spreadsheets: "no", legacyPrm: "no", ecosystem: "no" },
  { feature: "Revenue intelligence / ROI", covant: "yes", spreadsheets: "partial", legacyPrm: "no", ecosystem: "partial" },
  { feature: "Partner scoring & tiering", covant: "yes", spreadsheets: "no", legacyPrm: "partial", ecosystem: "no" },
  { feature: "CRM integration (Salesforce, HubSpot)", covant: "yes", spreadsheets: "no", legacyPrm: "yes", ecosystem: "yes" },
  { feature: "Account overlap / co-sell discovery", covant: "no", spreadsheets: "no", legacyPrm: "no", ecosystem: "yes" },
  { feature: "Partner onboarding & training", covant: "partial", spreadsheets: "no", legacyPrm: "yes", ecosystem: "no" },
  { feature: "Content management / resource hub", covant: "partial", spreadsheets: "no", legacyPrm: "yes", ecosystem: "no" },
  { feature: "Setup time", covant: "yes", spreadsheets: "yes", legacyPrm: "no", ecosystem: "partial" },
  { feature: "Payout automation (Stripe)", covant: "yes", spreadsheets: "no", legacyPrm: "no", ecosystem: "no" },
  { feature: "Forecasting & pipeline analytics", covant: "yes", spreadsheets: "partial", legacyPrm: "partial", ecosystem: "no" },
  { feature: "Webhook event ingestion", covant: "yes", spreadsheets: "no", legacyPrm: "partial", ecosystem: "partial" },
];

const SETUP_LABELS: Record<string, string> = {
  yes: "15 min",
  partial: "1–2 weeks",
  no: "3–6 months",
};

function StatusIcon({ status, isSetup }: { status: "yes" | "partial" | "no"; isSetup?: boolean }) {
  if (isSetup) {
    const color = status === "yes" ? "#22c55e" : status === "partial" ? "#eab308" : "#ef4444";
    return (
      <span style={{ fontSize: ".8rem", fontWeight: 600, color }}>
        {SETUP_LABELS[status]}
      </span>
    );
  }
  if (status === "yes") return <CheckCircle2 size={18} style={{ color: "#22c55e" }} />;
  if (status === "partial") return <MinusCircle size={18} style={{ color: "#eab308" }} />;
  return <XCircle size={18} style={{ color:'#374151' }} />;
}

type PositionCard = {
  competitor: string;
  tagline: string;
  whatTheyDo: string;
  whatTheyMiss: string;
  covantFits: string;
  color: string;
};

const POSITIONS: PositionCard[] = [
  {
    competitor: "Spreadsheets & Manual Processes",
    tagline: "Where 80% of partner programs live today",
    whatTheyDo: "Flexible, familiar, zero cost. Everyone has Excel.",
    whatTheyMiss:
      "No attribution logic, no audit trail, manual commission calculations that take 20+ hours/month. Disputes are inevitable because nobody trusts the numbers.",
    covantFits:
      "Replace the spreadsheet with automated attribution and commission rules. Keep the flexibility — lose the manual work and fights about who drove what.",
    color: "#ef4444",
  },
  {
    competitor: "Legacy PRMs (Impartner, Allbound)",
    tagline: "Built for partner onboarding & content, not revenue intelligence",
    whatTheyDo:
      "Contract management, partner onboarding workflows, training libraries, deal registration. Great for managing 500+ partners at scale.",
    whatTheyMiss:
      "No multi-touch attribution. Can't answer 'which partners actually drive revenue?' Manual commission calculations. 3–6 month implementation.",
    covantFits:
      "Layer Covant on top. Keep the PRM for contracts and training. Add attribution, revenue intelligence, and commission automation. 15-minute setup.",
    color: "#6366f1",
  },
  {
    competitor: "Ecosystem Tools (Crossbeam, Reveal)",
    tagline: "Find co-sell opportunities — but then what?",
    whatTheyDo:
      "Account mapping, overlap analysis, co-sell opportunity discovery. Great for identifying where your partners' customers overlap with your prospects.",
    whatTheyMiss:
      "No attribution modeling. No commission automation. No partner portal. Can't measure long-term partner ROI or answer 'who gets paid what?'",
    covantFits:
      "Use Crossbeam to find the opportunities. Use Covant to attribute the deals, calculate commissions, and prove partner ROI to your board.",
    color: "#22c55e",
  },
  {
    competitor: "Salesforce PRM (Native)",
    tagline: "Free with SFDC licenses, but you get what you pay for",
    whatTheyDo:
      "Native Salesforce integration, workflow automation, partner community. No additional cost if you're already on Salesforce.",
    whatTheyMiss:
      "No multi-touch attribution. Manual commission calculations. No real partner portal UX. Can't answer 'which attribution model is fair?'",
    covantFits:
      "Covant writes attribution data back into Salesforce. Keep using SFDC for workflows. Add the intelligence layer that SFDC doesn't have.",
    color: "#3b82f6",
  },
];

const DIFFERENTIATORS = [
  {
    icon: Brain,
    title: "Attribution is the moat",
    description:
      "5 attribution models (deal reg protection, source wins, role split, time decay, equal split). Not just tracking — explaining who drove what and why.",
  },
  {
    icon: Zap,
    title: "15 minutes to first report",
    description:
      "AI-powered setup extracts your program config from a single conversation. No consultants, no 6-month implementation, no IT tickets.",
  },
  {
    icon: Shield,
    title: "Full audit trail",
    description:
      "Every commission has a paper trail. Every attribution decision is explainable. When an AE questions a number, you have the receipts.",
  },
  {
    icon: DollarSign,
    title: "Commission automation",
    description:
      "Complex commission rules by product line, partner tier, and deal type. Automatic calculation on deal close. Stripe payouts built in.",
  },
  {
    icon: Users,
    title: "Partner portal included",
    description:
      "Partners register deals, track commissions, view performance, and access resources. Self-serve — no monthly PDFs.",
  },
  {
    icon: BarChart3,
    title: "Intelligence, not infrastructure",
    description:
      "Revenue forecasting, partner scoring, cohort analysis, benchmarks. Know which partners to invest in — not just who to pay.",
  },
];

export default function ComparePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:'#f9fafb',
        color: "#e5e5e5",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Nav */}
      <header
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/"
            style={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color:'#0a0a0a',
              textDecoration: "none",
              letterSpacing: "-.02em",
            }}
          >
            Covant.ai
          </Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ fontSize: ".9rem", color: "#888" }}>Compare</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link
            href="/use-cases"
            style={{ fontSize: ".8rem", color:'#6b7280', textDecoration: "none" }}
          >
            Use Cases
          </Link>
          <Link
            href="/pricing"
            style={{ fontSize: ".8rem", color:'#6b7280', textDecoration: "none" }}
          >
            Pricing
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontSize: ".8rem",
              color: "#000",
              background: "#fff",
              padding: "6px 14px",
              borderRadius: 6,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get Started
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color:'#0a0a0a',
              letterSpacing: "-.03em",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            Partner attribution shouldn&apos;t be<br />this hard.
          </h1>
          <p
            style={{
              color:'#6b7280',
              fontSize: "1.1rem",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Spreadsheets break. Legacy PRMs don&apos;t do attribution. Ecosystem
            tools find opportunities but can&apos;t measure impact. Covant does.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #1a1a1a",
            overflow: "hidden",
            marginBottom: "4rem",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px 20px",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color:'#6b7280',
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      width: "30%",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 12px",
                      fontSize: ".85rem",
                      fontWeight: 800,
                      color:'#0a0a0a',
                      background: "#6366f108",
                      borderLeft: "1px solid #1a1a1a",
                      borderRight: "1px solid #1a1a1a",
                    }}
                  >
                    <span style={{ color:'#0a0a0a' }}>Covant</span>
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 12px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      color: "#888",
                    }}
                  >
                    Spreadsheets
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 12px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      color: "#888",
                    }}
                  >
                    Legacy PRM
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px 12px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      color: "#888",
                    }}
                  >
                    Ecosystem Tools
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row) => {
                  const isSetup = row.feature === "Setup time";
                  return (
                    <tr
                      key={row.feature}
                      style={{ borderBottom: "1px solid #111" }}
                    >
                      <td
                        style={{
                          padding: "12px 20px",
                          fontSize: ".85rem",
                          fontWeight: 500,
                          color:'#374151',
                        }}
                      >
                        {row.feature}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          background: "#6366f105",
                          borderLeft: "1px solid #1a1a1a",
                          borderRight: "1px solid #1a1a1a",
                        }}
                      >
                        <StatusIcon status={row.covant} isSetup={isSetup} />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <StatusIcon
                          status={row.spreadsheets}
                          isSetup={isSetup}
                        />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <StatusIcon status={row.legacyPrm} isSetup={isSetup} />
                      </td>
                      <td style={{ textAlign: "center", padding: "12px" }}>
                        <StatusIcon status={row.ecosystem} isSetup={isSetup} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              padding: "12px 20px",
              borderTop: "1px solid #1a1a1a",
              background:'#f9fafb',
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: ".75rem",
                color: "#888",
              }}
            >
              <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> Full
              support
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: ".75rem",
                color: "#888",
              }}
            >
              <MinusCircle size={14} style={{ color: "#eab308" }} /> Partial /
              limited
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: ".75rem",
                color: "#888",
              }}
            >
              <XCircle size={14} style={{ color:'#374151' }} /> Not available
            </div>
          </div>
        </div>

        {/* Detailed Comparison Pages */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', textAlign: "center", marginBottom: ".5rem" }}>
            Detailed comparisons
          </h2>
          <p style={{ color:'#6b7280', textAlign: "center", marginBottom: "1.5rem", fontSize: ".95rem" }}>
            Deep-dive feature comparisons with specific competitors.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { name: "PartnerStack", slug: "partnerstack", desc: "Partner management & payouts platform for SaaS" },
              { name: "impact.com", slug: "impact-com", desc: "Enterprise affiliate & partnership management" },
              { name: "Crossbeam (Reveal)", slug: "crossbeam", desc: "Account mapping & co-sell intelligence" },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                style={{
                  padding: "1.5rem", borderRadius: 12, border: "1px solid #1a1a1a",
                  background:'#f9fafb', textDecoration: "none", color: "inherit",
                  transition: "border-color .2s",
                }}
              >
                <div style={{ fontSize: "1rem", fontWeight: 700, color:'#0a0a0a', marginBottom: 6 }}>
                  Covant vs {c.name}
                </div>
                <p style={{ fontSize: ".8rem", color:'#6b7280', margin: "0 0 12px", lineHeight: 1.5 }}>
                  {c.desc}
                </p>
                <span style={{ fontSize: ".8rem", color: "#6366f1", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Compare features <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Head-to-Head Cards */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color:'#0a0a0a',
              textAlign: "center",
              marginBottom: ".5rem",
            }}
          >
            Head-to-head
          </h2>
          <p
            style={{
              color:'#6b7280',
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: ".95rem",
            }}
          >
            Where Covant fits — and doesn&apos;t — alongside what you&apos;re
            already using.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {POSITIONS.map((pos) => (
              <div
                key={pos.competitor}
                style={{
                  border: "1px solid #1a1a1a",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #1a1a1a",
                    background: `${pos.color}06`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: pos.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color:'#0a0a0a',
                      }}
                    >
                      vs. {pos.competitor}
                    </span>
                  </div>
                  <p style={{ fontSize: ".85rem", color: "#888" }}>
                    {pos.tagline}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 0,
                  }}
                >
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
                      borderRight: "1px solid #1a1a1a",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color:'#6b7280',
                        marginBottom: 8,
                      }}
                    >
                      What they do well
                    </div>
                    <p
                      style={{
                        fontSize: ".85rem",
                        color:'#6b7280',
                        lineHeight: 1.6,
                      }}
                    >
                      {pos.whatTheyDo}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
                      borderRight: "1px solid #1a1a1a",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: "#ef4444",
                        marginBottom: 8,
                      }}
                    >
                      What they miss
                    </div>
                    <p
                      style={{
                        fontSize: ".85rem",
                        color:'#6b7280',
                        lineHeight: 1.6,
                      }}
                    >
                      {pos.whatTheyMiss}
                    </p>
                  </div>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        fontSize: ".65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: "#22c55e",
                        marginBottom: 8,
                      }}
                    >
                      Where Covant fits
                    </div>
                    <p
                      style={{
                        fontSize: ".85rem",
                        color:'#6b7280',
                        lineHeight: 1.6,
                      }}
                    >
                      {pos.covantFits}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color:'#0a0a0a',
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            What makes Covant different
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  style={{
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid #1a1a1a",
                    background:'#f9fafb',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background:'#f9fafb',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                      color: "#888",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3
                    style={{
                      fontSize: ".95rem",
                      fontWeight: 700,
                      color:'#0a0a0a',
                      marginBottom: 6,
                    }}
                  >
                    {d.title}
                  </h3>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color:'#6b7280',
                      lineHeight: 1.6,
                    }}
                  >
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            padding: "3rem 0",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color:'#0a0a0a',
              marginBottom: ".75rem",
            }}
          >
            See it for yourself
          </h2>
          <p style={{ color:'#6b7280', marginBottom: "1.5rem", maxWidth: 460, margin: "0 auto 1.5rem" }}>
            15 minutes to set up. No credit card. No 6-month implementation.
            Just import your partners and go.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/sign-up"
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                background: "#fff",
                color: "#000",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "1px solid #333",
                color:'#6b7280',
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Try the demo →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
