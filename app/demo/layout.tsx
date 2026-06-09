import type { Metadata } from "next";
import { MeridianProvider } from "@/components/demo/MeridianProvider";
import DemoTopbar from "@/components/demo/DemoTopbar";

export const metadata: Metadata = {
  title: "Covant demo — Meridian Analytics",
  description:
    "A live demo of Covant's attribution engine on Meridian Analytics, a fictional $40M ARR B2B SaaS company. Flip between five attribution models and watch the story change.",
  robots: { index: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <MeridianProvider>
      <div className="d-shell">
        <DemoTopbar />
        <main className="d-main">{children}</main>
      </div>
    </MeridianProvider>
  );
}
