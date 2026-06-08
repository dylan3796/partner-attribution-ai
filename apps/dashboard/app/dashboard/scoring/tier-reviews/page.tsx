"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  calculatePartnerScores,
  tierColor,
  tierBgColor,
  scoreColor,
  DEFAULT_SCORING_CONFIG,
  type PartnerScore,
} from "@/lib/partner-scoring";
import { TIER_LABELS } from "@/lib/types";
import type { Id } from "@/convex/_generated/dataModel";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  ChevronRight,
  Users,
  Loader2,
  Save,
} from "lucide-react";

type ReviewAction = "approved" | "rejected" | "deferred";

function TierBadge({ tier, size = "md" }: { tier: string; size?: "sm" | "md" }) {
  const s = size === "sm" ? { padding: "1px 8px", fontSize: ".7rem" } : { padding: "3px 12px", fontSize: ".8rem" };
  return (
    <span style={{
      ...s, borderRadius: 999, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".04em",
      background: tierBgColor(tier), color: tierColor(tier),
    }}>
      {TIER_LABELS[tier as keyof typeof TIER_LABELS] || tier}
    </span>
  );
}

function ScoreCircle({ score, size = 36 }: { score: number; size?: number }) {
  const color = scoreColor(score);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      background: `${color}15`, border: `2px solid ${color}`, color, fontWeight: 800, fontSize: size * 0.35,
    }}>
      {score}
    </div>
  );
}

function ActionButton({ label, icon, active, onClick, color, saving }: {
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void; color: string; saving?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={saving}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, fontSize: ".8rem", fontWeight: 600,
        border: active ? `2px solid ${color}` : "1px solid var(--border)",
        background: active ? `${color}15` : "transparent", color: active ? color : "var(--muted)",
        cursor: saving ? "wait" : "pointer", transition: "all 0.15s", opacity: saving ? 0.6 : 1,
      }}
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : icon} {label}
    </button>
  );
}

