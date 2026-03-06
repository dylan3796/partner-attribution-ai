"use client";

import { useState } from "react";

export default function ROICalculator() {
  const [partners, setPartners] = useState(15);
  const [partnerRevenue, setPartnerRevenue] = useState(250_000);
  const [hoursPerMonth, setHoursPerMonth] = useState(20);

  // Conservative fixed assumptions
  const HOURLY_RATE = 75;          // fully-loaded ops hourly cost
  const REVENUE_IMPROVEMENT = 0.03; // 3% improvement in partner close rates
  const DISPUTE_HRS = 4;            // hours per dispute to resolve

  // Tier logic
  const getTier = (p: number) => {
    if (p <= 5)   return { name: "Free",       monthly: 0,   annual: 0    };
    if (p <= 25)  return { name: "Pro",        monthly: 99,  annual: 1188 };
    if (p <= 100) return { name: "Scale",      monthly: 349, annual: 4188 };
    return              { name: "Enterprise", monthly: null, annual: null };
  };

  const tier = getTier(partners);
  const isEnterprise = tier.name === "Enterprise";
  const isFree = tier.name === "Free";

  // Value drivers — all conservative
  const timeSavings         = hoursPerMonth * 12 * HOURLY_RATE;
  const revenueGain         = partnerRevenue * REVENUE_IMPROVEMENT;
  const disputesPerYear     = Math.max(2, Math.round(partners / 5));
  const disputeSavings      = disputesPerYear * DISPUTE_HRS * HOURLY_RATE;

  const totalValue  = timeSavings + revenueGain + disputeSavings;
  const costPerYear = tier.annual ?? 0;
  const netROI      = isEnterprise ? null : totalValue - costPerYear;
  const roiMultiple = isEnterprise
    ? null
    : costPerYear === 0
      ? null
      : Math.round(totalValue / costPerYear);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `$${Math.round(n / 1000)}K`
        : `$${Math.round(n)}`;

  const paybackWeeks =
    !isEnterprise && !isFree && totalValue > 0
      ? Math.round((costPerYear / totalValue) * 52)
      : null;

  return (
    <div className="roi-wrap">
      {/* Inputs */}
      <div className="roi-inputs">
        <div className="input-group">
          <div className="input-label-row">
            <label>Active partners</label>
            <span className="input-val">{partners}</span>
          </div>
          <input
            type="range" min={1} max={100} step={1}
            value={partners}
            onChange={e => setPartners(Number(e.target.value))}
          />
          <div className="input-hint">How many active partners do you manage?</div>
        </div>

        <div className="input-group">
          <div className="input-label-row">
            <label>Partner-influenced revenue</label>
            <span className="input-val">{fmt(partnerRevenue)}/yr</span>
          </div>
          <input
            type="range" min={50_000} max={2_000_000} step={25_000}
            value={partnerRevenue}
            onChange={e => setPartnerRevenue(Number(e.target.value))}
          />
          <div className="input-hint">Revenue sourced or influenced by your partners annually</div>
        </div>

        <div className="input-group">
          <div className="input-label-row">
            <label>Hours/month on manual ops</label>
            <span className="input-val">{hoursPerMonth} hrs</span>
          </div>
          <input
            type="range" min={5} max={80} step={5}
            value={hoursPerMonth}
            onChange={e => setHoursPerMonth(Number(e.target.value))}
          />
          <div className="input-hint">Spreadsheets, commission disputes, deal tracking, reporting</div>
        </div>

        <div className="assumptions-note">
          Assumptions: $75/hr labor cost · 3% revenue improvement from accurate attribution · {disputesPerYear} disputes/yr at 4 hrs each
        </div>
      </div>

      {/* Results */}
      <div className="roi-results">
        <div className="result-plan">
          <span className="plan-label">Recommended plan</span>
          <span className="plan-name" data-tier={tier.name}>{tier.name}</span>
          <span className="plan-cost">
            {isEnterprise ? "Custom pricing" : isFree ? "Free forever" : `$${tier.monthly}/mo`}
          </span>
        </div>

        <div className="result-rows">
          <div className="result-row">
            <span>Time saved</span>
            <span>{fmt(timeSavings)}/yr</span>
          </div>
          <div className="result-row">
            <span>Revenue improvement</span>
            <span>{fmt(revenueGain)}/yr</span>
          </div>
          <div className="result-row">
            <span>Dispute resolution</span>
            <span>{fmt(disputeSavings)}/yr</span>
          </div>
          {!isFree && !isEnterprise && (
            <div className="result-row cost-row">
              <span>Covant cost</span>
              <span>−{fmt(costPerYear)}/yr</span>
            </div>
          )}
        </div>

        <div className="result-total">
          {isEnterprise ? (
            <>
              <div className="total-label">Annual value</div>
              <div className="total-value">{fmt(totalValue)}</div>
              <div className="total-sub">
                <a href="/contact">Talk to sales about Enterprise pricing →</a>
              </div>
            </>
          ) : isFree ? (
            <>
              <div className="total-label">Annual value</div>
              <div className="total-value">{fmt(totalValue)}</div>
              <div className="total-sub">At zero cost on the free plan</div>
            </>
          ) : (
            <>
              <div className="total-label">Net annual ROI</div>
              <div className="total-value">{fmt(netROI!)}</div>
              {roiMultiple && (
                <div className="roi-badge">{roiMultiple}× return</div>
              )}
              {paybackWeeks && (
                <div className="total-sub">Pays for itself in {paybackWeeks} {paybackWeeks === 1 ? "week" : "weeks"}</div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .roi-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          background: #000;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 2.5rem;
          color: #fff;
          font-family: Inter, sans-serif;
        }

        /* Inputs */
        .input-group {
          margin-bottom: 2rem;
        }

        .input-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: .5rem;
        }

        label {
          font-size: .85rem;
          color: #aaa;
          font-weight: 500;
        }

        .input-val {
          font-size: .95rem;
          font-weight: 600;
          color: #fff;
        }

        input[type=range] {
          width: 100%;
          accent-color: #fff;
          cursor: pointer;
        }

        .input-hint {
          font-size: .75rem;
          color: #555;
          margin-top: .4rem;
        }

        .assumptions-note {
          font-size: .72rem;
          color: #444;
          line-height: 1.6;
          border-top: 1px solid #1a1a1a;
          padding-top: 1.25rem;
          margin-top: .5rem;
        }

        /* Results */
        .result-plan {
          display: flex;
          align-items: center;
          gap: .75rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #1c1c1c;
        }

        .plan-label {
          font-size: .75rem;
          color: #555;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .plan-name {
          font-size: .85rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(255,255,255,.08);
          color: #fff;
        }

        .plan-name[data-tier="Pro"]        { color: #818cf8; background: rgba(129,140,248,.12); }
        .plan-name[data-tier="Scale"]      { color: #f59e0b; background: rgba(245,158,11,.12); }
        .plan-name[data-tier="Enterprise"] { color: #aaa;    background: rgba(255,255,255,.08); }

        .plan-cost {
          font-size: .8rem;
          color: #666;
          margin-left: auto;
        }

        .result-rows {
          margin-bottom: 1.5rem;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          font-size: .875rem;
          padding: .6rem 0;
          border-bottom: 1px solid #111;
          color: #aaa;
        }

        .result-row span:last-child {
          color: #fff;
          font-weight: 500;
        }

        .cost-row span:last-child {
          color: #666;
        }

        .result-total {
          background: #0d0d0d;
          border: 1px solid #1c1c1c;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .total-label {
          font-size: .75rem;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: #555;
          margin-bottom: .5rem;
        }

        .total-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #10b981;
          line-height: 1;
          margin-bottom: .75rem;
        }

        .roi-badge {
          display: inline-block;
          background: rgba(16,185,129,.12);
          color: #10b981;
          border: 1px solid rgba(16,185,129,.2);
          font-size: .8rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: .75rem;
        }

        .total-sub {
          font-size: .8rem;
          color: #555;
        }

        .total-sub a {
          color: #818cf8;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .roi-wrap {
            grid-template-columns: 1fr;
            padding: 1.5rem;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
