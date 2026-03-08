import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { StoreProvider } from "@/lib/store";
import { Analytics } from "@vercel/analytics/next";
import { PlatformConfigProvider } from "@/lib/platform-config";
import { Providers } from "./providers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AskCovant from "@/components/AskCovant";
import AnnouncementBar from "@/components/AnnouncementBar";
import { OrganizationSchema, WebSiteSchema, SoftwareApplicationSchema } from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Covant — Partner Intelligence Platform",
  description:
    "Covant is the rules engine that sits between 'someone did something' and 'someone gets paid.' Attribution, commission automation, and partner program management for any industry.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Covant — Partner Intelligence Platform",
    description: "Attribution, commission automation, and partner program management. Covant turns partner activity into automated, accurate payouts.",
    type: "website",
    siteName: "Covant",
    url: "https://covant.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covant — Partner Intelligence Platform",
    description: "Attribution, commission automation, and partner program management. The infrastructure layer for partner economics.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark'||(!localStorage.theme&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProvider>
          <Providers>
            <StoreProvider>
              <PlatformConfigProvider>
                <AnnouncementBar />
                <Nav />
                {children}
                <Footer />
                <AskCovant />
              </PlatformConfigProvider>
            </StoreProvider>
          </Providers>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
