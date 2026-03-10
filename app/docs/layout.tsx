import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation — REST API & Webhooks | Covant.ai",
  description: "Covant REST API documentation. Endpoints for partners, deals, commissions, touchpoints, and webhooks. Authentication, rate limits, and code examples.",
  openGraph: {
    title: "API Documentation — REST API & Webhooks | Covant.ai",
    description: "Covant REST API documentation. Endpoints for partners, deals, commissions, touchpoints, and webhooks.",
    url: "https://covant.ai/docs",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
