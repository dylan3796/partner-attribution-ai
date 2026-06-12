import Vignette from "@/components/marketing/Vignette";

/**
 * Illustrative product shot: how the map gets made. One partner's working
 * profile, built by joining the customer's opportunity/account/revenue data
 * with partner data and reading notes, emails, and registrations — then
 * expressed as parameters (industry expertise, deal size, deal progression,
 * prior relationships), each citing the records behind it. Clearly labelled
 * example data.
 *
 * Plays once on scroll-into-view: parameters land one by one.
 */
const PARAMETERS = [
  {
    label: "Industry expertise",
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
    label: "Deal progression",
    value: "Eval → close, 41 days median",
    note: "faster than program average",
  },
  {
    label: "Prior relationships",
    value: "Atlas Health · Northwind",
    note: "12 logged contacts, 2 delivered projects",
  },
];

export default function PartnerMapVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: a partner's working profile mapped from CRM records, notes, and emails — industry expertise, deal size range, deal progression speed, and prior relationships, each citing its source records"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Covant · Partner map</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
            <span className="m-avatar" style={{ background: "#1f5d4c" }}>
              MC
            </span>
            <div>
              <div className="m-app-deal">
                Meridian Consulting <span className="m-pill">Working profile</span>
              </div>
              <p className="m-app-sub" style={{ marginTop: ".1rem" }}>
                Mapped from CRM, notes, emails, registrations
              </p>
            </div>
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
          <span className="m-app-link">View sources →</span>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
