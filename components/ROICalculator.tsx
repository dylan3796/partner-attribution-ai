"use client";

import { useState } from "react";

export default function ROICalculator() {
  const [partners, setPartners] = useState(25);
  const [hoursPerMonth, setHoursPerMonth] = useState(40);
  const [avgDealSize, setAvgDealSize] = useState(50000);
  const [partnerRevPercent, setPartnerRevPercent] = useState(30);

  // Calculations
  const hourlyRate = 75; // Average ops team hourly cost
  const monthlyTimeCost = hoursPerMonth * hourlyRate;
  const annualTimeSaved = monthlyTimeCost * 12;
  
  // Assume 15% lift in partner-influenced revenue from better targeting
  const currentPartnerRev = (avgDealSize * partners * (partnerRevPercent / 100)) * 12;
  const projectedLift = currentPartnerRev * 0.15;
  
  // Dispute reduction (assume 2 disputes/month @ 8 hours each)
  const disputesSaved = 2 * 8 * hourlyRate * 12;
  
  const totalROI = annualTimeSaved + projectedLift + disputesSaved;
  const costPerYear = 199 * 12; // Pro tier
  const netROI = totalROI - costPerYear;
  const roiMultiple = (totalROI / costPerYear).toFixed(1);

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
              onChange={(e) => setPartners(Number(e.target.value))}
              min="1"
              max="500"
            />
          </div>

          <div className="input-group">
            <label>Hours/month on commission reconciliation</label>
            <input
              type="number"
              value={hoursPerMonth}
              onChange={(e) => setHoursPerMonth(Number(e.target.value))}
              min="0"
              max="200"
            />
          </div>

          <div className="input-group">
            <label>Average deal size ($)</label>
            <input
              type="number"
              value={avgDealSize}
              onChange={(e) => setAvgDealSize(Number(e.target.value))}
              min="1000"
              step="1000"
            />
          </div>

          <div className="input-group">
            <label>Partner-influenced revenue (%)</label>
            <input
              type="number"
              value={partnerRevPercent}
              onChange={(e) => setPartnerRevPercent(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Right: Results */}
        <div className="roi-results">
          <h3>Your ROI with PartnerBase</h3>
          
          <div className="roi-metric">
            <div className="metric-label">Time savings (annual)</div>
            <div className="metric-value">${annualTimeSaved.toLocaleString()}</div>
            <div className="metric-detail">{hoursPerMonth * 12} hours saved @ ${hourlyRate}/hr</div>
          </div>

          <div className="roi-metric">
            <div className="metric-label">Revenue lift (15% from better targeting)</div>
            <div className="metric-value">${projectedLift.toLocaleString()}</div>
            <div className="metric-detail">Invest MDF in high-performing partners</div>
          </div>

          <div className="roi-metric">
            <div className="metric-label">Dispute reduction</div>
            <div className="metric-value">${disputesSaved.toLocaleString()}</div>
            <div className="metric-detail">Transparent attribution = fewer disputes</div>
          </div>

          <div className="roi-total">
            <div className="total-row">
              <span>Total Annual Value</span>
              <span>${totalROI.toLocaleString()}</span>
            </div>
            <div className="total-row cost">
              <span>PartnerBase Cost (Pro)</span>
              <span>-${costPerYear.toLocaleString()}</span>
            </div>
            <div className="total-row net">
              <span>Net ROI (Year 1)</span>
              <span className="highlight">${netROI.toLocaleString()}</span>
            </div>
            <div className="roi-multiple">{roiMultiple}x return on investment</div>
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

        .input-group input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #333;
          color: #fff;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
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
