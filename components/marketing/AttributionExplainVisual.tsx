/**
 * Illustrative product shot: a closed-won deal's attribution screen — split
 * percentages with the evidence behind each one, plus an earned-incentive
 * toast. Clearly labelled example data, not a live customer. Mirrors the
 * explanation strings the shipped engine produces
 * (convex/lib/attribution/models.ts).
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

export default function AttributionExplainVisual() {
  return (
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
          <span className="m-app-title">Covant · Deal attribution</span>
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
            <div className="m-app-amount">$186,000</div>
            <p className="m-app-sub" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              Role-weighted model
            </p>
          </div>
        </div>
        <div>
          {ROWS.map((r) => (
            <div className="m-app-row" key={r.name}>
              <span className="m-avatar" style={{ background: r.color }}>
                {r.initials}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="m-app-name">
                  {r.name} <span className="m-pill m-pill--line">{r.role}</span>
                </div>
                <p className="m-app-reason">{r.reason}</p>
                <span className="m-app-bartrack">
                  <span className="m-app-barfill" style={{ width: `${r.pct}%` }} />
                </span>
              </div>
              <div>
                <div className="m-app-pct">{r.pct}%</div>
                <div className="m-app-credit">{r.credit} credited</div>
              </div>
            </div>
          ))}
        </div>
        <div className="m-app-foot">
          <span>14 touchpoints logged · full audit trail</span>
          <span className="m-app-link">View evidence →</span>
        </div>
      </div>
      <div className="m-float">
        <span className="m-float-icon">✓</span>
        <div>
          <p className="m-float-title">Incentive earned</p>
          <p className="m-float-sub">
            Meridian Consulting · deal registration bonus · $4,485 — awaiting your approval
          </p>
        </div>
      </div>
    </div>
  );
}
