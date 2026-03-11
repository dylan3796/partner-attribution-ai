"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  Target,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Percent,
  GitBranch,
  Loader2,
  Edit2,
  X,
} from "lucide-react";

// ─── Types & constants ───────────────────────────────────────────────────────

type Metric = "revenue" | "pipeline" | "partners" | "deals" | "win_rate";
type Status = "active" | "completed" | "missed";

const METRIC_CONFIG: Record<
  Metric,
  { label: string; icon: typeof Target; color: string; format: (v: number) => string }
> = {
  revenue: {
    label: "Revenue",
    icon: DollarSign,
    color: "#22c55e",
    format: (v) => `$${v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toLocaleString()}`,
  },
  pipeline: {
    label: "Pipeline",
    icon: GitBranch,
    color: "#6366f1",
    format: (v) => `$${v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toLocaleString()}`,
  },
  partners: {
    label: "New Partners",
    icon: Users,
    color: "#3b82f6",
    format: (v) => v.toLocaleString(),
  },
  deals: {
    label: "Deals Won",
    icon: Briefcase,
    color: "#f59e0b",
    format: (v) => v.toLocaleString(),
  },
  win_rate: {
    label: "Win Rate",
    icon: Percent,
    color: "#8b5cf6",
    format: (v) => `${v}%`,
  },
};

const STATUS_BADGE: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#3b82f6", bg: "#3b82f618" },
  completed: { label: "Completed", color: "#22c55e", bg: "#22c55e18" },
  missed: { label: "Missed", color: "#ef4444", bg: "#ef444418" },
};

