import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckCircle2, XCircle, MinusCircle, ArrowRight, ArrowLeft,
  Brain, Zap, Shield, Users, BarChart3, DollarSign,
  Clock, Workflow, Globe, Bot, Target, TrendingUp,
} from "lucide-react";

/* ── Competitor Data ── */

type FeatureRow = {
  category: string;
  feature: string;
  covant: "yes" | "partial" | "no";
  competitor: "yes" | "partial" | "no";
  covantNote?: string;
  competitorNote?: string;
};

type CompetitorData = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  whatTheyAre: string;
  founded: string;
  pricing: string;
  bestFor: string;
  features: FeatureRow[];
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
  switchReasons: { title: string; description: string; icon: typeof Brain }[];
  verdict: string;
};

const COMPETITORS: Record<string, CompetitorData> = {
  partnerstack: {
    name: "PartnerStack",
    slug: "partnerstack",
    tagline: "PartnerStack is a partner management and payout platform. Covant is a partner intelligence platform.",
    description: "PartnerStack focuses on partner recruitment, marketplace distribution, and automated payouts. It's built for SaaS companies running affiliate and referral programs at scale. Covant focuses on attribution intelligence, commission logic, and revenue analytics for VPs managing strategic partner programs.",
    whatTheyAre: "Partner ecosystem platform for SaaS — recruitment, marketplace, payouts",
    founded: "2015 · Toronto",
    pricing: "Custom pricing (typically $800+/mo)",
    bestFor: "SaaS companies running high-volume affiliate/referral programs with marketplace distribution",
    features: [
      { category: "Attribution", feature: "Multi-touch attribution models", covant: "yes", competitor: "no", covantNote: "5 models including Deal Reg Protection, Source Wins, Role Split", competitorNote: "Single-touch referral tracking only" },
      { category: "Attribution", feature: "Attribution audit trail", covant: "yes", competitor: "no", covantNote: "Step-by-step calculation chain per deal", competitorNote: "No audit trail — just link/referral credit" },
      { category: "Attribution", feature: "Revenue intelligence & analytics", covant: "yes", competitor: "partial", competitorNote: "Basic reporting — revenue by partner, payout totals" },
      { category: "Commissions", feature: "Complex commission rules", covant: "yes", competitor: "partial", covantNote: "Rules by product, tier, deal size, partner type", competitorNote: "Percentage-based, limited product-level rules" },
      { category: "Commissions", feature: "Automated payout processing", covant: "yes", competitor: "yes", competitorNote: "Strong — built-in payout infrastructure" },
      { category: "Commissions", feature: "Commission dispute resolution", covant: "yes", competitor: "no" },
      { category: "Portal", feature: "Partner portal", covant: "yes", competitor: "yes", competitorNote: "Marketplace-style portal with partner directory" },
      { category: "Portal", feature: "Deal registration", covant: "yes", competitor: "partial", competitorNote: "Referral link tracking, not traditional deal reg" },
      { category: "Portal", feature: "Partner certifications", covant: "yes", competitor: "partial" },
      { category: "Portal", feature: "MDF management", covant: "yes", competitor: "no" },
      { category: "Platform", feature: "Partner marketplace / recruitment", covant: "no", competitor: "yes", competitorNote: "Network of 80K+ partners for discovery" },
      { category: "Platform", feature: "CRM integration (Salesforce, HubSpot)", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "API & webhooks", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "AI-powered setup", covant: "yes", competitor: "no", covantNote: "Natural language → full program config in 15 min" },
      { category: "Intelligence", feature: "Partner health scoring", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "Partner scoring & tiering", covant: "yes", competitor: "partial" },
      { category: "Intelligence", feature: "Forecasting & pipeline analytics", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "Win/loss analysis", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "QBR report generation", covant: "yes", competitor: "no" },
      { category: "Operations", feature: "Setup time", covant: "yes", competitor: "partial", covantNote: "15 minutes", competitorNote: "2–4 weeks typical" },
      { category: "Operations", feature: "Free tier", covant: "yes", competitor: "no", covantNote: "Free for up to 5 partners", competitorNote: "Custom pricing only" },
    ],
    strengths: [
      { title: "Partner marketplace network", description: "80K+ partners in their marketplace means you can recruit partners through PartnerStack itself — a genuine distribution advantage for high-volume programs." },
      { title: "Payout infrastructure", description: "Built-in global payouts with tax form collection, currency conversion, and compliance. They've invested heavily in the money movement side." },
      { title: "SaaS ecosystem focus", description: "Purpose-built for B2B SaaS partner programs. Integrations with common SaaS tools are deep and well-maintained." },
    ],
    weaknesses: [
      { title: "No real attribution", description: "PartnerStack tracks referral links and first-touch credit. There's no multi-touch attribution, no deal reg protection model, and no way to answer 'which partner actually influenced this deal?'" },
      { title: "No revenue intelligence", description: "Basic reporting on payouts and partner activity, but no partner health scores, win/loss analysis, forecasting, or QBR generation. VPs still need spreadsheets for board decks." },
      { title: "Expensive for small programs", description: "Custom pricing typically starts at $800+/mo. No free tier, no self-serve. Overkill for teams with <25 strategic partners." },
      { title: "Referral-centric model", description: "Built around affiliate/referral tracking with link-based attribution. Traditional reseller and co-sell programs with deal registration workflows are an afterthought." },
    ],
    switchReasons: [
      { title: "You need to prove partner ROI to your board", description: "PartnerStack tells you who got paid. Covant tells you which partners actually drive revenue, through what touchpoints, with what attribution model, and generates the QBR to present it.", icon: BarChart3 },
      { title: "Your program is deal-reg based, not referral-link based", description: "If your partners register deals, co-sell with your AEs, and earn commissions on closed-won revenue — that's Covant's sweet spot. PartnerStack is built for link-click referrals.", icon: Shield },
      { title: "You're a VP managing 10–100 strategic partners", description: "PartnerStack is built for scale (500+ affiliates). Covant is built for depth — understanding which of your 50 resellers is actually moving the needle and why.", icon: Target },
      { title: "Commission disputes are eating your time", description: "Covant's attribution audit trail and dispute resolution workflow replace the spreadsheet arguments. Every number has a paper trail.", icon: Brain },
    ],
    verdict: "PartnerStack is excellent for high-volume affiliate and referral programs where you need a partner marketplace and automated payouts at scale. Covant is built for VPs of Partnerships running strategic programs where attribution intelligence, commission logic, and revenue analytics matter more than partner recruitment volume. If you need to prove ROI to your board — not just process payments — Covant is the better fit.",
  },
  "impact-com": {
    name: "impact.com",
    slug: "impact-com",
    tagline: "impact.com is an enterprise partnership platform. Covant is partner intelligence for teams that move fast.",
    description: "impact.com is the enterprise standard for managing affiliate, influencer, and strategic partnerships. It's comprehensive, powerful, and complex. Covant is purpose-built for the VP of Partnerships who needs attribution, commissions, and intelligence — without a 6-month implementation.",
    whatTheyAre: "Enterprise partnership management — affiliates, influencers, strategic partners",
    founded: "2008 · Santa Barbara (formerly Impact Radius)",
    pricing: "Custom enterprise pricing (typically $2,500+/mo)",
    bestFor: "Enterprise companies managing large-scale affiliate + influencer + strategic partner programs with dedicated partnership teams",
    features: [
      { category: "Attribution", feature: "Multi-touch attribution", covant: "yes", competitor: "yes", covantNote: "5 models purpose-built for partner programs", competitorNote: "Strong cross-channel attribution — their original product" },
      { category: "Attribution", feature: "Attribution audit trail", covant: "yes", competitor: "partial", competitorNote: "Attribution data available but not partner-specific audit trails" },
      { category: "Attribution", feature: "Revenue intelligence", covant: "yes", competitor: "partial", competitorNote: "Reporting focused on affiliate metrics, not partner program ROI" },
      { category: "Commissions", feature: "Complex commission rules", covant: "yes", competitor: "yes", competitorNote: "Very flexible — supports complex affiliate commission structures" },
      { category: "Commissions", feature: "Automated payouts", covant: "yes", competitor: "yes", competitorNote: "Enterprise-grade payout infrastructure with 220+ country support" },
      { category: "Commissions", feature: "Commission disputes", covant: "yes", competitor: "partial" },
      { category: "Portal", feature: "Partner portal", covant: "yes", competitor: "yes", competitorNote: "Full portal with marketplace listing" },
      { category: "Portal", feature: "Deal registration", covant: "yes", competitor: "partial", competitorNote: "Not a core workflow — built for affiliate tracking" },
      { category: "Portal", feature: "Partner certifications", covant: "yes", competitor: "no" },
      { category: "Portal", feature: "MDF management", covant: "yes", competitor: "no" },
      { category: "Platform", feature: "Partner discovery marketplace", covant: "no", competitor: "yes", competitorNote: "Large marketplace for affiliate/influencer discovery" },
      { category: "Platform", feature: "Influencer management", covant: "no", competitor: "yes" },
      { category: "Platform", feature: "Fraud detection", covant: "no", competitor: "yes", competitorNote: "Advanced fraud detection for affiliate programs" },
      { category: "Platform", feature: "CRM integration", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "AI-powered setup", covant: "yes", competitor: "no", covantNote: "15-minute setup from natural language", competitorNote: "Weeks-long implementation with dedicated team" },
      { category: "Intelligence", feature: "Partner health scoring", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "Forecasting & pipeline analytics", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "Win/loss analysis", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "QBR report generation", covant: "yes", competitor: "no" },
      { category: "Operations", feature: "Setup time", covant: "yes", competitor: "no", covantNote: "15 minutes", competitorNote: "4–12 weeks with implementation team" },
      { category: "Operations", feature: "Free tier", covant: "yes", competitor: "no", covantNote: "Free for up to 5 partners", competitorNote: "Enterprise pricing only" },
    ],
    strengths: [
      { title: "Cross-channel attribution", description: "impact.com was originally an attribution company (Impact Radius). Their cross-channel, cross-device attribution across affiliates, influencers, and strategic partners is genuinely best-in-class." },
      { title: "Enterprise scale & compliance", description: "220+ country payout support, advanced fraud detection, SOC 2 compliance, and enterprise SLAs. They serve the Fortune 500 partnership teams." },
      { title: "Affiliate + influencer management", description: "If you run affiliate AND influencer programs alongside strategic partnerships, impact.com handles all three. Covant focuses on strategic partner programs only." },
    ],
    weaknesses: [
      { title: "Massive implementation overhead", description: "4–12 week implementation with a dedicated team. Requires training, custom configuration, and often a solutions consultant. Overkill for teams with <50 partners." },
      { title: "Enterprise pricing, enterprise complexity", description: "Typically $2,500+/mo with annual contracts. The product has years of feature accumulation — powerful but complex. New users report a steep learning curve." },
      { title: "No partner program intelligence", description: "Strong on tracking and payouts, weak on insights. No partner health scores, no pipeline forecasting, no QBR generation, no win/loss analysis. VPs still build board decks manually." },
      { title: "Affiliate-first architecture", description: "The product was built for affiliate marketing and expanded into partnerships. Deal registration, co-sell workflows, and reseller program management feel bolted on rather than native." },
    ],
    switchReasons: [
      { title: "You don't need affiliate or influencer management", description: "If your program is strategic partners (resellers, referral partners, technology partners), you're paying for features you'll never use. Covant is purpose-built for that use case.", icon: Target },
      { title: "Implementation timeline matters", description: "Covant: 15 minutes to first report. impact.com: 4–12 weeks. If you need to prove partner program value this quarter, you can't wait 3 months to get set up.", icon: Clock },
      { title: "You need intelligence, not just tracking", description: "impact.com tracks what happened. Covant tells you why it happened, what's at risk, and what to do about it. Health scores, forecasting, and QBR generation are native.", icon: Brain },
      { title: "Your budget is <$2,500/mo", description: "Covant starts free and scales to $349/mo for 100 partners. impact.com starts where Covant's top tier ends. For growing programs, the math is obvious.", icon: DollarSign },
    ],
    verdict: "impact.com is the right choice for enterprise teams managing large-scale affiliate and influencer programs alongside strategic partnerships, with budget for a multi-month implementation. Covant is built for VPs of Partnerships at growth-stage companies who need attribution intelligence, commission automation, and revenue analytics — set up in 15 minutes, not 15 weeks. If your program is strategic partners (not affiliates), Covant gives you more relevant intelligence at a fraction of the cost.",
  },
  crossbeam: {
    name: "Crossbeam (Reveal)",
    slug: "crossbeam",
    tagline: "Crossbeam finds the overlap. Covant measures the impact.",
    description: "Crossbeam (now part of Reveal) is an account mapping and co-sell intelligence platform. It helps you discover where your partners' customer bases overlap with your prospect list. Covant picks up where Crossbeam leaves off — attributing partner-influenced revenue, calculating commissions, and measuring program ROI.",
    whatTheyAre: "Account mapping and co-sell intelligence for partner ecosystems",
    founded: "2018 · Philadelphia (merged with Reveal in 2024)",
    pricing: "Free tier available · Paid plans from $500+/mo",
    bestFor: "Partnership teams focused on co-sell discovery and account mapping across large partner ecosystems",
    features: [
      { category: "Discovery", feature: "Account overlap / mapping", covant: "no", competitor: "yes", competitorNote: "Core product — best-in-class account mapping" },
      { category: "Discovery", feature: "Co-sell opportunity scoring", covant: "no", competitor: "yes" },
      { category: "Discovery", feature: "Partner ecosystem analytics", covant: "partial", competitor: "yes" },
      { category: "Attribution", feature: "Multi-touch attribution", covant: "yes", competitor: "no", competitorNote: "No attribution — discovery only" },
      { category: "Attribution", feature: "Attribution audit trail", covant: "yes", competitor: "no" },
      { category: "Attribution", feature: "Revenue intelligence", covant: "yes", competitor: "partial", competitorNote: "Overlap value estimates, not actual attribution" },
      { category: "Commissions", feature: "Commission calculation", covant: "yes", competitor: "no" },
      { category: "Commissions", feature: "Automated payouts", covant: "yes", competitor: "no" },
      { category: "Commissions", feature: "Complex commission rules", covant: "yes", competitor: "no" },
      { category: "Portal", feature: "Partner portal", covant: "yes", competitor: "no" },
      { category: "Portal", feature: "Deal registration", covant: "yes", competitor: "no" },
      { category: "Portal", feature: "Partner certifications", covant: "yes", competitor: "no" },
      { category: "Platform", feature: "CRM integration", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "API & webhooks", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "Data sharing controls", covant: "partial", competitor: "yes", competitorNote: "Granular data sharing permissions are core" },
      { category: "Intelligence", feature: "Partner health scoring", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "Forecasting & pipeline analytics", covant: "yes", competitor: "partial" },
      { category: "Intelligence", feature: "Win/loss analysis", covant: "yes", competitor: "no" },
      { category: "Intelligence", feature: "QBR reports", covant: "yes", competitor: "no" },
      { category: "Operations", feature: "Setup time", covant: "yes", competitor: "yes", covantNote: "15 minutes", competitorNote: "CRM connect + partner invites (~1 week)" },
    ],
    strengths: [
      { title: "Account mapping is genuinely unique", description: "No one else does secure, privacy-preserving account overlap analysis as well as Crossbeam/Reveal. It's a category they essentially created." },
      { title: "Co-sell discovery", description: "Identifying which of your prospects are already customers of your partners — and vice versa — is incredibly valuable for pipeline generation." },
      { title: "Ecosystem network effects", description: "The more partners on the platform, the more valuable the data. Crossbeam's network of 18K+ companies creates compounding value." },
    ],
    weaknesses: [
      { title: "Discovery without measurement", description: "Crossbeam tells you 'Partner X has 200 accounts that overlap with your target list.' It doesn't tell you what happened after the co-sell — who drove the deal, what's the attribution, what's the commission." },
      { title: "No partner program management", description: "No portal, no deal registration, no commission calculation, no payout automation. Crossbeam is a data layer — you still need something to run your actual program." },
      { title: "No revenue attribution", description: "Can estimate overlap value but can't attribute actual closed-won revenue to specific partner contributions. VPs can't use Crossbeam data alone to justify program spend." },
    ],
    switchReasons: [
      { title: "You've found the opportunities — now what?", description: "Crossbeam identifies co-sell opportunities. Covant tracks those opportunities through the pipeline, attributes revenue to the right partners, and calculates commissions. They're complements, not competitors.", icon: Workflow },
      { title: "You need to prove partner ROI, not just overlap", description: "Board members don't care about account overlaps. They care about partner-sourced revenue, attribution, and program ROI. Covant generates that analysis.", icon: BarChart3 },
      { title: "You need a partner portal and program ops", description: "Partners need somewhere to register deals, track commissions, and access resources. Crossbeam doesn't provide that — Covant does.", icon: Users },
      { title: "You want one platform for the full lifecycle", description: "Use Crossbeam for discovery. Use Covant for everything after — attribution, commissions, portal, reporting, intelligence. Or start with Covant if your program is deal-reg based.", icon: TrendingUp },
    ],
    verdict: "Crossbeam and Covant solve different problems. Crossbeam is the best tool for discovering co-sell opportunities through account mapping. Covant is the best tool for measuring what happened after those opportunities — attribution, commissions, and revenue intelligence. Most VPs of Partnerships will benefit from both. If you can only pick one, ask yourself: is your bigger problem finding opportunities (Crossbeam) or proving the impact of the ones you've already found (Covant)?",
  },
  impartner: {
    name: "Impartner PRM",
    slug: "impartner",
    tagline: "Impartner is the enterprise PRM. Covant is the intelligent partner platform built for speed.",
    description: "Impartner is the category leader for enterprise channel management — built for Fortune 1000 companies with global reseller networks, deep Salesforce integration, and compliance requirements. Covant is built for modern B2B companies that need attribution intelligence and commission automation without 6 months of implementation.",
    whatTheyAre: "Enterprise PRM — deal reg, portal, MDF, incentives for large channel programs",
    founded: "1997 · Salt Lake City",
    pricing: "Typically $30K–$100K+/year (custom contracts)",
    bestFor: "Fortune 1000 companies with 200+ resellers, dedicated channel ops team, and Salesforce-heavy stack",
    features: [
      { category: "Attribution", feature: "Multi-touch attribution models", covant: "yes", competitor: "partial", covantNote: "5 models including Deal Reg Protection, Source Wins, Role Split", competitorNote: "Basic deal reg credit only — no multi-touch models" },
      { category: "Attribution", feature: "Attribution audit trail", covant: "yes", competitor: "partial" },
      { category: "Attribution", feature: "Revenue intelligence & analytics", covant: "yes", competitor: "yes", competitorNote: "Strong reporting — built for large programs" },
      { category: "Commissions", feature: "Complex commission rules", covant: "yes", competitor: "yes" },
      { category: "Commissions", feature: "Automated payout processing", covant: "yes", competitor: "partial", competitorNote: "Commissions tracked, but payments typically handled externally" },
      { category: "Commissions", feature: "Commission dispute resolution", covant: "yes", competitor: "partial" },
      { category: "Portal", feature: "Partner portal", covant: "yes", competitor: "yes", competitorNote: "Full-featured enterprise portal" },
      { category: "Portal", feature: "Deal registration", covant: "yes", competitor: "yes" },
      { category: "Portal", feature: "Partner certifications", covant: "yes", competitor: "yes" },
      { category: "Portal", feature: "MDF management", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "CRM integration (Salesforce, HubSpot)", covant: "yes", competitor: "yes", competitorNote: "Native Salesforce objects — their strongest integration" },
      { category: "Platform", feature: "API & webhooks", covant: "yes", competitor: "yes" },
      { category: "Platform", feature: "AI-powered setup", covant: "yes", competitor: "no" },
      { category: "Platform", feature: "Self-serve onboarding", covant: "yes", competitor: "no", competitorNote: "Requires implementation partner — 3–6 months typical" },
      { category: "Intelligence", feature: "Partner health scoring", covant: "yes", competitor: "partial" },
      { category: "Intelligence", feature: "Forecasting & pipeline analytics", covant: "yes", competitor: "yes" },
      { category: "Intelligence", feature: "QBR report generation", covant: "yes", competitor: "no" },
      { category: "Operations", feature: "Setup time", covant: "yes", competitor: "no", covantNote: "15 minutes to first attribution report", competitorNote: "3–6 months typical implementation" },
      { category: "Operations", feature: "Free tier", covant: "yes", competitor: "no", covantNote: "Free for up to 5 partners", competitorNote: "No free tier — enterprise contracts only" },
      { category: "Operations", feature: "Starting price", covant: "yes", competitor: "no", covantNote: "Free, then $49/mo", competitorNote: "$30K–$100K+/year" },
    ],
    strengths: [
      { title: "Enterprise scale", description: "Built for Fortune 1000 channel programs with 200+ partners. Deep compliance, audit trails, and enterprise security certifications that large companies require." },
      { title: "Native Salesforce integration", description: "The deepest Salesforce PRM integration on the market — native SFDC objects, no middleware required." },
      { title: "Full PRM feature set", description: "Every feature a large channel program needs: deal reg, MDF, certifications, territory management, market development funds." },
    ],
    weaknesses: [
      { title: "6-month implementation", description: "Impartner requires an implementation partner and typically takes 3–6 months to go live. Not an option if you need something working this quarter." },
      { title: "Enterprise pricing", description: "$30K–$100K+/year custom contracts. No self-serve, no free tier, no monthly billing. Built for companies with dedicated channel ops budgets." },
      { title: "No modern attribution", description: "Deal registration exists, but there is no multi-touch attribution model, no AI-powered attribution suggestions, and no automated QBR generation." },
      { title: "Complex to maintain", description: "Requires a dedicated Impartner admin or SI partner to manage configuration changes. Self-service is limited." },
    ],
    switchReasons: [
      { title: "You need to be live this quarter, not next year", description: "Covant takes 15 minutes to set up. No implementation partner, no SFDC admin, no 6-month project plan.", icon: Zap },
      { title: "Your program is Series A–C, not Fortune 1000", description: "Impartner is architected for 500+ partner programs with dedicated channel ops teams. Covant is built for VPs running 10–150 strategic partners.", icon: Users },
      { title: "You want attribution intelligence, not just deal tracking", description: "Impartner tracks deals. Covant tells you which partners drive revenue, through which touchpoints, with an audit trail your CFO can verify.", icon: Brain },
      { title: "Your budget is for software, not implementation", description: "At $30K–$100K/year before implementation costs, Impartner is a major budget commitment. Covant starts free.", icon: DollarSign },
    ],
    verdict: "Impartner is the right choice if you are a Fortune 1000 company with a dedicated channel ops team, a large Salesforce investment, and 6 months to implement. If you are a fast-moving B2B company that needs attribution intelligence, automated commissions, and a partner portal live this week — Covant is built for you.",
  },
};

