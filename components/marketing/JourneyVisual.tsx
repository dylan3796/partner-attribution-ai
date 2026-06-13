import Vignette from "@/components/marketing/Vignette";
import CountUp from "@/components/marketing/CountUp";

/**
 * Illustrative product shot: a partner journey — milestones the customer
 * defined, each validated against the data, with the same progress visible
 * to both sides in real time. Clearly labelled example data.
 *
 * Future scope: the journey-flow engine and validation datasets this shot
 * depicts (milestone definitions, automated validation, two-sided progress)
 * are not yet modeled in convex/ — this is marketing surface for the full
 * vision, not shipped product.
 *
 * Plays once on scroll-into-view: the progress bar fills, milestones land
 * one by one, then the validation pop.
 */
const MILESTONES = [
  {
    done: true,
    name: "First certification",
    pill: "Validated",
    note: "Confirmed against training records · Mar 12",
  },
  {
    done: true,
    name: "First dollar of revenue",
    pill: "Validated",
    note: "Closed-won, synced from your CRM · May 3",
  },
  {
    done: false,
    name: "First solution launched",
    pill: "In progress",
    note: "2 of 3 steps complete — listing drafted, review pending",
  },
];

export default function JourneyVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: a partner journey with customer-defined milestones — first certification and first revenue validated against the data, solution launch in progress — and a notification that a validated milestone is visible to both sides"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Covant · Partner journey</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
            <span className="m-avatar" style={{ background: "#7a6a3a" }}>
              BA
            </span>
            <div>
              <div className="m-app-deal">
                Brightline Apps <span className="m-pill">Launch journey</span>
              </div>
              <p className="m-app-sub" style={{ marginTop: ".1rem" }}>
                Milestones defined by you · validated against your data
              </p>
            </div>
          </div>
        </div>
        <div className="m-prog" data-vig={1}>
          <div className="m-prog-top">
            <span>Journey progress</span>
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
          {MILESTONES.map((m, i) => (
            <div className="m-app-row" data-vig={i + 2} key={m.name}>
              <span className={m.done ? "m-check" : "m-check m-check--todo"}>
                {m.done ? "✓" : "○"}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="m-app-name">
                  {m.name}{" "}
                  <span className={m.done ? "m-pill" : "m-pill m-pill--line"}>
                    {m.pill}
                  </span>
                </div>
                <p className="m-app-reason">{m.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="m-app-foot" data-vig={5}>
          <span>Both sides watch the same progress, live</span>
          <span className="m-app-link">View journey →</span>
        </div>
      </div>
      <div className="m-float m-vig-pop" data-vig={6}>
        <span className="m-float-icon">✓</span>
        <div>
          <p className="m-float-title">Milestone validated</p>
          <p className="m-float-sub">
            First dollar of revenue — visible to you and Brightline Apps.
          </p>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
