"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { meridian } from "@/lib/meridian/dataset";
import {
  getPartnerScorecard,
  getPartnerSurfacedAction,
  getPartnerDeals,
} from "@/lib/meridian/selectors";
import { MODEL_LABELS, TIER_LABELS, type AttributionModel } from "@/lib/types";
import { fmtDate, fmtMoney } from "@/components/demo/format";

const MODELS = Object.keys(MODEL_LABELS) as AttributionModel[];
const STATUS_CLASS = { won: "d-pill--won", open: "d-pill--open", lost: "d-pill--lost" } as const;

function PartnerView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partner") ?? "mp_001";
  const card = getPartnerScorecard(partnerId) ?? getPartnerScorecard("mp_001")!;
  const { partner } = card;
  const action = getPartnerSurfacedAction(partner._id);
  const deals = getPartnerDeals(partner._id).sort(
    (a, b) => (b.closedAt ?? b.expectedCloseDate ?? b.createdAt) - (a.closedAt ?? a.expectedCloseDate ?? a.createdAt)
  );
  const maxCredit = Math.max(...MODELS.map((m) => card.creditByModel[m]), 1);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="d-h1">{partner.name}</h1>
          <p className="d-sub">
            {partner.tier ? `${TIER_LABELS[partner.tier]} tier · ` : ""}
            {partner.contactName ? `${partner.contactName} · ` : ""}
            {card.daysSinceActivity !== null
              ? `last activity ${card.daysSinceActivity} days ago`
              : "no recorded activity"}
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".85rem", color: "var(--m-muted)" }}>
          Viewing
          <select
            className="m-select"
            style={{ width: "auto", padding: ".5rem 2.2rem .5rem .7rem", fontSize: ".85rem" }}
            value={partner._id}
            onChange={(e) => router.replace(`/demo/partner-view?partner=${e.target.value}`)}
          >
            {meridian.partners.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {action && (
        <div className="d-section">
          <div className="d-action">
            <div>
              <p className="d-action-title">Next action: {action.title}</p>
              <p className="d-action-why">{action.why}</p>
            </div>
          </div>
        </div>
      )}

      <div className="d-section d-kpis" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="d-card">
          <p className="d-kpi-label">Open pipeline</p>
          <p className="d-kpi-value">{fmtMoney(card.openPipeline)}</p>
          <p className="d-kpi-sub">across {deals.filter((d) => d.status === "open").length} open deals</p>
        </div>
        <div className="d-card">
          <p className="d-kpi-label">Deals touched</p>
          <p className="d-kpi-value">{card.dealsTouched}</p>
          <p className="d-kpi-sub">trailing 12 months</p>
        </div>
        <div className="d-card">
          <p className="d-kpi-label">Won-deal credit</p>
          <p className="d-kpi-value">{fmtMoney(card.creditByModel.role_weighted)}</p>
          <p className="d-kpi-sub">role-weighted lens</p>
        </div>
      </div>

      <div className="d-section">
        <div className="d-card">
          <h2 className="d-h2">Credit under each lens</h2>
          <p className="d-sub">
            The same work, five ways of counting it. Big spreads here are why
            attribution arguments happen.
          </p>
          <div style={{ marginTop: ".75rem" }}>
            {MODELS.map((m) => (
              <div key={m} className="d-model-split">
                <span className="d-model-split-name">{MODEL_LABELS[m]}</span>
                <span className="d-bar">
                  <span
                    className="d-bar-fill"
                    style={{ width: `${(card.creditByModel[m] / maxCredit) * 100}%` }}
                  />
                </span>
                <span className="d-row-amount">{fmtMoney(card.creditByModel[m])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {card.nextTier && (
        <div className="d-section">
          <div className="d-card">
            <h2 className="d-h2">Tier progress</h2>
            <p className="d-sub">
              {Math.round(card.tierProgress)}% of the way from {TIER_LABELS[partner.tier ?? "bronze"]} to{" "}
              {TIER_LABELS[card.nextTier]}, measured on role-weighted won-deal credit.
            </p>
            <div className="d-progress">
              <span className="d-progress-fill" style={{ width: `${card.tierProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="d-section">
        <div className="d-card">
          <h2 className="d-h2">Deals</h2>
          <div style={{ marginTop: ".5rem" }}>
            {deals.map((deal) => (
              <div key={deal._id} className="d-deal">
                <div style={{ minWidth: 0 }}>
                  <p className="d-deal-name">{deal.name}</p>
                  <p className="d-deal-meta">
                    {deal.closedAt
                      ? `${deal.status === "won" ? "Closed" : "Lost"} ${fmtDate(deal.closedAt)}`
                      : `Expected close ${fmtDate(deal.expectedCloseDate ?? deal.createdAt)}`}
                  </p>
                </div>
                <span />
                <span className="d-row-amount">{fmtMoney(deal.amount)}</span>
                <span className={`d-pill ${STATUS_CLASS[deal.status]}`}>{deal.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PartnerViewPage() {
  // useSearchParams requires a Suspense boundary in the app router.
  return (
    <Suspense fallback={null}>
      <PartnerView />
    </Suspense>
  );
}
