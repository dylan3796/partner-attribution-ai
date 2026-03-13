import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Commission Calculator | Covant",
  description: "Calculate partner commission rates by type and tier. See monthly and annual totals instantly. Free tool, no signup required.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
