import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PartnerAI — The AI-Native Partner Platform",
  description:
    "Run your entire partner operation from one platform. Attribution, incentives, program management, partner portal, revenue intelligence — all powered by AI.",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤝</text></svg>", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "PartnerAI — The AI-Native Partner Platform",
    description: "Run your entire partner operation from one platform. Attribution, incentives, program management, partner portal, revenue intelligence — all powered by AI.",
    type: "website",
    siteName: "PartnerAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PartnerAI — The AI-Native Partner Platform",
    description: "Run your entire partner operation from one platform. Attribution, incentives, and partner management — all powered by AI.",
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
        <StoreProvider>
          <Nav />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
