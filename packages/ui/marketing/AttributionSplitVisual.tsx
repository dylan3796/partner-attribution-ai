/**
 * Illustrative attribution split for a single co-sell deal under the
 * role-weighted model. Clearly labelled as an example — not live customer data.
 */
const ROWS = [
  { name: "Sourcer", pct: 45 },
  { name: "Implementer", pct: 35 },
  { name: "Influencer", pct: 20 },
];

export default function AttributionSplitVisual() {
  return (
    <div className="m-split" role="img" aria-label="Example attribution split across three partner roles">
      <div className="m-split-head">
        <span>Deal · role-weighted model</span>
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
