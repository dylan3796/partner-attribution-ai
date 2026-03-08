import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Talk to the Covant Team",
  description: "Get in touch with the Covant team. Enterprise pricing, demo requests, partnership inquiries, and general questions.",
  openGraph: {
    title: "Contact Us — Talk to the Covant Team",
    description: "Enterprise pricing, demo requests, partnership inquiries, and general questions.",
    url: "https://covant.ai/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
