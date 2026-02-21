"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  MODEL_COLORS,
} from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import {
  MODEL_LABELS,
  TOUCHPOINT_LABELS,
  type AttributionModel,
  type TouchpointType,
} from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import confetti from "canvas-confetti";

const MODELS: AttributionModel[] = [
  "deal_reg_protection",
  "source_wins",
  "role_split",
  "equal_split",
  "first_touch",
  "last_touch",
];

const statusBadgeClass: Record<string, string> = {
  won: "badge-success",
  open: "badge-info",
  lost: "badge-danger",
};

function LoadingSkeleton() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ height: 20, width: 120, background: "var(--border)", borderRadius: 4, marginBottom: "1rem" }} />
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ height: 36, width: 200, background: "var(--border)", borderRadius: 4 }} />
        <div style={{ height: 36, width: 80, background: "var(--border)", borderRadius: 20 }} />
      </div>
      <div className="stat-grid" style={{ marginBottom: "2rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ height: 100 }}>
            <div style={{ height: 16, width: 80, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
            <div style={{ height: 32, width: 100, background: "var(--border)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  
  // Convex queries and mutations
  const dealData = useQuery(api.deals.getById, { id: id as Id<"deals"> });
  const closeDealMutation = useMutation(api.dealsCrud.closeDeal);

  const { toast } = useToast();
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showTouchpointModal, setShowTouchpointModal] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Touchpoint form (for now, touchpoint add is not wired - would need a mutation)
  const [tpPartnerId, setTpPartnerId] = useState("");
  const [tpType, setTpType] = useState<TouchpointType>("referral");
  const [tpNotes, setTpNotes] = useState("");

  const fireConfetti = useCallback(() => {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#06b6d4"];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  // Loading state
  if (dealData === undefined) {
    return <LoadingSkeleton />;
  }

  // Not found state
  if (dealData === null) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p className="muted">Deal not found</p>
        <Link
          href="/dashboard/deals"
          style={{
            fontWeight: 500,
            marginTop: "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to deals
        </Link>
      </div>
    );
  }

  const deal = dealData;
  const touchpoints = deal.touchpoints || [];
  const allAttributions = deal.attributions || [];
  const partners = (deal.partners || []).filter((p): p is NonNullable<typeof p> => p !== null);

  const involvedPartners = partners;
  const timeline = [...touchpoints].sort((a, b) => a.createdAt - b.createdAt);

  // Attribution comparison data
  const partnerModels: Record<string, Record<string, number>> = {};
  allAttributions.forEach((a) => {
    const partner = partners.find((p) => p._id === a.partnerId);
    const name = partner?.name || "Unknown";
    if (!partnerModels[name]) partnerModels[name] = {};
    partnerModels[name][a.model] = a.percentage;
  });

  const comparisonData = Object.entries(partnerModels).map(
    ([name, models]) => ({
      name: name.split(" ")[0],
      fullName: name,
      ...models,
    })
  );

  async function handleClose(status: "won" | "lost") {
    setShowCloseModal(false);
    if (status === "won") {
      setIsRecalculating(true);
      // Simulate attribution recalculation delay for dramatic effect
      setTimeout(async () => {
        try {
          await closeDealMutation({ id: id as Id<"deals">, status });
          setIsRecalculating(false);
          toast(`🎉 Deal closed as Won! Attribution calculated.`, "success");
          fireConfetti();
        } catch (err: any) {
          setIsRecalculating(false);
          toast(err.message || "Failed to close deal", "error");
        }
      }, 1800);
    } else {
      try {
        await closeDealMutation({ id: id as Id<"deals">, status });
        toast("Deal closed as Lost", "info");
      } catch (err: any) {
        toast(err.message || "Failed to close deal", "error");
      }
    }
  }

  function handleAddTouchpoint(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add Convex mutation for adding touchpoints
    setShowTouchpointModal(false);
    setTpPartnerId("");
    setTpType("referral");
    setTpNotes("");
    toast("Touchpoint feature coming soon", "info");
  }

  // Active partners for selection
  const activePartners = partners.filter((p) => p.status !== "inactive");

  const timelineDays =
    timeline.length > 1
      ? Math.ceil(
          (timeline[timeline.length - 1].createdAt - timeline[0].createdAt) /
            86400000
        )
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/deals"
          className="muted"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        >
          ← Back to Deals
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {deal.name}
              </h1>
              <span
                className={`badge ${statusBadgeClass[deal.status] || "badge-neutral"}`}
                style={{ textTransform: "capitalize" }}
              >
                {deal.status}
              </span>
            </div>
            <div
              className="muted"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <span>{formatCurrency(deal.amount)}</span>
              <span>Created {formatDate(deal.createdAt)}</span>
              {deal.closedAt && (
                <span>Closed {formatDate(deal.closedAt)}</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {deal.status === "open" && (
              <>
                <button
                  className="btn-outline"
                  onClick={() => setShowTouchpointModal(true)}
                >
                  + Touchpoint
                </button>
                <button
                  className="btn"
                  onClick={() => setShowCloseModal(true)}
                >
                  Record Deal Outcome
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="card">
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}
          >
            Deal Value
          </p>
          <p style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {formatCurrency(deal.amount)}
          </p>
        </div>
        <div className="card">
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}
          >
            Partners Involved
          </p>
          <p style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {involvedPartners.length}
          </p>
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
          >
            {touchpoints.length} touchpoints
          </p>
        </div>
        <div className="card">
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}
          >
            Timeline
          </p>
          <p style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {timelineDays > 0 ? `${timelineDays} days` : "—"}
          </p>
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
          >
            First to last touch
          </p>
        </div>
        <div className="card">
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}
          >
            Status
          </p>
          <p style={{ fontSize: "1.8rem", fontWeight: 700, textTransform: "capitalize" }}>
            {deal.status}
          </p>
          <p
            className="muted"
            style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
          >
            {deal.closedAt ? formatDate(deal.closedAt) : "In progress"}
          </p>
        </div>
      </div>

      {/* Touchpoint Timeline */}
      <div className="card">
        <h3
          style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1.5rem" }}
        >
          Touchpoint Timeline
        </h3>
        {timeline.length > 0 ? (
          <div style={{ position: "relative" }}>
            {timeline.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  right: 16,
                  height: 2,
                  background: "var(--border)",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                gap: 0,
                overflowX: "auto",
                paddingBottom: "0.5rem",
              }}
            >
              {timeline.map((tp) => {
                const partner = tp.partner;
                return (
                  <div
                    key={tp._id}
                    style={{
                      flex: "1 0 160px",
                      position: "relative",
                      padding: "0 0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--bg)",
                          border: "2px solid var(--fg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "var(--fg)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <span
                          className="badge-neutral"
                          style={{
                            padding: "0.15rem 0.5rem",
                            borderRadius: 4,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {TOUCHPOINT_LABELS[tp.type as keyof typeof TOUCHPOINT_LABELS] || tp.type}
                        </span>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            marginTop: "0.4rem",
                          }}
                        >
                          {partner?.name}
                        </p>
                        <p
                          className="muted"
                          style={{
                            fontSize: "0.75rem",
                            marginTop: "0.15rem",
                          }}
                        >
                          {formatDate(tp.createdAt)}
                        </p>
                        {tp.notes && (
                          <p
                            className="muted"
                            style={{
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                              maxWidth: 140,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tp.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p
            className="muted"
            style={{ textAlign: "center", padding: "2rem 0" }}
          >
            No touchpoints recorded
          </p>
        )}
      </div>

      {/* Attribution Audit Trail (only for won deals) */}
      {deal.status === "won" && allAttributions.length > 0 && (() => {
        const CONTRIBUTION_NOTES: Record<string, string> = {
          referral: "Introduced the opportunity — counts as initial engagement",
          demo: "Ran product demo — technical enablement credit",
          introduction: "Made the introduction — first-touch credit",
          proposal: "Submitted proposal — late-stage engagement credit",
          negotiation: "Involved in negotiation — closing credit",
          content_share: "Shared content — awareness credit",
        };
        const activeModel: AttributionModel = allAttributions.find(a => a.model === "deal_reg_protection") ? "deal_reg_protection"
          : allAttributions.find(a => a.model === "source_wins") ? "source_wins"
          : allAttributions.find(a => a.model === "role_split") ? "role_split"
          : allAttributions.find(a => a.model === "role_based") ? "role_based"
          : "equal_split";

        const modelExplanations: Record<string, string> = {
          deal_reg_protection: "The partner who registered this deal holds full credit. All commission goes to the registering partner.",
          source_wins: "The partner who sourced or first introduced this opportunity receives full credit.",
          role_split: "Credit is split between partners based on their defined roles in the program.",
          equal_split: "Credit is split equally among all partners who touched this deal.",
          first_touch: "The first partner to engage with this deal receives full credit.",
          last_touch: "The last partner to engage before close receives full credit.",
          time_decay: "Partners receive weighted credit based on recency — more recent touches count more.",
          role_based: "Credit is weighted by touchpoint type and partner role.",
        };

        const auditModel = activeModel;
        const auditAttributions = allAttributions.filter((a) => a.model === auditModel);
        const auditPartnerIds = [...new Set(auditAttributions.map((a) => a.partnerId))];

        return (
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>Attribution Audit Trail</h3>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, background: "var(--subtle)", padding: "0.2rem 0.6rem", borderRadius: 12 }}>🔍 Fully auditable</span>
            </div>

            <div style={{ background: "var(--subtle)", borderRadius: 8, padding: ".75rem 1rem", fontSize: ".85rem", marginBottom: "1.25rem" }}>
              <span style={{ fontWeight: 600 }}>{MODEL_LABELS[activeModel]}</span>
              <span className="muted"> · </span>
              <span className="muted">{modelExplanations[activeModel]}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {auditPartnerIds.map((pid) => {
                const partner = partners.find((p) => p._id === pid);
                if (!partner) return null;
                const attr = auditAttributions.find((a) => a.partnerId === pid);
                if (!attr) return null;
                const pTouchpoints = [...touchpoints.filter((tp) => tp.partnerId === pid)].sort((a, b) => a.createdAt - b.createdAt);
                const partnerAmount = attr.amount;
                const commissionAmount = attr.commissionAmount;

                return (
                  <div key={pid} style={{ background: "var(--subtle)", borderRadius: 8, padding: "1.25rem" }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.7rem" }}>
                          {partner.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{partner.name}</span>
                          <span className="muted" style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}>{formatPercent(attr.percentage)} credit</span>
                        </div>
                      </div>
                      <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.95rem" }}>{formatCurrency(commissionAmount)}</span>
                    </div>

                    {/* Touchpoint list */}
                    {pTouchpoints.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
                        {pTouchpoints.map((tp) => (
                          <div key={tp._id}>
                            <div style={{ fontSize: "0.85rem" }}>
                              <span style={{ fontWeight: 500 }}>{formatDate(tp.createdAt)}</span>
                              <span className="muted"> · </span>
                              <span>{TOUCHPOINT_LABELS[tp.type as keyof typeof TOUCHPOINT_LABELS] || tp.type}</span>
                              {tp.notes && <span className="muted"> · {tp.notes}</span>}
                            </div>
                            <div className="muted" style={{ fontSize: "0.78rem", paddingLeft: "0.75rem", marginTop: "0.15rem" }}>
                              ↳ Attribution contribution: {CONTRIBUTION_NOTES[tp.type] || "Partner activity — attribution credit"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Math summary */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                      <p className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                        {formatCurrency(deal.amount)} deal  ×  {formatPercent(attr.percentage)} credit  ×  {partner.commissionRate}% commission rate  =  {formatCurrency(commissionAmount)}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.78rem" }}>
                        <span style={{ background: "var(--bg)", padding: "0.25rem 0.6rem", borderRadius: 6, fontWeight: 500 }}>Deal value: {formatCurrency(deal.amount)}</span>
                        <span className="muted">→</span>
                        <span style={{ background: "var(--bg)", padding: "0.25rem 0.6rem", borderRadius: 6, fontWeight: 500 }}>Partner credit: {formatPercent(attr.percentage)}</span>
                        <span className="muted">→</span>
                        <span style={{ background: "var(--bg)", padding: "0.25rem 0.6rem", borderRadius: 6, fontWeight: 500 }}>Partner amount: {formatCurrency(partnerAmount)}</span>
                        <span className="muted">→</span>
                        <span style={{ background: "var(--bg)", padding: "0.25rem 0.6rem", borderRadius: 6, fontWeight: 500, color: "#059669" }}>Commission: {formatCurrency(commissionAmount)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="muted" style={{ fontSize: "0.75rem", marginTop: "1.25rem", fontStyle: "italic" }}>
              This audit trail is generated from logged touchpoints. Each attribution decision is recorded and cannot be retroactively modified.
            </p>
          </div>
        );
      })()}

      {/* Attribution Results (only for won deals) */}
      {deal.status === "won" && allAttributions.length > 0 && (
        <>
          {/* Model Comparison Chart */}
          <div className="card">
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "0.25rem",
              }}
            >
              Attribution Model Comparison
            </h3>
            <p
              className="muted"
              style={{
                fontSize: "0.8rem",
                marginBottom: "1.5rem",
              }}
            >
              How each model attributes credit for this{" "}
              {formatCurrency(deal.amount)} deal
            </p>
            <div style={{ height: 288 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--muted)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${value}%`,
                      MODEL_LABELS[name as AttributionModel] || name,
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  />
                  <Legend
                    formatter={(value: string) =>
                      MODEL_LABELS[value as AttributionModel] || value
                    }
                  />
                  {MODELS.map((model) => (
                    <Bar
                      key={model}
                      dataKey={model}
                      name={model}
                      fill={MODEL_COLORS[model]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Breakdown Cards */}
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Model Breakdown
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "1rem",
              }}
            >
              {MODELS.map((model) => {
                const modelAttrs = allAttributions.filter(
                  (a) => a.model === model
                );
                return (
                  <div key={model} className="card" style={{ padding: "1.2rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: MODEL_COLORS[model],
                        }}
                      />
                      <h4
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {MODEL_LABELS[model]}
                      </h4>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {modelAttrs
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((attr) => {
                          const partner = partners.find(
                            (p) => p._id === attr.partnerId
                          );
                          return (
                            <div key={attr._id}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 500,
                                    maxWidth: 100,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {partner?.name?.split(" ")[0]}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {formatPercent(attr.percentage)}
                                </span>
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  height: 6,
                                  background: "var(--border)",
                                  borderRadius: 3,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${attr.percentage}%`,
                                    height: "100%",
                                    background: MODEL_COLORS[model],
                                    borderRadius: 3,
                                  }}
                                />
                              </div>
                              <p
                                className="muted"
                                style={{
                                  fontSize: "0.75rem",
                                  marginTop: "0.15rem",
                                }}
                              >
                                {formatCurrency(attr.amount)}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1.2rem 1.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <strong>Full Attribution & Commission Table</strong>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: "var(--subtle)",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Partner
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Model
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "0.75rem 1rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      %
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "0.75rem 1rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "0.75rem 1.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allAttributions
                    .sort((a, b) =>
                      a.partnerId !== b.partnerId
                        ? a.partnerId.localeCompare(b.partnerId)
                        : MODELS.indexOf(a.model as AttributionModel) - MODELS.indexOf(b.model as AttributionModel)
                    )
                    .map((attr) => {
                      const partner = partners.find(
                        (p) => p._id === attr.partnerId
                      );
                      return (
                        <tr
                          key={attr._id}
                          style={{
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <div
                                className="avatar"
                                style={{
                                  width: 28,
                                  height: 28,
                                  fontSize: "0.65rem",
                                }}
                              >
                                {partner?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "?"}
                              </div>
                              <span
                                style={{
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                }}
                              >
                                {partner?.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: MODEL_COLORS[attr.model as AttributionModel],
                                }}
                              />
                              <span style={{ fontSize: "0.85rem" }}>
                                {MODEL_LABELS[attr.model as AttributionModel]}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "right",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}
                          >
                            {formatPercent(attr.percentage)}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              textAlign: "right",
                              fontSize: "0.9rem",
                            }}
                          >
                            {formatCurrency(attr.amount)}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem 1.5rem",
                              textAlign: "right",
                              fontWeight: 500,
                              fontSize: "0.9rem",
                              color: "#059669",
                            }}
                          >
                            {formatCurrency(attr.commissionAmount)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Partners Involved */}
      <div className="card">
        <h3
          style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem" }}
        >
          Partners Involved
        </h3>
        <div className="grid-3">
          {involvedPartners.map((partner) => {
            if (!partner) return null;
            const pTouchpoints = touchpoints.filter(
              (tp) => tp.partnerId === partner._id
            );
            return (
              <Link
                key={partner._id}
                href={`/dashboard/partners/${partner._id}`}
                className="card card-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                }}
              >
                <div
                  className="avatar"
                  style={{ width: 36, height: 36, fontSize: "0.75rem" }}
                >
                  {partner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {partner.name}
                  </p>
                  <p
                    className="muted"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {pTouchpoints.length} touchpoints ·{" "}
                    {partner.commissionRate}% rate
                  </p>
                </div>
                <span
                  className={`badge ${statusBadgeClass[partner.status] || "badge-neutral"}`}
                  style={{ textTransform: "capitalize", fontSize: "0.7rem" }}
                >
                  {partner.status}
                </span>
              </Link>
            );
          })}
          {involvedPartners.length === 0 && (
            <p className="muted">No partners involved yet</p>
          )}
        </div>
      </div>

      {/* Recalculating Attribution Overlay */}
      {isRecalculating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card animate-in"
            style={{
              padding: "2.5rem 3rem",
              textAlign: "center",
              maxWidth: 400,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "3px solid var(--border)",
                borderTopColor: "#6366f1",
                borderRadius: "50%",
                margin: "0 auto 1.2rem",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              Recalculating Attribution...
            </h3>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Running 5 attribution models across all partner touchpoints
            </p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Record Deal Outcome Modal */}
      <Modal
        open={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="Record Deal Outcome"
      >
        <p style={{ marginBottom: ".75rem", color: "var(--muted)" }}>
          How did <strong>{deal.name}</strong> ({formatCurrency(deal.amount)}) end?
        </p>
        <p style={{ marginBottom: "1.5rem", fontSize: ".8rem", color: "var(--muted)" }}>
          💡 This records the CRM deal outcome for attribution calculation. When CRM sync is active, this happens automatically.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn"
            style={{
              flex: 1,
              background: "#059669",
              color: "white",
              justifyContent: "center",
            }}
            onClick={() => handleClose("won")}
          >
            ✓ Won
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: "#dc2626",
              color: "white",
              justifyContent: "center",
            }}
            onClick={() => handleClose("lost")}
          >
            ✗ Lost
          </button>
        </div>
        <button
          className="btn-outline"
          style={{ width: "100%", marginTop: "0.75rem", justifyContent: "center" }}
          onClick={() => setShowCloseModal(false)}
        >
          Cancel
        </button>
      </Modal>

      {/* Add Touchpoint Modal */}
      <Modal
        open={showTouchpointModal}
        onClose={() => setShowTouchpointModal(false)}
        title="Add Touchpoint"
      >
        <form
          onSubmit={handleAddTouchpoint}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Partner
            </label>
            <select
              className="input"
              value={tpPartnerId}
              onChange={(e) => setTpPartnerId(e.target.value)}
              required
            >
              <option value="">Select a partner...</option>
              {activePartners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Type
            </label>
            <select
              className="input"
              value={tpType}
              onChange={(e) => setTpType(e.target.value as TouchpointType)}
            >
              <option value="referral">Referral</option>
              <option value="demo">Demo</option>
              <option value="content_share">Content Share</option>
              <option value="introduction">Introduction</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
              }}
            >
              Notes (optional)
            </label>
            <input
              className="input"
              placeholder="What happened?"
              value={tpNotes}
              onChange={(e) => setTpNotes(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              paddingTop: "0.5rem",
            }}
          >
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowTouchpointModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Add Touchpoint
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
