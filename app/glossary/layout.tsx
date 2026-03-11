import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Glossary — Key Terms & Definitions",
  description: "Plain-language definitions for partner program terms: attribution models, deal registration, MDF, co-selling, channel conflict, and more.",
  openGraph: {
    title: "Partner Program Glossary — Key Terms & Definitions",
    description: "Plain-language definitions for partner program terms: attribution models, deal registration, MDF, co-selling, channel conflict, and more.",
    type: "website",
    siteName: "Covant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner Program Glossary — Key Terms & Definitions",
    description: "Plain-language definitions for partner program terms: attribution models, deal registration, MDF, co-selling, channel conflict, and more.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
