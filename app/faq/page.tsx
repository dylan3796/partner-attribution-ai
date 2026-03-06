import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FAQSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ — Covant Partner Intelligence Platform",
  description:
    "Common questions about Covant: pricing, implementation, security, integrations, attribution models, and partner portal features.",
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
        a: "Better — there's a permanent free tier. Up to 5 active partners, 3 commission rules, full attribution engine, no credit card required. Most teams start free and upgrade to Pro when they add their 6th partner.",
      },
      {
        q: "Can I import existing partner data?",
        a: "Yes. Upload a CSV from the Partners page or connect your CRM (Salesforce, HubSpot) to sync automatically. Field mapping happens during setup so your data lands in the right place.",
      },
    ],
  },
  {
    title: "Attribution & Commissions",
    items: [
      {
        q: "What attribution models does Covant support?",
        a: "Three models built for how partner programs actually work: Deal Reg Protection (registering partner wins — standard for reseller programs), Source Wins (sourcing partner gets credit — for referral networks), and Role Split (predefined % by partner type — for co-sell programs). Each model produces a full audit trail.",
      },
      {
        q: "How do you handle attribution disputes?",
        a: "Every attribution decision comes with a step-by-step paper trail: deal value → credit percentage → partner amount → commission. When an AE or partner questions a number, you show them the exact logic — not a spreadsheet formula.",
      },
      {
        q: "Can I set different commission rates for different partners?",
        a: "Yes. Commission rules support conditions like partner tier, deal size, product type, and territory. Gold reseller gets 20%, referral partner gets 10%, enterprise deals over $100K get a different rate — all configurable without code.",
      },
      {
        q: "How are payouts processed?",
        a: "Covant calculates commissions automatically when deals close or get approved. Payouts go through an approval workflow (individual or bulk), and you can export reconciliation reports for your finance team. Stripe integration handles the actual money movement.",
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
        a: "Yes. Beyond CRM integrations, Covant supports Slack notifications, Stripe for billing and payouts, webhooks for real-time events, and a full API. Most teams connect their CRM in the first session and add other tools over time.",
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
        a: "Data is stored in Convex's cloud infrastructure (US regions). We maintain a full audit trail of all data changes — every attribution calculation, commission update, and payout approval is logged with timestamps and actor information.",
      },
      {
        q: "Is there SOC 2 compliance?",
        a: "We're working toward SOC 2 Type II certification as part of our 2026 roadmap. Our infrastructure providers (Convex, Clerk, Vercel) maintain their own SOC 2 certifications. Enterprise customers can request our security questionnaire.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    items: [
      {
        q: "How does pricing work?",
        a: "Pricing is engine-based. Partner Portal is always free. Add AI engines (Attribution, Incentives, Intelligence, CRM) individually or as a bundle. Tiers: Starter (≤25 partners), Growth (≤100), Scale (unlimited). Enterprise custom pricing available for large programs.",
      },
      {
        q: "What counts as an 'active partner'?",
        a: "A partner is active if they have any deals, touchpoints, or portal activity in the current billing period. Inactive partners don't count toward your limit. You can have unlimited inactive/archived partners on any plan.",
      },
      {
        q: "Can I switch plans anytime?",
        a: "Yes. Upgrade or downgrade from the billing settings page. Upgrades take effect immediately with prorated billing. Downgrades apply at the end of the current billing cycle.",
      },
      {
        q: "Is there a discount for annual billing?",
        a: "Yes — annual plans save roughly 20% compared to monthly. Contact us for annual pricing on Pro and Scale plans. Enterprise plans are always custom-quoted.",
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
        background: "#000",
        color: "#fff",
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
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.03em",
          }}
        >
          covant
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link
            href="/pricing"
            style={{ color: "#888", fontSize: "0.85rem", textDecoration: "none" }}
          >
            Pricing
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
            Join Beta
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
            color: "#666",
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
          <Link href="/contact" style={{ color: "#818cf8", textDecoration: "none" }}>
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
                color: "#fff",
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
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Join the Beta →
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
