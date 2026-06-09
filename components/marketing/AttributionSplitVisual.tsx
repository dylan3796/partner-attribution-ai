/**
 * The hero visual: one won deal from the Meridian demo dataset, shown under
 * the CRM's first-touch view and under Covant's role-weighted view. The
 * numbers are computed by the real attribution engine at render time —
 * clearly labelled as a fictional scenario, never invented inline.
 */
import { SCENARIO, getDeal, getDealLedger } from "@/lib/meridian/selectors";
import { fmtMoney } from "@/components/demo/format";

export default function AttributionSplitVisual() {
  const dealId = SCENARIO.attributionGapDealId;
  const deal = getDeal(dealId)!;
  const crmView = getDealLedger(dealId, "first_touch_sourcer");
  const covantView = [...getDealLedger(dealId, "role_weighted")].sort(
    (a, b) => b.percentage - a.percentage
  );
  const registrant = crmView[0];
  const registrantUnderRoles =
    covantView.find((e) => e.partnerId === registrant.partnerId)?.percentage ?? 0;
  const hidden = (deal.amount * (100 - registrantUnderRoles)) / 100;

  return (
    <div>
      <div
        className="m-split"
        role="img"
        aria-label="The same won deal under the CRM's first-touch view and Covant's role-weighted view"
      >
        <div className="m-split-head">
          <span>Won deal · {fmtMoney(deal.amount)}</span>
          <span>What your CRM sees</span>
        </div>
        {crmView.map((row) => (
          <div className="m-split-row" key={`crm-${row.partnerId}`}>
            <span className="m-split-name">{row.partnerName}</span>
            <span className="m-split-track">
              <span className="m-split-fill" style={{ width: `${row.percentage}%` }} />
            </span>
            <span className="m-split-pct">{Math.round(row.percentage)}%</span>
          </div>
        ))}
        <div className="m-split-head">
          <span>Same deal, same touchpoints</span>
          <span>What actually happened</span>
        </div>
        {covantView.map((row) => (
          <div className="m-split-row" key={`covant-${row.partnerId}`}>
            <span className="m-split-name">{row.partnerName}</span>
            <span className="m-split-track">
              <span
                className={`m-split-fill${row.partnerId !== registrant.partnerId ? " m-split-fill--warn" : ""}`}
                style={{ width: `${row.percentage}%` }}
              />
            </span>
            <span className="m-split-pct">{Math.round(row.percentage)}%</span>
          </div>
        ))}
      </div>
      <div className="m-callout-amber" style={{ marginTop: ".9rem" }}>
        <span aria-hidden>⚠</span>
        <span>
          {fmtMoney(hidden)} of this deal&apos;s credit belongs to partners your CRM
          can&apos;t see — the ones who implemented and closed it.
        </span>
      </div>
      <p className="m-split-caption">
        Computed by Covant&apos;s attribution engine on a fictional demo dataset.
      </p>
    </div>
  );
}
