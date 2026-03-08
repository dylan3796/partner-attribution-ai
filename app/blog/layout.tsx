import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Partner Program Strategy & Best Practices | Covant",
  description: "Expert guides on partner attribution, commission structures, deal registration, program scaling, KPIs, and partner intelligence. Written for VPs of Partnerships.",
  openGraph: {
    title: "Blog — Partner Program Strategy & Best Practices | Covant",
    description: "Expert guides on partner attribution, commissions, deal registration, and partner intelligence.",
    url: "https://covant.ai/blog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
