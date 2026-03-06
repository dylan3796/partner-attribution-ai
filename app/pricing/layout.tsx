import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Covant",
  description:
    "Engine-based pricing. Partner Portal always free. Add Attribution, Incentives, Intelligence, and CRM engines individually or bundled. Starter, Growth, and Scale tiers.",
  openGraph: {
    title: "Covant Pricing — Pay for the engines you use",
    description:
      "Partner Portal is always free. Add AI engines to automate attribution, commissions, insights, and CRM sync — individually or bundled.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
