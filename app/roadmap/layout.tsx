import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Roadmap — What's Shipped & What's Next | Covant",
  description: "Track Covant's development: 38+ shipped features, current priorities, and upcoming capabilities. Updated weekly.",
  openGraph: {
    title: "Product Roadmap — What's Shipped & What's Next | Covant",
    description: "38+ shipped features and counting. See what's built, in progress, and planned for Covant.",
    url: "https://covant.ai/roadmap",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
