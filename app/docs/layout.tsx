import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation — Covant",
  description: "Complete REST API reference for the Covant partner attribution platform. Endpoints for partners, deals, attribution, payouts, and webhooks.",
  openGraph: {
    title: "Covant API Documentation",
    description: "REST API reference for partner attribution, deal management, and commission payouts.",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
