import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Benchmarks 2026 — Industry Metrics & Comparison Tool | Covant.ai",
  description: "Compare your partner program against industry benchmarks. 16 key metrics across attribution, commissions, engagement, and revenue with interactive percentile rankings.",
  openGraph: {
    title: "Partner Program Benchmarks 2026 — Industry Metrics & Comparison Tool",
    description: "Compare your partner program against industry benchmarks. 16 key metrics with interactive percentile rankings.",
    url: "https://covant.ai/benchmarks",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
