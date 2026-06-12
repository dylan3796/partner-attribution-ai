import Vignette from "@/components/marketing/Vignette";
import CountUp from "@/components/marketing/CountUp";

/**
 * Illustrative product shot: a partner's home base in the portal — earnings
 * at a glance, explicit tier criteria, and the recommended next move.
 * Clearly labelled example data, not a live customer. Mirrors real portal
 * surface (app/portal/** dashboard, commissions, tier progress).
 *
 * Plays once on scroll-into-view: earnings count up, the tier bar fills,
 * the criteria land one by one, then the next move pops.
 */
export default function NextMoveVisual() {
  return (
    <Vignette>
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
        <div className="m-stats" data-vig={1}>
          <div className="m-stat">
            <p className="m-stat-label">Earned YTD</p>
            <p className="m-stat-value">
              <CountUp to={48200} prefix="$" delay={250} />
            </p>
          </div>
          <div className="m-stat">
            <p className="m-stat-label">Pending approval</p>
            <p className="m-stat-value">
              <CountUp to={6400} prefix="$" delay={400} />
            </p>
          </div>
          <div className="m-stat">
            <p className="m-stat-label">Projected Q3</p>
            <p className="m-stat-value">
              <CountUp to={12800} prefix="$" delay={550} />
            </p>
          </div>
        </div>
        <div className="m-prog" data-vig={2}>
          <div className="m-prog-top">
            <span>Progress to Gold</span>
            <span>
              <CountUp to={78} suffix="%" delay={900} />
            </span>
          </div>
          <span className="m-app-bartrack">
            <span
              className="m-app-barfill m-vig-bar"
              style={{ "--fill": "78%" } as React.CSSProperties}
            />
          </span>
          <ul className="m-checklist">
            <li data-vig={3}>
              <span className="m-check">✓</span> $250K influenced revenue — met
            </li>
            <li data-vig={4}>
              <span className="m-check">✓</span> 8 registered deals — met
            </li>
            <li data-vig={5}>
              <span className="m-check m-check--todo">○</span> 2 more closed wins to qualify
            </li>
          </ul>
        </div>
        <div className="m-reco m-vig-pop" data-vig={6}>
          <p className="m-reco-tag">Recommended next move</p>
          <p className="m-reco-body">
            Register the Atlas Logistics expansion — your evaluation work on the account is
            already credited.
          </p>
          <span className="m-reco-btn">Register deal →</span>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
