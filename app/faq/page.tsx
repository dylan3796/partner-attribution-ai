import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FAQSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ — Covant",
  description:
    "Common questions about Covant: the platform, the four agents (PSM, PAM, Program, Ops), design-partner pilots, implementation, security, integrations, and the branded partner portal.",
};

type FAQItem = { q: string; a: string };
type FAQSection = { title: string; items: FAQItem[] };

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "How long does implementation take?",
        a: "Most teams are live in under an hour. Our AI-powered setup extracts your program config from a single conversation — no multi-week integrations. Connect your CRM, invite partners, and you're running.",
      },
      {
        q: "Do I need engineering resources to set up Covant?",
        a: "No. Covant is designed for partner operations teams. CRM connections are OAuth-based (click to connect), partner invites are link-based, and commission rules are configured through the UI. API access is available if your team wants deeper integrations.",
      },
      {
        q: "Is there a free trial?",
        a: "We're in design-partner phase. During pilot, you get full platform access — ledger, portal, deal reg, commission rules, and the four agents as they ship — free. Design partners lock in pricing at GA.",
      },
      {
        q: "Can I import existing partner data?",
        a: "Yes. Upload a CSV from the Partners page or connect your CRM (Salesforce, HubSpot) to sync automatically. Field mapping happens during setup so your data lands in the right place.",
      },
      {
        q: "Can I use Covant without connecting a CRM?",
        a: "Yes. Covant works from day one with just opportunities and the partner portal — no CRM required. When you're ready, connect Salesforce or HubSpot and the ledger starts ingesting closed-won deals automatically. More data = sharper agents, but the floor is useful on day one.",
      },
    ],
  },
  {
    title: "The Four Agents",
    items: [
      {
        q: "What are the four agents?",
        a: "Four in-product agents, one per partner-team persona. PSM Agent finds co-sell overlap and drafts warm intros. PAM Agent watches partner health and writes the weekly check-in. Program Agent spots tier and incentive drift and proposes fixes. Ops Agent reconciles attribution and flags disputes before they land.",
      },
      {
        q: "Do the agents act on their own?",
        a: "No. Every agent action is a proposal. Your team reviews, approves, edits, or rejects. The system then executes and logs. You get leverage without losing control.",
      },
      {
        q: "Are the agents optional?",
        a: "Yes. The platform (ledger, portal, deal reg, revenue intelligence) runs standalone. Turn agents on as you're ready — many teams start with Ops Agent for attribution reconciliation and add the others over 30 days.",
      },
    ],
  },
  {
    title: "Ledger, Attribution & Commissions",
    items: [
      {
        q: "What attribution models does Covant support?",
        a: "The ledger runs whichever model your team agreed on: Deal Reg Protection (registering partner wins — standard for reseller programs), Source Wins (sourcing partner gets credit — for referral networks), Role Split (predefined % by partner type — for co-sell programs), first-touch, last-touch, time-decay, and equal-split. Each model produces a full audit trail.",
      },
      {
        q: "How do you handle attribution disputes?",
        a: "Every attribution decision comes with a step-by-step paper trail: deal value → credit percentage → partner amount → commission. The Ops Agent flags dispute-risk patterns early (e.g., a partner who registered the deal but is receiving <50% of expected commission). When an AE or partner questions a number, you open the ledger, not a spreadsheet.",
      },
      {
        q: "Can I set different commission rates for different partners?",
        a: "Yes. Commission rules support conditions like partner tier, deal size, product type, and territory. Gold reseller gets 20%, referral partner gets 10%, enterprise deals over $100K get a different rate — all configurable without code. The Program Agent dry-runs any rule change against the last 90 days before it activates.",
      },
      {
        q: "Does Covant pay partners?",
        a: "No. Covant is a revenue intelligence platform — we record every touchpoint, capture every deal, measure partner contribution, and produce defensible commission math. Your finance team handles actual payment on whatever rails they already use (bank transfers, AP, or any payout tool). You keep the rails; we keep the receipts.",
      },
      {
        q: "How is commission math calculated?",
        a: "The ledger calculates commissions automatically when deals close — rule match, tier check, attribution model, dollar amount. The Ops Agent reconciles across every deal and flags any mismatch early. Every number traces back to a deal, a touchpoint, and a rule. Export the variance report to your finance team.",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        q: "Which CRMs do you support?",
        a: "Salesforce and HubSpot are fully supported with OAuth-based connections. Deals, contacts, and accounts sync automatically. We also offer webhooks and a REST API for custom integrations with any system.",
      },
      {
        q: "Can I connect Covant to our existing tech stack?",
        a: "Yes. Beyond CRM integrations, Covant supports Slack notifications, webhooks for real-time events, and a full REST API. Most teams connect their CRM in the first session and add other tools over time.",
      },
      {
        q: "Does data sync in real time?",
        a: "CRM syncs run on a configurable schedule (default: every 15 minutes). Webhook events and API calls are real time. Dashboard data updates instantly when changes are made within Covant.",
      },
    ],
  },
  {
    title: "Partner Portal",
    items: [
      {
        q: "What can partners see in the portal?",
        a: "Partners get a white-labeled portal where they can register deals, track commission earnings, view performance metrics, see tier progress, and access notifications — all scoped to their own data. No Covant branding visible.",
      },
      {
        q: "How do partners access the portal?",
        a: "You send an invite link from the Partners page. Partners click the link, fill out a quick profile form, and they're in. No separate app install, no complex onboarding — just a browser.",
      },
      {
        q: "Can I customize the portal for my brand?",
        a: "The portal is fully white-labeled — no Covant branding appears. Partners see your program name and interact with your deal registration forms, commission structures, and tier definitions.",
      },
    ],
  },
  {
    title: "Security & Compliance",
    items: [
      {
        q: "How is my data protected?",
        a: "All data is encrypted at rest and in transit (TLS 1.3). We use Clerk for authentication with support for SSO on Enterprise plans. Every query is org-scoped server-side — there's no way for one customer to access another's data.",
      },
      {
        q: "Do you offer a DPA?",
        a: "Yes. Our Data Processing Agreement is available at covant.ai/dpa and covers GDPR, CCPA, and standard contractual clauses. Enterprise customers can request custom DPA terms.",
      },
      {
        q: "Where is data stored?",
        a: "Data is stored in Convex's cloud infrastructure (US regions). We maintain a full audit trail of all data changes — every attribution calculation, commission update, and agent proposal is logged with timestamps and actor information.",
      },
      {
        q: "Is there SOC 2 compliance?",
        a: "We're working toward SOC 2 Type II certification as part of our 2026 roadmap. Our infrastructure providers (Convex, Clerk, Vercel) maintain their own SOC 2 certifications. Enterprise customers can request our security questionnaire.",
      },
    ],
  },
  {
    title: "Design Partners & Pricing",
    items: [
      {
        q: "How does pricing work?",
        a: "We're onboarding a small cohort of design partners right now. Design partners get the full platform — ledger, portal, deal reg, commission rules, and the four agents as they ship — free during pilot, with locked-in pricing at GA. Public pricing lands with general availability.",
      },
      {
        q: "Who are design partners and what do you expect from them?",
        a: "Partner-program teams at Seed–Series B B2B SaaS companies, willing to run Covant as their program of record for 60 days and give us 30 minutes of feedback per week. In exchange: free during pilot, locked-in pricing at GA, direct line to the founding team, and the option of a case-study conversation if the pilot works.",
      },
      {
        q: "Is the partner portal really free?",
        a: "Yes. The branded partner portal has unlimited partner seats on every plan, including pilot. Your partners don't pay, don't see Covant branding, and get a real workspace for deal registration, commission visibility, MDF requests, and certifications.",
      },
    ],
  },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const id = `faq-${index}`;
  return (
    <details className="faq-item" id={id}>
      <summary className="faq-question">{item.q}</summary>
      <div className="faq-answer">{item.a}</div>
    </details>
  );
}