/* ── Metadata ── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPETITORS[slug];
  if (!comp) {
    return { title: "Comparison — Covant" };
  }
  return {
    title: `Covant vs ${comp.name} — Partner Intelligence Comparison`,
    description: `Compare Covant and ${comp.name} for partner attribution, commissions, and program management. See which platform is right for your partner program.`,
    openGraph: {
      title: `Covant vs ${comp.name} — Which Partner Platform Is Right for You?`,
      description: comp.tagline,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((slug) => ({ slug }));
}

/* ── Components ── */

function StatusIcon({ status }: { status: "yes" | "partial" | "no" }) {
  if (status === "yes") return <CheckCircle2 size={16} style={{ color: "#22c55e" }} />;
  if (status === "partial") return <MinusCircle size={16} style={{ color: "#eab308" }} />;
  return <XCircle size={16} style={{ color: "#333" }} />;
}

/* ── Page ── */

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = COMPETITORS[slug];

  if (!comp) {
    return (
      <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Comparison not found</h1>
          <Link href="/compare" style={{ color: "#6366f1", textDecoration: "none" }}>← Back to comparisons</Link>
        </div>
      </div>
    );
  }

  // Group features by category
  const categories = [...new Set(comp.features.map((f) => f.category))];

  return (
    <div style={{ minHeight: "100vh", background:'#f9fafb', color: "#e5e5e5" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "1.1rem", color:'#0a0a0a', textDecoration: "none", letterSpacing: "-.02em" }}>Covant.ai</Link>
          <span style={{ color: "#333" }}>/</span>
          <Link href="/compare" style={{ fontSize: ".9rem", color: "#888", textDecoration: "none" }}>Compare</Link>
          <span style={{ color: "#333" }}>/</span>
          <span style={{ fontSize: ".9rem", color:'#374151' }}>{comp.name}</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/pricing" style={{ fontSize: ".8rem", color:'#6b7280', textDecoration: "none" }}>Pricing</Link>
          <Link href="/sign-up" style={{ fontSize: ".8rem", color: "#000", background: "#fff", padding: "6px 14px", borderRadius: 6, fontWeight: 600, textDecoration: "none" }}>
            Get Started
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 4rem" }}>
        {/* Back link */}
        <Link href="/compare" style={{ display: "inline-flex", alignItems: "center", gap: 6, color:'#6b7280', fontSize: ".85rem", textDecoration: "none", marginBottom: "2rem" }}>
          <ArrowLeft size={14} /> All comparisons
        </Link>

        {/* Hero */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
            <span style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#6366f1", background: "#6366f115", padding: "4px 10px", borderRadius: 6 }}>
              Comparison
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, color:'#0a0a0a', letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: "1rem" }}>
            Covant vs {comp.name}
          </h1>
          <p style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 700 }}>
            {comp.tagline}
          </p>
        </div>

        {/* Quick comparison cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "3rem" }}>
          {/* Covant card */}
          <div style={{ border: "1px solid #6366f133", borderRadius: 14, padding: "1.5rem", background: "#6366f108" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: "#6366f1" }} />
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color:'#0a0a0a' }}>Covant</span>
            </div>
            <p style={{ fontSize: ".8rem", color: "#888", marginBottom: "1rem", lineHeight: 1.5 }}>
              Partner intelligence platform — attribution, commissions, revenue analytics, and partner portal.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Setup:</span> <span style={{ color: "#22c55e", fontWeight: 600 }}>15 minutes</span></div>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Pricing:</span> <span style={{ color:'#374151', fontWeight: 600 }}>Free — $349/mo</span></div>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Best for:</span> <span style={{ color:'#374151' }}>Strategic partner programs (10–100 partners)</span></div>
            </div>
          </div>

          {/* Competitor card */}
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 14, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: "#555" }} />
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color:'#0a0a0a' }}>{comp.name}</span>
            </div>
            <p style={{ fontSize: ".8rem", color: "#888", marginBottom: "1rem", lineHeight: 1.5 }}>
              {comp.whatTheyAre}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Founded:</span> <span style={{ color:'#374151' }}>{comp.founded}</span></div>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Pricing:</span> <span style={{ color:'#374151' }}>{comp.pricing}</span></div>
              <div style={{ fontSize: ".8rem" }}><span style={{ color:'#6b7280' }}>Best for:</span> <span style={{ color:'#374151' }}>{comp.bestFor}</span></div>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div style={{ marginBottom: "3rem", padding: "1.5rem", borderRadius: 14, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color:'#0a0a0a', marginBottom: ".75rem" }}>The bottom line</h2>
          <p style={{ color:'#6b7280', fontSize: ".9rem", lineHeight: 1.7 }}>{comp.description}</p>
        </div>

        {/* Feature Comparison Table */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color:'#0a0a0a', marginBottom: "1.5rem" }}>Feature-by-feature comparison</h2>

          <div style={{ borderRadius: 14, border: "1px solid #1a1a1a", overflow: "hidden" }}>
            {categories.map((category, catIdx) => {
              const catFeatures = comp.features.filter((f) => f.category === category);
              return (
                <div key={category}>
                  {/* Category header */}
                  <div style={{
                    padding: "10px 20px",
                    background: "#0d0d0d",
                    borderTop: catIdx > 0 ? "1px solid #1a1a1a" : undefined,
                    borderBottom: "1px solid #1a1a1a",
                  }}>
                    <span style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color:'#6b7280' }}>{category}</span>
                  </div>

                  {/* Feature rows */}
                  {catFeatures.map((feat, i) => (
                    <div key={feat.feature} style={{
                      display: "grid", gridTemplateColumns: "1fr 200px 200px",
                      borderBottom: i < catFeatures.length - 1 ? "1px solid #111" : undefined,
                    }}>
                      <div style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: ".85rem", fontWeight: 500, color:'#374151' }}>{feat.feature}</div>
                      </div>
                      <div style={{
                        padding: "14px 16px",
                        borderLeft: "1px solid #1a1a1a",
                        background: "#6366f105",
                        display: "flex", flexDirection: "column", gap: 4,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <StatusIcon status={feat.covant} />
                          <span style={{ fontSize: ".7rem", fontWeight: 700, color: "#6366f1" }}>Covant</span>
                        </div>
                        {feat.covantNote && (
                          <span style={{ fontSize: ".72rem", color:'#6b7280', lineHeight: 1.4 }}>{feat.covantNote}</span>
                        )}
                      </div>
                      <div style={{
                        padding: "14px 16px",
                        borderLeft: "1px solid #1a1a1a",
                        display: "flex", flexDirection: "column", gap: 4,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <StatusIcon status={feat.competitor} />
                          <span style={{ fontSize: ".7rem", fontWeight: 700, color:'#6b7280' }}>{comp.name}</span>
                        </div>
                        {feat.competitorNote && (
                          <span style={{ fontSize: ".72rem", color:'#6b7280', lineHeight: 1.4 }}>{feat.competitorNote}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: ".75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem", color: "#888" }}>
              <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> Full support
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem", color: "#888" }}>
              <MinusCircle size={14} style={{ color: "#eab308" }} /> Partial
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".75rem", color: "#888" }}>
              <XCircle size={14} style={{ color: "#333" }} /> Not available
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
          {/* Strengths */}
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color:'#0a0a0a', marginBottom: "1rem" }}>
              Where {comp.name} excels
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {comp.strengths.map((s) => (
                <div key={s.title} style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
                  <h3 style={{ fontSize: ".85rem", fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: ".8rem", color: "#777", lineHeight: 1.55, margin: 0 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color:'#0a0a0a', marginBottom: "1rem" }}>
              Where {comp.name} falls short
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {comp.weaknesses.map((w) => (
                <div key={w.title} style={{ padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
                  <h3 style={{ fontSize: ".85rem", fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>{w.title}</h3>
                  <p style={{ fontSize: ".8rem", color: "#777", lineHeight: 1.55, margin: 0 }}>{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Switch Reasons */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color:'#0a0a0a', marginBottom: "1.5rem" }}>
            When to choose Covant over {comp.name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {comp.switchReasons.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} style={{ padding: "1.5rem", borderRadius: 12, border: "1px solid #1a1a1a", background:'#f9fafb' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: "#6366f115",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 12, color: "#6366f1",
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: ".9rem", fontWeight: 700, color:'#0a0a0a', marginBottom: 6, lineHeight: 1.3 }}>{r.title}</h3>
                  <p style={{ fontSize: ".8rem", color: "#777", lineHeight: 1.6, margin: 0 }}>{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict */}
        <div style={{
          padding: "2rem", borderRadius: 14,
          border: "1px solid #6366f133", background: "#6366f108",
          marginBottom: "3rem",
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color:'#0a0a0a', marginBottom: ".75rem" }}>Our honest take</h2>
          <p style={{ color:'#6b7280', fontSize: ".9rem", lineHeight: 1.7, margin: 0 }}>{comp.verdict}</p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "3rem 0", borderTop: "1px solid #1a1a1a" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: ".75rem" }}>
            See the difference yourself
          </h2>
          <p style={{ color:'#6b7280', marginBottom: "1.5rem", maxWidth: 460, margin: "0 auto 1.5rem" }}>
            15 minutes to set up. No credit card. No implementation project.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{
              padding: "12px 28px", borderRadius: 8, background: "#fff", color: "#000",
              fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/demo" style={{
              padding: "12px 28px", borderRadius: 8, border: "1px solid #333",
              color:'#6b7280', fontWeight: 600, textDecoration: "none",
            }}>
              Try the demo →
            </Link>
          </div>

          {/* Other comparisons */}
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.values(COMPETITORS)
              .filter((c) => c.slug !== comp.slug)
              .map((c) => (
                <Link key={c.slug} href={`/compare/${c.slug}`} style={{
                  fontSize: ".8rem", color:'#6b7280', textDecoration: "none",
                  padding: "6px 14px", borderRadius: 6, border: "1px solid #1a1a1a",
                }}>
                  vs {c.name}
                </Link>
              ))}
            <Link href="/compare" style={{
              fontSize: ".8rem", color:'#6b7280', textDecoration: "none",
              padding: "6px 14px", borderRadius: 6, border: "1px solid #1a1a1a",
            }}>
              All comparisons →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
