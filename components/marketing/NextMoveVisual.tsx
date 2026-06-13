import Vignette from "@/components/marketing/Vignette";
import CountUp from "@/components/marketing/CountUp";

/**
 * Illustrative product shot: a partner's home base in the portal — the
 * journey they're walking, the deals they're part of, an incoming enlist
 * ask from the vendor, and a two-way submission in review. Clearly
 * labelled example data, not a live customer.
 *
 * Future scope: the one-click enlist actions (call scheduling, AI-drafted
 * outreach) and two-way submission types (leads, customer stories,
 * references, posts) shown here are not yet modeled in app/portal/** —
 * marketing surface for the full vision, not shipped product.
 *
 * Plays once on scroll-into-view: journey bar fills, deals land, the
 * enlist ask pops, then the submission line.
 */
const DEALS = [
  {
    name: "Atlas Health — implementation",
    pill: "Enlisted",
    line: true,
    note: "Joined at evaluation · next step: scoping call",
  },
  {
    name: "Northwind expansion",
    pill: "Registered",
    line: true,
    note: "Submitted by you · approved, in your vendor's pipeline",
  },
];

export default function NextMoveVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example partner portal screen: journey progress toward a solution launch, the partner's active deals with their status, an incoming ask from the vendor to join a deal with a call proposed, and a submitted customer story in review"
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
          <span className="m-pill">Launch journey</span>
        </div>
        <div className="m-prog" data-vig={1}>
          <div className="m-prog-top">
            <span>Your journey — solution launch</span>
            <span>
              <CountUp to={2} suffix=" of 3" delay={600} duration={600} />
            </span>
          </div>
          <span className="m-app-bartrack">
            <span
              className="m-app-barfill m-vig-bar"
              style={{ "--fill": "66%" } as React.CSSProperties}
            />
          </span>
        </div>
        <div>
          {DEALS.map((d, i) => (
            <div className="m-app-row" data-vig={i + 2} key={d.name}>
              <div style={{ minWidth: 0 }}>
                <div className="m-app-name">
                  {d.name}{" "}
                  <span className={d.line ? "m-pill m-pill--line" : "m-pill"}>
                    {d.pill}
                  </span>
                </div>
                <p className="m-app-reason">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="m-reco m-vig-pop" data-vig={4}>
          <p className="m-reco-tag">New ask from your vendor</p>
          <p className="m-reco-body">
            Atlas Logistics expansion — they want you in. Your delivery record
            on the account fits. Call proposed for Thursday.
          </p>
          <span className="m-reco-btn">Accept &amp; book →</span>
        </div>
        <div className="m-app-foot" data-vig={5}>
          <span>Customer story submitted · in review</span>
          <span className="m-app-link">Submit a lead →</span>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
