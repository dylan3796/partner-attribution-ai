import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Partner Program Tools | Covant",
  description: "Free tools for partner program managers. No signup required.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
