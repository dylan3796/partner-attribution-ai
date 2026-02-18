"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { INCENTIVE_TYPE_LABELS, INCENTIVE_STATUS_LABELS } from "@/lib/types";
import type { IncentiveProgram, IncentiveEnrollment } from "@/lib/types";
import {
  Gift,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ChevronRight,
  Award,
  Clock,
  CheckCircle2,
  PauseCircle,
  XCircle,
} from "lucide-react";

function ProgressBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function StatusBadge({ status }: { status: IncentiveProgram["status"] }) {
  const colors: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
    active: { bg: "rgba(34,197,94,0.15)", fg: "#22c55e", icon: <CheckCircle2 size={12} /> },
    draft: { bg: "rgba(148,163,184,0.15)", fg: "#94a3b8", icon: <Clock size={12} /> },
    paused: { bg: "rgba(234,179,8,0.15)", fg: "#eab308", icon: <PauseCircle size={12} /> },
    ended: { bg: "rgba(239,68,68,0.15)", fg: "#ef4444", icon: <XCircle size={12} /> },
  };
  const c = colors[status] || colors.draft;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: ".75rem", fontWeight: 600, background: c.bg, color: c.fg }}>
      {c.icon} {INCENTIVE_STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: IncentiveProgram["type"] }) {
  const colors: Record<string, string> = {
    spif: "#8b5cf6",
    bonus: "#3b82f6",
    accelerator: "#f59e0b",
    mdf_match: "#10b981",
    deal_reg_bonus: "#ec4899",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: ".75rem", fontWeight: 600, background: `${colors[type]}22`, color: colors[type] }}>
      {INCENTIVE_TYPE_LABELS[type]}
    </span>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
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

function daysRemaining(endDate: number): string {
  const days = Math.ceil((endDate - Date.now()) / 86400000);
  if (days < 0) return "Ended";
  if (days === 0) return "Ends today";
  return `${days}d left`;
}