export default function TierReviewsPage() {
  // Fetch real data from Convex
  const scoringData = useQuery(api.tierReviews.getScoringData);
  const existingReviews = useQuery(api.tierReviews.list);
  const saveReview = useMutation(api.tierReviews.save);
  const bulkApprove = useMutation(api.tierReviews.bulkApprove);
  const updateNotes = useMutation(api.tierReviews.updateNotes);

  const [filter, setFilter] = useState<"all" | "upgrades" | "downgrades">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [localNotes, setLocalNotes] = useState<Map<string, string>>(new Map());
  const [noteTimers, setNoteTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Compute scores from real Convex data
  const scores = useMemo(() => {
    if (!scoringData) return [];
    const { partners, deals, touchpoints, attributions } = scoringData;
    return calculatePartnerScores(
      partners as any,
      deals as any,
      touchpoints as any,
      attributions as any,
      DEFAULT_SCORING_CONFIG
    );
  }, [scoringData]);

  // Build a map of existing reviews by partnerId
  const reviewMap = useMemo(() => {
    const map = new Map<string, { action: ReviewAction; notes: string }>();
    if (!existingReviews) return map;
    for (const r of existingReviews) {
      map.set(r.partnerId as string, {
        action: r.action,
        notes: r.notes || "",
      });
    }
    return map;
  }, [existingReviews]);

  // Only show partners with tier changes
  const changesOnly = useMemo(() => scores.filter((s) => s.tierChange !== "maintain"), [scores]);
  const upgrades = changesOnly.filter((s) => s.tierChange === "upgrade");
  const downgrades = changesOnly.filter((s) => s.tierChange === "downgrade");
  const filtered = filter === "upgrades" ? upgrades : filter === "downgrades" ? downgrades : changesOnly;

  // Count reviewed (from Convex)
  const reviewed = changesOnly.filter((s) => reviewMap.has(s.partnerId)).length;

  const handleAction = useCallback(async (score: PartnerScore, action: ReviewAction) => {
    setSavingIds((prev) => new Set(prev).add(score.partnerId));
    try {
      await saveReview({
        partnerId: score.partnerId as Id<"partners">,
        action,
        previousTier: score.currentTier,
        recommendedTier: score.recommendedTier,
        overallScore: score.overallScore,
        notes: localNotes.get(score.partnerId) || reviewMap.get(score.partnerId)?.notes || undefined,
      });
    } catch (err) {
      console.error("Failed to save tier review:", err);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(score.partnerId);
        return next;
      });
    }
  }, [saveReview, localNotes, reviewMap]);

  const handleBulkApprove = useCallback(async () => {
    const pending = changesOnly.filter((s) => !reviewMap.has(s.partnerId));
    if (pending.length === 0) return;
    setBulkSaving(true);
    try {
      await bulkApprove({
        reviews: pending.map((s) => ({
          partnerId: s.partnerId as Id<"partners">,
          previousTier: s.currentTier,
          recommendedTier: s.recommendedTier,
          overallScore: s.overallScore,
        })),
      });
    } catch (err) {
      console.error("Bulk approve failed:", err);
    } finally {
      setBulkSaving(false);
    }
  }, [changesOnly, reviewMap, bulkApprove]);

  const handleNotesChange = useCallback((partnerId: string, value: string) => {
    setLocalNotes((prev) => new Map(prev).set(partnerId, value));
    // Debounce save notes
    setNoteTimers((prev) => {
      const existing = prev.get(partnerId);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(async () => {
        if (reviewMap.has(partnerId)) {
          try {
            await updateNotes({ partnerId: partnerId as Id<"partners">, notes: value });
          } catch { /* silently fail */ }
        }
      }, 1000);
      return new Map(prev).set(partnerId, timer);
    });
  }, [reviewMap, updateNotes]);

  // Loading state
  if (!scoringData || existingReviews === undefined) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Link href="/dashboard/scoring" style={{ fontSize: ".8rem", color: "var(--muted)", textDecoration: "none" }}>Scoring</Link>
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
            <span style={{ fontSize: ".8rem", fontWeight: 600 }}>Tier Reviews</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Tier Review Queue</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Review and approve partner tier changes based on scoring</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {[1,2,3,4].map((i) => (
            <div key={i} className="card" style={{ padding: "1.25rem", height: 80 }}>
              <div style={{ width: "60%", height: 12, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: "40%", height: 24, background: "var(--border)", borderRadius: 6 }} />
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Loader2 size={24} style={{ color: "var(--muted)", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
          <p className="muted" style={{ fontSize: ".875rem" }}>Loading scoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Link href="/dashboard/scoring" style={{ fontSize: ".8rem", color: "var(--muted)", textDecoration: "none" }}>Scoring</Link>
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
            <span style={{ fontSize: ".8rem", fontWeight: 600 }}>Tier Reviews</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Tier Review Queue</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Review and approve partner tier changes based on scoring</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value as any)} style={{ maxWidth: 180 }}>
            <option value="all">All Changes ({changesOnly.length})</option>
            <option value="upgrades">Upgrades ({upgrades.length})</option>
            <option value="downgrades">Downgrades ({downgrades.length})</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#6366f118", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
            <Users size={22} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending Reviews</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{changesOnly.length - reviewed}</div>
          </div>
        </div>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#22c55e18", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
            <ArrowUpCircle size={22} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Upgrades</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{upgrades.length}</div>
          </div>
        </div>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ef444418", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
            <ArrowDownCircle size={22} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Downgrades</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{downgrades.length}</div>
          </div>
        </div>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#8b5cf618", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Reviewed</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{reviewed}/{changesOnly.length}</div>
          </div>
        </div>
      </div>

      {/* Review List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Trophy size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600 }}>No tier changes recommended</p>
          <p className="muted" style={{ fontSize: ".875rem" }}>All partners are correctly tiered based on current scores</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {filtered
            .sort((a, b) => {
              if (a.tierChange !== b.tierChange) return a.tierChange === "upgrade" ? -1 : 1;
              return b.overallScore - a.overallScore;
            })
            .map((score) => {
              const review = reviewMap.get(score.partnerId);
              const isSaving = savingIds.has(score.partnerId);
              const isExpanded = expandedId === score.partnerId;
              const isUpgrade = score.tierChange === "upgrade";
              const changeColor = isUpgrade ? "#22c55e" : "#ef4444";
              const ChangeIcon = isUpgrade ? ArrowUpCircle : ArrowDownCircle;

              return (
                <div key={score.partnerId}>
                  <div
                    className="card"
                    onClick={() => setExpandedId(isExpanded ? null : score.partnerId)}
                    style={{
                      padding: "1rem 1.25rem", cursor: "pointer",
                      border: review?.action === "approved" ? "1px solid #22c55e" : review?.action === "rejected" ? "1px solid #ef4444" : isExpanded ? "1px solid #6366f1" : "1px solid var(--border)",
                      opacity: review?.action === "rejected" ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <ScoreCircle score={score.overallScore} />

                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{score.partnerName}</span>
                          {review && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              padding: "1px 8px", borderRadius: 999, fontSize: ".65rem", fontWeight: 700,
                              background: review.action === "approved" ? "#22c55e20" : review.action === "rejected" ? "#ef444420" : "#eab30820",
                              color: review.action === "approved" ? "#22c55e" : review.action === "rejected" ? "#ef4444" : "#eab308",
                            }}>
                              <Save size={9} /> {review.action.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <TierBadge tier={score.currentTier} size="sm" />
                          <ChangeIcon size={16} style={{ color: changeColor }} />
                          <TierBadge tier={score.recommendedTier} size="sm" />
                        </div>
                      </div>

                      {/* Score dimensions mini */}
                      <div style={{ display: "flex", gap: 12, fontSize: ".75rem" }}>
                        {Object.entries(score.dimensions).map(([key, dim]) => dim ? (
                          <div key={key} style={{ textAlign: "center" }}>
                            <div className="muted" style={{ fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase" }}>{dim.label.split(" ")[0]}</div>
                            <div style={{ fontWeight: 700, color: scoreColor(dim.score) }}>{dim.score}</div>
                          </div>
                        ) : null)}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <ActionButton label="Approve" icon={<CheckCircle2 size={14} />} active={review?.action === "approved"} onClick={() => handleAction(score, "approved")} color="#22c55e" saving={isSaving} />
                        <ActionButton label="Reject" icon={<XCircle size={14} />} active={review?.action === "rejected"} onClick={() => handleAction(score, "rejected")} color="#ef4444" saving={isSaving} />
                        <ActionButton label="Defer" icon={<Clock size={14} />} active={review?.action === "deferred"} onClick={() => handleAction(score, "deferred")} color="#eab308" saving={isSaving} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded: scoring rationale */}
                  {isExpanded && (
                    <div className="card" style={{ marginTop: 4, padding: "1.25rem", borderLeft: `3px solid ${changeColor}` }}>
                      <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "#6366f1", marginBottom: 12 }}>Scoring Breakdown</div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: 16 }}>
                        {Object.entries(score.dimensions).map(([key, dim]) => dim ? (
                          <div key={key} style={{ padding: "0.75rem", background: "rgba(99,102,241,0.04)", borderRadius: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontSize: ".8rem", fontWeight: 700 }}>{dim.label}</span>
                              <span style={{ fontSize: ".8rem", fontWeight: 800, color: scoreColor(dim.score) }}>{dim.score}/100</span>
                            </div>
                            <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                              <div style={{ width: `${dim.score}%`, height: "100%", background: scoreColor(dim.score), borderRadius: 3 }} />
                            </div>
                            <div className="muted" style={{ fontSize: ".75rem", lineHeight: 1.4 }}>{dim.detail}</div>
                            <div className="muted" style={{ fontSize: ".7rem", marginTop: 4 }}>Weight: {(dim.weight * 100).toFixed(0)}%</div>
                          </div>
                        ) : null)}
                      </div>

                      {/* Highlights / rationale */}
                      {score.highlights.length > 0 && (
                        <div>
                          <div style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: isUpgrade ? "#22c55e" : "#ef4444", marginBottom: 8 }}>
                            {isUpgrade ? "Upgrade Rationale" : "Downgrade Signals"}
                          </div>
                          {score.highlights.map((h, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: ".85rem" }}>
                              <ChevronRight size={14} style={{ color: changeColor, flexShrink: 0 }} />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes field */}
                      <div style={{ marginTop: 16 }}>
                        <label style={{ fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Review Notes</label>
                        <textarea
                          className="input"
                          rows={2}
                          placeholder="Add notes for this tier review..."
                          value={localNotes.get(score.partnerId) ?? review?.notes ?? ""}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleNotesChange(score.partnerId, e.target.value)}
                          style={{ width: "100%", resize: "vertical" }}
                        />
                        {review && (
                          <p className="muted" style={{ fontSize: ".7rem", marginTop: 4 }}>
                            Notes auto-save when you have an active review decision
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Bulk action bar */}
      {changesOnly.length > 0 && (
        <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span className="muted" style={{ fontSize: ".875rem" }}>
            {reviewed} of {changesOnly.length} reviewed
            {reviewed > 0 && (() => {
              const approved = changesOnly.filter(s => reviewMap.get(s.partnerId)?.action === "approved").length;
              const rejected = changesOnly.filter(s => reviewMap.get(s.partnerId)?.action === "rejected").length;
              const deferred = changesOnly.filter(s => reviewMap.get(s.partnerId)?.action === "deferred").length;
              return ` • ${approved} approved, ${rejected} rejected, ${deferred} deferred`;
            })()}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-outline"
              onClick={handleBulkApprove}
              disabled={bulkSaving || changesOnly.length === reviewed}
              style={{ fontSize: ".8rem", opacity: bulkSaving ? 0.6 : 1 }}
            >
              {bulkSaving ? (
                <><Loader2 size={14} style={{ animation: "spin 1s linear infinite", marginRight: 6 }} /> Approving...</>
              ) : (
                `Approve All Remaining (${changesOnly.length - reviewed})`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
