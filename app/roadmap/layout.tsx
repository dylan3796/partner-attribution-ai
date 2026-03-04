import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Roadmap — Covant",
  description:
    "See what Covant has shipped, what's in progress, and what's planned. Public roadmap for partner attribution, commission automation, and program management.",
  openGraph: {
    title: "Covant Product Roadmap — What's Shipped & What's Next",
    description:
      "Transparent product roadmap: shipped features, in-progress builds, and planned capabilities through Q3 2026.",
  },
};

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
