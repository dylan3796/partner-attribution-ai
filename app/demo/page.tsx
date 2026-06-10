"use client";

import { getAttributionGap } from "@/lib/meridian/selectors";
import ModelSelector from "@/components/demo/ModelSelector";
import KpiCards from "@/components/demo/KpiCards";
import PartnerLeaderboard from "@/components/demo/PartnerLeaderboard";
import DealTimeline from "@/components/demo/DealTimeline";
import { fmtMoney } from "@/components/demo/format";

export default function DemoDashboard() {
  const gap = getAttributionGap();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="d-h1">Partner revenue — Meridian Analytics</h1>
          <p className="d-sub">
            Same partners, same deals, same touchpoints. Flip the lens and watch
            who gets credit change.
          </p>
        </div>
        <ModelSelector />
      </div>

      <div className="d-section">
        <KpiCards />
      </div>

      <div className="d-section">
        <div className="d-action">
          <div>
            <p className="d-action-title">
              {fmtMoney(gap.hiddenRevenue)} of won revenue is invisible in the CRM&apos;s
              first-touch view
            </p>
            <p className="d-action-why">
              Across {gap.dealsAffected} won deals, the partner who registered the deal
              gets 100% in a first-touch report while the partners who implemented and
              closed get nothing. The role-weighted lens redistributes that credit —
              compare the leaderboard under both.
            </p>
          </div>
        </div>
      </div>

      <div className="d-section">
        <PartnerLeaderboard />
      </div>

      <div className="d-section">
        <DealTimeline />
      </div>
    </>
  );
}
