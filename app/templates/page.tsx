import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  Plug,
  Megaphone,
  Handshake,
  Target,
  TrendingUp,
  Shield,
  Coins,
  BarChart2,
  Clock,
  Layers,
  Star,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partner Program Templates — Covant",
  description:
    "Pre-built partner program blueprints for SaaS reseller, referral, technology alliance, affiliate, and co-sell programs. Start with a proven structure instead of building from scratch.",
  openGraph: {
    title: "Partner Program Templates — Covant",
    description:
      "Pre-built partner program blueprints. Pick a template, customize it, launch in minutes.",
    url: "https://covant.ai/templates",
  },
};

type Template = {
  slug: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bestFor: string;
  attributionModel: string;
  attributionDesc: string;
  commissionStructure: {
    tier: string;
    rate: string;
    threshold: string;
  }[];
  tiers: { name: string; partners: string; perks: string }[];
  kpis: { metric: string; target: string; icon: React.ElementType }[];
  setupTime: string;
  portalFeatures: string[];
  whenToUse: string[];
};

const TEMPLATES: Template[] = [
  {
    slug: "saas-reseller",
    name: "SaaS Reseller Program",
    subtitle: "For companies selling through channel partners who resell your product",
    icon: Building2,
    color: "#6366f1",
    bestFor: "B2B SaaS with 10–500 reseller partners",
    attributionModel: "Deal Registration Protection",
    attributionDesc:
      "The registering partner wins the deal. First to register with a valid opportunity gets credit — prevents channel conflict and protects partner investment in the deal.",
    commissionStructure: [
      { tier: "Bronze", rate: "15%", threshold: "Any revenue" },
      { tier: "Silver", rate: "20%", threshold: "$50K+ quarterly" },
      { tier: "Gold", rate: "25%", threshold: "$150K+ quarterly" },
      { tier: "Platinum", rate: "30%", threshold: "$500K+ quarterly" },
    ],
    tiers: [
      { name: "Bronze", partners: "New partners", perks: "Basic portal, deal reg, standard support" },
      { name: "Silver", partners: "$50K+ quarterly", perks: "+ Co-marketing funds, priority support" },
      { name: "Gold", partners: "$150K+ quarterly", perks: "+ Dedicated partner manager, joint webinars" },
      { name: "Platinum", partners: "$500K+ quarterly", perks: "+ Executive sponsor, custom integrations" },
    ],
    kpis: [
      { metric: "Partner-sourced revenue", target: ">30% of total", icon: TrendingUp },
      { metric: "Deal registration rate", target: ">80% of partner deals", icon: Shield },
      { metric: "Average deal size", target: "$25K+", icon: Coins },
      { metric: "Partner activation rate", target: ">60% active in 90d", icon: Target },
    ],
    setupTime: "~15 minutes",
    portalFeatures: [
      "Deal registration with conflict detection",
      "Commission tracking & payout history",
      "Tier progress dashboard",
      "Product catalog with partner pricing",
      "MDF request submission",
      "Certification tracking",
    ],
    whenToUse: [
      "Your product requires sales expertise or implementation services",
      "Partners bring existing customer relationships",
      "Deal sizes justify dedicated partner sales cycles",
      "You need to protect partners from direct-vs-channel conflict",
    ],
  },
  {
    slug: "referral-network",
    name: "Referral Partner Program",
    subtitle: "For companies growing through partner introductions and lead referrals",
    icon: Megaphone,
    color: "#10b981",
    bestFor: "SaaS, agencies, and service businesses with broad referral networks",
    attributionModel: "Source Wins",
    attributionDesc:
      "The partner who sourced or introduced the opportunity gets full credit. Simple, transparent — if they brought the lead, they get paid.",
    commissionStructure: [
      { tier: "Referral", rate: "10%", threshold: "First-year revenue" },
      { tier: "Qualified Referral", rate: "15%", threshold: "Demo-qualified leads" },
      { tier: "Influenced", rate: "5%", threshold: "Existing pipeline acceleration" },
    ],
    tiers: [
      { name: "Affiliate", partners: "Anyone", perks: "Referral link, basic tracking" },
      { name: "Partner", partners: "3+ closed referrals", perks: "+ Higher rates, co-marketing" },
      { name: "Strategic", partners: "10+ referrals/quarter", perks: "+ Custom landing pages, priority payouts" },
    ],
    kpis: [
      { metric: "Referral conversion rate", target: ">15%", icon: Target },
      { metric: "Time to first referral", target: "<30 days", icon: Clock },
      { metric: "Revenue per partner", target: "$5K+/quarter", icon: Coins },
      { metric: "Active referral partners", target: ">40% of enrolled", icon: Users },
    ],
    setupTime: "~10 minutes",
    portalFeatures: [
      "Unique referral link generation",
      "Real-time referral status tracking",
      "Commission dashboard",
      "Performance leaderboard",
      "Payout history & invoicing",
      "Marketing collateral library",
    ],
    whenToUse: [
      "Your customers or advisors naturally recommend your product",
      "Deal cycles are shorter and don't need partner involvement post-intro",
      "You want a lightweight program with minimal partner management overhead",
      "Your ACV is <$25K and you need volume over depth",
    ],
  },
  {
    slug: "technology-alliance",
    name: "Technology Alliance Program",
    subtitle: "For companies partnering with complementary technology vendors",
    icon: Plug,
    color: "#8b5cf6",
    bestFor: "Platform companies with integration ecosystems",
    attributionModel: "Role Split",
    attributionDesc:
      "Credit is split by predefined percentages based on each partner's role — technology partner, implementation partner, and referral partner each get their agreed share.",
    commissionStructure: [
      { tier: "Technology Partner", rate: "5–10%", threshold: "Integration-sourced deals" },
      { tier: "Implementation Partner", rate: "15–20%", threshold: "Services revenue" },
      { tier: "Co-Sell Partner", rate: "10–15%", threshold: "Joint pipeline deals" },
    ],
    tiers: [
      { name: "Compatible", partners: "Listed integration", perks: "Marketplace listing, API access" },
      { name: "Preferred", partners: "Certified + 5 joint customers", perks: "+ Joint marketing, co-branded docs" },
      { name: "Premier", partners: "10+ joint customers", perks: "+ Joint roadmap input, executive alignment" },
    ],
    kpis: [
      { metric: "Joint customer count", target: "10+ per partner", icon: Users },
      { metric: "Integration adoption", target: ">30% of mutual customers", icon: Layers },
      { metric: "Co-sell pipeline", target: "$100K+/quarter", icon: TrendingUp },
      { metric: "Partner NPS", target: ">50", icon: Star },
    ],
    setupTime: "~20 minutes",
    portalFeatures: [
      "Integration status dashboard",
      "Co-sell deal registration",
      "Joint customer tracking",
      "Revenue attribution by integration",
      "Partner roadmap visibility",
      "Technical certification programs",
    ],
    whenToUse: [
      "Your product has APIs/integrations that create joint value",
      "Multiple partners often contribute to a single deal",
      "You want to grow through ecosystem effects, not just direct sales",
      "Partners include both technology vendors and service providers",
    ],
  },
  {
    slug: "affiliate",
    name: "Affiliate Program",
    subtitle: "For companies scaling through high-volume content creators and influencers",
    icon: Users,
    color: "#f59e0b",
    bestFor: "PLG SaaS, tools, and platforms with self-serve onboarding",
    attributionModel: "Source Wins",
    attributionDesc:
      "Last-click attribution — the affiliate whose link drove the signup gets credit. Simple tracking, automated payouts, zero ambiguity.",
    commissionStructure: [
      { tier: "Standard", rate: "20%", threshold: "Recurring (12 months)" },
      { tier: "Power", rate: "25%", threshold: "10+ conversions/month" },
      { tier: "Elite", rate: "30%", threshold: "50+ conversions/month" },
    ],
    tiers: [
      { name: "Standard", partners: "Open enrollment", perks: "Tracking links, basic dashboard" },
      { name: "Power", partners: "10+ conversions/month", perks: "+ Custom landing pages, higher rates" },
      { name: "Elite", partners: "50+ conversions/month", perks: "+ Dedicated manager, exclusive promotions" },
    ],
    kpis: [
      { metric: "Conversion rate", target: ">3%", icon: Target },
      { metric: "Cost per acquisition", target: "<$50", icon: Coins },
      { metric: "Active affiliates", target: ">20% of enrolled", icon: Users },
      { metric: "Revenue per click", target: ">$0.50", icon: BarChart2 },
    ],
    setupTime: "~10 minutes",
    portalFeatures: [
      "Affiliate link generator",
      "Click and conversion tracking",
      "Real-time earnings dashboard",
      "Automated payout scheduling",
      "Creative asset library",
      "Performance leaderboard",
    ],
    whenToUse: [
      "Your product has self-serve signup (no sales cycle needed)",
      "Content creators and bloggers write about your category",
      "You want to scale acquisition without scaling sales headcount",
      "Average deal values are lower but volume is high",
    ],
  },
  {
    slug: "co-sell",
    name: "Co-Sell Program",
    subtitle: "For companies running joint selling motions with strategic partners",
    icon: Handshake,
    color: "#ef4444",
    bestFor: "Enterprise SaaS with complex, multi-partner deal cycles",
    attributionModel: "Role Split",
    attributionDesc:
      "Multi-touch attribution across all partners involved in a deal. Each partner's contribution is tracked — sourcing, technical validation, implementation, executive sponsorship — and credit is split proportionally.",
    commissionStructure: [
      { tier: "Sourcing Partner", rate: "10–15%", threshold: "Originated the opportunity" },
      { tier: "Technical Partner", rate: "5–10%", threshold: "POC/demo support" },
      { tier: "Implementation Partner", rate: "15–25%", threshold: "Delivery & services" },
      { tier: "Executive Sponsor", rate: "3–5%", threshold: "CxO relationship" },
    ],
    tiers: [
      { name: "Registered", partners: "Signed agreement", perks: "Co-sell registration, basic portal" },
      { name: "Preferred", partners: "$250K+ joint pipeline", perks: "+ Joint planning, MDF access" },
      { name: "Strategic", partners: "$1M+ joint revenue", perks: "+ Executive alignment, joint GTM" },
    ],
    kpis: [
      { metric: "Joint win rate", target: ">40%", icon: TrendingUp },
      { metric: "Average deal size (joint)", target: "2x direct", icon: Coins },
      { metric: "Partner-influenced pipeline", target: ">50%", icon: BarChart2 },
      { metric: "Deal velocity (partner-assisted)", target: "20% faster", icon: Zap },
    ],
    setupTime: "~20 minutes",
    portalFeatures: [
      "Joint deal registration",
      "Multi-partner attribution tracking",
      "Co-sell playbooks & templates",
      "Shared pipeline visibility",
      "Partner role assignment per deal",
      "QBR report generation",
    ],
    whenToUse: [
      "Enterprise deals involve 2+ partners (technology + services + channel)",
      "Your sales cycle is 3+ months with multiple stakeholders",
      "Partners add meaningful value beyond just referrals",
      "You need to track who did what on complex, high-value deals",
    ],
  },
];

