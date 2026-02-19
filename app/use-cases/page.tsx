import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases — Covant",
  description: "See how VP Partnerships, RevOps leaders, and Partner Managers use Covant to run world-class partner programs.",
  openGraph: {
    title: "Covant Use Cases — Partner Attribution for Every Role",
    description: "From proving partner ROI to automating commissions, see how Covant solves real partner ops problems.",
  },
};

type UseCase = {
  persona: string;
  title: string;
  subtitle: string;
  painPoints: string[];
  solutions: { feature: string; description: string }[];
  outcome: string;
  cta: string;
  color: string;
  emoji: string;
};

const useCases: UseCase[] = [
  {
    persona: "VP of Partnerships",
    title: "Prove partner ROI to your board",
    subtitle: "You know partners drive revenue. Now prove it with data.",
    emoji: "📊",
    color: "#6366f1",
    painPoints: [
      "Can't quantify partner-sourced vs partner-influenced revenue",
      "Board asks for partner ROI and you're stuck with anecdotes",
      "No visibility into which partners actually drive pipeline",
      "Tier decisions are based on gut feel, not data",
    ],
    solutions: [
      { feature: "Multi-touch attribution", description: "See exactly how much revenue each partner influences across 5 attribution models." },
      { feature: "Executive dashboard", description: "Real-time metrics: partner-sourced revenue, pipeline, conversion rates, and trends." },
      { feature: "Partner scoring & tiering", description: "Data-driven tier recommendations based on revenue, engagement, pipeline, and velocity." },
      { feature: "ROI calculator", description: "Show the board exactly what your partner program returns per dollar invested." },
    ],
    outcome: "Average customer proves 8-12x ROI on their partner program within 90 days.",
    cta: "See the executive dashboard →",
  },
  {
    persona: "Revenue Operations",
    title: "Automate the commission nightmare",
    subtitle: "Stop spending 20 hours a month on partner payout spreadsheets.",
    emoji: "⚙️",
    color: "#22c55e",
    painPoints: [
      "Commission calculations take days of manual spreadsheet work",
      "Disputes with partners over attribution and payout amounts",
      "No audit trail for how commissions were calculated",
      "Payout timing is inconsistent and partners complain",
    ],
    solutions: [
      { feature: "Automatic commission calculation", description: "When a deal closes, commissions are calculated instantly based on attribution and rate tiers." },
      { feature: "Full audit trail", description: "Every calculation is logged with the model used, attribution percentages, and approval chain." },
      { feature: "Payout automation", description: "Approved commissions flow directly to Stripe Connect for automated ACH/wire payouts." },
      { feature: "Dispute resolution", description: "Partners see their own attribution data in the portal, reducing disputes by 80%." },
    ],
    outcome: "RevOps teams save 15-20 hours per month and eliminate payout disputes.",
    cta: "See automated payouts →",
  },
  {
    persona: "Partner Manager",
    title: "Know exactly where every partner stands",
    subtitle: "Stop flying blind. See onboarding progress, deal pipeline, and engagement in one place.",
    emoji: "🤝",
    color: "#f59e0b",
    painPoints: [
      "Managing 50+ partners with no centralized view of activity",
      "No idea which partners are engaged vs going dark",
      "Onboarding new partners takes months with no tracking",
      "Incentive programs are hard to measure and manage",
    ],
    solutions: [
      { feature: "Partner onboarding tracker", description: "6-stage pipeline from signed → producing with milestone tracking and blocker alerts." },
      { feature: "Engagement scoring", description: "Real-time engagement scores flag at-risk partners before they churn." },
      { feature: "Incentive programs", description: "Create SPIFs, bonuses, and accelerators with automatic enrollment and progress tracking." },
      { feature: "Partner portal", description: "Self-serve portal where partners register deals, track commissions, access resources, and see their performance." },
    ],
    outcome: "Partner managers handle 2x more partners with better engagement scores.",
    cta: "See the partner portal →",
  },
];

