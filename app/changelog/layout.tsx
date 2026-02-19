import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Covant",
  description: "Latest updates, features, and improvements to the Covant partner attribution platform.",
  openGraph: {
    title: "Covant Changelog — What's New",
    description: "See the latest features and improvements to the Covant platform.",
  },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
