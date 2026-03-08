import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Features — 45+ Partner Program Capabilities | Covant",
  description: "Explore every Covant feature: attribution models, commission automation, partner portal, analytics, integrations, and productivity tools. The complete partner intelligence platform.",
  openGraph: {
    title: "All Features — 45+ Partner Program Capabilities | Covant",
    description: "Explore every Covant feature: attribution, commissions, partner portal, analytics, integrations, and more.",
    url: "https://covant.ai/features",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
