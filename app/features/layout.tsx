import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Covant | Partner Intelligence Platform",
  description:
    "45+ features for partner attribution, commission automation, portal management, analytics, and integrations. See every capability in one place.",
  openGraph: {
    title: "Features — Covant | Partner Intelligence Platform",
    description:
      "45+ features for partner attribution, commission automation, portal management, analytics, and integrations.",
    url: "https://covant.ai/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
