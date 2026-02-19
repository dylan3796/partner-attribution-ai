"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ArrowUpDown,
  Target,
  DollarSign,
  Award,
  Zap,
  Clock,
  Star,
} from "lucide-react";

interface PartnerBenchmark {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  region: string;
  metrics: {
    revenue: number;
    deals: number;
    winRate: number;
    avgDealSize: number;
    avgCycleTime: number; // days
    certifications: number;
    nps: number;
    activationRate: number;
    yoyGrowth: number;
    pipelineValue: number;
  };
}

const PARTNERS: PartnerBenchmark[] = [
  {
    id: "P-101", name: "Cloudflare Solutions", tier: "Platinum", region: "North America",
    metrics: { revenue: 1850000, deals: 47, winRate: 68, avgDealSize: 39362, avgCycleTime: 28, certifications: 12, nps: 82, activationRate: 95, yoyGrowth: 34, pipelineValue: 2400000 },
  },
  {
    id: "P-102", name: "DataSync Partners", tier: "Gold", region: "EMEA",
    metrics: { revenue: 920000, deals: 31, winRate: 55, avgDealSize: 29677, avgCycleTime: 35, certifications: 8, nps: 71, activationRate: 82, yoyGrowth: 18, pipelineValue: 1100000 },
  },
  {
    id: "P-103", name: "TechBridge Inc", tier: "Silver", region: "APAC",
    metrics: { revenue: 410000, deals: 18, winRate: 44, avgDealSize: 22778, avgCycleTime: 42, certifications: 4, nps: 65, activationRate: 70, yoyGrowth: 12, pipelineValue: 580000 },
  },
  {
    id: "P-106", name: "Meridian Systems", tier: "Platinum", region: "North America",
    metrics: { revenue: 2100000, deals: 52, winRate: 72, avgDealSize: 40385, avgCycleTime: 25, certifications: 14, nps: 88, activationRate: 98, yoyGrowth: 41, pipelineValue: 3200000 },
  },
  {
    id: "P-108", name: "CloudFirst GmbH", tier: "Gold", region: "DACH",
    metrics: { revenue: 780000, deals: 24, winRate: 58, avgDealSize: 32500, avgCycleTime: 32, certifications: 7, nps: 74, activationRate: 85, yoyGrowth: 22, pipelineValue: 950000 },
  },
  {
    id: "P-109", name: "NexGen Consulting", tier: "Bronze", region: "North America",
    metrics: { revenue: 125000, deals: 8, winRate: 32, avgDealSize: 15625, avgCycleTime: 55, certifications: 2, nps: 52, activationRate: 45, yoyGrowth: -5, pipelineValue: 180000 },
  },
  {
    id: "P-110", name: "PivotPoint Analytics", tier: "Silver", region: "North America",
    metrics: { revenue: 340000, deals: 14, winRate: 48, avgDealSize: 24286, avgCycleTime: 38, certifications: 5, nps: 68, activationRate: 72, yoyGrowth: 15, pipelineValue: 420000 },
  },
  {
    id: "P-111", name: "Apex Digital LATAM", tier: "Silver", region: "LATAM",
    metrics: { revenue: 290000, deals: 16, winRate: 42, avgDealSize: 18125, avgCycleTime: 45, certifications: 3, nps: 60, activationRate: 65, yoyGrowth: 28, pipelineValue: 370000 },
  },
];

type MetricKey = keyof PartnerBenchmark["metrics"];

const METRIC_CONFIG: Record<MetricKey, { label: string; format: (v: number) => string; icon: typeof DollarSign; higherBetter: boolean }> = {
  revenue: { label: "Revenue", format: (v) => `$${(v / 1000).toFixed(0)}k`, icon: DollarSign, higherBetter: true },
  deals: { label: "Closed Deals", format: (v) => String(v), icon: Target, higherBetter: true },
  winRate: { label: "Win Rate", format: (v) => `${v}%`, icon: Award, higherBetter: true },
  avgDealSize: { label: "Avg Deal Size", format: (v) => `$${(v / 1000).toFixed(1)}k`, icon: BarChart3, higherBetter: true },
  avgCycleTime: { label: "Avg Cycle (days)", format: (v) => `${v}d`, icon: Clock, higherBetter: false },
  certifications: { label: "Certifications", format: (v) => String(v), icon: Star, higherBetter: true },
  nps: { label: "NPS Score", format: (v) => String(v), icon: Zap, higherBetter: true },
  activationRate: { label: "Activation Rate", format: (v) => `${v}%`, icon: TrendingUp, higherBetter: true },
  yoyGrowth: { label: "YoY Growth", format: (v) => `${v > 0 ? "+" : ""}${v}%`, icon: TrendingUp, higherBetter: true },
  pipelineValue: { label: "Pipeline Value", format: (v) => `$${(v / 1000000).toFixed(1)}M`, icon: DollarSign, higherBetter: true },
};

const TIER_COLORS = {
  Platinum: "text-violet-300 bg-violet-400/10",
  Gold: "text-amber-300 bg-amber-400/10",
  Silver: "text-zinc-300 bg-zinc-400/10",
  Bronze: "text-orange-300 bg-orange-400/10",
};

