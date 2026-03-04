type Section = {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
};

export const ARTICLE_CONTENT: Record<string, Section[]> = {
  "why-partner-attribution-is-broken": [
    {
      paragraphs: [
        "Here's a question most VPs of Partnerships can't answer with confidence: which partner actually drove that deal?",
        "Not 'who was involved.' Not 'who registered it.' Which partner's effort — their introduction, their technical validation, their executive sponsorship — was the reason the deal closed?",
        "If you're managing this in spreadsheets, CRM custom fields, or quarterly manual reviews, you already know the answer: it depends on who you ask.",
      ],
    },
    {
      heading: "The attribution gap",
      paragraphs: [
        "Partner attribution is broken because most programs treat it as an afterthought. Revenue teams have sophisticated multi-touch attribution for marketing campaigns — but the partner channel, which often drives 30–60% of enterprise revenue, gets a spreadsheet and a quarterly true-up.",
        "The symptoms show up everywhere:",
      ],
      bullets: [
        "AEs dispute partner-sourced deals because they can't see the logic behind the attribution",
        "Commission calculations take days of manual work at quarter-end",
        "Partners lose trust when they can't verify how their payouts were calculated",
        "Finance flags partner payouts because there's no audit trail",
        "New partners churn in 90 days because the program feels opaque",
      ],
    },
    {
      heading: "Why CRM fields don't cut it",
      paragraphs: [
        "The standard approach is a 'Partner Source' picklist on the opportunity record. Someone selects the partner. Maybe they're right. Maybe they picked the last partner they talked to. Maybe the field's been blank for six months and someone backfills it at quarter-end.",
        "This isn't attribution. It's data entry with no verification, no logic, and no paper trail. When a $400K deal is on the line and an AE says 'I sourced that myself,' what do you have? A picklist value vs. their word.",
        "Real attribution needs three things: a clear model (what counts as 'driving the deal'), timestamped evidence (touchpoints, registrations, introductions), and an explainable calculation (partner X contributed Y% because of Z).",
      ],
    },
    {
      heading: "Three models that actually work",
      paragraphs: [
        "After talking to dozens of partnership leaders, we've found that attribution disputes almost always come from using the wrong model — or no model at all. There are three that cover 90% of real programs:",
      ],
      bullets: [
        "Deal Reg Protection: The partner who registers the deal first wins. Simple, clear, standard for reseller programs. 80% of the market uses some version of this.",
        "Source Wins: Whoever sourced or introduced the opportunity gets credit. Built for referral and affiliate programs where the introduction is the value.",
        "Role Split: Predefined percentages by partner type — reseller gets 60%, tech partner gets 25%, referral gets 15%. For multi-partner co-sell motions.",
      ],
    },
    {
      heading: "The audit trail is the product",
      paragraphs: [
        "The model is just the starting point. What actually resolves disputes — what makes AEs stop arguing and finance stop flagging — is the audit trail.",
        "Every payout should trace back to: which touchpoints happened, when, by whom. Which model was applied. What the calculation was, step by step. Why this partner got 20% and not 15%.",
        "When Sarah Chen (VP Partnerships at a Series C SaaS) told us 'if I can't show the AE the exact logic, they reject the output,' she wasn't asking for a better spreadsheet. She was asking for a system of record that makes the math transparent.",
        "That's what modern partner attribution looks like. Not a field on a CRM record. A complete paper trail from touchpoint to payout.",
      ],
    },
  ],

  "true-cost-of-spreadsheet-partner-programs": [
    {
      paragraphs: [
        "The spreadsheet starts small. A Google Sheet with partner names, deal amounts, and commission percentages. It takes 20 minutes to update. No big deal.",
        "Twelve months later, you're spending 2–3 days per quarter on commission calculations. You have 47 tabs. Three people have edit access and nobody trusts the formulas. Your partner ops person just quit and took the institutional knowledge with them.",
        "Sound familiar? You're not alone. Most partner programs under 50 partners run entirely on spreadsheets. And most of them are hemorrhaging money without realizing it.",
      ],
    },
    {
      heading: "The visible costs",
      paragraphs: [
        "These are the ones you can point to on a P&L:",
      ],
      bullets: [
        "Partner ops headcount: 1–2 FTEs spending 40%+ of their time on commission admin, data reconciliation, and partner inquiries about payouts. At $120K loaded cost, that's $50–100K/year in pure admin.",
        "Quarter-end crunch: 15–25 hours per quarter of senior staff time reconciling partner data across CRM, finance, and the spreadsheet. That's strategy time burned on data entry.",
        "Overpayments and underpayments: Without automated rules, manual calculation errors average 3–5%. On a $2M annual commission budget, that's $60–100K in errors — some caught, some not.",
      ],
    },
    {
      heading: "The invisible costs",
      paragraphs: [
        "These are harder to measure but often larger:",
      ],
      bullets: [
        "Partner churn from slow payouts: Partners who wait 60+ days for commission payment are 3x more likely to deprioritize your deals. Every week of delay costs pipeline.",
        "Disputed deals: When attribution is unclear, deals get stuck in dispute cycles. Average resolution time: 2–3 weeks. Revenue recognition gets delayed. Finance gets nervous.",
        "Missed upsell signals: A spreadsheet can tell you what happened. It can't tell you which partners are trending up, which are at risk, or where to double down. You're flying blind on the channel that drives a third of your revenue.",
        "Onboarding friction: New partners wait days or weeks for portal access, deal reg confirmation, and commission visibility. The best partners — the ones with options — go somewhere else.",
      ],
    },
    {
      heading: "The math",
      paragraphs: [
        "Add it up for a program with 30 active partners and $2M in annual partner-influenced revenue:",
      ],
      bullets: [
        "Ops overhead: $50–100K/year",
        "Commission errors: $60–100K/year",
        "Pipeline leakage from slow payouts: $100–200K/year (conservative)",
        "Partner churn replacement cost: $30–50K/year",
        "Total: $240–450K/year in real cost",
      ],
    },
    {
      paragraphs: [
        "A purpose-built platform costs $1,200–4,200/year at the same scale. The ROI isn't a rounding error — it's a 50–100x return.",
        "The spreadsheet isn't free. It just hides the cost in time, errors, and lost revenue. Every month you wait is another month of compounding inefficiency.",
      ],
    },
  ],

  "3-attribution-models-every-vp-should-know": [
    {
      paragraphs: [
        "The 'first touch vs. last touch' debate has poisoned partner attribution for a decade. It's the wrong framework entirely.",
        "Marketing attribution and partner attribution are different problems. Marketing has hundreds of anonymous touchpoints across channels. Partner programs have named relationships, registered deals, and contractual obligations. Trying to force marketing attribution models onto partner programs is why most of them end up in spreadsheets.",
        "Here are three models that actually reflect how partner programs work in the real world.",
      ],
    },
    {
      heading: "1. Deal Registration Protection",
      paragraphs: [
        "How it works: The partner who registers the deal first gets full credit — as long as the registration is approved before the deal closes. Registration creates a time-limited protection window (typically 90–180 days). If the deal closes within the window, that partner gets the commission.",
        "When to use it: Reseller programs, VAR programs, any model where partners are actively selling your product alongside direct sales. This is the most common model — roughly 80% of B2B partner programs use some version of it.",
        "Why it works: It's simple, predictable, and defensible. Partners know exactly what they need to do (register early), and sales knows exactly who gets credit (whoever registered first). Disputes drop dramatically because the rules are binary — either you registered it or you didn't.",
      ],
      bullets: [
        "Best for: Reseller programs with 10–100 partners",
        "Commission range: 10–25% of deal value",
        "Key config: Protection window length, auto-expire rules, conflict resolution (when two partners register the same deal)",
      ],
    },
    {
      heading: "2. Source Wins",
      paragraphs: [
        "How it works: The partner who sourced or introduced the opportunity gets credit, regardless of who else is involved later. 'Sourcing' means the partner brought the customer to you — not that they showed up after the deal was already in pipeline.",
        "When to use it: Referral programs, affiliate programs, technology partnership referrals. Any model where the primary value is the introduction, not ongoing deal support.",
        "Why it works: It rewards the hardest part of the funnel — finding the opportunity. Partners who bring net-new logos are worth more than partners who attach to existing pipeline. This model makes that explicit.",
      ],
      bullets: [
        "Best for: Referral and affiliate programs",
        "Commission range: 5–15% of first-year revenue (sometimes recurring)",
        "Key config: Source verification rules (how do you prove the partner sourced it?), attribution window (how long after intro does the partner get credit?)",
      ],
    },
    {
      heading: "3. Role Split",
      paragraphs: [
        "How it works: Multiple partners share credit based on predefined percentages tied to their role in the deal. A reseller might get 60%, a technology partner 25%, and a referral partner 15%. The split is defined by partner type, not negotiated deal-by-deal.",
        "When to use it: Complex co-sell motions, ecosystem plays, any deal that involves more than one partner. Common in enterprise software where a deal might have a reseller, a systems integrator, and a technology partner all contributing.",
        "Why it works: Multi-partner deals are increasingly common — and 'winner take all' models create infighting. Role split acknowledges that different partners contribute different things. The reseller manages the commercial relationship, the tech partner provides integration value, and the referral partner opened the door.",
      ],
      bullets: [
        "Best for: Enterprise co-sell, ecosystem programs with 50+ partners",
        "Commission range: Varies by role (5–25% per partner, total 20–40%)",
        "Key config: Role definitions, default split percentages, override rules for strategic deals",
      ],
    },
    {
      heading: "Choosing the right model",
      paragraphs: [
        "Most programs start with Deal Reg Protection — it's the simplest and covers the majority of use cases. As your program matures and you add referral tracks or co-sell motions, you layer in Source Wins or Role Split for specific partner segments.",
        "The mistake is trying to use one model for everything. A reseller shouldn't be attributed the same way as a referral partner. Your attribution model should match how each partner type actually contributes value.",
        "Whatever model you choose, the non-negotiable is transparency. Partners need to see exactly how their credit was calculated. AEs need to verify that the attribution is correct. Finance needs an audit trail. If your attribution model can't produce a step-by-step paper trail for every payout, it's not ready for production.",
      ],
    },
  ],
};
