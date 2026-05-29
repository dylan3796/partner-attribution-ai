/**
 * Illustrative attribution split for a single co-sell deal under the
 * role-based model. Clearly labelled as an example — not live customer data.
 */
const ROWS = [
  { name: "Sourcing partner", pct: 45 },
  { name: "Implementation partner", pct: 35 },
  { name: "Referral partner", pct: 20 },
];

export default function AttributionSplitVisual() {
  return (
    <div className="m-split" role="img" aria-label="Example attribution split across three partners">
      <div className="m-split-head">
        <span>Deal · role-based model</span>
        <span>Example</span>
      </div>
      {ROWS.map((row) => (
        <div className="m-split-row" key={row.name}>
          <span className="m-split-name">{row.name}</span>
          <span className="m-split-track">
            <span className="m-split-fill" style={{ width: `${row.pct}%` }} />
          </span>
          <span className="m-split-pct">{row.pct}%</span>
        </div>
      ))}
    </div>
  );
}
