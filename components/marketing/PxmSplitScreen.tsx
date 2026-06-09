/**
 * "PXM, not PRM" split-screen: what the internal team sees next to what each
 * partner sees. Both panes render real numbers from the Meridian demo dataset
 * (role-weighted lens) — the same data the /demo environment runs on.
 */
import Link from "next/link";
import {
  getLeaderboard,
  getPartnerScorecard,
  getPartnerSurfacedAction,
} from "@/lib/meridian/selectors";
import { fmtMoney } from "@/components/demo/format";

export default function PxmSplitScreen() {
  const board = getLeaderboard("role_weighted").filter((r) => r.credit > 0).slice(0, 4);
  const maxCredit = Math.max(...board.map((r) => r.credit), 1);
  const card = getPartnerScorecard("mp_001")!;
  const action = getPartnerSurfacedAction("mp_001");

  return (
    <div>
      <div className="m-pxm">
        <div className="m-pxm-pane">
          <div className="m-pxm-pane-head">What your team sees</div>
          <div className="m-pxm-pane-body">
            {board.map((row) => (
              <div className="m-mock-row" key={row.partner._id}>
                <span className="m-mock-row-label">{row.partner.name}</span>
                <span className="m-mock-row-value">{fmtMoney(row.credit)}</span>
                <span className="m-mock-bar">
                  <span
                    className="m-mock-bar-fill"
                    style={{ width: `${(row.credit / maxCredit) * 100}%` }}
                  />
                </span>
              </div>
            ))}
            <p className="m-small" style={{ marginTop: ".8rem" }}>
              Won-deal credit, role-weighted — who to back and why.
            </p>
          </div>
        </div>
        <div className="m-pxm-pane">
          <div className="m-pxm-pane-head">What {card.partner.name} sees</div>
          <div className="m-pxm-pane-body">
            <div className="m-mock-row">
              <span className="m-mock-row-label">Credited revenue</span>
              <span className="m-mock-row-value">{fmtMoney(card.creditByModel.role_weighted)}</span>
            </div>
            <div className="m-mock-row">
              <span className="m-mock-row-label">Open pipeline</span>
              <span className="m-mock-row-value">{fmtMoney(card.openPipeline)}</span>
            </div>
            {card.nextTier && (
              <div className="m-mock-row">
                <span className="m-mock-row-label">Progress to {card.nextTier}</span>
                <span className="m-mock-row-value">{Math.round(card.tierProgress)}%</span>
                <span className="m-mock-bar">
                  <span className="m-mock-bar-fill" style={{ width: `${card.tierProgress}%` }} />
                </span>
              </div>
            )}
            {action && (
              <p className="m-small" style={{ marginTop: ".8rem" }}>
                Next move: {action.title.toLowerCase()}.
              </p>
            )}
          </div>
        </div>
      </div>
      <p className="m-small" style={{ marginTop: "1.25rem" }}>
        Both sides run on the same ledger.{" "}
        <Link href="/demo" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
          Explore the live demo →
        </Link>
      </p>
    </div>
  );
}
