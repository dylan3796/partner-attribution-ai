import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Covant",
  description:
    "Simple, partner-count pricing. Free for up to 5 partners. Pro $99/mo, Scale $349/mo, Enterprise custom. No time-limited trials — start free forever.",
  openGraph: {
    title: "Covant Pricing — Start Free, Scale as You Grow",
    description:
      "Partner attribution and commission automation from $0/mo. Free tier for up to 5 partners, Pro for 25, Scale for 100, Enterprise unlimited.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
