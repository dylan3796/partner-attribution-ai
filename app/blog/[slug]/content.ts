type Section = {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
};

export const ARTICLE_CONTENT: Record<string, Section[]> = {
  "how-to-build-partner-commission-structure": [
    {
      paragraphs: [
        "Every partner program starts the same way: 'We'll give partners 10% on closed deals.' It's clean. It's simple. And it stops working the moment you hit 20 partners.",
        "The reseller who manages a $500K enterprise relationship gets the same rate as the affiliate who sent a cold email intro. Your top performer is quietly building a spreadsheet comparing your commission rates to competitors. And your finance team is asking why partner payouts increased 40% while partner-sourced revenue only grew 15%.",
        "Commission structure isn't a spreadsheet problem. It's an incentive design problem. Get it right and partners prioritize your deals. Get it wrong and your best partners walk.",
      ],
    },
    {
      heading: "Why flat rates break down",
      paragraphs: [
        "A flat commission rate sends one message: every partner and every deal is worth the same to us. That's almost never true.",
      ],
      bullets: [
        "A reseller managing the full sales cycle contributes more than a referral partner who makes an introduction — they should earn more",
        "A partner closing enterprise deals ($100K+) has longer cycles and higher effort than one bringing in SMB deals — the rate should reflect that",
        "A Gold partner with 30 closed deals this year is more valuable than a new partner with zero — flat rates don't reward loyalty or volume",
        "Strategic product lines or expansion into new markets might warrant higher rates to incentivize focus",
      ],
    },
    {
      heading: "The three layers of commission design",
      paragraphs: [
        "Effective commission structures layer three dimensions: partner role, deal characteristics, and performance tier. Each one answers a different question.",
      ],
    },
    {
      heading: "Layer 1: Role-based rates",
      paragraphs: [
        "Different partner types contribute different value. Your commission structure should acknowledge that explicitly.",
      ],
      bullets: [
        "Resellers (full sales cycle): 15–25% — they own the customer relationship, handle objections, and close",
        "Referral partners (introduction only): 5–10% — they open the door, you walk through it",
        "Technology partners (integration-driven): 8–15% — they drive adoption through product integration",
        "Affiliate/marketplace: 3–8% — high volume, low touch, typically automated",
      ],
    },
    {
      paragraphs: [
        "This isn't about paying less — it's about paying right. A referral partner earning 8% on a warm intro they spent 15 minutes on is getting a better deal than a reseller earning 20% on a deal they managed for 4 months.",
      ],
    },
    {
      heading: "Layer 2: Deal-based modifiers",
      paragraphs: [
        "Not all deals are created equal. Modifiers adjust the base rate based on deal characteristics:",
      ],
      bullets: [
        "Deal size thresholds: Enterprise deals (>$100K ACV) might get a 2–5% bump because the sales cycle is longer and partner effort is higher",
        "New vs. expansion: First deal with a net-new customer is worth more than an upsell on an existing account — consider a sourcing bonus (one-time $500–$2K) on top of the commission",
        "Product line: If you're pushing a new product, offer a temporarily higher rate (20% instead of 15%) to incentivize partner focus",
        "Multi-year contracts: 3-year deal? Pay commission on year 1 at full rate and years 2–3 at a reduced rate (e.g., 50%)",
      ],
    },
    {
      heading: "Layer 3: Performance tiers",
      paragraphs: [
        "Tiers reward consistency and volume. The structure should be simple enough that partners can calculate their path to the next level:",
      ],
      bullets: [
        "Silver (0–$100K annual): Base rate",
        "Gold ($100K–$500K annual): Base rate + 3% bonus",
        "Platinum ($500K+ annual): Base rate + 5% bonus + quarterly accelerator",
      ],
    },
    {
      paragraphs: [
        "Keep tiers to 3–4 levels. More than that creates confusion. The gap between tiers should be achievable — if no partner can realistically reach Platinum, it's not a tier, it's decoration.",
        "Critical: tier evaluation should be automatic. If a partner has to email you to ask what tier they're in, your system is broken.",
      ],
    },
    {
      heading: "The ops reality",
      paragraphs: [
        "A three-layer commission structure sounds elegant on a whiteboard. In practice, it means: Gold reseller on a $150K enterprise deal for a new product gets (20% base + 3% tier bonus) × 1.0 product modifier = 23%. Can your current system calculate that automatically?",
        "If you're running commissions in a spreadsheet, adding layers means adding formula complexity, error surface, and reconciliation time. Every modifier is another column. Every tier is another IF statement. Every edge case is another row someone has to manually verify.",
        "This is where most programs get stuck. They know flat rates don't work, but they can't operationalize anything better. The answer isn't simpler commission structures — it's better tooling.",
      ],
    },
    {
      heading: "Getting started",
      paragraphs: [
        "If you're redesigning your commission structure, start here:",
      ],
      bullets: [
        "Audit your current payouts: Who earned what last quarter? Does the payout distribution match the value distribution? If your top 3 partners drive 60% of revenue but earn 30% of commissions, your structure is misaligned.",
        "Define 2–3 partner roles: Don't overcomplicate. Reseller, referral, and technology is enough for most programs.",
        "Set base rates by role: Look at what competitors pay (industry benchmarks are 10–25% for resellers, 5–10% for referrals). Then differentiate slightly — not by paying more, but by paying faster and more transparently.",
        "Add one modifier: Start with deal size or new-vs-expansion. Don't add all three layers at once.",
        "Automate the calculation: If a partner can't see their commission within 24 hours of a deal closing, you're too slow. The best programs pay within 30 days and show real-time accruals.",
      ],
    },
    {
      paragraphs: [
        "Commission structure is a lever, not a cost center. The right structure turns partners into an extension of your sales team. The wrong one makes them feel like an afterthought. Design it like the strategic asset it is.",
      ],
    },
  ],

  "partner-deal-registration-best-practices": [
    {
      paragraphs: [
        "Deal registration is the single most important operational workflow in a partner program. It's how partners claim deals, how you prevent channel conflict, and how you decide who gets paid. And most teams run it over email.",
        "A partner emails their channel manager: 'Hey, we're working on a deal with Acme Corp, $200K, should close Q2.' The channel manager logs it in a spreadsheet. Maybe they check CRM to see if direct sales is already working it. Maybe they don't. Six weeks later, the deal closes and two people think they own it.",
        "This is a $200K dispute waiting to happen. And it happens every quarter in every partner program that doesn't have a real deal registration system.",
      ],
    },
    {
      heading: "What deal registration actually solves",
      paragraphs: [
        "Deal reg isn't paperwork — it's a protection mechanism for both sides:",
      ],
      bullets: [
        "For partners: It guarantees that if they register a deal first and it closes, they get credit. No arguments, no 'we were already working that account.' Registration = protection.",
        "For you: It gives pipeline visibility into what partners are working. You see deals before they close, can deconflict with direct sales early, and forecast partner-sourced revenue accurately.",
        "For sales: It eliminates the 'who sourced it?' argument at quarter-end. If the deal was registered before the AE touched it, the partner sourced it. Period.",
      ],
    },
    {
      heading: "The anatomy of a good deal reg workflow",
      paragraphs: [
        "A deal registration workflow has five steps. Each one is a potential failure point if handled manually.",
      ],
    },
    {
      heading: "Step 1: Submission",
      paragraphs: [
        "The partner submits a deal registration with: customer name, estimated deal size, expected close date, and a brief description of the opportunity. That's it. Don't ask for 15 fields — partners won't fill them out, and you don't need them yet.",
        "The submission should be self-service. A form in the partner portal, not an email to a channel manager. Every hour between 'partner finds an opportunity' and 'registration is submitted' is time for someone else to register it first.",
      ],
    },
    {
      heading: "Step 2: Deconfliction",
      paragraphs: [
        "This is where most programs fail. Someone needs to check: is direct sales already working this account? Has another partner registered the same deal?",
        "Manual deconfliction means a channel manager opens the CRM, searches for the account, checks open opportunities, and cross-references against existing registrations. This takes 10–30 minutes per deal. At 20 registrations per week, that's a full day of work.",
        "Automated deconfliction checks the CRM and registration database instantly. Duplicate? Flag it. Direct sales already has an open opp? Route to the channel manager for a judgment call. Clean? Auto-approve.",
      ],
    },
    {
      heading: "Step 3: Approval (with a clock)",
      paragraphs: [
        "Partners hate waiting. If a registration sits in 'pending' for a week, the partner assumes you don't care — and they're probably right.",
        "Set a hard SLA: registrations are approved or rejected within 48 hours. If nobody acts, auto-approve. Yes, this means some bad registrations slip through. That's fine — you can always reject later. The cost of a false positive is much lower than the cost of a partner who stops registering because they think nobody's reading them.",
      ],
      bullets: [
        "Auto-approve: Clean submission, no CRM conflicts, deal size under threshold ($50K). Partner gets instant confirmation.",
        "Route for review: CRM conflict detected, large deal, or flagged account. Channel manager reviews within 48h.",
        "Auto-reject: Duplicate registration, deal already closed, or blacklisted account. Instant with explanation.",
      ],
    },
    {
      heading: "Step 4: Protection window",
      paragraphs: [
        "Once approved, the registration creates a protection window — typically 90 to 180 days. During this window, the registering partner has exclusive claim to the deal. If it closes, they get the commission.",
        "Window length should match your sales cycle. If enterprise deals take 6 months, a 90-day window forces partners to re-register mid-cycle, which is friction for no reason. If SMB deals close in 30 days, a 180-day window is too generous.",
        "What happens at expiration matters: auto-extend by 30 days if the deal is still in active pipeline? Auto-expire and notify? Let the partner request an extension? Pick one approach and document it. The worst thing is ambiguity.",
      ],
    },
    {
      heading: "Step 5: Outcome tracking",
      paragraphs: [
        "When the deal closes (or doesn't), the registration should update automatically. Won? Commission calculated and queued. Lost? Registration archived with reason. Expired? Partner notified with option to re-register.",
        "Partners should be able to check the status of every registration in real time. Not by emailing their channel manager. Not by waiting for a quarterly report. In their portal, right now, with a status that updates when the CRM updates.",
      ],
    },
    {
      heading: "The metrics that matter",
      paragraphs: [
        "Once deal reg is running, track these:",
      ],
      bullets: [
        "Registration-to-close rate: What percentage of registered deals actually close? Healthy: 20–35%. Below 15% means partners are registering everything speculatively.",
        "Average approval time: How long from submission to approved/rejected? Target: <24 hours for auto-eligible, <48 for manual review.",
        "Conflict rate: How often do registrations conflict with direct sales or other partners? High conflict rates (>20%) suggest unclear territory rules or too many partners in the same accounts.",
        "Protection window utilization: What percentage of deals close within the protection window? If most deals need extensions, your window is too short.",
        "Partner registration velocity: Are partners registering more deals over time? Declining registration velocity is a leading indicator of partner disengagement.",
      ],
    },
    {
      heading: "Common mistakes",
      paragraphs: [
        "A few patterns that kill deal reg programs:",
      ],
      bullets: [
        "Too many required fields: Every extra field reduces submission rate. Ask for the minimum at registration, enrich later.",
        "No SLA on approvals: If approval takes a week, partners stop registering. Set a clock and stick to it.",
        "Manual-only deconfliction: Doesn't scale past 10 registrations per week. Automate the easy cases.",
        "Invisible status: If partners can't check registration status without emailing you, they'll assume the worst.",
        "One-size-fits-all windows: SMB and enterprise deals don't have the same cycle. Use different windows for different segments.",
        "No audit trail: When a registration is rejected, the partner needs to know why. 'Rejected' with no explanation breeds distrust.",
      ],
    },
    {
      paragraphs: [
        "Deal registration is where trust gets built or broken in a partner program. When it works — fast submission, fair deconfliction, transparent tracking — partners register more, conflicts drop, and your pipeline visibility improves. When it's broken, partners either stop registering or start gaming the system. Neither outcome is one you want.",
      ],
    },
  ],

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
