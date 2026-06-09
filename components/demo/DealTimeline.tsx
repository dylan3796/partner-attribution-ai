"use client";

import { meridian } from "@/lib/meridian/dataset";
import { getDealLedger, isInterestingDeal } from "@/lib/meridian/selectors";
import { useMeridianDemo } from "./MeridianProvider";
import { fmtDate, fmtMoney } from "./format";

const STATUS_CLASS = { won: "d-pill--won", open: "d-pill--open", lost: "d-pill--lost" } as const;

export default function DealTimeline() {
  const { model } = useMeridianDemo();
  const deals = [...meridian.deals].sort(
    (a, b) => (b.closedAt ?? b.createdAt) - (a.closedAt ?? a.createdAt)
  );

  return (
    <div className="d-card">
      <h2 className="d-h2">Deals</h2>
      <p className="d-sub">
        All 20 deals. The amber flag marks deals where the five models disagree
        by 25+ points on someone&apos;s credit — worth a look before payout.
      </p>
      <div style={{ marginTop: "0.75rem" }}>
        {deals.map((deal) => {
          const ledger = getDealLedger(deal._id, model);
          const top = ledger[0];
          return (
            <div key={deal._id} className="d-deal">
              <div style={{ minWidth: 0 }}>
                <p className="d-deal-name">{deal.name}</p>
                <p className="d-deal-meta">
                  {deal.closedAt
                    ? `${deal.status === "won" ? "Closed" : "Lost"} ${fmtDate(deal.closedAt)}`
                    : `Expected close ${fmtDate(deal.expectedCloseDate ?? deal.createdAt)}`}
                  {top ? ` · top credit: ${top.partnerName}` : ""}
                </p>
              </div>
              {isInterestingDeal(deal._id) ? (
                <span className="d-flag" title="Attribution models disagree on this deal — review the split before payout.">
                  ⚠ models disagree
                </span>
              ) : (
                <span />
              )}
              <span className="d-row-amount">{fmtMoney(deal.amount)}</span>
              <span className={`d-pill ${STATUS_CLASS[deal.status]}`}>{deal.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
