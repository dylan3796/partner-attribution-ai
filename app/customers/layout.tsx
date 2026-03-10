import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Stories — How Teams Use Covant | Covant.ai",
  description: "See how partner teams automate attribution, streamline commissions, and scale their programs with Covant. Real results from real partner programs.",
  openGraph: {
    title: "Customer Stories — How Teams Use Covant",
    description: "See how partner teams automate attribution, streamline commissions, and scale programs with Covant.",
    url: "https://covant.ai/customers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
