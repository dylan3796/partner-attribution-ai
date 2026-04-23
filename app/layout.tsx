import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Analytics } from "@vercel/analytics/next";
import { PlatformConfigProvider } from "@/lib/platform-config";
import { Providers } from "./providers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AskCovant from "@/components/AskCovant";
import AnnouncementBar from "@/components/AnnouncementBar";
import CookieConsent from "@/components/CookieConsent";
import { OrganizationSchema, WebSiteSchema, SoftwareApplicationSchema } from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Covant — The platform your partner team runs on",
  description:
    "The platform your partner team runs on. Four agents that unlock channel revenue — record every touchpoint, capture every deal, action every partner, and pay commissions end-to-end. Free branded portal for partners.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Covant — The platform your partner team runs on",
    description: "One ledger. Four agents (PSM, PAM, Program, Ops). Stripe Connect payouts. A branded portal your partners actually log into.",
    type: "website",
    siteName: "Covant",
    url: "https://covant.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covant — The platform your partner team runs on",
    description: "Four agents that unlock channel revenue end-to-end. Record every touchpoint, capture every deal, action every partner, pay every commission.",
  },
  metadataBase: new URL("https://covant.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode disabled — Covant is light-only */}
        <link rel="alternate" type="application/rss+xml" title="Covant Blog" href="/blog/feed.xml" />
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <StoreProvider>
            <PlatformConfigProvider>
              <AnnouncementBar />
              <Nav />
              {children}
              <Footer />
              <AskCovant />
              <CookieConsent />
            </PlatformConfigProvider>
          </StoreProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
