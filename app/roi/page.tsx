import type { Metadata } from "next";
import Link from "next/link";
import ROICalculator from "@/components/ROICalculator";

export const metadata: Metadata = {
  title: "ROI Calculator — Covant",
  description:
    "Estimate the revenue impact of automating your partner program. Input your partners, deals, and commission rates to get a custom ROI projection.",
  openGraph: {
    title: "ROI Calculator — Covant",
    description:
      "Estimate the revenue impact of automating your partner program with Covant.",
  },
};

export default function ROIPage() {
  return (
    <div className="roi-page">
      <div className="roi-page-header">
        <p className="l-tag">Resources</p>
        <h1 className="roi-page-title">ROI Calculator</h1>
        <p className="roi-page-subtitle">
          Estimate revenue impact, time saved, and cost recovery from automating
          your partner program. All projections use conservative assumptions.
        </p>
      </div>

      <div className="roi-page-calc">
        <ROICalculator />
      </div>

      <div className="roi-page-cta">
        <h2 className="roi-page-cta-title">Ready to see it in action?</h2>
        <p className="roi-page-cta-text">
          Try the live demo with real data — no signup required.
        </p>
        <div className="roi-page-cta-buttons">
          <Link href="/dashboard?demo=true" className="l-btn">
            Try Live Demo
          </Link>
          <Link href="/contact" className="l-btn-outline">
            Talk to Us
          </Link>
        </div>
      </div>
    </div>
  );
}
