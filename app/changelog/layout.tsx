import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — What's New at Covant",
  description: "Every feature, fix, and improvement shipped to Covant. Follow our daily shipping cadence — 90+ items and counting.",
  openGraph: {
    title: "Changelog — What's New at Covant",
    description: "Every feature, fix, and improvement shipped to Covant. 90+ items and counting.",
    url: "https://covant.ai/changelog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