export default function FAQPage() {
  const allItems = FAQ_SECTIONS.flatMap((s) => s.items);

  const faqQuestions = allItems.map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background:'#f9fafb',
        color:'#0a0a0a',
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <FAQSchema questions={faqQuestions} />
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid #111",
        }}
      >
        <Link
          href="/"
          style={{
            color:'#0a0a0a',
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.03em",
          }}
        >
          Covant.ai
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link
            href="/platform"
            style={{ color: "#888", fontSize: "0.85rem", textDecoration: "none" }}
          >
            Platform
          </Link>
          <Link
            href="/beta"
            style={{
              color: "#000",
              background: "#fff",
              fontSize: "0.85rem",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Become a design partner
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: "80px 40px 40px", maxWidth: 800, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color:'#6b7280',
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Frequently Asked Questions
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#888",
            lineHeight: 1.6,
            maxWidth: 600,
          }}
        >
          Everything you need to know about Covant. Can&apos;t find what you&apos;re looking
          for?{" "}
          <Link href="/contact" style={{ color:'#0a0a0a', textDecoration: "none" }}>
            Get in touch
          </Link>
          .
        </p>
      </section>

      {/* FAQ Sections */}
      <section style={{ padding: "0 40px 80px", maxWidth: 800, margin: "0 auto" }}>
        {FAQ_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color:'#0a0a0a',
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #1a1a1a",
              }}
            >
              {section.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {section.items.map((item, ii) => (
                <FAQAccordion
                  key={ii}
                  item={item}
                  index={si * 100 + ii}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "60px 40px",
          borderTop: "1px solid #111",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "0.75rem",
          }}
        >
          Still have questions?
        </h2>
        <p
          style={{
            color: "#888",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          Talk to us — we respond within 24 hours.
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
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 24px",
              background: "#fff",
              color: "#000",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Contact Us
          </Link>
          <Link
            href="/beta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 24px",
              background: "transparent",
              color:'#0a0a0a',
              border: "1px solid #333",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Become a design partner →
          </Link>
        </div>
      </section>

      <style>{`
        .faq-item {
          border-bottom: 1px solid #1a1a1a;
        }
        .faq-question {
          padding: 18px 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #e5e5e5;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 0.15s;
        }
        .faq-question::-webkit-details-marker {
          display: none;
        }
        .faq-question::after {
          content: '+';
          font-size: 1.25rem;
          font-weight: 300;
          color: #555;
          flex-shrink: 0;
          margin-left: 1rem;
          transition: transform 0.2s;
        }
        details[open] > .faq-question::after {
          content: '−';
          color: #818cf8;
        }
        .faq-question:hover {
          color: #fff;
        }
        details[open] > .faq-question {
          color: #fff;
        }
        .faq-answer {
          padding: 0 0 18px;
          font-size: 0.9rem;
          color: #999;
          line-height: 1.7;
          max-width: 680px;
        }
        @media (max-width: 640px) {
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          nav {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
