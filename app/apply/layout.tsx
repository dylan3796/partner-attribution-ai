import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Partner — Apply to Join | Covant",
  description: "Apply to become a Covant partner. Reseller, referral, integration, and affiliate partnership opportunities for agencies, consultants, and technology companies.",
  openGraph: {
    title: "Become a Partner — Apply to Join | Covant",
    description: "Apply to become a Covant partner. Partnership opportunities for agencies, consultants, and tech companies.",
    url: "https://covant.ai/apply",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
