import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Assessment — Covant",
  description:
    "Take the 2-minute partner program maturity assessment. Score your attribution, commissions, deal registration, and partner experience across 8 dimensions.",
  openGraph: {
    title: "How Mature Is Your Partner Program? — Covant Assessment",
    description:
      "Free interactive quiz: score your partner program across attribution, commissions, deal reg, and operations. Get personalized recommendations.",
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
