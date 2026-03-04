import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Covant",
  description:
    "Get in touch with the Covant team. Questions about partner attribution, commission automation, or enterprise pricing? We respond within 48 hours.",
  openGraph: {
    title: "Contact Covant — Talk to the Team",
    description:
      "Reach out about partner program automation, enterprise pricing, or beta access. We respond within 48 hours.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
