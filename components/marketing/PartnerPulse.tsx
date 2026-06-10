/**
 * The hero visual: one partner's morning view in the Covant portal, computed
 * live from the Meridian demo dataset by the same selectors the /demo
 * environment runs on. Clearly labelled as a fictional scenario.
 */
import Link from "next/link";
import { SCENARIO, getPartnerPulse } from "@/lib/meridian/selectors";
import { fmtMoney, fmtWeekdayDate } from "@/components/demo/format";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PartnerPulse() {
  const pulse = getPartnerPulse(SCENARIO.pulseHeroPartnerId)!;
  const firstName = pulse.partner.contactName?.split(" ")[0] ?? pulse.partner.name;

  return (
    <div>
      <div
        className="m-pulse"
        role="img"
        aria-label={`A partner's morning view in the Covant portal. ${pulse.summary}`}
      >
        <div className="m-pulse-head">
          <span className="m-pulse-greeting">Good morning, {firstName}</span>
          <span className="m-pulse-meta">
            {fmtWeekdayDate(pulse.asOf)} · {pulse.partner.name} · {cap(pulse.tier.current)} partner
          </span>
        </div>
        <p className="m-pulse-summary">{pulse.summary}</p>
        <div className="m-pulse-items">
          {pulse.items.map((item, i) => (
            <div
              className={`m-pulse-item${i === 0 ? " m-pulse-item--lead" : ""}`}
              key={`${item.kind}-${item.dealId ?? i}`}
            >
              <span className="m-pulse-item-title">{item.title}</span>
              <span className="m-pulse-item-detail">{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="m-pulse-foot">
          {pulse.tier.next && (
            <div className="m-mock-row">
              <span className="m-mock-row-label">Progress to {pulse.tier.next}</span>
              <span className="m-mock-row-value">{pulse.tier.progress}%</span>
              <span className="m-mock-bar">
                <span className="m-mock-bar-fill" style={{ width: `${pulse.tier.progress}%` }} />
              </span>
            </div>
          )}
          {pulse.pendingPayout.amount > 0 && (
            <div className="m-mock-row">
              <span className="m-mock-row-label">Payout in flight</span>
              <span className="m-mock-row-value">{fmtMoney(pulse.pendingPayout.amount)}</span>
            </div>
          )}
        </div>
      </div>
      <p className="m-split-caption">
        Computed live from a fictional demo dataset.{" "}
        <Link
          href={`/demo/partner-view?partner=${SCENARIO.pulseHeroPartnerId}`}
          style={{ color: "var(--m-accent)", fontWeight: 600 }}
        >
          See this partner&apos;s full view →
        </Link>
      </p>
    </div>
  );
}
