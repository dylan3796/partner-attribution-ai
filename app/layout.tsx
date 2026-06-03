import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Covant — The AI-native PRM",
  description:
    "Covant is the AI-native PRM for B2B SaaS running more than one partner motion. It scores every partner, recommends the attribution model that fits each motion, and hands your team the next move. Partner Experience Management — the successor to the PRM.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Covant — The AI-native PRM",
    description: "The AI-native PRM that tells you which partners drive revenue, which model to attribute them with, and what to do next. Partner Experience Management — the successor to the PRM.",
    type: "website",
    siteName: "Covant",
    url: "https://covant.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covant — The AI-native PRM",
    description: "The AI-native PRM that tells you which partners drive revenue, which model to attribute them with, and what to do next.",
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
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
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
