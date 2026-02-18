"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  demoOnboardingData,
  ONBOARDING_STAGES,
  STAGE_INDEX,
  type PartnerOnboarding,
  type OnboardingStage,
} from "@/lib/onboarding-demo-data";
import {
  Rocket,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Target,
  UserCheck,
  Zap,
} from "lucide-react";

/* ── helpers ── */

function stagePct(stage: OnboardingStage): number {
  return Math.round(((STAGE_INDEX[stage] + 1) / ONBOARDING_STAGES.length) * 100);
}

function tierColor(tier: string) {
  const m: Record<string, string> = { bronze: "#cd7f32", silver: "#94a3b8", gold: "#eab308", platinum: "#a78bfa" };
  return m[tier] || "#64748b";
}

function rampColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

function daysSince(ts: number) {
  return Math.floor((Date.now() - ts) / 86400000);
}

/* ── components ── */

function ProgressPipeline({ partner }: { partner: PartnerOnboarding }) {
  const currentIdx = STAGE_INDEX[partner.currentStage];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
      {ONBOARDING_STAGES.map((stage, i) => {
        const done = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const isOverdue = !done && partner.milestones[i]?.dueBy && partner.milestones[i].dueBy! < Date.now();
        return (
          <div
            key={stage.key}
            title={`${stage.label}${partner.milestones[i]?.completedAt ? " ✓" : isOverdue ? " ⚠ Overdue" : ""}`}
            style={{
              flex: 1,
              height: 8,
              borderRadius: i === 0 ? "4px 0 0 4px" : i === 5 ? "0 4px 4px 0" : 0,
              background: done ? "#6366f1" : isOverdue ? "#ef444466" : "var(--border)",
              opacity: isCurrent ? 1 : done ? 0.7 : 0.4,
              transition: "all 0.3s",
            }}
          />
        );
      })}
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent || "#6366f1"}18`, display: "flex", alignItems: "center", justifyContent: "center", color: accent || "#6366f1", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div className="muted" style={{ fontSize: ".8rem" }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const partners = demoOnboardingData;
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterManager, setFilterManager] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const managers = useMemo(() => [...new Set(partners.map((p) => p.assignedTo))].sort(), [partners]);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (filterStage !== "all" && p.currentStage !== filterStage) return false;
      if (filterManager !== "all" && p.assignedTo !== filterManager) return false;
      return true;
    });
  }, [partners, filterStage, filterManager]);

  const selected = selectedId ? partners.find((p) => p._id === selectedId) : null;

  // Stats
  const producing = partners.filter((p) => p.currentStage === "producing").length;
  const inProgress = partners.filter((p) => p.currentStage !== "producing").length;
  const blocked = partners.filter((p) => p.blockers.length > 0).length;
  const avgRamp = partners.length > 0 ? Math.round(partners.reduce((s, p) => s + p.rampScore, 0) / partners.length) : 0;
  const avgDaysToFirst = (() => {
    const withDeals = partners.filter((p) => p.daysToFirstDeal !== null);
    return withDeals.length > 0 ? Math.round(withDeals.reduce((s, p) => s + p.daysToFirstDeal!, 0) / withDeals.length) : 0;
  })();

  // Stage funnel
  const stageCounts = ONBOARDING_STAGES.map((s) => ({
    ...s,
    count: partners.filter((p) => p.currentStage === s.key).length,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Partner Onboarding & Ramp</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Track partner journey from signup to revenue production</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <select className="input" value={filterStage} onChange={(e) => setFilterStage(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="all">All Stages</option>
            {ONBOARDING_STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <select className="input" value={filterManager} onChange={(e) => setFilterManager(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="all">All Managers</option>
            {managers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem" }}>
        <StatCard icon={<CheckCircle2 size={22} />} label="Producing" value={String(producing)} sub={`${partners.length} total partners`} accent="#22c55e" />
        <StatCard icon={<Rocket size={22} />} label="In Progress" value={String(inProgress)} accent="#6366f1" />
        <StatCard icon={<AlertTriangle size={22} />} label="Blocked" value={String(blocked)} accent="#ef4444" sub={blocked > 0 ? "needs attention" : "all clear"} />
        <StatCard icon={<Clock size={22} />} label="Avg Days to 1st Deal" value={`${avgDaysToFirst}d`} accent="#eab308" />
        <StatCard icon={<TrendingUp size={22} />} label="Avg Ramp Score" value={`${avgRamp}`} accent={rampColor(avgRamp)} />
      </div>

      {/* Stage Funnel */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: ".875rem", fontWeight: 700, marginBottom: 12 }}>Onboarding Funnel</div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 60 }}>
          {stageCounts.map((s, i) => {
            const maxCount = Math.max(...stageCounts.map((x) => x.count), 1);
            const h = Math.max(8, (s.count / maxCount) * 56);
            return (
              <div key={s.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: ".7rem", fontWeight: 700 }}>{s.count}</span>
                <div style={{ width: "100%", height: h, background: `rgba(99,102,241,${0.3 + (i / 5) * 0.7})`, borderRadius: 4 }} />
                <span className="muted" style={{ fontSize: ".65rem", textAlign: "center", lineHeight: 1.2 }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner List */}
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
        {filtered.sort((a, b) => STAGE_INDEX[a.currentStage] - STAGE_INDEX[b.currentStage]).map((p) => {
          const isSelected = selectedId === p._id;
          const overdueMilestones = p.milestones.filter((m) => !m.completedAt && m.dueBy && m.dueBy < Date.now());

          return (
            <div key={p._id}>
              <div
                className="card"
                onClick={() => setSelectedId(isSelected ? null : p._id)}
                style={{
                  padding: "1rem 1.25rem",
                  cursor: "pointer",
                  border: isSelected ? "1px solid #6366f1" : "1px solid var(--border)",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{p.partnerName}</span>
                    <span style={{ padding: "1px 8px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: `${tierColor(p.tier)}22`, color: tierColor(p.tier), textTransform: "uppercase" }}>
                      {p.tier}
                    </span>
                    <span className="muted" style={{ fontSize: ".8rem" }}>{p.partnerType}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {p.blockers.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".75rem", color: "#ef4444", fontWeight: 600 }}>
                        <AlertTriangle size={13} /> {p.blockers.length} blocker{p.blockers.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {overdueMilestones.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".75rem", color: "#eab308", fontWeight: 600 }}>
                        <Clock size={13} /> {overdueMilestones.length} overdue
                      </span>
                    )}
                    <span style={{ fontSize: ".8rem", fontWeight: 700, color: rampColor(p.rampScore) }}>
                      {p.rampScore}/100
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <ProgressPipeline partner={p} />
                  </div>
                  <span className="muted" style={{ fontSize: ".75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {ONBOARDING_STAGES[STAGE_INDEX[p.currentStage]].label}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "1.5rem", marginTop: 8, fontSize: ".78rem" }}>
                  <span className="muted"><UserCheck size={12} style={{ verticalAlign: -2 }} /> {p.assignedTo}</span>
                  <span className="muted"><Clock size={12} style={{ verticalAlign: -2 }} /> {daysSince(p.startedAt)}d since start</span>
                  {p.daysToFirstDeal !== null && (
                    <span className="muted"><Target size={12} style={{ verticalAlign: -2 }} /> {p.daysToFirstDeal}d to first deal</span>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div className="card" style={{ padding: "1.25rem", marginTop: 4, borderLeft: "3px solid #6366f1" }}>
                  {/* Milestone timeline */}
                  <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 12 }}>Milestone Timeline</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {p.milestones.map((m, i) => {
                      const done = !!m.completedAt;
                      const overdue = !done && m.dueBy && m.dueBy < Date.now();
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: ".7rem", fontWeight: 700,
                            background: done ? "#22c55e" : overdue ? "#ef4444" : "var(--border)",
                            color: done || overdue ? "#fff" : "var(--muted)",
                          }}>
                            {done ? "✓" : i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: ".875rem" }}>{m.label}</span>
                            <span className="muted" style={{ fontSize: ".8rem", marginLeft: 8 }}>
                              {done ? `Completed ${new Date(m.completedAt!).toLocaleDateString()}` : m.dueBy ? `Due ${new Date(m.dueBy).toLocaleDateString()}` : "Not scheduled"}
                            </span>
                          </div>
                          {overdue && <span style={{ fontSize: ".7rem", fontWeight: 700, color: "#ef4444" }}>OVERDUE</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Blockers */}
                  {p.blockers.length > 0 && (
                    <div>
                      <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#ef4444", marginBottom: 8 }}>Blockers</div>
                      {p.blockers.map((b, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: ".875rem" }}>
                          <AlertTriangle size={14} style={{ color: "#ef4444", flexShrink: 0 }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
