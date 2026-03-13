import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Program Health Scorecard | Covant",
  description: "Grade your partner program in 60 seconds. See exactly where you're leaving revenue on the table. Free, no signup required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
