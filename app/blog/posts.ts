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
