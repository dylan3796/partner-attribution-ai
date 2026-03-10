import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Assessment — Free Maturity Quiz | Covant.ai",
  description: "Take a free 8-question assessment to evaluate your partner program maturity. Get a personalized score and recommendations for attribution, commissions, and operations.",
  openGraph: {
    title: "Partner Program Assessment — Free Maturity Quiz | Covant.ai",
    description: "Evaluate your partner program maturity in 2 minutes. Free assessment with personalized recommendations.",
    url: "https://covant.ai/assessment",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
