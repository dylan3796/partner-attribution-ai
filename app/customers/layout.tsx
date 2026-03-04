import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Stories — Covant",
  description:
    "See how partner teams use Covant to automate attribution, commissions, and partner program management. Real scenarios, real results.",
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
