"use client";

import { useState, useEffect } from "react";

export default function ROICalculator() {
  const [partners, setPartners] = useState(25);
  const [annualPartnerRevenue, setAnnualPartnerRevenue] = useState(2000000);
  const [hoursPerMonth, setHoursPerMonth] = useState(40);
  const [disputesPerQuarter, setDisputesPerQuarter] = useState(
    Math.max(1, Math.round(25 / 10))
  );
  const [hourlyRate, setHourlyRate] = useState(85);
  const [mdfBudget, setMdfBudget] = useState(0);
  const [disputesManuallyEdited, setDisputesManuallyEdited] = useState(false);

  // Auto-suggest disputes when partners change (unless user has manually overridden)
  useEffect(() => {
    if (!disputesManuallyEdited) {
      setDisputesPerQuarter(Math.max(1, Math.round(partners / 10)));
    }
  }, [partners, disputesManuallyEdited]);

  // --- Tier logic ---
  const getTier = (p: number) => {
    if (p <= 10) return { name: "Starter", monthly: 49, annual: 588 };
    if (p <= 25) return { name: "Professional", monthly: 199, annual: 2388 };
    return { name: "Business", monthly: 499, annual: 5988 };
  };
  const tier = getTier(partners);

  // --- Value drivers ---
  const timeSavings = hoursPerMonth * 12 * hourlyRate;
  const dealVisibilityRecovery = annualPartnerRevenue * 0.18;
  const disputeResolutionSavings = disputesPerQuarter * 4 * 6 * hourlyRate;
  const mdfEfficiencyGain = mdfBudget > 0 ? mdfBudget * 0.2 : 0;

  const totalAnnualValue =
    timeSavings + dealVisibilityRecovery + disputeResolutionSavings + mdfEfficiencyGain;
  const costPerYear = tier.annual;
  const netROI = totalAnnualValue - costPerYear;
  const roiMultiple = (totalAnnualValue / costPerYear).toFixed(1);

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");

  return (
    <div className="roi-calculator">
      <div className="roi-grid">
        {/* Left: Inputs */}
        <div className="roi-inputs">
          <h3>Your Partnership Program</h3>

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
            <label>Annual partner-influenced revenue</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={annualPartnerRevenue}
                onChange={(e) =>
                  setAnnualPartnerRevenue(Math.max(0, Number(e.target.value)))
                }
                min="0"
                step="100000"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Hours/month on manual reconciliation &amp; reporting</label>
            <input
              type="number"
              value={hoursPerMonth}
              onChange={(e) => setHoursPerMonth(Math.max(0, Number(e.target.value)))}
              min="0"
              max="200"
            />
          </div>

          <div className="input-group">
            <label>
              Avg disputes per quarter
              <span className="label-hint"> (auto-suggested: 1 per 10 partners)</span>
            </label>
            <input
              type="number"
              value={disputesPerQuarter}
              onChange={(e) => {
                setDisputesManuallyEdited(true);
                setDisputesPerQuarter(Math.max(0, Number(e.target.value)));
              }}
              min="0"
            />
          </div>

          <div className="input-group">
            <label>Team hourly cost (fully loaded)</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">$</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) =>
                  setHourlyRate(Math.max(1, Number(e.target.value)))
                }
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
                onChange={(e) =>
                  setMdfBudget(Math.max(0, Number(e.target.value)))
                }
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
              Deal visibility recovery (18% misattribution rate)
            </div>
            <div className="metric-value">{fmt(dealVisibilityRecovery)}</div>
            <div className="metric-detail">
              Industry average: 18% of partner deals aren&apos;t properly tracked in CRM
              (Forrester, 2024). Better attribution captures this.
            </div>
          </div>

          <div className="roi-metric">
            <div className="metric-label">Dispute resolution savings</div>
            <div className="metric-value">{fmt(disputeResolutionSavings)}</div>
            <div className="metric-detail">
              {disputesPerQuarter * 4} disputes/year × ~6 hrs each to resolve
            </div>
          </div>

          {mdfBudget > 0 && (
            <div className="roi-metric">
              <div className="metric-label">MDF efficiency improvement</div>
              <div className="metric-value">{fmt(mdfEfficiencyGain)}</div>
              <div className="metric-detail">
                20% of MDF typically goes to underperformers without attribution data
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

        .label-hint {
          font-size: 0.75rem;
          color: #555;
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

        .metric-value {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
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