// Quarter helpers
function getCurrentQuarter(): string {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

function getQuarterDates(period: string): { start: number; end: number } {
  const match = period.match(/Q(\d)\s+(\d{4})/);
  if (!match) {
    const now = new Date();
    return { start: now.getTime(), end: now.getTime() + 90 * 86400000 };
  }
  const q = parseInt(match[1]);
  const year = parseInt(match[2]);
  const startMonth = (q - 1) * 3;
  const start = new Date(year, startMonth, 1).getTime();
  const end = new Date(year, startMonth + 3, 0, 23, 59, 59, 999).getTime();
  return { start, end };
}

function getQuarterOptions(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  const options: string[] = [];
  // Previous quarter, current, next 2
  for (let i = -1; i <= 2; i++) {
    let qq = q + i;
    let yy = year;
    if (qq <= 0) { qq += 4; yy -= 1; }
    if (qq > 4) { qq -= 4; yy += 1; }
    options.push(`Q${qq} ${yy}`);
  }
  return options;
}

function getProgressColor(pct: number): string {
  if (pct >= 75) return "#22c55e";
  if (pct >= 50) return "#f59e0b";
  return "#ef4444";
}

function getTimeProgress(startDate: number, endDate: number): number {
  const now = Date.now();
  if (now <= startDate) return 0;
  if (now >= endDate) return 100;
  return Math.round(((now - startDate) / (endDate - startDate)) * 100);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const goals = useQuery(api.goals.list);
  const progress = useQuery(api.goals.getProgress);
  const createGoal = useMutation(api.goals.create);
  const updateGoal = useMutation(api.goals.update);
  const removeGoal = useMutation(api.goals.remove);
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Create form state
  const [newMetric, setNewMetric] = useState<Metric>("revenue");
  const [newLabel, setNewLabel] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newPeriod, setNewPeriod] = useState(getCurrentQuarter());
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<Id<"goals"> | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const loading = goals === undefined || progress === undefined;

  const filteredGoals = useMemo(() => {
    if (!goals) return [];
    return goals.filter((g) => {
      if (filterPeriod !== "all" && g.period !== filterPeriod) return false;
      if (filterStatus !== "all" && g.status !== filterStatus) return false;
      return true;
    });
  }, [goals, filterPeriod, filterStatus]);

  const periods = useMemo(() => {
    if (!goals) return [];
    const set = new Set(goals.map((g) => g.period));
    return Array.from(set).sort();
  }, [goals]);

  // Stats
  const stats = useMemo(() => {
    if (!goals || !progress) return { total: 0, onTrack: 0, atRisk: 0, completed: 0 };
    const active = goals.filter((g) => g.status === "active");
    const onTrack = active.filter((g) => {
      const p = progress[g._id];
      if (!p) return false;
      const timePct = getTimeProgress(g.startDate, g.endDate);
      return p.percentage >= timePct * 0.8; // within 80% of expected pace
    }).length;
    return {
      total: goals.length,
      onTrack,
      atRisk: active.length - onTrack,
      completed: goals.filter((g) => g.status === "completed").length,
    };
  }, [goals, progress]);

  async function handleCreate() {
    const target = parseFloat(newTarget);
    if (!newLabel.trim() || isNaN(target) || target <= 0) {
      toast("Fill in all required fields", "error");
      return;
    }
    setCreating(true);
    try {
      const { start, end } = getQuarterDates(newPeriod);
      await createGoal({
        metric: newMetric,
        label: newLabel.trim(),
        target,
        period: newPeriod,
        startDate: start,
        endDate: end,
        notes: newNotes.trim() || undefined,
      });
      toast("Goal created");
      setShowCreate(false);
      setNewLabel("");
      setNewTarget("");
      setNewNotes("");
    } catch {
      toast("Failed to create goal", "error");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(goal: NonNullable<typeof goals>[number]) {
    setEditingId(goal._id);
    setEditLabel(goal.label);
    setEditTarget(String(goal.target));
    setEditNotes(goal.notes || "");
  }

  async function saveEdit() {
    if (!editingId) return;
    const target = parseFloat(editTarget);
    if (!editLabel.trim() || isNaN(target)) return;
    try {
      await updateGoal({
        id: editingId,
        label: editLabel.trim(),
        target,
        notes: editNotes.trim() || undefined,
      });
      toast("Goal updated");
      setEditingId(null);
    } catch {
      toast("Failed to update", "error");
    }
  }

  async function markStatus(id: Id<"goals">, status: Status) {
    try {
      await updateGoal({ id, status });
      toast(`Goal marked as ${status}`);
    } catch {
      toast("Failed to update status", "error");
    }
  }

  async function handleDelete(id: Id<"goals">) {
    if (!confirm("Delete this goal?")) return;
    try {
      await removeGoal({ id });
      toast("Goal deleted");
    } catch {
      toast("Failed to delete", "error");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 3rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={22} style={{ color: "#6366f1" }} /> Goals & Targets
          </h1>
          <p className="muted" style={{ fontSize: ".85rem", marginTop: 2 }}>
            Set quarterly targets and track live progress against real data.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: "#6366f1", color: "#fff", fontWeight: 700,
            fontSize: ".85rem", cursor: "pointer",
          }}
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Total Goals", value: stats.total, color: "#6366f1" },
          { label: "On Track", value: stats.onTrack, color: "#22c55e" },
          { label: "At Risk", value: stats.atRisk, color: "#f59e0b" },
          { label: "Completed", value: stats.completed, color: "#8b5cf6" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "14px 16px",
            }}
          >
            <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, marginTop: 2 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "6px 12px", color: "inherit", fontSize: ".8rem",
          }}
        >
          <option value="all">All Periods</option>
          {periods.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "6px 12px", color: "inherit", fontSize: ".8rem",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      {/* Goal cards */}
      {filteredGoals.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "3rem 1rem",
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: 12,
        }}>
          <Target size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>No goals yet</h3>
          <p className="muted" style={{ fontSize: ".85rem", marginBottom: 16 }}>
            Set quarterly targets to track revenue, pipeline, partner growth, and more.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#6366f1", color: "#fff", fontWeight: 700,
              fontSize: ".85rem", cursor: "pointer",
            }}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {filteredGoals.map((goal) => {
            const cfg = METRIC_CONFIG[goal.metric];
            const Icon = cfg.icon;
            const p = progress?.[goal._id];
            const pct = p?.percentage ?? 0;
            const current = p?.current ?? 0;
            const timePct = getTimeProgress(goal.startDate, goal.endDate);
            const statusBadge = STATUS_BADGE[goal.status];
            const isEditing = editingId === goal._id;

            return (
              <div
                key={goal._id}
                style={{
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "18px 20px", position: "relative",
                }}
              >
                {/* Top row: metric icon + label + status badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      background: `${cfg.color}18`,
                    }}>
                      <Icon size={18} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      {isEditing ? (
                        <input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          style={{
                            background: "transparent", border: "1px solid var(--border)",
                            borderRadius: 6, padding: "2px 8px", color: "inherit",
                            fontWeight: 700, fontSize: ".9rem", width: 180,
                          }}
                        />
                      ) : (
                        <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{goal.label}</div>
                      )}
                      <div className="muted" style={{ fontSize: ".7rem" }}>
                        {goal.period} · {cfg.label}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: "2px 8px", borderRadius: 6, fontSize: ".65rem",
                    fontWeight: 700, color: statusBadge.color, background: statusBadge.bg,
                  }}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: getProgressColor(pct) }}>
                      {cfg.format(current)}
                    </span>
                    <span className="muted">
                      {cfg.format(goal.target)} target
                    </span>
                  </div>
                  <div style={{
                    height: 8, borderRadius: 4, background: "var(--border)",
                    overflow: "hidden", position: "relative",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: getProgressColor(pct),
                      width: `${pct}%`, transition: "width 0.5s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span className="muted" style={{ fontSize: ".7rem" }}>
                      {pct}% of target
                    </span>
                    <span className="muted" style={{ fontSize: ".7rem" }}>
                      {timePct}% of period elapsed
                    </span>
                  </div>
                </div>

                {/* Pace indicator */}
                {goal.status === "active" && timePct > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: ".75rem", marginBottom: 10,
                    color: pct >= timePct * 0.8 ? "#22c55e" : pct >= timePct * 0.5 ? "#f59e0b" : "#ef4444",
                  }}>
                    <TrendingUp size={14} />
                    {pct >= timePct * 0.8
                      ? "On track"
                      : pct >= timePct * 0.5
                        ? "Slightly behind"
                        : "Behind pace"}
                    {" — "}
                    {pct >= timePct
                      ? "ahead of schedule"
                      : `expected ${Math.round(timePct)}% by now`}
                  </div>
                )}

                {/* Notes */}
                {isEditing ? (
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notes (optional)"
                    rows={2}
                    style={{
                      width: "100%", background: "transparent", border: "1px solid var(--border)",
                      borderRadius: 6, padding: "6px 8px", color: "inherit", fontSize: ".8rem",
                      resize: "vertical", marginBottom: 8,
                    }}
                  />
                ) : goal.notes ? (
                  <p className="muted" style={{ fontSize: ".75rem", marginBottom: 8, lineHeight: 1.4 }}>
                    {goal.notes}
                  </p>
                ) : null}

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {isEditing ? (
                    <>
                      <input
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                        type="number"
                        placeholder="Target"
                        style={{
                          background: "transparent", border: "1px solid var(--border)",
                          borderRadius: 6, padding: "4px 8px", color: "inherit",
                          fontSize: ".8rem", width: 100,
                        }}
                      />
                      <button onClick={saveEdit} style={actionBtn("#22c55e")}>
                        <CheckCircle size={13} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} style={actionBtn("#6b7280")}>
                        <X size={13} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(goal)} style={actionBtn("#6b7280")}>
                        <Edit2 size={13} /> Edit
                      </button>
                      {goal.status === "active" && (
                        <>
                          <button onClick={() => markStatus(goal._id, "completed")} style={actionBtn("#22c55e")}>
                            <CheckCircle size={13} /> Complete
                          </button>
                          <button onClick={() => markStatus(goal._id, "missed")} style={actionBtn("#f59e0b")}>
                            <XCircle size={13} /> Missed
                          </button>
                        </>
                      )}
                      {goal.status !== "active" && (
                        <button onClick={() => markStatus(goal._id, "active")} style={actionBtn("#3b82f6")}>
                          Reactivate
                        </button>
                      )}
                      <button onClick={() => handleDelete(goal._id)} style={actionBtn("#ef4444")}>
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "24px", maxWidth: 420, width: "100%",
          }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={18} style={{ color: "#6366f1" }} /> New Goal
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Metric */}
              <div>
                <label className="muted" style={{ fontSize: ".7rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  METRIC
                </label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => {
                    const c = METRIC_CONFIG[m];
                    const MIcon = c.icon;
                    const selected = newMetric === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setNewMetric(m)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "5px 10px", borderRadius: 6,
                          border: `1px solid ${selected ? c.color : "var(--border)"}`,
                          background: selected ? `${c.color}18` : "transparent",
                          color: selected ? c.color : "inherit",
                          fontSize: ".75rem", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        <MIcon size={13} /> {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="muted" style={{ fontSize: ".7rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  GOAL NAME
                </label>
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={`e.g. ${getCurrentQuarter()} Revenue Target`}
                  style={{
                    width: "100%", background: "transparent", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 12px", color: "inherit", fontSize: ".85rem",
                  }}
                />
              </div>

              {/* Target */}
              <div>
                <label className="muted" style={{ fontSize: ".7rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  TARGET {newMetric === "win_rate" ? "(%)" : newMetric === "revenue" || newMetric === "pipeline" ? "($)" : "(COUNT)"}
                </label>
                <input
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  type="number"
                  placeholder={newMetric === "win_rate" ? "e.g. 40" : newMetric === "revenue" ? "e.g. 500000" : "e.g. 50"}
                  style={{
                    width: "100%", background: "transparent", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 12px", color: "inherit", fontSize: ".85rem",
                  }}
                />
              </div>

              {/* Period */}
              <div>
                <label className="muted" style={{ fontSize: ".7rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  PERIOD
                </label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  style={{
                    width: "100%", background: "var(--card-bg)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 12px", color: "inherit", fontSize: ".85rem",
                  }}
                >
                  {getQuarterOptions().map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="muted" style={{ fontSize: ".7rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
                  NOTES (OPTIONAL)
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Context, strategy, or reasoning..."
                  rows={2}
                  style={{
                    width: "100%", background: "transparent", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 12px", color: "inherit", fontSize: ".85rem",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "inherit", fontWeight: 600,
                    fontSize: ".85rem", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  style={{
                    padding: "8px 20px", borderRadius: 8, border: "none",
                    background: "#6366f1", color: "#fff", fontWeight: 700,
                    fontSize: ".85rem", cursor: creating ? "wait" : "pointer",
                    opacity: creating ? 0.7 : 1,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline style helper for action buttons
function actionBtn(color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "4px 10px", borderRadius: 6,
    border: `1px solid ${color}33`,
    background: `${color}10`, color,
    fontSize: ".7rem", fontWeight: 600, cursor: "pointer",
  };
}
