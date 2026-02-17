"use client";

import { useState } from "react";

export default function ROICalculator() {
  const [totalARR, setTotalARR] = useState(10000000);
  const [partnerInfluencedPct, setPartnerInfluencedPct] = useState(30);
  const [partners, setPartners] = useState(25);
  const [hoursPerMonth, setHoursPerMonth] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [mdfBudget, setMdfBudget] = useState(0);
  const [revenueImprovementPct, setRevenueImprovementPct] = useState(5);

  // Derived
  const partnerRevenue = totalARR * (partnerInfluencedPct / 100);

  // --- Tier logic ---
  const getTier = (p: number) => {
    if (p <= 10) return { name: "Starter", monthly: 49, annual: 588 };
    if (p <= 25) return { name: "Professional", monthly: 199, annual: 2388 };
    return { name: "Business", monthly: 499, annual: 5988 };
  };
  const tier = getTier(partners);

  // --- Value drivers ---
  const timeSavings = hoursPerMonth * 12 * hourlyRate;
  const revenueImprovement = partnerRevenue * (revenueImprovementPct / 100);
  const disputesPerYear = Math.max(1, Math.round(partners / 10)) * 4;
  const disputeResolutionSavings =
    Math.max(1, Math.round(partners / 10)) * 4 * 6 * hourlyRate;
  const mdfEfficiencyGain = mdfBudget > 0 ? mdfBudget * 0.15 : 0;

  const totalAnnualValue =
    timeSavings + revenueImprovement + disputeResolutionSavings + mdfEfficiencyGain;
  const costPerYear = tier.annual;
  const netROI = totalAnnualValue - costPerYear;
  const roiMultiple = (totalAnnualValue / costPerYear).toFixed(1);

  // Payback periods (in weeks)
  const timeSavingsPaybackWeeks =
    timeSavings > 0 ? Math.round((costPerYear / timeSavings) * 52) : null;
  const totalPaybackWeeks =
    totalAnnualValue > 0 ? Math.round((costPerYear / totalAnnualValue) * 52) : null;

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <div className="roi-calculator">
      <div className="roi-grid">
        {/* Left: Inputs */}
        <div className="roi-inputs">
          <h3>Your Partnership Program</h3>

          <div className="input-group">
            <label>Total annual revenue</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={totalARR}
                onChange={(e) => setTotalARR(Math.max(0, Number(e.target.value)))}
                min="0"
                step="1000000"
              />
            </div>
          </div>

          <div className="input-group">
            <label>% of revenue partner-influenced</label>
            <div className="input-suffix-wrap">
              <input
                type="number"
                value={partnerInfluencedPct}
                onChange={(e) =>
                  setPartnerInfluencedPct(
                    Math.min(100, Math.max(0, Number(e.target.value)))
                  )
                }
                min="0"
                max="100"
                step="1"
              />
              <span className="input-suffix">%</span>
            </div>
            <div className="input-derived">= {fmt(partnerRevenue)} partner revenue</div>
          </div>

          <div className="input-group">
            <label>Number of active partners</label>
            <input
              type="number"
              value={partners}
              onChange={(e) => setPartners(Math.max(1, Number(e.target.value)))}
              min="1"
              max="500"
            />
          </div>

          <div className="input-group">
            <label>Hours/month on manual partner ops</label>
            <input
              type="number"
              value={hoursPerMonth}
              onChange={(e) => setHoursPerMonth(Math.max(0, Number(e.target.value)))}
              min="0"
              max="200"
            />
          </div>

          <div className="input-group">
            <label>Team hourly cost (fully loaded)</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Math.max(1, Number(e.target.value)))}
                min="1"
                step="5"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Annual MDF budget (optional)</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={mdfBudget}
                onChange={(e) => setMdfBudget(Math.max(0, Number(e.target.value)))}
                min="0"
                step="10000"
              />
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="roi-results">
          <h3>Your ROI with PartnerBase</h3>

          <div className="roi-metric">
            <div className="metric-label">Time savings (annual)</div>
            <div className="metric-value">{fmt(timeSavings)}</div>
            <div className="metric-detail">
              {hoursPerMonth * 12} hours/year freed from manual work
            </div>
          </div>

          <div className="roi-metric">
            <div className="metric-label">
              Revenue improvement{" "}
              <span className="label-adjustable">(adjustable)</span>
            </div>
            <div className="metric-value-row">
              <div className="metric-value">{fmt(revenueImprovement)}</div>
              <div className="metric-pct-input">
                <input
                  type="number"
                  value={revenueImprovementPct}
                  onChange={(e) =>
                    setRevenueImprovementPct(
                      Math.min(50, Math.max(0.1, Number(e.target.value)))
                    )
                  }
                  min="0.1"
                  max="50"
                  step="0.5"
                />
                <span className="pct-label">%</span>
              </div>
            </div>
            <div className="metric-detail">
              {revenueImprovementPct}% improvement in partner close rates from better
              targeting
            </div>
          </div>

          <div className="roi-metric">
            <div className="metric-label">Dispute reduction</div>
            <div className="metric-value">{fmt(disputeResolutionSavings)}</div>
            <div className="metric-detail">
              ~{disputesPerYear} disputes/year × 6 hrs each to resolve (auto-calculated
              from partner count)
            </div>
          </div>

          {mdfBudget > 0 && (
            <div className="roi-metric">
              <div className="metric-label">MDF efficiency improvement</div>
              <div className="metric-value">{fmt(mdfEfficiencyGain)}</div>
              <div className="metric-detail">
                15% of MDF typically goes to underperformers without attribution data
              </div>
            </div>
          )}

          <div className="roi-total">
            <div className="total-row">
              <span>Total Annual Value</span>
              <span>{fmt(totalAnnualValue)}</span>
            </div>
            <div className="total-row cost">
              <span>
                PartnerBase Cost ({tier.name} · ${tier.monthly}/mo)
              </span>
              <span>-{fmt(costPerYear)}</span>
            </div>
            <div className="total-row net">
              <span>Net ROI (Year 1)</span>
              <span className="highlight">{fmt(netROI)}</span>
            </div>
            <div className="roi-multiple">{roiMultiple}× return on investment</div>

            <div className="payback-section">
              <div className="payback-primary">
                ⏱ Your time savings alone pay for PartnerBase in{" "}
                <strong>
                  {timeSavingsPaybackWeeks !== null ? timeSavingsPaybackWeeks : "—"} weeks
                </strong>
              </div>
              <div className="payback-secondary">
                Total payback with all value drivers:{" "}
                <strong>
                  {totalPaybackWeeks !== null ? totalPaybackWeeks : "—"} weeks
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .roi-calculator {
          background: #000;
          color: #fff;
          padding: 3rem;
          border-radius: 8px;
          border: 1px solid #333;
        }

        .roi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .roi-inputs .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          font-size: 0.875rem;
          color: #a0a0a0;
          margin-bottom: 0.5rem;
        }

        .input-derived {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.35rem;
        }

        .input-prefix-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix {
          position: absolute;
          left: 0.75rem;
          color: #666;
          font-size: 1rem;
          pointer-events: none;
        }

        .input-prefix-wrap input {
          padding-left: 1.75rem !important;
        }

        .input-suffix-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-suffix {
          position: absolute;
          right: 0.75rem;
          color: #666;
          font-size: 1rem;
          pointer-events: none;
        }

        .input-suffix-wrap input {
          padding-right: 1.75rem !important;
        }

        .input-group input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #333;
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .input-group input:focus {
          outline: none;
          border-color: #fff;
        }

        .roi-metric {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #333;
        }

        .metric-label {
          font-size: 0.875rem;
          color: #a0a0a0;
          margin-bottom: 0.5rem;
        }

        .label-adjustable {
          font-size: 0.75rem;
          color: #555;
          font-style: italic;
        }

        .metric-value-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .metric-value-row .metric-value {
          margin-bottom: 0;
        }

        .metric-pct-input {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #1a1a1a;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
        }

        .metric-pct-input input {
          width: 3rem;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.875rem;
          text-align: right;
          outline: none;
        }

        .pct-label {
          font-size: 0.875rem;
          color: #a0a0a0;
        }

        .metric-detail {
          font-size: 0.75rem;
          color: #666;
        }

        .roi-total {
          background: #1a1a1a;
          padding: 1.5rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          font-size: 0.9rem;
        }

        .total-row.cost {
          color: #666;
        }

        .total-row.net {
          border-top: 2px solid #333;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .total-row.net .highlight {
          color: #10b981;
          font-size: 1.5rem;
        }

        .roi-multiple {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #a0a0a0;
        }

        .payback-section {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #333;
        }

        .payback-primary {
          font-size: 0.9rem;
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .payback-secondary {
          font-size: 0.8rem;
          color: #a0a0a0;
        }

        @media (max-width: 768px) {
          .roi-calculator {
            padding: 2rem 1.5rem;
          }
          .roi-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
