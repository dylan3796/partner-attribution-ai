"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Activity, Flame, Calendar, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Get color intensity for a count value */
function getColor(count: number, max: number): string {
  if (count === 0) return "#161616";
  const ratio = count / Math.max(max, 1);
  if (ratio <= 0.25) return "#0e4429";
  if (ratio <= 0.5) return "#006d32";
  if (ratio <= 0.75) return "#26a641";
  return "#39d353";
}

/** Generate array of dates for the past N weeks */
function getDateGrid(weeks: number): { date: string; dayOfWeek: number }[] {
  const result: { date: string; dayOfWeek: number }[] = [];
  const today = new Date();
  // Start from (weeks * 7) days ago, aligned to Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1) - start.getDay());

  for (let i = 0; i < weeks * 7 + today.getDay() + 1; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d > today) break;
    result.push({
      date: d.toISOString().split("T")[0],
      dayOfWeek: d.getDay(),
    });
  }
  return result;
}

/** Format date string for tooltip */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ─── Stats helpers ──────────────────────────────────────────

function computeStats(days: Record<string, { count: number; types: Record<string, number> }>, totalEvents: number) {
  const entries = Object.entries(days);
  if (entries.length === 0) {
    return { totalEvents: 0, busiestDay: "—", busiestCount: 0, activeDays: 0, avgPerActiveDay: 0, currentStreak: 0 };
  }

  // Busiest day
  let busiestDay = "";
  let busiestCount = 0;
  for (const [date, data] of entries) {
    if (data.count > busiestCount) {
      busiestCount = data.count;
      busiestDay = date;
    }
  }

  // Active days
  const activeDays = entries.filter(([, d]) => d.count > 0).length;
  const avgPerActiveDay = activeDays > 0 ? Math.round((totalEvents / activeDays) * 10) / 10 : 0;

  // Current streak (consecutive days with activity ending today or yesterday)
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (days[key] && days[key].count > 0) {
      streak++;
    } else if (i === 0) {
      // Today has no activity — that's OK, check from yesterday
      continue;
    } else {
      break;
    }
  }

  return {
    totalEvents,
    busiestDay: busiestDay ? formatDate(busiestDay) : "—",
    busiestCount,
    activeDays,
    avgPerActiveDay,
    currentStreak: streak,
  };
}

