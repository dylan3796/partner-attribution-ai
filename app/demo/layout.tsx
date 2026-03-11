import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Covant Live Demo — See Partner Attribution in Action",
  description: "Explore Covant with sample data. See how multi-touch attribution, commission calculations, and partner portal work — no signup required.",
  openGraph: {
    title: "Covant Live Demo — See Partner Attribution in Action",
    description: "Explore Covant with sample data. See how multi-touch attribution, commission calculations, and partner portal work — no signup required.",
    type: "website",
    siteName: "Covant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covant Live Demo — See Partner Attribution in Action",
    description: "Explore Covant with sample data. See how multi-touch attribution, commission calculations, and partner portal work — no signup required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
