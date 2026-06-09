"use client";

import { useRouter } from "next/navigation";
import { getLeaderboard } from "@/lib/meridian/selectors";
import { useMeridianDemo } from "./MeridianProvider";
import { fmtMoney } from "./format";

function DeltaChip({ delta, isBaseline }: { delta: number; isBaseline: boolean }) {
  if (isBaseline) return <span className="d-delta d-delta--flat">CRM view</span>;
  if (delta > 0) return <span className="d-delta d-delta--up">▲ {delta} vs CRM view</span>;
  if (delta < 0) return <span className="d-delta d-delta--down">▼ {Math.abs(delta)} vs CRM view</span>;
  return <span className="d-delta d-delta--flat">— vs CRM view</span>;
}

export default function PartnerLeaderboard() {
  const { model } = useMeridianDemo();
  const router = useRouter();
  const rows = getLeaderboard(model);
  const maxShare = Math.max(...rows.map((r) => r.share), 1);
  const isBaseline = model === "first_touch_sourcer";

  return (
    <div className="d-card">
      <h2 className="d-h2">Partner leaderboard</h2>
      <p className="d-sub">
        Won-deal credit under this lens. Rank movement is measured against the
        first-touch view — what a CRM report would show.
      </p>
      <div style={{ marginTop: "0.75rem" }}>
        {rows.map((row) => (
          <div
            key={row.partner._id}
            className="d-row d-row--click"
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/demo/partner-view?partner=${row.partner._id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/demo/partner-view?partner=${row.partner._id}`);
            }}
          >
            <span className="d-row-rank">{row.rank}</span>
            <span className="d-row-name">{row.partner.name}</span>
            <span className="d-bar">
              <span className="d-bar-fill" style={{ width: `${(row.share / maxShare) * 100}%` }} />
            </span>
            <span className="d-row-amount">{fmtMoney(row.credit)}</span>
            <DeltaChip delta={row.deltaVsFirstTouch} isBaseline={isBaseline} />
          </div>
        ))}
      </div>
    </div>
  );
}
