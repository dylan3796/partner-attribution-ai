"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  BarChart3,
  Zap,
  Quote,
  Building2,
  Target,
  Layers,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────── */

type Stat = { label: string; before: string; after: string; icon: typeof TrendingUp };
type Step = { title: string; description: string };
type Story = {
  slug: string;
  company: string;
  logo: string; // emoji stand-in
  industry: string;
  size: string;
  partners: string;
  headline: string;
  subline: string;
  challenge: string[];
  solution: Step[];
  stats: Stat[];
  quote: string;
  quotePerson: string;
  quoteRole: string;
  timeline: string;
  attributionModel: string;
  color: string;
};

/* ── Data ──────────────────────────────────────────────────────────── */

const STORIES: Story[] = [
  {
    slug: "meridian-cloud",
    company: "Meridian Cloud",
    logo: "☁️",
    industry: "Cloud Infrastructure",
    size: "Series B · 120 employees",
    partners: "42 channel partners",
    headline: "From spreadsheet chaos to automated partner payouts in 3 weeks",
    subline:
      "How a cloud infrastructure company eliminated 20+ hours/month of manual commission work and reduced payout disputes by 90%.",
    challenge: [
      "Partner commissions tracked in a shared Google Sheet that broke every quarter-end",
      "Finance spent 20+ hours/month reconciling partner payouts manually",
      "3 partner disputes per month over attribution — no audit trail to resolve them",
      "VP of Partnerships couldn't answer 'which partners actually drive revenue?' without a 2-week data pull",
    ],
    solution: [
      {
        title: "Connected CRM in 10 minutes",
        description:
          "Salesforce OAuth flow synced 800+ deals and mapped partner fields automatically. No CSV imports, no field mapping spreadsheets.",
      },
      {
        title: "Configured Deal Reg Protection model",
        description:
          "AI setup conversation extracted their existing partner rules in a 2-minute chat. Deal registration = exclusive attribution for 90 days.",
      },
      {
        title: "Automated commission calculations",
        description:
          "Tiered commission rules (8% Bronze → 15% Platinum) run automatically on every deal close. Finance reviews and approves in bulk.",
      },
      {
        title: "Partners self-serve via portal",
        description:
          "Partners log in, see their pipeline, commissions, and tier status. Deal reg submissions go directly into the approval queue.",
      },
    ],
    stats: [
      { label: "Commission processing time", before: "20+ hrs/mo", after: "45 min/mo", icon: Clock },
      { label: "Payout disputes", before: "3/month", after: "0/month", icon: CheckCircle2 },
      { label: "Partner-sourced revenue", before: "$1.2M/yr", after: "$2.8M/yr", icon: DollarSign },
      { label: "Active partners", before: "18", after: "42", icon: Users },
    ],
    quote:
      "We went from dreading quarter-end to having commissions calculated before the deals even hit our books. Our partners trust the numbers now — that alone changed the relationship.",
    quotePerson: "Rachel Torres",
    quoteRole: "VP of Partnerships, Meridian Cloud",
    timeline: "3 weeks to full deployment",
    attributionModel: "Deal Reg Protection",
    color: "#6366f1",
  },
  {
    slug: "stackpath-analytics",
    company: "StackPath Analytics",
    logo: "📊",
    industry: "Data Analytics",
    size: "Series C · 280 employees",
    partners: "85 partners across 3 programs",
    headline: "Scaling from 1 partner program to 3 without adding headcount",
    subline:
      "How a data analytics company launched referral and technology partner programs alongside their existing reseller channel — managed by the same 2-person team.",
    challenge: [
      "Reseller program was working but manual — couldn't scale to new partner types",
      "Referral partners had no visibility into whether their leads converted",
      "Technology partners wanted co-sell attribution but there was no way to track joint deals",
      "Adding a 3rd program meant hiring 2 more partner ops people (or so they thought)",
    ],
    solution: [
      {
        title: "Three programs, one platform",
        description:
          "Set up Reseller (Deal Reg Protection), Referral (Source Wins), and Technology (Role Split) programs with different attribution models and commission structures.",
      },
      {
        title: "Referral tracking with portal access",
        description:
          "Referral partners submit leads through the portal. Attribution is automatic — if the lead converts within 90 days, the referrer gets credit. No more 'did my referral close?' emails.",
      },
      {
        title: "Co-sell attribution for tech partners",
        description:
          "Role Split model assigns predefined percentages: 60% to the reseller who closed, 25% to the tech partner who enabled, 15% to the referral source. Every deal, every time.",
      },
      {
        title: "Automated tier progression",
        description:
          "Partner scoring evaluates revenue impact, pipeline contribution, engagement, and deal velocity. Partners see exactly what they need to reach the next tier.",
      },
    ],
    stats: [
      { label: "Partner programs managed", before: "1", after: "3", icon: Layers },
      { label: "Partner ops headcount", before: "2 people", after: "2 people", icon: Users },
      { label: "Partner-influenced pipeline", before: "$4.2M", after: "$11.8M", icon: TrendingUp },
      { label: "Average deal cycle", before: "68 days", after: "41 days", icon: Clock },
    ],
    quote:
      "We thought scaling partner programs meant scaling the team. Turns out it meant scaling the system. Two of us manage 85 partners across three programs and we're not even stressed about it.",
    quotePerson: "David Kim",
    quoteRole: "Head of Channel, StackPath Analytics",
    timeline: "6 weeks for all 3 programs",
    attributionModel: "Deal Reg + Source Wins + Role Split",
    color: "#22c55e",
  },
  {
    slug: "nova-security",
    company: "Nova Security",
    logo: "🔒",
    industry: "Cybersecurity",
    size: "Series A · 45 employees",
    partners: "12 → 38 partners in 6 months",
    headline: "Building a partner channel from zero to $1.4M in partner-sourced revenue",
    subline:
      "How an early-stage cybersecurity company used automated onboarding and transparent commissions to recruit and activate partners 3x faster than industry average.",
    challenge: [
      "No existing partner program — needed to build from scratch",
      "Couldn't afford a PRM ($30K+/yr) or dedicated partner ops hire",
      "Partners they recruited would sign up but never send deals — 80% inactive after 30 days",
      "No way to show partners ROI of the relationship, so recruitment calls fell flat",
    ],
    solution: [
      {
        title: "Invite flow that activates in minutes",
        description:
          "Generated invite links for each partner prospect. Partners click, fill out a profile, and immediately see their portal with deal reg, commissions, and tier info. Time to first deal reg: under 24 hours.",
      },
      {
        title: "Transparent commission visibility",
        description:
          "Partners see exactly how much they'll earn before submitting a deal. Commission calculator on every deal reg form. No surprises, no 'we'll figure out your rate later.'",
      },
      {
        title: "Onboarding checklist with enablement",
        description:
          "5-step getting started guide: watch product demo, complete certification, register first deal, invite a colleague, hit Bronze tier. Gamified progression kept partners engaged past day 30.",
      },
      {
        title: "Recruitment with proof",
        description:
          "Shared anonymized partner performance data in recruitment calls: 'Our average partner earns $X in commissions within 90 days.' Real data from the platform, not a pitch deck.",
      },
    ],
    stats: [
      { label: "Partners recruited", before: "0", after: "38", icon: Users },
      { label: "Partner activation rate", before: "N/A", after: "72%", icon: Target },
      { label: "Partner-sourced revenue", before: "$0", after: "$1.4M", icon: DollarSign },
      { label: "Time to first deal reg", before: "N/A", after: "<24 hrs", icon: Zap },
    ],
    quote:
      "I was spending half my day chasing partners for updates and the other half building pitch decks. Now the platform does both. I focus on relationships and strategy — the way it should be.",
    quotePerson: "Aisha Patel",
    quoteRole: "VP of Business Development, Nova Security",
    timeline: "2 weeks to launch, 6 months to $1.4M",
    attributionModel: "Source Wins",
    color: "#f59e0b",
  },
];

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CustomersPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--muted)",
            fontSize: ".85rem",
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: ".5rem",
          }}
        >
          Customer Stories
        </h1>
        <p
          className="muted"
          style={{ fontSize: "1.1rem", lineHeight: 1.6, maxWidth: 600 }}
        >
          How partner teams use Covant to eliminate spreadsheet chaos, automate
          payouts, and scale their programs without scaling headcount.
        </p>
        <p
          className="muted"
          style={{
            fontSize: ".8rem",
            marginTop: ".75rem",
            fontStyle: "italic",
            opacity: 0.6,
          }}
        >
          Scenarios are illustrative and based on common partner program
          patterns. Company names have been changed.
        </p>
      </div>

      {/* Story Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {STORIES.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: "4rem",
          padding: "2.5rem",
          borderRadius: 16,
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-.02em",
            marginBottom: ".5rem",
          }}
        >
          Ready to write your own story?
        </h2>
        <p
          className="muted"
          style={{
            fontSize: ".95rem",
            lineHeight: 1.6,
            maxWidth: 500,
            margin: "0 auto .75rem",
          }}
        >
          Start free with up to 5 partners. No credit card, no time limit.
          See your first attribution in minutes.
        </p>
        <div
          style={{
            display: "flex",
            gap: ".75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/demo"
            className="btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: ".9rem",
            }}
          >
            Try the Demo <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: ".9rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Story Card Component ─────────────────────────────────────────── */

function StoryCard({ story }: { story: Story }) {
  return (
    <article
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid var(--border)",
          background: `${story.color}08`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>{story.logo}</span>
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {story.company}
            </h2>
            <div
              className="muted"
              style={{
                fontSize: ".75rem",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 2,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Building2 size={11} /> {story.industry}
              </span>
              <span>{story.size}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={11} /> {story.partners}
              </span>
            </div>
          </div>
        </div>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            letterSpacing: "-.02em",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {story.headline}
        </h3>
        <p
          className="muted"
          style={{ fontSize: ".9rem", lineHeight: 1.5, marginTop: 6 }}
        >
          {story.subline}
        </p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>
        {/* Challenge */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4
            style={{
              fontSize: ".8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "#ef4444",
              marginBottom: 10,
            }}
          >
            The Challenge
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {story.challenge.map((c, i) => (
              <li
                key={i}
                style={{ fontSize: ".85rem", lineHeight: 1.5, color: "var(--muted)" }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4
            style={{
              fontSize: ".8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: story.color,
              marginBottom: 10,
            }}
          >
            The Solution
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {story.solution.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${story.color}15`,
                    color: story.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".75rem",
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 2 }}>
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: ".85rem",
                      lineHeight: 1.5,
                      color: "var(--muted)",
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4
            style={{
              fontSize: ".8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "#22c55e",
              marginBottom: 10,
            }}
          >
            Results
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {story.stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg, #000)",
                  }}
                >
                  <div
                    className="muted"
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 6,
                    }}
                  >
                    <Icon size={12} /> {stat.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: ".8rem",
                        color: "var(--muted)",
                        textDecoration: "line-through",
                        opacity: 0.5,
                      }}
                    >
                      {stat.before}
                    </span>
                    <ArrowRight size={12} style={{ color: "#22c55e" }} />
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "#22c55e",
                      }}
                    >
                      {stat.after}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            padding: "1.25rem",
            borderRadius: 12,
            background: `${story.color}08`,
            border: `1px solid ${story.color}20`,
            position: "relative",
          }}
        >
          <Quote
            size={20}
            style={{
              color: story.color,
              opacity: 0.4,
              marginBottom: 8,
            }}
          />
          <p
            style={{
              fontSize: ".9rem",
              lineHeight: 1.6,
              fontStyle: "italic",
              margin: "0 0 8px",
            }}
          >
            &ldquo;{story.quote}&rdquo;
          </p>
          <div style={{ fontSize: ".8rem" }}>
            <span style={{ fontWeight: 700 }}>{story.quotePerson}</span>
            <span className="muted"> — {story.quoteRole}</span>
          </div>
        </div>

        {/* Meta pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: story.timeline, icon: Clock },
            { label: story.attributionModel, icon: BarChart3 },
          ].map((pill, i) => {
            const Icon = pill.icon;
            return (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: ".7rem",
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                }}
              >
                <Icon size={11} /> {pill.label}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}
