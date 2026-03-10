import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Partner Program Glossary | Covant.ai",
  description:
    "A comprehensive glossary of partner program terms — attribution, commissions, deal registration, PRM, and more. The definitive reference for VPs of Partnerships and channel teams.",
  openGraph: {
    title: "Partner Program Glossary | Covant.ai",
    description: "Every term a VP of Partnerships needs to know, defined clearly.",
    url: "https://covant.ai/glossary",
  },
};

/* ── Term data ── */
type GlossaryTerm = {
  term: string;
  slug: string;
  definition: string;
  example?: string;
  relatedLinks?: { label: string; href: string }[];
  category: string;
};

const CATEGORIES = [
  "Attribution & Tracking",
  "Commissions & Payouts",
  "Partner Management",
  "Deal Flow",
  "Analytics & Reporting",
  "Platform & Operations",
];

const TERMS: GlossaryTerm[] = [
  // Attribution & Tracking
  {
    term: "Partner Attribution",
    slug: "partner-attribution",
    category: "Attribution & Tracking",
    definition:
      "The process of determining which partner(s) influenced or sourced a deal, and how much credit each partner receives. Accurate attribution is the foundation of every partner program — it determines commissions, partner health scores, and program ROI.",
    example:
      "A partner refers a prospect, another partner co-sells the deal, and a third provides technical enablement. Attribution determines how credit is split between all three.",
    relatedLinks: [
      { label: "Why Attribution Is Broken", href: "/blog/why-partner-attribution-is-broken" },
      { label: "Attribution Engine", href: "/features" },
      { label: "3 Attribution Models", href: "/blog/3-attribution-models-every-vp-should-know" },
    ],
  },
  {
    term: "Multi-Touch Attribution",
    slug: "multi-touch-attribution",
    category: "Attribution & Tracking",
    definition:
      "An attribution model that distributes deal credit across multiple partner touchpoints rather than giving 100% credit to a single interaction. Reflects the reality that most enterprise deals involve multiple partner contributions over weeks or months.",
    example:
      "A deal has 6 touchpoints across 3 partners — multi-touch attribution might assign 40% credit to the sourcing partner, 35% to the co-sell partner, and 25% to the enablement partner based on interaction weights.",
    relatedLinks: [
      { label: "Attribution Models Guide", href: "/blog/3-attribution-models-every-vp-should-know" },
    ],
  },
  {
    term: "First-Touch Attribution",
    slug: "first-touch-attribution",
    category: "Attribution & Tracking",
    definition:
      "An attribution model that gives 100% of deal credit to the first partner interaction — typically the partner who sourced or referred the opportunity. Simple to implement but doesn't account for partners who contributed later in the sales cycle.",
  },
  {
    term: "Last-Touch Attribution",
    slug: "last-touch-attribution",
    category: "Attribution & Tracking",
    definition:
      "An attribution model that gives 100% of deal credit to the final partner interaction before the deal closed. Common in referral programs but can unfairly ignore partners who sourced and nurtured the opportunity.",
  },
  {
    term: "Deal Reg Protection",
    slug: "deal-reg-protection",
    category: "Attribution & Tracking",
    definition:
      "An attribution model where the partner who registers a deal first receives full credit. The industry standard for reseller programs (roughly 80% of the market). Incentivizes early deal registration and prevents channel conflict by establishing clear ownership.",
    example:
      "Partner A registers a deal for Acme Corp on March 1st. Partner B tries to register the same deal on March 5th — Partner A's registration is protected and they receive full credit when the deal closes.",
    relatedLinks: [
      { label: "Deal Registration Guide", href: "/blog/partner-deal-registration-best-practices" },
    ],
  },
  {
    term: "Source Wins",
    slug: "source-wins",
    category: "Attribution & Tracking",
    definition:
      "An attribution model where the partner who originally sourced or introduced the opportunity receives full credit, regardless of who else was involved in the sales process. Common in referral and affiliate programs.",
  },
  {
    term: "Role Split",
    slug: "role-split",
    category: "Attribution & Tracking",
    definition:
      "An attribution model that assigns predefined credit percentages based on each partner's role in the deal — e.g., reseller gets 50%, technology partner gets 30%, referral partner gets 20%. Used in co-sell programs where multiple partners consistently contribute to deals.",
  },
  {
    term: "Touchpoint",
    slug: "touchpoint",
    category: "Attribution & Tracking",
    definition:
      "Any recorded interaction between a partner and a deal or opportunity. Touchpoints are the raw data that attribution models use to calculate credit. Common types include referrals, co-sell meetings, technical demos, content shares, and deal registrations.",
    example:
      "A partner logs a 'co-sell meeting' touchpoint on March 3rd, followed by a 'technical demo' touchpoint on March 10th. Both are factored into the attribution calculation when the deal closes.",
  },
  {
    term: "Attribution Audit Trail",
    slug: "attribution-audit-trail",
    category: "Attribution & Tracking",
    definition:
      "A step-by-step record showing exactly how attribution credit was calculated for each partner on a deal — touchpoint timeline, model applied, credit percentages, and resulting commission amounts. Essential for resolving disputes and building trust with AEs and partners.",
    relatedLinks: [
      { label: "Product Tour", href: "/product" },
    ],
  },

  // Commissions & Payouts
  {
    term: "Partner Commission",
    slug: "partner-commission",
    category: "Commissions & Payouts",
    definition:
      "A payment made to a partner based on their attributed contribution to a closed deal. Commissions are typically a percentage of the deal value and vary by partner tier, product line, deal size, and partner type.",
    relatedLinks: [
      { label: "Commission Structure Guide", href: "/blog/how-to-build-partner-commission-structure" },
    ],
  },
  {
    term: "Commission Rule",
    slug: "commission-rule",
    category: "Commissions & Payouts",
    definition:
      "A configurable rule that determines how commissions are calculated. Rules can be based on partner type (reseller, referral, affiliate), partner tier (bronze, silver, gold), product line, deal size thresholds, or a combination. Complex programs may have dozens of rules with priority ordering.",
    example:
      "Rule: Gold-tier resellers earn 20% commission on Enterprise product deals over $50K, but only 15% on deals under $50K.",
  },
  {
    term: "Payout",
    slug: "payout",
    category: "Commissions & Payouts",
    definition:
      "The actual disbursement of earned commissions to a partner. Payouts go through a lifecycle: pending (calculated but not approved), approved (ready for payment), and paid (disbursed). Bulk approval workflows help finance teams process payouts efficiently.",
  },
  {
    term: "Commission Reconciliation",
    slug: "commission-reconciliation",
    category: "Commissions & Payouts",
    definition:
      "The end-of-period process of verifying that all commissions were calculated correctly, matching payouts against closed deals, and identifying discrepancies. Typically performed quarterly. A reconciliation report provides the audit trail for finance sign-off.",
    relatedLinks: [
      { label: "ROI Calculator", href: "/roi" },
    ],
  },
  {
    term: "Commission Dispute",
    slug: "commission-dispute",
    category: "Commissions & Payouts",
    definition:
      "A formal disagreement raised by a partner (or internally) about the commission amount on a specific deal. Disputes typically arise from attribution disagreements, incorrect tier assignments, or product-line commission rate mismatches. Resolution requires an audit trail showing the calculation logic.",
  },
  {
    term: "MDF (Market Development Funds)",
    slug: "mdf",
    category: "Commissions & Payouts",
    definition:
      "Funds allocated by a vendor to partners for joint marketing activities — events, campaigns, content creation, demand generation. Partners submit MDF requests with budget justification and expected ROI. Admins approve, deny, or adjust based on program budget and partner tier.",
  },

  // Partner Management
  {
    term: "PRM (Partner Relationship Management)",
    slug: "prm",
    category: "Partner Management",
    definition:
      "A platform for managing the full lifecycle of partner relationships — recruitment, onboarding, enablement, deal tracking, commissions, and performance analytics. Covant is an AI-native PRM that replaces spreadsheet-based partner management.",
    relatedLinks: [
      { label: "Compare PRMs", href: "/compare" },
      { label: "Cost of Spreadsheets", href: "/blog/true-cost-of-spreadsheet-partner-programs" },
    ],
  },
  {
    term: "Partner Tier",
    slug: "partner-tier",
    category: "Partner Management",
    definition:
      "A classification level (e.g., Bronze, Silver, Gold, Platinum) assigned to partners based on performance, certification completion, or revenue contribution. Tiers typically determine commission rates, portal access levels, MDF eligibility, and co-marketing privileges.",
  },
  {
    term: "Partner Health Score",
    slug: "partner-health-score",
    category: "Partner Management",
    definition:
      "A composite metric (typically 0-100) that quantifies a partner's overall engagement and performance. Factors include deal activity, revenue contribution, touchpoint engagement, recency of activity, and payout health. Used to identify at-risk partners before they churn.",
    relatedLinks: [
      { label: "Partner Intelligence", href: "/blog/partner-intelligence-data-driven-programs" },
    ],
  },
  {
    term: "Partner Portal",
    slug: "partner-portal",
    category: "Partner Management",
    definition:
      "A dedicated, partner-facing web application where partners can register deals, track commissions, view performance analytics, access certifications, and communicate with the vendor. White-labeled portals remove vendor branding so partners see the program owner's brand.",
    relatedLinks: [
      { label: "Portal Preview", href: "/portal-preview" },
      { label: "Build a Great Portal", href: "/blog/partner-portal-partners-actually-use" },
    ],
  },
  {
    term: "White-Label",
    slug: "white-label",
    category: "Partner Management",
    definition:
      "The practice of removing the platform vendor's branding from partner-facing pages so partners see only the program owner's brand. Covant's portal is fully white-labeled — no 'Powered by' badges, custom domains supported, and branding customizable.",
  },
  {
    term: "Partner Onboarding",
    slug: "partner-onboarding",
    category: "Partner Management",
    definition:
      "The process of bringing a new partner from initial signup to their first deal registration. Effective onboarding includes profile setup, certification completion, portal orientation, and first-deal coaching. Covant tracks onboarding completion with progress bars and automated checklist steps.",
  },
  {
    term: "Channel Conflict",
    slug: "channel-conflict",
    category: "Partner Management",
    definition:
      "A situation where multiple partners (or a partner and the direct sales team) compete for the same deal or customer. Deal registration is the primary mechanism for preventing channel conflict — the first partner to register a deal receives protection.",
  },

  // Deal Flow
  {
    term: "Deal Registration",
    slug: "deal-registration",
    category: "Deal Flow",
    definition:
      "A process where partners formally register an opportunity they've sourced or are working. Registered deals receive protection — other partners or direct sales can't claim credit. Registration typically includes customer name, deal size, expected close date, and product.",
    relatedLinks: [
      { label: "Deal Registration Guide", href: "/blog/partner-deal-registration-best-practices" },
    ],
  },
  {
    term: "Pipeline",
    slug: "pipeline",
    category: "Deal Flow",
    definition:
      "The collection of all active deals in various stages of the sales process — from registered to in-progress to closed (won or lost). Pipeline visibility helps VPs forecast partner-sourced revenue and identify stalled deals.",
  },
  {
    term: "Win Rate",
    slug: "win-rate",
    category: "Deal Flow",
    definition:
      "The percentage of deals that close as 'won' versus the total number of deals (won + lost). Win rate by partner reveals which partners consistently convert, and win rate by product shows which offerings sell best through the channel.",
  },
  {
    term: "Deal Velocity",
    slug: "deal-velocity",
    category: "Deal Flow",
    definition:
      "The average number of days from deal registration to close. Faster deal velocity means shorter sales cycles and more efficient partner engagement. Comparing velocity across partners identifies top performers and highlights process bottlenecks.",
  },

  // Analytics & Reporting
  {
    term: "QBR (Quarterly Business Review)",
    slug: "qbr",
    category: "Analytics & Reporting",
    definition:
      "A structured quarterly meeting between the vendor and partner to review performance, discuss strategy, and align on goals. QBR reports typically include revenue trends, pipeline analysis, win/loss ratios, top deals, and action items for the next quarter.",
    relatedLinks: [
      { label: "Measure Partner ROI", href: "/blog/measure-partner-program-roi" },
    ],
  },
  {
    term: "Revenue Intelligence",
    slug: "revenue-intelligence",
    category: "Analytics & Reporting",
    definition:
      "Analytics focused on understanding where partner revenue comes from, how concentrated it is, and where the risks are. Includes revenue breakdown by partner type, tier, and product, plus concentration risk analysis (e.g., 'top 3 partners generate 60% of revenue').",
    relatedLinks: [
      { label: "Partner Intelligence", href: "/blog/partner-intelligence-data-driven-programs" },
    ],
  },
  {
    term: "Partner Leaderboard",
    slug: "partner-leaderboard",
    category: "Analytics & Reporting",
    definition:
      "A ranked list of partners based on a composite performance score — typically combining revenue, deal count, win rate, and engagement metrics. Leaderboards drive healthy competition and give VPs instant visibility into who's performing and who needs attention.",
  },
  {
    term: "Partner Scorecard",
    slug: "partner-scorecard",
    category: "Analytics & Reporting",
    definition:
      "A one-page performance summary for a specific partner — health score, revenue trends, key metrics, top deals, and auto-generated insights. Used for QBR prep, leadership reporting, and partner-facing performance reviews.",
  },

  // Platform & Operations
  {
    term: "Partner Intelligence Platform",
    slug: "partner-intelligence-platform",
    category: "Platform & Operations",
    definition:
      "A software platform that goes beyond basic PRM (partner relationship management) by adding AI-driven insights — health scoring, attribution modeling, revenue intelligence, and proactive recommendations. Covant is a partner intelligence platform, not just payout infrastructure.",
  },
  {
    term: "CRM Sync",
    slug: "crm-sync",
    category: "Platform & Operations",
    definition:
      "Bi-directional data synchronization between the partner platform and a CRM (Salesforce, HubSpot). Deals, contacts, and pipeline data flow automatically between systems so partner attribution is calculated against the same data the sales team sees.",
    relatedLinks: [
      { label: "Salesforce Integration", href: "/integrations/salesforce" },
      { label: "HubSpot Integration", href: "/integrations/hubspot" },
    ],
  },
  {
    term: "Webhook",
    slug: "webhook",
    category: "Platform & Operations",
    definition:
      "An HTTP callback that sends real-time event notifications to external systems when something happens — a deal closes, a partner is created, a commission is paid. Webhooks enable custom integrations without polling the API.",
    relatedLinks: [
      { label: "Webhooks Integration", href: "/integrations/webhooks" },
      { label: "API Docs", href: "/docs" },
    ],
  },
  {
    term: "HMAC Signing",
    slug: "hmac-signing",
    category: "Platform & Operations",
    definition:
      "A security mechanism that signs webhook payloads with a shared secret so the receiving system can verify the request came from Covant and wasn't tampered with. Each webhook endpoint has its own rotating signing secret.",
  },
];