export default function TemplatesPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
      {/* Nav */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#9ca3af",
          fontSize: ".85rem",
          textDecoration: "none",
          marginBottom: 16,
        }}
      >
        <ArrowLeft size={14} /> Back to Covant
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          Partner Program Templates
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: 640 }}>
          Don&apos;t build from scratch. Pick a proven program template, customize the commission
          rates and tiers, and launch in minutes — not months.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "white",
              color: "black",
              borderRadius: 8,
              fontSize: ".9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Try a Template <ArrowRight size={14} />
          </Link>
          <Link
            href="/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "transparent",
              color: "white",
              border: "1px solid #333",
              borderRadius: 8,
              fontSize: ".9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Not sure which? Take the assessment
          </Link>
        </div>
      </div>

      {/* Quick selector cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: "3.5rem",
        }}
      >
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          return (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "16px",
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: 10,
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              <Icon size={20} color={t.color} />
              <span style={{ color: "white", fontWeight: 600, fontSize: ".85rem" }}>
                {t.name.replace(" Program", "")}
              </span>
              <span style={{ color: "#6b7280", fontSize: ".75rem", lineHeight: 1.4 }}>
                {t.bestFor}
              </span>
            </a>
          );
        })}
      </div>

      {/* Template detail sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          return (
            <section key={t.slug} id={t.slug}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${t.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={t.color} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </h2>
                  <p style={{ color: "#9ca3af", fontSize: ".85rem", margin: 0 }}>{t.subtitle}</p>
                </div>
              </div>

              {/* Meta pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 24,
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    padding: "4px 12px",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 20,
                    fontSize: ".75rem",
                    color: "#9ca3af",
                  }}
                >
                  Best for: {t.bestFor}
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 20,
                    fontSize: ".75rem",
                    color: "#9ca3af",
                  }}
                >
                  ⏱ Setup: {t.setupTime}
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}30`,
                    borderRadius: 20,
                    fontSize: ".75rem",
                    color: t.color,
                    fontWeight: 600,
                  }}
                >
                  {t.attributionModel}
                </span>
              </div>

              {/* 3-column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 16,
                }}
              >
                {/* Attribution Model */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    Attribution Model
                  </h3>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: ".95rem",
                      marginBottom: 6,
                      color: "white",
                    }}
                  >
                    {t.attributionModel}
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: ".82rem", lineHeight: 1.55, margin: 0 }}>
                    {t.attributionDesc}
                  </p>
                </div>

                {/* Commission Structure */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    Commission Structure
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.commissionStructure.map((c) => (
                      <div
                        key={c.tier}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span
                            style={{ fontSize: ".85rem", fontWeight: 600, color: "white" }}
                          >
                            {c.tier}
                          </span>
                          <span
                            style={{
                              fontSize: ".72rem",
                              color: "#6b7280",
                              marginLeft: 8,
                            }}
                          >
                            {c.threshold}
                          </span>
                        </div>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: ".95rem",
                            color: t.color,
                          }}
                        >
                          {c.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tier Structure */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    Partner Tiers
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {t.tiers.map((tier) => (
                      <div key={tier.name}>
                        <div
                          style={{
                            fontSize: ".85rem",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {tier.name}{" "}
                          <span style={{ fontWeight: 400, color: "#6b7280", fontSize: ".75rem" }}>
                            — {tier.partners}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: ".78rem",
                            color: "#9ca3af",
                            marginTop: 2,
                          }}
                        >
                          {tier.perks}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPIs */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    Key Metrics to Track
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {t.kpis.map((kpi) => {
                      const KIcon = kpi.icon;
                      return (
                        <div
                          key={kpi.metric}
                          style={{ display: "flex", alignItems: "center", gap: 10 }}
                        >
                          <KIcon size={14} color={t.color} style={{ flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: ".85rem", color: "white" }}>
                              {kpi.metric}
                            </span>
                            <span
                              style={{
                                fontSize: ".75rem",
                                color: t.color,
                                fontWeight: 700,
                                marginLeft: 8,
                              }}
                            >
                              {kpi.target}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Portal Features */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    Partner Portal Includes
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {t.portalFeatures.map((f) => (
                      <div
                        key={f}
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        <CheckCircle2 size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: ".82rem", color: "#d1d5db" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* When to Use */}
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 12,
                    padding: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "#6b7280",
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    When to Use This Template
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.whenToUse.map((w) => (
                      <div
                        key={w}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <ArrowRight
                          size={12}
                          color={t.color}
                          style={{ flexShrink: 0, marginTop: 3 }}
                        />
                        <span style={{ fontSize: ".82rem", color: "#d1d5db", lineHeight: 1.45 }}>
                          {w}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 20,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/demo"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: `${t.color}`,
                    color: "white",
                    borderRadius: 8,
                    fontSize: ".82rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Launch with this template <ArrowRight size={13} />
                </Link>
                <Link
                  href="/portal-preview"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: "transparent",
                    color: "#9ca3af",
                    border: "1px solid #333",
                    borderRadius: 8,
                    fontSize: ".82rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  See the partner portal
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: "4rem",
          padding: "2.5rem",
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Not sure which template fits?
        </h2>
        <p style={{ color: "#9ca3af", marginBottom: 20, fontSize: ".9rem" }}>
          Take our 2-minute partner program assessment — we&apos;ll recommend the right structure
          based on your program maturity, partner count, and goals.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "white",
              color: "black",
              borderRadius: 8,
              fontSize: ".9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Take the Assessment <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "transparent",
              color: "white",
              border: "1px solid #333",
              borderRadius: 8,
              fontSize: ".9rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
}
