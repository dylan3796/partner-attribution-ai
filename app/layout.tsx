import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { PlatformConfigProvider } from "@/lib/platform-config";
import { Providers } from "./providers";
import Nav from "@/components/Nav";
import AskPartnerBase from "@/components/AskPartnerBase";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PartnerBase — AI-Powered Partner Intelligence for Your CRM",
  description:
    "AI-powered partner attribution and program management that layers on top of your CRM. Measure partner impact, automate commissions, and run world-class partner programs. Works with Salesforce, HubSpot, and Pipedrive.",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤝</text></svg>", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "PartnerBase — AI-Powered Partner Intelligence for Your CRM",
    description: "AI-powered partner attribution and program management that layers on top of your CRM. Measure partner impact, automate commissions, and run world-class partner programs.",
    type: "website",
    siteName: "PartnerBase",
  },
  twitter: {
    card: "summary_large_image",
    title: "PartnerBase — AI-Powered Partner Intelligence for Your CRM",
    description: "AI-powered partner attribution and program management that layers on top of your CRM. Measure partner impact, automate commissions, and run world-class partner programs.",
  },
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
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <StoreProvider>
            <PlatformConfigProvider>
              <Nav />
              {children}
              <AskPartnerBase />
            </PlatformConfigProvider>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