const additionalUseCases = [
  { title: "Channel conflict resolution", description: "When multiple partners claim the same account, Covant flags the conflict and provides data to resolve it fairly.", icon: "⚡" },
  { title: "MDF program management", description: "Allocate marketing development funds, track spend, and measure ROI on partner marketing activities.", icon: "📣" },
  { title: "Deal registration", description: "Partners register deals through the portal. Automated approval workflows with exclusivity windows.", icon: "📝" },
  { title: "Volume rebate programs", description: "Set up tiered rebate structures that calculate automatically as partners hit volume thresholds.", icon: "📈" },
  { title: "CRM integration", description: "Bi-directional sync with Salesforce and HubSpot. Deals, contacts, and activities flow automatically.", icon: "☁️" },
  { title: "Webhook event ingestion", description: "Receive events from any system via webhooks. Map external events to partner touchpoints automatically.", icon: "🔌" },
];

export default function UseCasesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e5e5" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", textDecoration: "none", letterSpacing: "-.02em" }}>covant</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ fontSize: ".9rem", color: "#888" }}>Use Cases</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/docs" style={{ fontSize: ".8rem", color: "#666", textDecoration: "none" }}>API Docs</Link>
          <Link href="/dashboard" style={{ fontSize: ".8rem", color: "#666", textDecoration: "none" }}>Dashboard →</Link>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
            Built for how partner teams<br />actually work
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto" }}>
            Whether you&apos;re proving ROI to the board, automating commissions, or managing 100 partners — Covant fits your workflow.
          </p>
        </div>

        {/* Main use cases */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", marginBottom: "4rem" }}>
          {useCases.map((uc) => (
            <div key={uc.persona} style={{ border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid #1a1a1a", background: `${uc.color}08` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.5rem" }}>{uc.emoji}</span>
                  <span style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: uc.color }}>{uc.persona}</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>{uc.title}</h2>
                <p style={{ color: "#888", fontSize: ".95rem" }}>{uc.subtitle}</p>
              </div>

              <div style={{ padding: "2rem 2.5rem" }}>
                {/* Pain points */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#ef4444", marginBottom: 10 }}>The Problem</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {uc.painPoints.map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".85rem", color: "#888" }}>
                        <span style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}>✕</span>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: uc.color, marginBottom: 10 }}>How Covant Solves It</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {uc.solutions.map((s) => (
                      <div key={s.feature} style={{ padding: "12px 16px", borderRadius: 10, background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
                        <div style={{ fontSize: ".85rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.feature}</div>
                        <div style={{ fontSize: ".8rem", color: "#666", lineHeight: 1.5 }}>{s.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, background: `${uc.color}10`, border: `1px solid ${uc.color}30` }}>
                  <div>
                    <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: uc.color, marginBottom: 4 }}>Outcome</div>
                    <div style={{ fontSize: ".9rem", color: "#ccc" }}>{uc.outcome}</div>
                  </div>
                  <Link href="/dashboard" style={{ padding: "8px 16px", borderRadius: 8, background: uc.color, color: "#fff", fontSize: ".8rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                    {uc.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional use cases grid */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: "2rem" }}>
            And everything else you need
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {additionalUseCases.map((uc) => (
              <div key={uc.title} style={{ padding: "1.25rem", borderRadius: 12, border: "1px solid #1a1a1a", background: "#0a0a0a" }}>
                <span style={{ fontSize: "1.3rem", display: "block", marginBottom: 8 }}>{uc.icon}</span>
                <h3 style={{ fontSize: ".95rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>{uc.title}</h3>
                <p style={{ fontSize: ".8rem", color: "#666", lineHeight: 1.5 }}>{uc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "3rem 0", borderTop: "1px solid #1a1a1a" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: ".75rem" }}>Ready to see it in action?</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>Explore the live demo — no signup required.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/dashboard" style={{ padding: "12px 24px", borderRadius: 8, background: "#fff", color: "#000", fontWeight: 700, textDecoration: "none" }}>Explore Demo</Link>
            <Link href="/program" style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #333", color: "#999", fontWeight: 600, textDecoration: "none" }}>Partner Program →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
