import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Benchmarks 2026 | Covant",
  description:
    "16 key partner program benchmarks across attribution, commissions, engagement, and revenue. Compare your program against industry medians and top-quartile performers.",
  openGraph: {
    title: "Partner Program Benchmarks 2026 | Covant",
    description:
      "16 key partner program benchmarks with interactive comparison tool. See how your program stacks up.",
    url: "https://covant.ai/benchmarks",
  },
};

export default function BenchmarksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
