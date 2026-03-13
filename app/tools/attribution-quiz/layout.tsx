import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attribution Model Quiz | Covant",
  description: "Find the right attribution model for your partner program in 2 minutes. 6 questions, instant recommendation. Free, no signup.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
