import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Covant",
  description: "Insights on partner attribution, commission management, and building high-performance partner programs.",
  openGraph: {
    title: "Covant Blog",
    description: "Insights on partner attribution, commission management, and building high-performance partner programs.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
