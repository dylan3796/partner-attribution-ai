import Vignette from "@/components/marketing/Vignette";
import CountUp from "@/components/marketing/CountUp";

/**
 * Illustrative product shot for the hero: a stalled open deal with two
 * channel signals — a partner proven in the deal's vertical who could
 * unblock it, and a partner already active in the account — each citing
 * the records behind it. Clearly labelled example data. Ordering matches
 * the positioning: putting partner expertise to work on revenue leads;
 * uncovering who's already there supports. Suggestions are cited and left
 * to the customer's judgment — never asserted as fact.
 *
 * Plays once on scroll-into-view: each signal lands, then the
 * unblock suggestion pops.
 */
const SIGNALS = [
  {
    initials: "BA",
    color: "#7a6a3a",
    name: "Brightline Apps",
    tag: "Proven in this vertical",
    detail:
      "4 healthcare deployments closed-won, including two at this deal size.",
    source: "Deal history",
  },
  {
    initials: "MC",
    color: "#1f5d4c",
    name: "Meridian Consulting",
    tag: "Already in the account",
    detail:
      "3 logged touches with Atlas Health since March — a workshop, an intro call, a scoping doc.",
    source: "Meeting + project records",
  },
];

export default function ChannelSignalVisual() {
  return (
    <Vignette>
    <div
      className="m-shot"
      role="img"
      aria-label="Example product screen: a stalled healthcare deal with two partner signals — one partner proven in the vertical who could unblock it, another already active in the account — each citing the records behind it"
    >
      <div className="m-app">
        <div className="m-app-bar">
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-dot" />
          <span className="m-app-title">Covant · Channel signals</span>
          <span className="m-app-tag">Example data</span>
        </div>
        <div className="m-app-head">
          <div>
            <div className="m-app-deal">
              Atlas Health — New implementation <span className="m-pill">Open deal</span>
            </div>
            <p className="m-app-sub">Healthcare · stalled 21 days · no partner attached</p>
          </div>
          <div>
            <div className="m-app-amount">
              <CountUp to={120000} prefix="$" duration={1100} />
            </div>
            <p className="m-app-sub" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              Estimated
            </p>
          </div>
        </div>
        <div>
          {SIGNALS.map((s, i) => (
            <div className="m-app-row" data-vig={i + 1} key={s.name}>
              <span className="m-avatar" style={{ background: s.color }}>
                {s.initials}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="m-app-name">
                  {s.name} <span className="m-pill">{s.tag}</span>
                </div>
                <p className="m-app-reason">{s.detail}</p>
              </div>
              <div>
                <div className="m-app-credit">{s.source}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="m-app-foot" data-vig={3}>
          <span>Every signal cites its records — your call to make</span>
          <span className="m-app-link">View records →</span>
        </div>
      </div>
      <div className="m-float m-vig-pop" data-vig={4}>
        <span className="m-float-icon">⚑</span>
        <div>
          <p className="m-float-title">A partner can unblock this deal</p>
          <p className="m-float-sub">
            Brightline Apps has delivered 4 healthcare deployments like this one — suggest
            them to the AE?
          </p>
        </div>
      </div>
    </div>
    </Vignette>
  );
}
