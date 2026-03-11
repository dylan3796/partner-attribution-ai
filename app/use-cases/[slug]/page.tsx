import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ slug: string }> };

type Stat = { value: string; label: string };
type Step = { title: string; description: string };
type BeforeAfter = { before: string; after: string };

type UseCaseDetail = {
  slug: string;
  persona: string;
  headline: string;
  subheadline: string;
  color: string;
  heroStats: Stat[];
  problemTitle: string;
  problemNarrative: string;
  painPoints: { title: string; description: string }[];
  solutionTitle: string;
  solutionSteps: Step[];
  beforeAfter: BeforeAfter[];
  outcomeTitle: string;
  outcomes: string[];
  quotePerson: string;
  quoteRole: string;
  quoteText: string;
  relatedSlugs: string[];
  ctaPrimary: string;
  ctaSecondary: string;
};

const USE_CASES: Record<string, UseCaseDetail> = {
  "vp-partnerships": {
    slug: "vp-partnerships",
    persona: "VP of Partnerships",
    headline: "Prove partner ROI to your board — with data, not anecdotes",
    subheadline: "You know your partners drive revenue. The board wants proof. Covant gives you the attribution intelligence to show exactly how much pipeline and revenue each partner influences.",
    color: "#6366f1",
    heroStats: [
      { value: "8-12x", label: "Average partner program ROI proven in 90 days" },
      { value: "73%", label: "Of VPs can't quantify partner-influenced revenue" },
      { value: "4hrs/wk", label: "Saved on manual reporting and attribution" },
    ],
    problemTitle: "The attribution black hole",
    problemNarrative: "Every quarter, you sit in the board meeting and someone asks: \"What's the actual ROI on the partner program?\" You have anecdotes. You have a spreadsheet someone on your team maintains. You have gut feel. What you don't have is a number you'd stake your job on. Meanwhile, the direct sales team has Salesforce dashboards showing exact pipeline contribution. Your partner team? A best guess.",
    painPoints: [
      { title: "No partner-sourced vs partner-influenced split", description: "Your CRM tracks who closed the deal, not who influenced it. Partners get zero credit for the 6 months of technical enablement they provided." },
      { title: "Board decks are guesswork", description: "You spend 5 hours every quarter building slides with approximate numbers. One wrong question exposes the entire methodology." },
      { title: "Tier decisions lack data", description: "Promoting a partner to Gold? Demoting one from Platinum? Without attribution data, every tier change is a political negotiation." },
      { title: "AE pushback on partner credit", description: "Your AEs don't trust partner attribution because there's no paper trail. Disputes eat hours of your team's time." },
    ],
    solutionTitle: "How Covant solves it",
    solutionSteps: [
      { title: "Connect your CRM in 2 minutes", description: "Salesforce or HubSpot — Covant syncs deals, contacts, and activities automatically. No data entry, no CSV imports." },
      { title: "Attribution runs automatically", description: "Every deal gets attributed using your chosen model — Deal Reg Protection, Source Wins, or Role Split. You see exactly which partners touched which deals." },
      { title: "Real-time executive dashboard", description: "Partner-sourced revenue, partner-influenced pipeline, conversion rates by partner, revenue trends — all live, all accurate." },
      { title: "Data-driven tier management", description: "Partner health scores combine revenue, pipeline, engagement, and velocity. Tier recommendations are automatic — no politics." },
    ],
    beforeAfter: [
      { before: "\"Partners contributed... roughly $2M this quarter?\"", after: "\"Partners sourced $1.4M and influenced $3.2M across 47 deals.\"" },
      { before: "5 hours building quarterly board slides from spreadsheets", after: "One-click export of real-time attribution dashboard" },
      { before: "Tier changes decided by relationship strength", after: "Tier changes driven by revenue velocity and engagement scores" },
      { before: "AE disputes about who deserves credit", after: "Audit trail showing every touchpoint and calculation step" },
    ],
    outcomeTitle: "What changes in 90 days",
    outcomes: [
      "You walk into the board meeting with exact partner-sourced and partner-influenced revenue numbers",
      "Tier decisions are backed by data — no more political negotiations",
      "AE disputes drop because every attribution has a transparent audit trail",
      "You can quantify the ROI of adding one more partner to the program",
      "Your partner team is treated like a revenue center, not a cost center",
    ],
    quotePerson: "Sarah Chen",
    quoteRole: "VP Partnerships, Series C SaaS (35 resellers)",
    quoteText: "If I can't show the AE the exact logic behind the attribution, they reject the output. I need a paper trail that makes disputes impossible — not a dashboard that makes them pretty.",
    relatedSlugs: ["revops", "partner-manager"],
    ctaPrimary: "See the executive dashboard →",
    ctaSecondary: "Try the ROI calculator",
  },
  "revops": {
    slug: "revops",
    persona: "Revenue Operations",
    headline: "Automate the commission nightmare — from calculation to payout",
    subheadline: "You're spending 20 hours a month on partner payout spreadsheets. Commission disputes eat your team's time. Covant makes commission calculation, approval, and payment fully automatic.",
    color: "#22c55e",
    heroStats: [
      { value: "20hrs/mo", label: "Average time saved on commission operations" },
      { value: "80%", label: "Reduction in partner payout disputes" },
      { value: "0", label: "Manual commission calculations after setup" },
    ],
    problemTitle: "The spreadsheet tax",
    problemNarrative: "Every month, someone on your team opens a spreadsheet, pulls deal data from the CRM, cross-references it with partner agreements, calculates commissions using a formula that only one person understands, and sends the results for approval. The entire process takes days. When a partner disputes a number — and they always do — it takes even longer to trace back through the logic. This is 2026. There's no reason this should be manual.",
    painPoints: [
      { title: "Commission calculations take days", description: "Pulling data, matching it to agreements, applying tier-based rates, handling split deals — it's a multi-day process every payout cycle." },
      { title: "Disputes are expensive", description: "When a partner questions their payout, you have to trace the logic backward through spreadsheets. Average resolution time: 3-5 business days." },
      { title: "No audit trail", description: "If the person who built the spreadsheet leaves, the institutional knowledge goes with them. Auditors hate this." },
      { title: "Inconsistent timing", description: "Partners don't know when to expect payouts. Late payments erode trust and create noise for your team." },
    ],
    solutionTitle: "How Covant solves it",
    solutionSteps: [
      { title: "Define commission rules once", description: "Set up rules by partner type, tier, product line, or deal size. Tiered rates, role-based splits, performance accelerators — all configurable." },
      { title: "Commissions calculate automatically", description: "When a deal is approved, Covant applies attribution, matches commission rules, and calculates the payout instantly. Zero manual work." },
      { title: "Approval workflows built in", description: "Bulk approve payouts with one click. Escalation paths for large amounts. Full audit log of who approved what and when." },
      { title: "Partners see their own numbers", description: "The partner portal shows real-time commission status, attribution data, and payout history. Disputes disappear when partners can see the math." },
    ],
    beforeAfter: [
      { before: "2 days calculating commissions in Excel every month", after: "Commissions calculated in real-time as deals close" },
      { before: "3-5 days to resolve a partner payout dispute", after: "Partners self-serve via portal — see attribution + math" },
      { before: "One person understands the commission spreadsheet", after: "Rules codified in the system with full audit trail" },
      { before: "Partners email asking 'where's my check?'", after: "Automated notifications at every payout stage" },
    ],
    outcomeTitle: "What changes in 30 days",
    outcomes: [
      "Commission calculations are instant and error-free",
      "Partner disputes drop 80% because they can see their own data",
      "End-of-quarter reconciliation takes minutes instead of days",
      "Full audit trail satisfies compliance and finance teams",
      "Your team reclaims 20+ hours per month for actual revenue operations",
    ],
    quotePerson: "Elena Torres",
    quoteRole: "VP Partnerships, 140 partners across complex tiers",
    quoteText: "Commission disputes eat my team alive every quarter. If partners could just see the math themselves — what the attribution was, what rate applied, how the number was calculated — 80% of those disputes go away overnight.",
    relatedSlugs: ["vp-partnerships", "partner-manager"],
    ctaPrimary: "See automated payouts →",
    ctaSecondary: "Explore commission rules",
  },
  "partner-manager": {
    slug: "partner-manager",
    persona: "Partner Manager",
    headline: "Know exactly where every partner stands — without the chaos",
    subheadline: "You're managing 50+ partners with no centralized view. Some are thriving, some are going dark, and you won't know which until it's too late. Covant gives you the visibility to manage at scale.",
    color: "#f59e0b",
    heroStats: [
      { value: "2x", label: "More partners managed per person" },
      { value: "<10min", label: "Time to fully onboard a new partner" },
      { value: "3 weeks", label: "Earlier detection of at-risk partners" },
    ],
    problemTitle: "The visibility gap",
    problemNarrative: "You have 60 partners. You know 10 of them well because they ping you on Slack. The other 50? You check in when you remember, or when a deal surfaces. By the time you notice a partner has gone quiet, they've already signed with a competitor. Partner management at scale requires systems, not just relationships.",
    painPoints: [
      { title: "No single view of partner activity", description: "Deal pipeline in the CRM, emails in Outlook, engagement in a spreadsheet, commission data in finance. Nothing connects." },
      { title: "Onboarding is a black box", description: "A new partner signs up and then... crickets. You don't know if they've completed training, registered a deal, or even logged into the portal." },
      { title: "At-risk partners are invisible", description: "A partner's engagement drops for 3 months before anyone notices. By then, the relationship is cold." },
      { title: "Incentive programs are unmeasurable", description: "You launch a SPIF or bonus program but can't tell who's participating or whether it's driving behavior." },
    ],
    solutionTitle: "How Covant solves it",
    solutionSteps: [
      { title: "Unified partner dashboard", description: "Every partner's deals, pipeline, commissions, engagement, and onboarding status in one view. Filter by tier, type, territory, or risk level." },
      { title: "Automated onboarding tracking", description: "6-stage onboarding pipeline from signed to producing. Milestone tracking flags stalled partners automatically." },
      { title: "Engagement scoring", description: "Real-time health scores based on deal activity, portal logins, commission trends, and pipeline velocity. At-risk partners surface before they churn." },
      { title: "White-label partner portal", description: "Partners self-serve: register deals, track commissions, see performance metrics, access resources. Branded with your company, not Covant." },
    ],
    beforeAfter: [
      { before: "Checking 4 systems to understand one partner's status", after: "One dashboard shows everything per partner" },
      { before: "New partners disappear after signing", after: "Onboarding pipeline with automated milestone alerts" },
      { before: "At-risk partners noticed months too late", after: "Engagement scores flag risk 3 weeks earlier" },
      { before: "Partners email you for basic info", after: "Self-serve portal handles 80% of partner questions" },
    ],
    outcomeTitle: "What changes in 60 days",
    outcomes: [
      "You manage 2x more partners without hiring — because the system handles the routine",
      "Every new partner is fully onboarded in under 10 minutes",
      "At-risk partners are flagged 3 weeks before they'd normally surface",
      "Partners stop emailing you for commission status — they check the portal",
      "Your manager sees partner engagement data that justifies headcount asks",
    ],
    quotePerson: "Marcus Webb",
    quoteRole: "VP Partnerships, Series B (12 partners, building from scratch)",
    quoteText: "I need a partner to go from invite link to registered deal in under 10 minutes. If it takes a week of back-and-forth to get someone onboarded, I've already lost them. The portal has to be instant.",
    relatedSlugs: ["vp-partnerships", "revops"],
    ctaPrimary: "See the partner portal →",
    ctaSecondary: "Explore onboarding flow",
  },
};

