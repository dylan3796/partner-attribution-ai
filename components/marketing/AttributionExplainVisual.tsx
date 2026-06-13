import Vignette from "@/components/marketing/Vignette";
import CountUp from "@/components/marketing/CountUp";

/**
 * Illustrative product shot: credit on a closed-won deal, computed on the
 * customer's terms — their model, their weights — with the evidence behind
 * each number, plus an earned-incentive toast. Demoted from flagship:
 * lives only in /product's "Attribution, on your terms" section. Clearly
 * labelled example data, not a live customer. Mirrors the explanation
 * strings the shipped engine produces (convex/lib/attribution/models.ts).
 *
 * Plays once on scroll-into-view: each partner row lands, its bar fills to
 * the split and the percentage counts up, then the incentive toast pops.
 */
const ROWS = [
  {
    initials: "MC",
    color: "#1f5d4c",
    name: "Meridian Consulting",
    role: "SI · Implementer",
    pct: 45,
    credit: "$83,700",
    reason: "Ran the technical evaluation and delivered the 6-week implementation",
  },
  {
    initials: "BA",
    color: "#7a6a3a",
    name: "Brightline Apps",
    role: "ISV · Influencer",
    pct: 20,
    credit: "$37,200",
    reason: "Co-sell introduction; integration enablement through the eval",
  },
  {
    initials: "NW",
    color: "#3d4f6b",
    name: "Direct sales",
    role: "Closer",
    pct: 35,
    credit: "$65,100",
    reason: "Sourced the contact, negotiated, and closed the contract",
  },
];

/* CountUp delays trail each row's CSS landing delay so the number is
   mid-count as the row fades in (see .m-vig rules in globals.css). */
const ROW_COUNT_DELAYS = [250, 600, 950];

export default function AttributionExplainVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: a $186,000 closed-won deal attributed across three partners, each percentage shown with its evidence, and an earned-incentive notification awaiting approval"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Covant · Credit — your model</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head">
          <div>
            <div className="m-app-deal">
              Northwind Cloud Migration <span className="m-pill">Closed won</span>
            </div>
            <p className="m-app-sub">Northwind Logistics · Closed May 28 · 3 partners credited</p>
          </div>
          <div>
            <div className="m-app-amount">
              <CountUp to={186000} prefix="$" duration={1100} />
            </div>
            <p className="m-app-sub" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              Role-weighted — your pick
            </p>
          </div>
        </div>
        <div>
          {ROWS.map((r, i) => (
            <div className="m-app-row" data-vig={i + 1} key={r.name}>
              <span className="m-avatar" style={{ background: r.color }}>
                {r.initials}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="m-app-name">
                  {r.name} <span className="m-pill m-pill--line">{r.role}</span>
                </div>
                <p className="m-app-reason">{r.reason}</p>
                <span className="m-app-bartrack">
                  <span
                    className="m-app-barfill m-vig-bar"
                    style={{ "--fill": `${r.pct}%` } as React.CSSProperties}
                  />
                </span>
              </div>
              <div>
                <div className="m-app-pct">
                  <CountUp to={r.pct} suffix="%" delay={ROW_COUNT_DELAYS[i]} />
                </div>
                <div className="m-app-credit">{r.credit} credited</div>
              </div>
            </div>
          ))}
        </div>
        <div className="m-app-foot" data-vig={4}>
          <span>14 touchpoints logged · full audit trail</span>
          <span className="m-app-link">View evidence →</span>
        </div>
      </div>
      <div className="m-float m-vig-pop" data-vig={5}>
        <span className="m-float-icon">✓</span>
        <div>
          <p className="m-float-title">Incentive earned</p>
          <p className="m-float-sub">
            Meridian Consulting · deal registration bonus · $4,485 — awaiting your approval
          </p>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