/* ── Helpers ── */
function getTermsByCategory(category: string) {
  return TERMS.filter((t) => t.category === category);
}

function getAlphabeticalIndex() {
  const letters: Record<string, GlossaryTerm[]> = {};
  for (const t of [...TERMS].sort((a, b) => a.term.localeCompare(b.term))) {
    const letter = t.term[0].toUpperCase();
    if (!letters[letter]) letters[letter] = [];
    letters[letter].push(t);
  }
  return letters;
}

/* ── Page ── */
export default function GlossaryPage() {
  const alphabetical = getAlphabeticalIndex();
  const letters = Object.keys(alphabetical).sort();

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#666",
          fontSize: ".85rem",
          textDecoration: "none",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={14} /> Back to Covant
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BookOpen size={22} style={{ color: "#818cf8" }} />
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "rgba(129,140,248,.7)",
              margin: 0,
            }}
          >
            Reference
          </p>
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 800,
            letterSpacing: "-.02em",
            lineHeight: 1.15,
            marginBottom: ".5rem",
          }}
        >
          Partner Program Glossary
        </h1>
        <p style={{ color: "#666", lineHeight: 1.6, maxWidth: 600 }}>
          {TERMS.length} terms every VP of Partnerships, RevOps lead, and partner
          manager should know — from attribution models to webhook signing.
        </p>
      </div>

      {/* Alphabet jump nav */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          marginBottom: "2.5rem",
          padding: "12px 16px",
          background: "rgba(255,255,255,.03)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: ".8rem",
              fontWeight: 700,
              color: "#818cf8",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
          >
            {l}
          </a>
        ))}
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#444",
            fontSize: ".75rem",
          }}
        >
          <Search size={12} /> {TERMS.length} terms
        </span>
      </div>

      {/* Category overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem",
          marginBottom: "3rem",
        }}
      >
        {CATEGORIES.map((cat) => {
          const count = getTermsByCategory(cat).length;
          return (
            <a
              key={cat}
              href={`#cat-${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              style={{
                padding: "14px 16px",
                background: "rgba(255,255,255,.03)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,.06)",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: ".85rem", color: "#fff", marginBottom: 2 }}>
                {cat}
              </div>
              <div style={{ fontSize: ".75rem", color: "#555" }}>{count} terms</div>
            </a>
          );
        })}
      </div>

      {/* Terms by category */}
      {CATEGORIES.map((cat) => {
        const terms = getTermsByCategory(cat);
        return (
          <section
            key={cat}
            id={`cat-${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            style={{ marginBottom: "3rem" }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "-.01em",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                paddingBottom: 8,
                marginBottom: "1.25rem",
              }}
            >
              {cat}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {terms.map((t) => (
                <div
                  key={t.slug}
                  id={`term-${t.slug}`}
                  style={{
                    padding: "1.25rem 1.5rem",
                    background: "rgba(255,255,255,.02)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: ".95rem",
                      fontWeight: 700,
                      margin: "0 0 6px",
                      color: "#fff",
                    }}
                  >
                    {t.term}
                  </h3>
                  <p
                    style={{
                      color: "#999",
                      fontSize: ".85rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {t.definition}
                  </p>
                  {t.example && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "10px 14px",
                        background: "rgba(129,140,248,.06)",
                        borderRadius: 6,
                        borderLeft: "3px solid rgba(129,140,248,.3)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: ".7rem",
                          fontWeight: 700,
                          color: "#818cf8",
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                        }}
                      >
                        Example
                      </span>
                      <p
                        style={{
                          color: "#888",
                          fontSize: ".8rem",
                          lineHeight: 1.6,
                          margin: "4px 0 0",
                        }}
                      >
                        {t.example}
                      </p>
                    </div>
                  )}
                  {t.relatedLinks && t.relatedLinks.length > 0 && (
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {t.relatedLinks.map((rl) => (
                        <Link
                          key={rl.href}
                          href={rl.href}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: ".75rem",
                            fontWeight: 600,
                            color: "#818cf8",
                            textDecoration: "none",
                            padding: "3px 10px",
                            borderRadius: 4,
                            background: "rgba(129,140,248,.08)",
                            transition: "background 0.15s",
                          }}
                        >
                          <ExternalLink size={10} /> {rl.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Alphabetical index */}
      <section style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: "2rem" }}>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-.01em",
            marginBottom: "1.5rem",
          }}
        >
          A–Z Index
        </h2>
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#818cf8",
                marginBottom: 6,
              }}
            >
              {letter}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {alphabetical[letter].map((t) => (
                <a
                  key={t.slug}
                  href={`#term-${t.slug}`}
                  style={{
                    fontSize: ".85rem",
                    color: "#888",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                >
                  {t.term}
                  <span style={{ color: "#333", fontSize: ".75rem", marginLeft: 8 }}>
                    {t.category}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2.5rem",
          background: "rgba(255,255,255,.03)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.06)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
          See these concepts in action
        </h2>
        <p style={{ color: "#666", fontSize: ".9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Covant turns partner program theory into a working product — attribution,
          commissions, portal, and intelligence in one platform.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/demo"
            className="btn"
            style={{ textDecoration: "none", padding: "10px 24px", fontSize: ".85rem" }}
          >
            Try the Demo →
          </Link>
          <Link
            href="/features"
            style={{
              textDecoration: "none",
              color: "#818cf8",
              fontSize: ".85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              border: "1px solid rgba(129,140,248,.2)",
              borderRadius: 8,
            }}
          >
            All Features →
          </Link>
        </div>
      </section>
    </div>
  );
}
