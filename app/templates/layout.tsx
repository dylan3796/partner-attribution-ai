import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Templates — Pre-Built Blueprints for SaaS, Reseller & Referral Programs",
  description: "Five ready-to-use partner program blueprints: SaaS Reseller, Referral, Alliance, Affiliate, and Co-Sell. Start your program in minutes, not months.",
  openGraph: {
    title: "Partner Program Templates — Pre-Built Blueprints for SaaS, Reseller & Referral Programs",
    description: "Five ready-to-use partner program blueprints: SaaS Reseller, Referral, Alliance, Affiliate, and Co-Sell. Start your program in minutes, not months.",
    type: "website",
    siteName: "Covant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner Program Templates — Pre-Built Blueprints for SaaS, Reseller & Referral Programs",
    description: "Five ready-to-use partner program blueprints: SaaS Reseller, Referral, Alliance, Affiliate, and Co-Sell. Start your program in minutes, not months.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
