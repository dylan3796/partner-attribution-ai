import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — Guides & Documentation | Covant.ai",
  description: "Step-by-step guides for partner attribution, commission rules, portal setup, integrations, and reporting. 22 articles across 7 categories.",
  openGraph: {
    title: "Help Center — Guides & Documentation | Covant.ai",
    description: "Step-by-step guides for partner attribution, commissions, portal setup, integrations, and reporting.",
    url: "https://covant.ai/help",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
