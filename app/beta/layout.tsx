import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Beta — Early Access to Covant",
  description: "Get early access to the partner intelligence platform. Free beta for VPs of Partnerships, RevOps, and partner managers building or scaling channel programs.",
  openGraph: {
    title: "Join the Beta — Early Access to Covant",
    description: "Get early access to Covant. Free beta for VPs of Partnerships, RevOps, and partner managers.",
    url: "https://covant.ai/beta",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
