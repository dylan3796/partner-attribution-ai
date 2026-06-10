/**
 * Illustrative attribution split for a single deal with the reason behind
 * each percentage — the "paper trail" made visible. Clearly labelled as an
 * example — not live customer data. Mirrors the explanation strings the
 * shipped engine produces (convex/lib/attribution/models.ts).
 */
const ROWS = [
  {
    name: "Meridian Consulting",
    role: "SI",
    pct: 45,
    reason: "Ran the technical eval and delivered the implementation",
  },
  {
    name: "Brightline Apps",
    role: "ISV",
    pct: 20,
    reason: "Integration touchpoints kept the renewal alive in Q3",
  },
  {
    name: "Your sales team",
    role: "Closer",
    pct: 35,
    reason: "Sourced the opportunity and closed the contract",
  },
];

export default function AttributionExplainVisual() {
  return (
    <div
      className="m-split"
      role="img"
      aria-label="Example attribution split across three partners, each with the reason it earned its percentage"
    >
      <div className="m-split-head">
        <span>Meridian renewal · $120k · role-weighted</span>
        <span>Example</span>
      </div>
      {ROWS.map((row) => (
        <div className="m-split-row m-split-row--reason" key={row.name}>
          <span className="m-split-name">
            {row.name} <span className="m-split-role">{row.role}</span>
          </span>
          <span className="m-split-track">
            <span className="m-split-fill" style={{ width: `${row.pct}%` }} />
          </span>
          <span className="m-split-pct">{row.pct}%</span>
          <span className="m-split-reason">{row.reason}</span>
        </div>
      ))}
    </div>
  );
}
