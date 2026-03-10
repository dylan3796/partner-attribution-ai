export type IndustryChallenge = {
  title: string;
  description: string;
};

export type IndustrySolution = {
  title: string;
  description: string;
  feature: string;
};

export type IndustryMetric = {
  value: string;
  label: string;
};

export type IndustryDetail = {
  slug: string;
  name: string;
  headline: string;
  subheadline: string;
  color: string;
  heroStats: IndustryMetric[];
  partnerTypes: string[];
  challenges: IndustryChallenge[];
  solutions: IndustrySolution[];
  attributionModel: {
    recommended: string;
    why: string;
    alternatives: string[];
  };
  metrics: { name: string; benchmark: string; description: string }[];
  programTips: string[];
  quotePerson: string;
  quoteRole: string;
  quoteText: string;
  relatedSlugs: string[];
};

export const INDUSTRIES: Record<string, IndustryDetail> = {
  saas: {
    slug: "saas",
    name: "SaaS",
    headline:
      "Partner Programs for SaaS Companies That Actually Drive ARR",
    subheadline:
      "SaaS partner programs fail when they treat channel like an afterthought. Covant gives you the attribution, commission automation, and partner intelligence to build a channel that compounds alongside your direct motion.",
    color: "#6366f1",
    heroStats: [
      {
        value: "30%",
        label: "Of SaaS revenue comes from partners at scale",
      },
      {
        value: "2.4x",
        label: "Higher LTV on partner-sourced deals vs direct",
      },
      {
        value: "40%",
        label: "Faster close rates on partner-influenced deals",
      },
    ],
    partnerTypes: [
      "Technology/ISV partners (integrations, marketplace)",
      "Reseller & VAR partners (co-sell, white-label)",
      "Referral & affiliate partners (lead gen)",
      "SI & consulting partners (implementation, advisory)",
      "Agency partners (managed services)",
    ],
    challenges: [
      {
        title: "Recurring revenue complicates commissions",
        description:
          "Monthly and annual billing, upgrades, downgrades, churn — flat one-time payouts don't work for SaaS. Partners need ongoing commission structures tied to customer lifetime value, not just the initial close.",
      },
      {
        title: "Multi-touch deals blur attribution",
        description:
          "A partner sources the lead, an ISV integration influences the evaluation, and a reseller closes the deal. Who gets credit? Without multi-partner attribution, you're guessing — and underpaying the partners who matter most.",
      },
      {
        title: "Product-led growth conflicts with channel",
        description:
          "Self-serve signups don't trigger deal registration. Partners can't prove they influenced a customer who found you through Google but bought because of a partner demo. PLG and channel coexist uneasily.",
      },
      {
        title: "Integration partnerships lack attribution",
        description:
          "Technology partners drive adoption through integrations, but there's no deal to register. How do you attribute revenue to an ISV whose integration was the deciding factor in a 6-figure enterprise deal?",
      },
      {
        title: "Scaling beyond 20 partners breaks everything",
        description:
          "The spreadsheet that worked for 10 partners crumbles at 25. Commission calculations take a week. Dispute resolution eats your ops team's time. Tier management becomes political.",
      },
    ],
    solutions: [
      {
        title: "Recurring commission engine",
        description:
          "Tiered rates by product line, accelerators for multi-year deals, ongoing commission on renewals and expansions. Partners see exactly what they'll earn before registering a deal.",
        feature: "Commission Rules",
      },
      {
        title: "Multi-partner attribution",
        description:
          "Role Split model credits every partner that touched a deal — sourcing partner, technology partner, and closing partner each get their defined share with a full audit trail.",
        feature: "Role Split Attribution",
      },
      {
        title: "Integration influence tracking",
        description:
          "Track how ISV integrations influence deal velocity and win rates. Attribute revenue to technology partners even without a traditional deal registration.",
        feature: "Attribution Engine",
      },
      {
        title: "Self-serve partner portal",
        description:
          "Partners register deals, track commissions, view tier progress, and access enablement content in a white-label portal that reflects your brand — not yours vendor's.",
        feature: "Partner Portal",
      },
      {
        title: "Automated tier management",
        description:
          "Health scores combine ARR contribution, pipeline generation, engagement, and deal velocity. Tier promotions and demotions are data-driven, not political.",
        feature: "Partner Health Scores",
      },
    ],
    attributionModel: {
      recommended: "Role Split",
      why: "SaaS deals typically involve multiple partner types — a referral partner sources the lead, a technology partner influences evaluation, and a reseller closes. Role Split assigns predefined credit percentages to each role, preventing disputes and rewarding all contributors.",
      alternatives: [
        "Deal Reg Protection for pure reseller channels",
        "Source Wins for referral-only programs",
      ],
    },
    metrics: [
      {
        name: "Partner-sourced ARR",
        benchmark: "20-35% of total ARR",
        description:
          "Revenue from deals where a partner was the primary source of the opportunity.",
      },
      {
        name: "Partner-influenced ARR",
        benchmark: "40-60% of pipeline",
        description:
          "Revenue from deals where partners played a supporting role (demo, integration, referral).",
      },
      {
        name: "Partner LTV vs Direct LTV",
        benchmark: "1.5-2.5x higher",
        description:
          "Lifetime value of partner-sourced customers vs self-serve or direct sales customers.",
      },
      {
        name: "Time to first deal",
        benchmark: "<30 days",
        description:
          "Days from partner onboarding to first registered deal — a key activation metric.",
      },
      {
        name: "Partner churn rate",
        benchmark: "<15% annually",
        description:
          "Percentage of active partners who become inactive or leave the program.",
      },
      {
        name: "Commission-to-revenue ratio",
        benchmark: "12-22%",
        description:
          "Total commissions paid as a percentage of partner-attributed revenue.",
      },
    ],
    programTips: [
      "Start with 5-10 design partners before scaling — validate your attribution model and commission structure with real deals",
      "Tie commission rates to customer retention, not just initial close — this aligns partner incentives with your LTV goals",
      "Build separate tracks for technology partners vs resellers — they have different motivations and contribution patterns",
      "Invest in enablement before recruitment — 10 productive partners beat 50 inactive ones",
      "Review tier criteria quarterly — SaaS markets move fast, and last year's Gold threshold may be this year's Silver",
    ],
    quotePerson: "Sarah Chen",
    quoteRole: "VP Partnerships, Series C SaaS",
    quoteText:
      "Our partner program was stuck at 15 resellers because we couldn't prove ROI to the board. Once we had real attribution data, we got budget to scale to 40 — and partner-sourced ARR went from 12% to 28% in two quarters.",
    relatedSlugs: ["fintech", "cybersecurity"],
  },
  fintech: {
    slug: "fintech",
    name: "Fintech",
    headline:
      "Partner Programs for Fintech Companies That Navigate Compliance and Scale Revenue",
    subheadline:
      "Fintech partner programs operate under regulatory constraints that generic PRMs ignore. Covant gives you auditable attribution, compliance-ready commission trails, and the partner intelligence to scale your channel without exposing your licenses.",
    color: "#10b981",
    heroStats: [
      {
        value: "45%",
        label: "Of fintech distribution goes through partners",
      },
      {
        value: "60%",
        label: "Longer sales cycles require multi-touch attribution",
      },
      {
        value: "3x",
        label: "More compliance documentation per partner deal",
      },
    ],
    partnerTypes: [
      "Banking & FI channel partners (distribution)",
      "Technology integration partners (APIs, embedded finance)",
      "Consulting & advisory partners (implementation)",
      "Referral partners (accountants, brokers, advisors)",
      "White-label / embedded partners (BaaS, payments)",
    ],
    challenges: [
      {
        title: "Compliance requires auditable attribution",
        description:
          "Regulators want to know exactly who sold what to whom and what commissions were paid. 'The spreadsheet says so' doesn't pass an audit. You need tamper-evident attribution trails for every partner-touched deal.",
      },
      {
        title: "Long sales cycles blur partner contribution",
        description:
          "Enterprise fintech deals take 6-18 months. The partner who made the introduction in January gets forgotten by the time the deal closes in October. Without continuous attribution tracking, partners lose credit — and motivation.",
      },
      {
        title: "Embedded finance creates attribution gaps",
        description:
          "When your product is white-labeled inside a partner's platform, revenue flows through their system. Attributing revenue back to the right partner relationship — especially with tiered or revenue-share models — requires infrastructure, not spreadsheets.",
      },
      {
        title: "Commission structures vary by product and region",
        description:
          "Payments products have different commission logic than lending products. US deals have different regulatory implications than EU deals. Your commission engine needs to handle product-line, geography, and partner-type variations simultaneously.",
      },
      {
        title: "Partner due diligence is table stakes",
        description:
          "You can't onboard partners as casually as a SaaS company. KYC/KYB requirements, licensing verification, and compliance training must be tracked and auditable. A partner who hasn't completed compliance can't register deals.",
      },
    ],
    solutions: [
      {
        title: "Compliance-ready audit trails",
        description:
          "Every attribution decision, commission calculation, and payout has a full audit trail with timestamps, calculation chains, and tamper-evident records. Ready for regulatory review.",
        feature: "Attribution Audit Trail",
      },
      {
        title: "Multi-touch attribution for long cycles",
        description:
          "Track partner touchpoints across 6-18 month deal cycles. Every introduction, demo, proposal review, and technical evaluation is recorded and attributed — no partner contribution gets lost.",
        feature: "Attribution Engine",
      },
      {
        title: "Product-line commission rules",
        description:
          "Different rates for payments vs lending vs insurance products. Geography-specific overrides. Partner-type adjustments. All computed automatically, all auditable.",
        feature: "Commission Rules",
      },
      {
        title: "Partner compliance tracking",
        description:
          "Certification programs with expiration dates, compliance training completion, licensing verification. Partners can't register deals until compliance requirements are met.",
        feature: "Partner Certifications",
      },
      {
        title: "Embedded revenue attribution",
        description:
          "Track revenue flowing through white-label and embedded integrations back to the partner relationship. Revenue-share calculations, usage-based attribution, and automated reconciliation.",
        feature: "Revenue Intelligence",
      },
    ],
    attributionModel: {
      recommended: "Deal Reg Protection",
      why: "Fintech distribution typically flows through defined channel partners with exclusive territory agreements. Deal Reg Protection ensures the registering partner gets credit, with clear audit trails that satisfy compliance requirements. For multi-partner enterprise deals, layer Role Split on top.",
      alternatives: [
        "Role Split for enterprise deals with multiple partners",
        "Source Wins for referral networks (advisors, brokers)",
      ],
    },
    metrics: [
      {
        name: "Partner-sourced revenue",
        benchmark: "25-45% of total revenue",
        description:
          "Higher than SaaS because fintech relies more heavily on channel distribution, especially in regulated markets.",
      },
      {
        name: "Compliance completion rate",
        benchmark: ">95%",
        description:
          "Percentage of active partners who have completed all required compliance training and certifications.",
      },
      {
        name: "Attribution dispute rate",
        benchmark: "<3%",
        description:
          "Percentage of deals where attribution is contested — lower is better, and audit trails are the key driver.",
      },
      {
        name: "Average deal cycle (partner)",
        benchmark: "90-180 days",
        description:
          "Partner-influenced fintech deals are often longer but larger. Track this against direct to prove partner value.",
      },
      {
        name: "Payout accuracy rate",
        benchmark: ">99%",
        description:
          "Percentage of commission payouts that don't require post-hoc adjustment. Critical for regulatory compliance.",
      },
      {
        name: "Partner activation rate",
        benchmark: ">60% in 90 days",
        description:
          "Percentage of onboarded partners who register their first deal within 90 days of completing compliance.",
      },
    ],
    programTips: [
      "Build compliance into onboarding — don't bolt it on later. Partners should complete KYC/training before they can access deal registration",
      "Use Deal Reg Protection for channel and add Role Split for enterprise co-sell — fintech often needs both models running in parallel",
      "Segment commission structures by product line from day one — retrofitting product-specific rates at 50 partners is painful",
      "Maintain audit trails for 7+ years — regulatory requirements vary by jurisdiction but err on the side of over-retention",
      "Invest in partner compliance dashboards — partners who can see their own compliance status self-serve instead of calling your team",
    ],
    quotePerson: "Elena Torres",
    quoteRole: "VP Partnerships, 140 partner fintech program",
    quoteText:
      "Our auditors asked for the attribution logic behind every partner commission over $10K. We used to spend two weeks pulling that together. Now it's a one-click export with full calculation chains.",
    relatedSlugs: ["saas", "cybersecurity"],
  },
  cybersecurity: {
    slug: "cybersecurity",
    name: "Cybersecurity",
    headline:
      "Partner Programs for Cybersecurity Companies That Scale Through the Channel",
    subheadline:
      "Cybersecurity has always been a channel-first industry — 70%+ of revenue flows through partners. Covant gives you the attribution engine, commission automation, and partner intelligence to manage a high-velocity security channel without the spreadsheet chaos.",
    color: "#ef4444",
    heroStats: [
      {
        value: "70%+",
        label: "Of cybersecurity revenue flows through channel",
      },
      {
        value: "200+",
        label: "Average partner count for mid-market security vendors",
      },
      {
        value: "5-8",
        label: "Partner types in a typical security ecosystem",
      },
    ],
    partnerTypes: [
      "Value-Added Resellers (VARs) — deal registration, co-sell",
      "Managed Security Service Providers (MSSPs) — recurring, managed",
      "System Integrators (SIs) — enterprise deployment, consulting",
      "Technology alliance partners — integrated solutions, marketplaces",
      "Distribution partners — two-tier channel, volume",
      "Referral partners — incident response firms, compliance consultants",
    ],
    challenges: [
      {
        title: "Two-tier distribution obscures attribution",
        description:
          "Deals flow through distributors to resellers to end customers. By the time revenue reaches you, attribution to the actual selling partner is muddy. Distributor POS data doesn't always match CRM records.",
      },
      {
        title: "MSSP recurring revenue needs different commission logic",
        description:
          "MSSPs don't close one-time deals — they bring monthly recurring customers. Your commission engine needs to handle ongoing revenue shares, not just one-time payouts. Churned MSSP customers should stop generating commissions.",
      },
      {
        title: "Channel conflict at scale is constant",
        description:
          "With 200+ partners, deal overlap is inevitable. Two VARs register the same prospect. An MSSP and a VAR both claim credit. Your direct team pursues an account a partner registered. Without automated conflict detection, every week brings disputes.",
      },
      {
        title: "Partner tiering across types is complex",
        description:
          "A top-performing VAR and a top-performing MSSP have completely different metrics. Revenue thresholds, certification requirements, and engagement criteria must vary by partner type — one-size-fits-all tiers don't work in security.",
      },
      {
        title: "Certification requirements are non-negotiable",
        description:
          "Security vendors require technical certifications before partners can sell or deploy. Partners whose certs lapse shouldn't register deals. Tracking cert status, expiration dates, and renewal across 200 partners manually is a full-time job.",
      },
    ],
    solutions: [
      {
        title: "Two-tier attribution engine",
        description:
          "Track deals from distributor POS through to end customer. Attribute revenue to the selling partner even when it flows through distribution. Reconcile distributor reports against CRM data automatically.",
        feature: "Attribution Engine",
      },
      {
        title: "Recurring commission automation",
        description:
          "Revenue-share models for MSSPs with automatic churn detection. Monthly commission calculations tied to active customer count. Different rate structures for VARs (one-time) vs MSSPs (recurring).",
        feature: "Commission Rules",
      },
      {
        title: "Automated conflict detection",
        description:
          "Deal registration with automatic duplicate and overlap detection. Registration windows with protection periods. Conflict resolution workflows with audit trails. Partners see registration status in real time.",
        feature: "Deal Registration",
      },
      {
        title: "Partner-type-specific tiers",
        description:
          "Separate tier ladders for VARs, MSSPs, SIs, and technology partners. Each with appropriate revenue thresholds, cert requirements, and engagement criteria. Automatic tier evaluation on rolling 12-month windows.",
        feature: "Tier Management",
      },
      {
        title: "Certification-gated deal registration",
        description:
          "Partners can only register deals for products they're certified to sell. Expiring certifications trigger notifications. Lapsed certs automatically block new deal registrations until renewed.",
        feature: "Partner Certifications",
      },
    ],
    attributionModel: {
      recommended: "Deal Reg Protection",
      why: "Cybersecurity's channel-first model means partners expect clear deal registration rules with protection windows. The partner who registers first and meets engagement criteria gets credit. This is the industry standard that VARs and MSSPs already understand and expect.",
      alternatives: [
        "Role Split for multi-partner enterprise deals (SI + VAR + tech partner)",
        "Source Wins for referral partners (IR firms, compliance consultants)",
      ],
    },
    metrics: [
      {
        name: "Channel revenue percentage",
        benchmark: "65-80%",
        description:
          "Cybersecurity is channel-first — if less than 60% of revenue comes through partners, your channel strategy needs work.",
      },
      {
        name: "Deal registration coverage",
        benchmark: ">85%",
        description:
          "Percentage of channel deals that go through deal registration. Below 80% means partners are bypassing the system.",
      },
      {
        name: "Conflict rate",
        benchmark: "<8%",
        description:
          "Percentage of deal registrations that trigger a conflict. Above 10% suggests territory or account mapping issues.",
      },
      {
        name: "Certification compliance rate",
        benchmark: ">90%",
        description:
          "Percentage of active partners with current certifications for the products they sell.",
      },
      {
        name: "MSSP monthly churn",
        benchmark: "<3%",
        description:
          "Monthly churn rate of customers managed by MSSP partners. Higher churn means commission costs without revenue.",
      },
      {
        name: "Time to deal reg approval",
        benchmark: "<24 hours",
        description:
          "Average time to approve or reject a deal registration. Partners leave programs with slow approval processes.",
      },
    ],
    programTips: [
      "Build separate program tracks for VARs and MSSPs from day one — their business models, metrics, and commission structures are fundamentally different",
      "Automate deal reg conflict detection before you hit 50 partners — manual conflict resolution doesn't scale and erodes trust",
      "Tie certifications to deal registration gates — partners who can't deploy shouldn't be able to register. This protects your brand and customer experience",
      "Invest in distributor POS reconciliation early — the gap between distributor-reported and CRM-tracked revenue grows exponentially with partner count",
      "Run separate QBRs by partner type — a VAR QBR focused on deal reg velocity is useless for an MSSP whose value is measured in monthly recurring customers",
    ],
    quotePerson: "Marcus Webb",
    quoteRole: "VP Partnerships, cybersecurity startup (building from scratch)",
    quoteText:
      "We went from 0 to 38 partners in 6 months. By partner 15, the spreadsheet was already breaking. Deal conflicts, cert tracking, commission disputes — we needed a system before we needed more partners.",
    relatedSlugs: ["saas", "fintech"],
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare IT",
    headline:
      "Partner Programs for Healthcare IT Companies That Scale Through Compliance-First Channels",
    subheadline:
      "Healthcare IT partner programs operate under HIPAA, HITECH, and regulatory constraints that generic PRMs can't handle. Covant gives you auditable attribution, compliance-gated onboarding, and the partner intelligence to scale your channel without risking patient data or regulatory standing.",
    color: "#14b8a6",
    heroStats: [
      {
        value: "55%",
        label: "Of healthcare IT sales flow through channel partners",
      },
      {
        value: "12-24mo",
        label: "Average enterprise deal cycle with compliance reviews",
      },
      {
        value: "4x",
        label: "More due diligence required per partner vs general SaaS",
      },
    ],
    partnerTypes: [
      "Value-Added Resellers (VARs) — EHR integrations, clinical workflows",
      "Health system consultants — advisory, implementation, change management",
      "Technology integration partners — EHR/EMR vendors, interoperability",
      "Referral partners — healthcare IT advisors, compliance consultants",
      "Managed service providers — hosted/managed clinical infrastructure",
      "Distribution partners — GPOs, buying consortiums",
    ],
    challenges: [
      {
        title: "HIPAA compliance gates everything",
        description:
          "Partners who handle PHI need BAAs, security assessments, and compliance training before touching a deal. Generic PRMs treat onboarding as 'fill out a form' — in healthcare, onboarding is a compliance process with legal requirements.",
      },
      {
        title: "12-24 month deal cycles lose partner attribution",
        description:
          "Healthcare enterprise deals involve committees, pilot programs, and procurement layers. The partner who introduced the opportunity 18 months ago gets lost in CRM notes by the time the deal closes. Without continuous attribution tracking, partners lose credit and walk.",
      },
      {
        title: "Group purchasing organizations complicate payouts",
        description:
          "Deals that flow through GPOs or buying consortiums add layers between you and the end customer. Commission calculations need to account for GPO pricing tiers, volume rebates, and the actual selling partner — not just whoever submitted the PO.",
      },
      {
        title: "Multi-stakeholder deals blur contribution",
        description:
          "A clinical consultant influences the evaluation, a VAR runs the implementation, and a technology partner provides the EHR integration. Three partners, one deal — and each expects credit for the role they played.",
      },
      {
        title: "Regulatory audits demand full traceability",
        description:
          "When auditors ask 'who sold this to which health system, through which partner, with what commission?' you need an instant answer with full calculation chains. 'Check the spreadsheet' fails compliance reviews.",
      },
    ],
    solutions: [
      {
        title: "Compliance-gated partner onboarding",
        description:
          "BAA tracking, security assessment completion, HIPAA training verification — all required before a partner can access deal registration. Expiring certifications automatically block new registrations.",
        feature: "Partner Certifications",
      },
      {
        title: "Long-cycle attribution tracking",
        description:
          "Track partner touchpoints across 12-24 month deal cycles. Every introduction, clinical demo, pilot support session, and procurement review is recorded and attributed — no partner contribution gets lost to time.",
        feature: "Attribution Engine",
      },
      {
        title: "GPO-aware commission engine",
        description:
          "Commission rules that account for GPO pricing tiers, volume rebates, and multi-layer distribution. Automatic reconciliation between GPO-reported and CRM-tracked revenue with full audit trails.",
        feature: "Commission Rules",
      },
      {
        title: "Multi-partner deal attribution",
        description:
          "Role Split model credits clinical consultants, implementation VARs, and technology partners each for their defined role. Audit trails show exactly why each partner received their share.",
        feature: "Role Split Attribution",
      },
      {
        title: "Audit-ready compliance dashboard",
        description:
          "Every attribution decision, commission calculation, and payout has a tamper-evident audit trail with timestamps and calculation chains. One-click export for regulatory reviews.",
        feature: "Attribution Audit Trail",
      },
    ],
    attributionModel: {
      recommended: "Deal Reg Protection",
      why: "Healthcare IT deals typically have a primary selling partner who registers the opportunity and manages the procurement relationship. Deal Reg Protection gives that partner clear credit with the audit trails that healthcare compliance demands. For enterprise deals with multiple partners (consultant + VAR + integrator), layer Role Split on top.",
      alternatives: [
        "Role Split for multi-partner enterprise deals (consultant + VAR + tech partner)",
        "Source Wins for referral networks (healthcare IT advisors)",
      ],
    },
    metrics: [
      {
        name: "Partner-sourced revenue",
        benchmark: "30-55% of total revenue",
        description:
          "Healthcare IT relies heavily on trusted advisors and consultants for distribution into health systems.",
      },
      {
        name: "Compliance completion rate",
        benchmark: ">98%",
        description:
          "Percentage of active partners with current BAAs, HIPAA training, and security assessments. Non-negotiable in healthcare.",
      },
      {
        name: "Attribution dispute rate",
        benchmark: "<2%",
        description:
          "Long deal cycles make disputes more likely — robust audit trails are the only way to keep this under 3%.",
      },
      {
        name: "Average deal cycle (partner)",
        benchmark: "180-360 days",
        description:
          "Healthcare enterprise deals are long — track partner-influenced vs direct to prove partners accelerate procurement.",
      },
      {
        name: "Partner activation rate",
        benchmark: ">50% in 120 days",
        description:
          "Healthcare partners need more ramp time due to compliance requirements — but once active, they're high-value and sticky.",
      },
      {
        name: "Commission audit pass rate",
        benchmark: "100%",
        description:
          "Every commission payout must be traceable to a deal, attribution calculation, and approval chain. No exceptions in regulated healthcare.",
      },
    ],
    programTips: [
      "Make BAA completion and HIPAA training mandatory before deal registration access — retroactive compliance is a liability, not a process",
      "Build separate partner tracks for VARs, consultants, and technology partners — a clinical consultant's value metric is influence, not closed revenue",
      "Invest in GPO/buying consortium relationship mapping early — understanding which health systems buy through which GPOs determines your entire channel strategy",
      "Maintain attribution records for 7+ years minimum — HIPAA and HITECH audit requirements outlast most vendor contracts",
      "Run quarterly compliance audits of your partner base — a partner whose BAA lapsed three months ago is a ticking regulatory risk",
    ],
    quotePerson: "Sarah Chen",
    quoteRole: "VP Partnerships, healthcare IT platform",
    quoteText:
      "Our compliance team used to block every new partner for 6 weeks. Now onboarding is structured — partners complete BAA, training, and certification in the portal, and the system only unlocks deal reg when they're fully compliant. We onboard in 2 weeks.",
    relatedSlugs: ["fintech", "cybersecurity"],
  },
  cloud: {
    slug: "cloud",
    name: "Cloud Infrastructure",
    headline:
      "Partner Programs for Cloud Infrastructure Companies That Drive Consumption Revenue",
    subheadline:
      "Cloud infrastructure partner programs run on consumption, not contracts. Covant gives you usage-based attribution, tiered commission automation, and the partner intelligence to scale a marketplace and channel ecosystem that compounds.",
    color: "#f59e0b",
    heroStats: [
      {
        value: "80%+",
        label: "Of cloud deals involve at least one partner",
      },
      {
        value: "$2.4M",
        label: "Average cloud partner-sourced deal value (enterprise)",
      },
      {
        value: "5-10",
        label: "Partner types in a cloud ecosystem",
      },
    ],
    partnerTypes: [
      "Cloud resellers & distributors — license/consumption resale",
      "Managed Service Providers (MSPs) — ongoing management, optimization",
      "System Integrators (SIs) — migration, implementation, modernization",
      "ISV partners — marketplace listings, co-sell motions",
      "Technology alliance partners — joint solutions, integrations",
      "Referral & consulting partners — cloud advisory, strategy",
      "Training & certification partners — skills enablement",
    ],
    challenges: [
      {
        title: "Consumption-based revenue breaks traditional commissions",
        description:
          "Cloud revenue grows (or shrinks) with customer usage. A partner who lands a $50K deal that grows to $500K in consumption deserves different economics than a static contract. One-time commission payouts don't align incentives with consumption growth.",
      },
      {
        title: "Marketplace attribution is a black box",
        description:
          "When a customer buys through a cloud marketplace (AWS, Azure, GCP), attribution to the partner who influenced the deal gets lost. Marketplace transactions don't carry partner metadata unless you've built the plumbing to track it.",
      },
      {
        title: "Multi-motion deals involve 3-5 partners",
        description:
          "An ISV builds on your platform, a reseller brings the customer, an SI does the implementation, and an MSP manages ongoing operations. That's 4 partners on one deal — who gets what credit, and how do you split commissions fairly?",
      },
      {
        title: "MSP recurring revenue needs ongoing tracking",
        description:
          "MSPs generate monthly recurring consumption. Commissions need to flow monthly based on active usage, not just initial deal value. Customer churn should stop commission accrual. This is a fundamentally different model than one-time resale.",
      },
      {
        title: "Co-sell motions require real-time partner visibility",
        description:
          "Cloud co-sell programs (like AWS ACE, Azure co-sell, GCP partner advantage) require shared deal visibility, aligned incentives, and coordinated execution. Partners need to see pipeline, not just their own registered deals.",
      },
    ],
    solutions: [
      {
        title: "Consumption-based commission engine",
        description:
          "Commission rules tied to customer consumption, not just initial deal value. Automatic monthly calculations based on usage data. Accelerators for consumption growth, with churn-adjusted payouts.",
        feature: "Commission Rules",
      },
      {
        title: "Marketplace attribution tracking",
        description:
          "Track partner influence on marketplace transactions. Map marketplace buyer IDs back to partner relationships. Attribute consumption revenue to the partner who sourced or influenced the marketplace listing adoption.",
        feature: "Attribution Engine",
      },
      {
        title: "Multi-partner co-sell attribution",
        description:
          "Role Split model assigns predefined credit to each partner role — ISV, reseller, SI, MSP — with full audit trails. Partners see their share before the deal closes, reducing disputes and improving co-sell participation.",
        feature: "Role Split Attribution",
      },
      {
        title: "MSP recurring revenue automation",
        description:
          "Monthly commission calculations tied to active customer consumption. Automatic churn detection stops accrual. Revenue-share models with usage tiers. Partners see real-time commission accrual in their portal.",
        feature: "Revenue Intelligence",
      },
      {
        title: "Co-sell pipeline visibility",
        description:
          "Shared deal views for co-sell partners with role-based access. Real-time pipeline updates, deal stage notifications, and coordinated deal registration — built for cloud co-sell programs.",
        feature: "Partner Portal",
      },
    ],
    attributionModel: {
      recommended: "Role Split",
      why: "Cloud deals almost always involve multiple partners — an ISV partner, a reseller, an SI, and an MSP can all touch the same deal. Role Split assigns predefined credit percentages to each partner role, ensuring fair attribution across the ecosystem and reducing disputes in complex multi-partner motions.",
      alternatives: [
        "Deal Reg Protection for pure reseller channels",
        "Source Wins for referral and advisory partners",
      ],
    },
    metrics: [
      {
        name: "Partner-influenced consumption",
        benchmark: "60-80% of total consumption",
        description:
          "Cloud is partner-first — if less than 50% of consumption flows through partners, your channel strategy is underperforming.",
      },
      {
        name: "Consumption growth rate (partner accounts)",
        benchmark: ">15% QoQ",
        description:
          "Partner-managed accounts should grow consumption faster than self-serve — this proves partner value beyond initial sale.",
      },
      {
        name: "Co-sell deal velocity",
        benchmark: "30-40% faster than solo deals",
        description:
          "Co-sell deals should close faster — if they're slower, your co-sell process has friction that needs fixing.",
      },
      {
        name: "Marketplace attribution rate",
        benchmark: ">70%",
        description:
          "Percentage of marketplace transactions that can be attributed to a partner influence. Below 50% means attribution gaps.",
      },
      {
        name: "MSP customer retention",
        benchmark: ">92% annually",
        description:
          "MSP-managed customers should retain better than self-managed. If not, your MSP enablement or selection needs work.",
      },
      {
        name: "Partner-sourced pipeline",
        benchmark: "40-60% of total pipeline",
        description:
          "Pipeline generated by partners — not just influenced. Strong programs see partners as a primary demand generation engine.",
      },
    ],
    programTips: [
      "Build consumption-based commission models from day one — retrofitting usage-based payouts on top of deal-based commissions creates accounting nightmares",
      "Invest in marketplace attribution tracking before scaling ISV partnerships — without it, you'll undercredit ISV partners and they'll deprioritize your platform",
      "Create separate program tracks for MSPs vs resellers vs ISVs — their business models, metrics, and incentive structures are fundamentally different",
      "Align your co-sell motion with cloud marketplace programs (AWS ACE, Azure co-sell) — partners already use those and expect integration, not a parallel system",
      "Track consumption growth per partner account, not just initial deal size — the best cloud partners are the ones whose accounts grow 3-5x after landing",
    ],
    quotePerson: "Elena Torres",
    quoteRole: "VP Partnerships, cloud infrastructure platform",
    quoteText:
      "We had 200 partners and no idea which ones actually drove consumption growth vs. just landing small deals that churned. Once we had consumption-based attribution, we restructured our entire tier system around growth — not just revenue.",
    relatedSlugs: ["saas", "cybersecurity"],
  },
};

export const INDUSTRY_LIST = Object.values(INDUSTRIES).map((i) => ({
  slug: i.slug,
  name: i.name,
  headline: i.headline,
  color: i.color,
  partnerTypeCount: i.partnerTypes.length,
  heroStats: i.heroStats,
}));