export default function IncentivesPage() {
  const { incentivePrograms, incentiveEnrollments } = useStore();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredPrograms = useMemo(() => {
    if (filterStatus === "all") return incentivePrograms;
    return incentivePrograms.filter((p) => p.status === filterStatus);
  }, [incentivePrograms, filterStatus]);

  const selectedProgram = selectedProgramId ? incentivePrograms.find((p) => p._id === selectedProgramId) : null;
  const enrollments = selectedProgramId
    ? incentiveEnrollments.filter((e) => e.programId === selectedProgramId)
    : [];

  // Summary stats
  const activePrograms = incentivePrograms.filter((p) => p.status === "active");
  const totalBudget = activePrograms.reduce((s, p) => s + p.budget, 0);
  const totalSpent = activePrograms.reduce((s, p) => s + p.spent, 0);
  const totalEnrollments = incentiveEnrollments.filter((e) =>
    activePrograms.some((p) => p._id === e.programId)
  ).length;
  const totalEarned = incentiveEnrollments.reduce((s, e) => s + e.earned, 0);
  const totalPaid = incentiveEnrollments.reduce((s, e) => s + e.paid, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Incentive Programs</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage SPIFs, bonuses, accelerators, and partner incentives</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="all">All Programs</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <StatCard icon={<Zap size={22} />} label="Active Programs" value={String(activePrograms.length)} sub={`${incentivePrograms.length} total`} />
        <StatCard icon={<DollarSign size={22} />} label="Total Budget" value={formatCurrency(totalBudget)} sub={`${formatCurrency(totalSpent)} spent (${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%)`} />
        <StatCard icon={<Users size={22} />} label="Enrollments" value={String(totalEnrollments)} sub="across active programs" />
        <StatCard icon={<Award size={22} />} label="Partner Earnings" value={formatCurrency(totalEarned)} sub={`${formatCurrency(totalPaid)} paid out`} />
      </div>

      {/* Budget Utilization Bar */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: ".875rem", fontWeight: 600 }}>Overall Budget Utilization</span>
          <span className="muted" style={{ fontSize: ".875rem" }}>{formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}</span>
        </div>
        <ProgressBar value={totalSpent} max={totalBudget} color="#6366f1" />
      </div>

      {/* Programs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {filteredPrograms.map((program) => {
          const progEnrollments = incentiveEnrollments.filter((e) => e.programId === program._id);
          const achieved = progEnrollments.filter((e) => e.status === "achieved").length;
          const isSelected = selectedProgramId === program._id;

          return (
            <div
              key={program._id}
              className="card"
              onClick={() => setSelectedProgramId(isSelected ? null : program._id)}
              style={{
                padding: "1.25rem",
                cursor: "pointer",
                border: isSelected ? "1px solid #6366f1" : "1px solid var(--border)",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <TypeBadge type={program.type} />
                  <StatusBadge status={program.status} />
                </div>
                <span className="muted" style={{ fontSize: ".75rem", fontWeight: 600 }}>{daysRemaining(program.endDate)}</span>
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>{program.name}</h3>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: 12, lineHeight: 1.4 }}>{program.description}</p>

              {/* Budget progress */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: 4 }}>
                  <span className="muted">Budget</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(program.spent)} / {formatCurrency(program.budget)}</span>
                </div>
                <ProgressBar
                  value={program.spent}
                  max={program.budget}
                  color={program.spent / program.budget > 0.9 ? "#ef4444" : program.spent / program.budget > 0.7 ? "#eab308" : "#22c55e"}
                />
              </div>

              {/* Footer stats */}
              <div style={{ display: "flex", gap: "1.5rem", fontSize: ".8rem", marginTop: 8 }}>
                <span className="muted"><Users size={13} style={{ verticalAlign: -2 }} /> {progEnrollments.length} enrolled</span>
                <span className="muted"><CheckCircle2 size={13} style={{ verticalAlign: -2 }} /> {achieved} achieved</span>
                <span className="muted"><Target size={13} style={{ verticalAlign: -2 }} /> {program.rules.length} rules</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment Detail Panel */}
      {selectedProgram && (
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              <Gift size={18} style={{ verticalAlign: -3, marginRight: 8 }} />
              {selectedProgram.name} — Partner Enrollments
            </h2>
            <StatusBadge status={selectedProgram.status} />
          </div>

          {/* Rules */}
          <div style={{ marginBottom: "1.25rem", padding: "1rem", background: "rgba(99,102,241,0.06)", borderRadius: 12 }}>
            <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, color: "#6366f1" }}>Program Rules</div>
            {selectedProgram.rules.map((rule, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: ".875rem", padding: "4px 0" }}>
                <ChevronRight size={14} style={{ color: "#6366f1", flexShrink: 0 }} />
                <span>{rule.description}</span>
              </div>
            ))}
          </div>

          {/* Enrollments table */}
          {enrollments.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "2rem" }}>No enrollments yet</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Partner</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progress</th>
                    <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Earned</th>
                    <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Paid</th>
                    <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 600, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => (
                    <tr key={enr._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{enr.partnerName}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {enr.progress.map((p, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 100 }}>
                              <ProgressBar
                                value={p.current}
                                max={p.target}
                                color={p.current >= p.target ? "#22c55e" : "#6366f1"}
                              />
                            </div>
                            <span style={{ fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {p.current}/{p.target} {p.metric.replace(/_/g, " ")}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>{formatCurrency(enr.earned)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        {formatCurrency(enr.paid)}
                        {enr.earned > enr.paid && (
                          <div style={{ fontSize: ".75rem", color: "#eab308" }}>
                            {formatCurrency(enr.earned - enr.paid)} pending
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: ".75rem",
                          fontWeight: 600,
                          background: enr.status === "achieved" ? "rgba(34,197,94,0.15)" : enr.status === "enrolled" ? "rgba(99,102,241,0.15)" : "rgba(148,163,184,0.15)",
                          color: enr.status === "achieved" ? "#22c55e" : enr.status === "enrolled" ? "#6366f1" : "#94a3b8",
                        }}>
                          {enr.status === "achieved" ? "✓ Achieved" : enr.status === "enrolled" ? "In Progress" : enr.status.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