function BarViz({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BenchmarksPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(["revenue", "winRate", "avgDealSize", "yoyGrowth", "nps"]);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortMetric, setSortMetric] = useState<MetricKey>("revenue");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = PARTNERS
    .filter((p) => (tierFilter === "all" || p.tier === tierFilter) && (regionFilter === "all" || p.region === regionFilter))
    .sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      return (a.metrics[sortMetric] - b.metrics[sortMetric]) * dir;
    });

  const regions = [...new Set(PARTNERS.map((p) => p.region))];

  // Compute tier averages
  const tierAvgs = Object.fromEntries(
    ["Platinum", "Gold", "Silver", "Bronze"].map((tier) => {
      const tp = PARTNERS.filter((p) => p.tier === tier);
      if (!tp.length) return [tier, null];
      const avgs = Object.fromEntries(
        (Object.keys(METRIC_CONFIG) as MetricKey[]).map((k) => [k, tp.reduce((s, p) => s + p.metrics[k], 0) / tp.length])
      );
      return [tier, avgs];
    })
  );

  function toggleMetric(m: MetricKey) {
    setSelectedMetrics((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));
  }

  function handleSort(m: MetricKey) {
    if (sortMetric === m) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortMetric(m); setSortDir("desc"); }
  }

  const comparing = compareIds.length >= 2 ? PARTNERS.filter((p) => compareIds.includes(p.id)) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          Partner Benchmarks
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Compare partner performance across key metrics</p>
      </div>

      {/* Tier Averages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["Platinum", "Gold", "Silver", "Bronze"] as const).map((tier) => {
          const avg = tierAvgs[tier] as Record<string, number> | null;
          if (!avg) return null;
          return (
            <div key={tier} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${TIER_COLORS[tier]}`}>{tier} Avg</span>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Revenue</span>
                  <span className="text-zinc-300">${(avg.revenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Win Rate</span>
                  <span className="text-zinc-300">{avg.winRate.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Growth</span>
                  <span className={`${avg.yoyGrowth > 0 ? "text-green-400" : "text-red-400"}`}>
                    {avg.yoyGrowth > 0 ? "+" : ""}{avg.yoyGrowth.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Metric Toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none">
          <option value="all">All Tiers</option>
          {["Platinum", "Gold", "Silver", "Bronze"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none">
          <option value="all">All Regions</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="flex-1" />
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((m) => (
            <button
              key={m}
              onClick={() => toggleMetric(m)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                selectedMetrics.includes(m) ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {METRIC_CONFIG[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Banner */}
      {compareIds.length > 0 && compareIds.length < 2 && (
        <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg px-4 py-2 text-xs text-cyan-300">
          Select {2 - compareIds.length} more partner{compareIds.length === 0 ? "s" : ""} to compare (click checkboxes)
        </div>
      )}

      {/* Side-by-Side Comparison */}
      {comparing && (
        <div className="bg-zinc-900 border border-cyan-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-cyan-300">Side-by-Side Comparison</h2>
            <button onClick={() => setCompareIds([])} className="text-xs text-zinc-500 hover:text-zinc-300">Clear</button>
          </div>
          <div className="space-y-3">
            {selectedMetrics.map((m) => {
              const cfg = METRIC_CONFIG[m];
              const vals = comparing.map((p) => p.metrics[m]);
              const best = cfg.higherBetter ? Math.max(...vals) : Math.min(...vals);
              const maxBar = Math.max(...vals.map(Math.abs));
              return (
                <div key={m}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <cfg.icon className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-400">{cfg.label}</span>
                  </div>
                  <div className="space-y-1">
                    {comparing.map((p) => {
                      const isBest = p.metrics[m] === best;
                      return (
                        <div key={p.id} className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 w-32 truncate">{p.name}</span>
                          <div className="flex-1">
                            <BarViz value={Math.abs(p.metrics[m])} max={maxBar} color={isBest ? "bg-cyan-400" : "bg-zinc-600"} />
                          </div>
                          <span className={`text-xs font-mono w-16 text-right ${isBest ? "text-cyan-300 font-semibold" : "text-zinc-400"}`}>
                            {cfg.format(p.metrics[m])}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Region</th>
                {selectedMetrics.map((m) => (
                  <th key={m} className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort(m)}>
                    <span className="inline-flex items-center gap-1">
                      {METRIC_CONFIG[m].label}
                      {sortMetric === m && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((p, i) => {
                const isComparing = compareIds.includes(p.id);
                return (
                  <tr key={p.id} className={`hover:bg-zinc-800/30 transition-colors ${isComparing ? "bg-cyan-500/5" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => toggleCompare(p.id)}
                        className="rounded bg-zinc-800 border-zinc-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                          {i + 1}
                        </div>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${TIER_COLORS[p.tier]}`}>{p.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{p.region}</td>
                    {selectedMetrics.map((m) => {
                      const cfg = METRIC_CONFIG[m];
                      const allVals = filtered.map((x) => x.metrics[m]);
                      const best = cfg.higherBetter ? Math.max(...allVals) : Math.min(...allVals);
                      const worst = cfg.higherBetter ? Math.min(...allVals) : Math.max(...allVals);
                      const isBest = p.metrics[m] === best;
                      const isWorst = p.metrics[m] === worst && filtered.length > 2;
                      return (
                        <td key={m} className="px-4 py-3">
                          <span className={`text-sm font-mono ${isBest ? "text-cyan-300 font-semibold" : isWorst ? "text-red-400" : "text-zinc-300"}`}>
                            {cfg.format(p.metrics[m])}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No partners match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
