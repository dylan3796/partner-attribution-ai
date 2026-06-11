/**
 * Illustrative product shot: a partner's home base in the portal — earnings
 * at a glance, explicit tier criteria, and the recommended next move.
 * Clearly labelled example data, not a live customer. Mirrors real portal
 * surface (app/portal/** dashboard, commissions, tier progress).
 */
export default function NextMoveVisual() {
  return (
    <div
      className="m-shot"
      role="img"
      aria-label="Example partner portal screen: earnings summary, progress toward Gold tier with explicit criteria, and a recommended next move"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Partner portal · your brand</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
            <span className="m-avatar" style={{ background: "#1f5d4c" }}>
              MC
            </span>
            <div>
              <div className="m-app-deal">Meridian Consulting</div>
              <p className="m-app-sub" style={{ marginTop: ".1rem" }}>
                SI program · partner since 2024
              </p>
            </div>
          </div>
          <span className="m-pill">Silver tier</span>
        </div>
        <div className="m-stats">
          <div className="m-stat">
            <p className="m-stat-label">Earned YTD</p>
            <p className="m-stat-value">$48,200</p>
          </div>
          <div className="m-stat">
            <p className="m-stat-label">Pending approval</p>
            <p className="m-stat-value">$6,400</p>
          </div>
          <div className="m-stat">
            <p className="m-stat-label">Projected Q3</p>
            <p className="m-stat-value">$12,800</p>
          </div>
        </div>
        <div className="m-prog">
          <div className="m-prog-top">
            <span>Progress to Gold</span>
            <span>78%</span>
          </div>
          <span className="m-app-bartrack">
            <span className="m-app-barfill" style={{ width: "78%" }} />
          </span>
          <ul className="m-checklist">
            <li>
              <span className="m-check">✓</span> $250K influenced revenue — met
            </li>
            <li>
              <span className="m-check">✓</span> 8 registered deals — met
            </li>
            <li>
              <span className="m-check m-check--todo">○</span> 2 more closed wins to qualify
            </li>
          </ul>
        </div>
        <div className="m-reco">
          <p className="m-reco-tag">Recommended next move</p>
          <p className="m-reco-body">
            Register the Atlas Logistics expansion — your evaluation work on the account is
            already credited.
          </p>
          <span className="m-reco-btn">Register deal →</span>
        </div>
      </div>
    </div>
  );
}