// ─── Components ─────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof Activity; label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: 12,
      padding: "1.25rem",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={16} style={{ color: "#555" }} />
        <span style={{ fontSize: ".75rem", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: ".75rem", color: "#555", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function HeatmapCell({ count, max, date, types }: {
  count: number;
  max: number;
  date: string;
  types: Record<string, number>;
}) {
  const [hover, setHover] = useState(false);
  const color = getColor(count, max);

  const typeLabels: Record<string, string> = {
    touchpoint: "Touchpoints",
    deal_created: "Deals created",
    deal_closed: "Deals closed",
    audit: "Other activity",
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          width: 13,
          height: 13,
          borderRadius: 3,
          background: color,
          border: hover ? "1px solid #39d353" : "1px solid transparent",
          cursor: "default",
          transition: "border-color .15s",
        }}
      />
      {hover && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 8,
          padding: "8px 12px",
          zIndex: 50,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          fontSize: ".8rem",
          boxShadow: "0 4px 12px rgba(0,0,0,.5)",
        }}>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 2 }}>
            {count === 0 ? "No activity" : `${count} event${count === 1 ? "" : "s"}`}
          </div>
          <div style={{ color: "#888", fontSize: ".7rem" }}>{formatDate(date)}</div>
          {count > 0 && (
            <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
              {Object.entries(types).map(([type, c]) => (
                <div key={type} style={{ color: "#666", fontSize: ".7rem" }}>
                  {typeLabels[type] || type}: {c}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────

export default function ActivityHeatmapPage() {
  const data = useQuery(api.activityHeatmap.getActivity);

  const WEEKS = 52;

  const { grid, maxCount, monthLabels, stats } = useMemo(() => {
    const dates = getDateGrid(WEEKS);
    const days = data?.days || {};

    // Build week columns
    const weeks: { date: string; dayOfWeek: number; count: number; types: Record<string, number> }[][] = [];
    let currentWeek: typeof weeks[0] = [];

    for (const d of dates) {
      const dayData = days[d.date];
      currentWeek.push({
        ...d,
        count: dayData?.count || 0,
        types: dayData?.types || {},
      });
      if (d.dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Max for color scaling
    let maxCount = 0;
    for (const w of weeks) for (const d of w) if (d.count > maxCount) maxCount = d.count;

    // Month labels positioned at week boundaries
    const monthLabels: { label: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    for (let wi = 0; wi < weeks.length; wi++) {
      const firstDay = weeks[wi][0];
      if (!firstDay) continue;
      const month = new Date(firstDay.date + "T12:00:00").getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], weekIdx: wi });
        lastMonth = month;
      }
    }

    const stats = computeStats(days, data?.totalEvents || 0);

    return { grid: weeks, maxCount, monthLabels, stats };
  }, [data, WEEKS]);

  if (!data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <div className="skeleton" style={{ height: 32, width: 320, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: 460 }} />
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 90, flex: 1, minWidth: 140, borderRadius: 12 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <Activity size={22} style={{ color: "#39d353" }} />
          Partner Activity
        </h1>
        <p style={{ color: "#666", fontSize: ".9rem", lineHeight: 1.5 }}>
          Daily partner program activity over the past year — touchpoints, deals, and program events.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <StatCard icon={BarChart3} label="Total Events" value={stats.totalEvents.toLocaleString()} sub="Past 12 months" />
        <StatCard icon={Flame} label="Current Streak" value={`${stats.currentStreak}d`} sub="Consecutive active days" />
        <StatCard icon={Calendar} label="Active Days" value={stats.activeDays} sub={`${stats.avgPerActiveDay} avg/day`} />
        <StatCard icon={TrendingUp} label="Busiest Day" value={stats.busiestCount} sub={stats.busiestDay} />
      </div>

      {/* Heatmap */}
      <div style={{
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        borderRadius: 12,
        padding: "1.5rem",
        overflowX: "auto",
      }}>
        {/* Month labels */}
        <div style={{ display: "flex", marginLeft: 36, marginBottom: 6, gap: 0 }}>
          {monthLabels.map((m, i) => {
            const nextWeek = monthLabels[i + 1]?.weekIdx ?? grid.length;
            const span = nextWeek - m.weekIdx;
            return (
              <div
                key={`${m.label}-${m.weekIdx}`}
                style={{
                  width: span * 16,
                  fontSize: ".7rem",
                  color: "#555",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {span >= 2 ? m.label : ""}
              </div>
            );
          })}
        </div>

        {/* Grid with day labels */}
        <div style={{ display: "flex", gap: 0 }}>
          {/* Day-of-week labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 6, paddingTop: 0 }}>
            {DAYS.map((day, i) => (
              <div
                key={day}
                style={{
                  height: 13,
                  fontSize: ".65rem",
                  color: "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: 28,
                }}
              >
                {i % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div style={{ display: "flex", gap: 3 }}>
            {grid.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Pad incomplete first week */}
                {wi === 0 && week.length < 7 && (
                  Array.from({ length: 7 - week.length }).map((_, pi) => (
                    <div key={`pad-${pi}`} style={{ width: 13, height: 13 }} />
                  ))
                )}
                {week.map((day) => (
                  <HeatmapCell
                    key={day.date}
                    count={day.count}
                    max={maxCount}
                    date={day.date}
                    types={day.types}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, justifyContent: "flex-end" }}>
          <span style={{ fontSize: ".7rem", color: "#555" }}>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              style={{
                width: 13,
                height: 13,
                borderRadius: 3,
                background: getColor(ratio === 0 ? 0 : Math.ceil(ratio * 10), 10),
              }}
            />
          ))}
          <span style={{ fontSize: ".7rem", color: "#555" }}>More</span>
        </div>
      </div>

      {/* Activity breakdown */}
      <div style={{
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        borderRadius: 12,
        padding: "1.5rem",
      }}>
        <h3 style={{ fontSize: ".85rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: "1rem" }}>
          Activity Breakdown
        </h3>
        <ActivityBreakdown days={data.days} />
      </div>

      {/* Links to related reports */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          { href: "/dashboard/reports", label: "Attribution Reports" },
          { href: "/dashboard/reports/revenue", label: "Revenue Intelligence" },
          { href: "/dashboard/reports/digest", label: "Weekly Digest" },
          { href: "/dashboard/reports/win-loss", label: "Win/Loss Analysis" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: ".8rem",
              color: "#555",
              textDecoration: "none",
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #1e1e1e",
              transition: "all .15s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#999"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#555"; }}
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Breakdown by event type for the period */
function ActivityBreakdown({ days }: { days: Record<string, { count: number; types: Record<string, number> }> }) {
  const totals = useMemo(() => {
    const t: Record<string, number> = {};
    for (const day of Object.values(days)) {
      for (const [type, count] of Object.entries(day.types)) {
        t[type] = (t[type] || 0) + count;
      }
    }
    return t;
  }, [days]);

  const typeConfig: Record<string, { label: string; color: string }> = {
    touchpoint: { label: "Partner Touchpoints", color: "#39d353" },
    deal_created: { label: "Deals Created", color: "#3b82f6" },
    deal_closed: { label: "Deals Closed", color: "#8b5cf6" },
    audit: { label: "Program Events", color: "#f59e0b" },
  };

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  if (sorted.length === 0) {
    return <div style={{ color: "#444", fontSize: ".85rem" }}>No activity recorded yet. Activity will appear here as partners register deals, log touchpoints, and interact with the platform.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sorted.map(([type, count]) => {
        const cfg = typeConfig[type] || { label: type, color: "#666" };
        const pct = Math.round((count / max) * 100);
        return (
          <div key={type}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: ".8rem", color: "#ccc", fontWeight: 600 }}>{cfg.label}</span>
              <span style={{ fontSize: ".8rem", color: "#888", fontVariantNumeric: "tabular-nums" }}>{count.toLocaleString()}</span>
            </div>
            <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: cfg.color,
                borderRadius: 3,
                transition: "width .5s ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
