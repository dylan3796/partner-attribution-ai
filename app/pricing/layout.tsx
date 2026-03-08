import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free Tier, No Credit Card Required | Covant",
  description: "Start free with up to 5 partners. Pro from $99/mo, Scale from $349/mo. Pay by active partners, not seats. No time-limited trial — free tier is forever.",
  openGraph: {
    title: "Pricing — Free Tier, No Credit Card Required | Covant",
    description: "Start free with up to 5 partners. Pro $99/mo, Scale $349/mo. Pay by active partners, not seats.",
    url: "https://covant.ai/pricing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