const PERSONA_LABELS: Record<string, string> = {
  "vp-partnerships": "VP of Partnerships",
  "revops": "Revenue Operations",
  "partner-manager": "Partner Manager",
};

export async function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uc = USE_CASES[slug];
  if (!uc) return {};
  return {
    title: `${uc.persona} — Use Cases | Covant`,
    description: uc.subheadline,
    openGraph: {
      title: `Covant for ${uc.persona} — ${uc.headline}`,
      description: uc.subheadline,
    },
  };
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const uc = USE_CASES[slug];
  if (!uc) notFound();

  const relatedCases = uc.relatedSlugs
    .map((s) => USE_CASES[s])
    .filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ color:'#0a0a0a', textDecoration: "none", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          Covant.ai
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/use-cases" style={{ color:'#6b7280', fontSize: ".85rem", textDecoration: "none" }}>All Use Cases</Link>
          <Link href="/beta" style={{ color: "#000", background: "#fff", fontSize: "0.85rem", textDecoration: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600 }}>
            Join Beta
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "32px 0 0" }}>
          <Link href="/use-cases" style={{ display: "inline-flex", alignItems: "center", gap: 6, color:'#6b7280', fontSize: ".85rem", textDecoration: "none" }}>
            <ArrowLeft size={14} /> All use cases
          </Link>
        </div>

        {/* Hero */}
        <section style={{ padding: "48px 0 56px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: uc.color, marginBottom: 16 }}>
            {uc.persona}
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color:'#0a0a0a', letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 20 }}>
            {uc.headline}
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#888", lineHeight: 1.7, maxWidth: 640 }}>
            {uc.subheadline}
          </p>

          {/* Hero stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 40 }}>
            {uc.heroStats.map((s) => (
              <div key={s.label} style={{ padding: "20px", borderRadius: 12, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: uc.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: ".8rem", color:'#6b7280', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem section */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#ef4444", marginBottom: 12 }}>The Problem</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 20 }}>{uc.problemTitle}</h2>
          <p style={{ fontSize: ".95rem", color: "#888", lineHeight: 1.8, marginBottom: 32 }}>{uc.problemNarrative}</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {uc.painPoints.map((p) => (
              <div key={p.title} style={{ padding: "20px", borderRadius: 12, background:'#f9fafb', border: "1px solid #1a1a1a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <X size={14} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <div style={{ fontSize: ".9rem", fontWeight: 700, color:'#0a0a0a' }}>{p.title}</div>
                </div>
                <div style={{ fontSize: ".8rem", color:'#6b7280', lineHeight: 1.6 }}>{p.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Solution section */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: uc.color, marginBottom: 12 }}>The Solution</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 32 }}>{uc.solutionTitle}</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {uc.solutionSteps.map((s, i) => (
              <div key={s.title} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${uc.color}20`, color: uc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: ".9rem", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color:'#0a0a0a', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: ".9rem", color: "#888", lineHeight: 1.6 }}>{s.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#888", marginBottom: 12 }}>Before & After</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 32 }}>The difference Covant makes</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {uc.beforeAfter.map((ba, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "16px 20px", borderRadius: 10, background:'#f9fafb', border: "1px solid #1a1a1a" }}>
                  <div style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#ef4444", marginBottom: 6 }}>Before</div>
                  <div style={{ fontSize: ".85rem", color: "#888", lineHeight: 1.5 }}>{ba.before}</div>
                </div>
                <div style={{ padding: "16px 20px", borderRadius: 10, background: `${uc.color}08`, border: `1px solid ${uc.color}25` }}>
                  <div style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: uc.color, marginBottom: 6 }}>After</div>
                  <div style={{ fontSize: ".85rem", color:'#374151', lineHeight: 1.5 }}>{ba.after}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
          <blockquote style={{ margin: 0, padding: "32px", borderRadius: 16, background:'#f9fafb', border: "1px solid #1a1a1a", position: "relative" }}>
            <div style={{ fontSize: "3rem", color: uc.color, lineHeight: 1, marginBottom: 8, fontWeight: 800 }}>&ldquo;</div>
            <p style={{ fontSize: "1.05rem", color:'#374151', lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>
              {uc.quoteText}
            </p>
            <footer>
              <div style={{ fontSize: ".9rem", fontWeight: 700, color:'#0a0a0a' }}>{uc.quotePerson}</div>
              <div style={{ fontSize: ".8rem", color:'#6b7280' }}>{uc.quoteRole}</div>
            </footer>
          </blockquote>
        </section>

        {/* Outcomes */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: uc.color, marginBottom: 12 }}>Results</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 24 }}>{uc.outcomeTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {uc.outcomes.map((o) => (
              <div key={o} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: ".95rem", color:'#374151', lineHeight: 1.5 }}>
                <Check size={16} style={{ color: uc.color, flexShrink: 0, marginTop: 3 }} />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "64px 0 48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 12 }}>Ready to see it in action?</h2>
          <p style={{ color:'#6b7280', marginBottom: 24, fontSize: ".95rem" }}>Start free — no card required. Set up your program in under 5 minutes.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{ padding: "14px 28px", borderRadius: 8, background: "#fff", color: "#000", fontWeight: 700, fontSize: ".95rem", textDecoration: "none" }}>
              Get Started Free →
            </Link>
            <Link href="/product" style={{ padding: "14px 28px", borderRadius: 8, border: "1px solid #333", color: "#999", fontWeight: 600, fontSize: ".95rem", textDecoration: "none" }}>
              Product Tour
            </Link>
          </div>
        </section>

        {/* Related use cases */}
        {relatedCases.length > 0 && (
          <section style={{ padding: "48px 0 64px", borderTop: "1px solid #1a1a1a" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color:'#6b7280', marginBottom: 20 }}>
              Related use cases
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${relatedCases.length}, 1fr)`, gap: 16 }}>
              {relatedCases.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/use-cases/${rc.slug}`}
                  style={{
                    padding: "20px",
                    borderRadius: 12,
                    border: "1px solid #1a1a1a",
                    background:'#f9fafb',
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: rc.color }}>{rc.persona}</div>
                  <div style={{ fontSize: ".95rem", fontWeight: 700, color:'#0a0a0a', lineHeight: 1.3 }}>{rc.headline.split("—")[0].trim()}</div>
                  <div style={{ fontSize: ".8rem", color:'#6b7280', display: "flex", alignItems: "center", gap: 4, marginTop: "auto" }}>
                    Read more <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
