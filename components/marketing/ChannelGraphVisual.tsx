import Vignette from "@/components/marketing/Vignette";

/**
 * Flagship product shot: the Channel Graph — the context layer itself.
 * Partners mapped from the customer's ingested data (the rail at top right),
 * with one partner's profile expanded: graph parameters (verticals, deal
 * size, time-to-close, use cases), each citing the records behind it —
 * including unstructured sources (emails, Slack threads, deal notes).
 * The closing pop shows the refinement loop: a customer correction
 * sharpening the graph. Clearly labelled example data.
 *
 * Plays once on scroll-into-view: parameters land one by one, then the
 * refinement pop.
 */
const PARAMETERS = [
  {
    label: "Verticals",
    value: (
      <>
        <span className="m-pill">Healthcare ×4</span>{" "}
        <span className="m-pill m-pill--line">Logistics ×2</span>
      </>
    ),
    note: "closed-won, last 24 months",
  },
  {
    label: "Deal size",
    value: "$80K – $250K",
    note: "the range they win in",
  },
  {
    label: "Time to close",
    value: "Eval → close, 41 days median",
    note: "faster than program average",
  },
  {
    label: "Use cases",
    value: "Cloud migration · Integrations",
    note: "read from deal notes, emails, and Slack threads",
  },
];

/* The rest of the graph — partners mapped alongside the expanded profile. */
const RAIL = [
  { initials: "BA", color: "#7a6a3a" },
  { initials: "NW", color: "#3d4f6b" },
  { initials: "KS", color: "#8a5a44" },
];

export default function ChannelGraphVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: the Channel Graph — partners mapped from the customer's data, with one partner's profile expanded into parameters for verticals, deal size, time to close, and use cases, each citing source records including emails, Slack threads, and deal notes, plus a refinement made by the customer's team"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Covant · Channel Graph</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
            <span className="m-avatar" style={{ background: "#1f5d4c" }}>
              MC
            </span>
            <div>
              <div className="m-app-deal">
                Meridian Consulting <span className="m-pill">Graph profile</span>
              </div>
              <p className="m-app-sub" style={{ marginTop: ".1rem" }}>
                First pass from your data · refined by your team
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {RAIL.map((p, i) => (
                <span
                  className="m-avatar"
                  key={p.initials}
                  style={{
                    background: p.color,
                    width: 24,
                    height: 24,
                    fontSize: ".56rem",
                    marginLeft: i === 0 ? 0 : -7,
                    border: "2px solid #fff",
                  }}
                >
                  {p.initials}
                </span>
              ))}
            </div>
            <p className="m-app-sub" style={{ whiteSpace: "nowrap" }}>
              +9 partners mapped
            </p>
          </div>
        </div>
        <div>
          {PARAMETERS.map((p, i) => (
            <div className="m-app-row" data-vig={i + 1} key={p.label}>
              <div style={{ minWidth: 0 }}>
                <p className="m-stat-label">{p.label}</p>
                <div className="m-app-name" style={{ marginTop: ".35rem" }}>
                  {p.value}
                </div>
                <p className="m-app-reason">{p.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="m-app-foot" data-vig={5}>
          <span>Every parameter cites its records</span>
          <span className="m-app-link">Refine this profile →</span>
        </div>
      </div>
      <div className="m-float m-vig-pop" data-vig={6}>
        <span className="m-float-icon">✎</span>
        <div>
          <p className="m-float-title">Profile refined</p>
          <p className="m-float-sub">
            Deal size updated by your team — the graph just got sharper.
          </p>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
