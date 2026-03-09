export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: "attribution" | "operations" | "strategy";
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "channel-conflict-resolution-guide",
    title: "Channel Conflict Resolution: The VP's Playbook for Partner Disputes",
    description:
      "Two partners claiming the same deal. An AE who registered it directly. A partner who sourced it six months ago. Channel conflict is inevitable — here's how to resolve it without destroying relationships.",
    date: "March 8, 2026",
    readTime: "8 min read",
    category: "operations",
  },
  {
    slug: "partner-onboarding-first-deal-in-30-days",
    title: "Partner Onboarding: How to Get New Partners to First Deal in 30 Days",
    description:
      "You signed the partner agreement. Everyone celebrated. Then nothing happened for 90 days. Here's the structured onboarding system that gets new partners to their first deal registration in 30 days — not 90.",
    date: "March 8, 2026",
    readTime: "8 min read",
    category: "operations",
  },
  {
    slug: "how-to-scale-partner-program",
    title: "How to Scale Your Partner Program from 10 to 100+ Partners",
    description:
      "The playbook that works at 10 partners breaks at 30 and collapses at 100. Here's the infrastructure, automation, and mindset shift required to scale a partner program without scaling your team 10x.",
    date: "March 8, 2026",
    readTime: "9 min read",
    category: "strategy",
  },
  {
    slug: "partner-program-kpis-metrics-to-track",
    title: "The 15 Partner Program KPIs That Actually Matter in 2026",
    description:
      "Most VPs track revenue and call it a day. The best ones track 15 metrics across attribution, engagement, operations, and growth — and use them to make decisions, not decorate slide decks.",
    date: "March 8, 2026",
    readTime: "8 min read",
    category: "strategy",
  },
  {
    slug: "partner-intelligence-data-driven-programs",
    title: "From Gut Feel to Partner Intelligence: How Data Changes Everything",
    description:
      "Most VPs of Partnerships run their programs on instinct and spreadsheets. The ones outperforming them by 3x have one thing in common: partner intelligence. Here's what it is and how to build it.",
    date: "March 7, 2026",
    readTime: "9 min read",
    category: "strategy",
  },
  {
    slug: "partner-portal-partners-actually-use",
    title: "How to Build a Partner Portal That Partners Actually Use",
    description:
      "Most partner portals are digital graveyards. Partners log in once, never come back. Here's how to build a portal that drives engagement, not frustration.",
    date: "March 4, 2026",
    readTime: "8 min read",
    category: "strategy",
  },
  {
    slug: "measure-partner-program-roi",
    title: "Partner Program ROI: How to Prove Your Channel Is Worth the Investment",
    description:
      "Your CEO wants to know if the partner program is working. 'Revenue influenced' isn't enough anymore. Here's how to measure — and communicate — real partner ROI.",
    date: "March 4, 2026",
    readTime: "7 min read",
    category: "attribution",
  },
  {
    slug: "how-to-build-partner-commission-structure",
    title: "How to Build a Partner Commission Structure That Scales",
    description:
      "Flat 10% for everyone stops working at 20 partners. Here's how to design tiered, role-based commission rules that reward performance without creating ops nightmares.",
    date: "March 4, 2026",
    readTime: "7 min read",
    category: "operations",
  },
  {
    slug: "partner-deal-registration-best-practices",
    title: "Partner Deal Registration: The Complete Guide for 2026",
    description:
      "Deal reg is the backbone of channel programs — and most teams still run it over email. How to build a deal registration workflow that protects partners and closes faster.",
    date: "March 4, 2026",
    readTime: "6 min read",
    category: "strategy",
  },
  {
    slug: "why-partner-attribution-is-broken",
    title: "Why Partner Attribution Is Broken (And What to Do About It)",
    description:
      "Most partner programs can't answer a basic question: which partner actually drove the deal? Here's why — and how modern attribution models fix it.",
    date: "March 3, 2026",
    readTime: "6 min read",
    category: "attribution",
  },
  {
    slug: "true-cost-of-spreadsheet-partner-programs",
    title: "The True Cost of Managing Partner Programs in Spreadsheets",
    description:
      "You're not saving money by running your partner program in Google Sheets. You're losing $200K+ a year in ops overhead, disputes, and missed revenue.",
    date: "March 2, 2026",
    readTime: "5 min read",
    category: "operations",
  },
  {
    slug: "3-attribution-models-every-vp-should-know",
    title: "3 Attribution Models Every VP of Partnerships Should Know",
    description:
      "Deal reg protection, source wins, role split — three real-world models that replace the vague 'first touch vs. last touch' debate.",
    date: "March 1, 2026",
    readTime: "7 min read",
    category: "strategy",
  },
];

export const CATEGORY_CONFIG = {
  attribution: { label: "Attribution", color: "#6366f1" },
  operations: { label: "Operations", color: "#22c55e" },
  strategy: { label: "Strategy", color: "#f59e0b" },
};
