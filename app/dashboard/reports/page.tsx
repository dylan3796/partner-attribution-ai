"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatPercent, MODEL_COLORS, CHART_COLORS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MODEL_LABELS, type AttributionModel } from "@/lib/types";
import { Download, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MODELS: AttributionModel[] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];

export default function ReportsPage() {
  const { attributions, partners } = useStore();
  const [selectedModel, setSelectedModel] = useState<AttributionModel>("equal_split");
  const [sortBy, setSortBy] = useState<"revenue" | "commission" | "deals">("revenue");

  // Aggregate by partner per model
  const partnerModelData = useMemo(() => {
    const data: Record<string, Record<string, { revenue: number; commission: number; deals: Set<string>; pct: number; count: number }>> = {};
    attributions.forEach((a) => {
      const partner = partners.find((p) => p._id === a.partnerId);
      if (!partner) return;
      if (!data[a.partnerId]) data[a.partnerId] = {};
      if (!data[a.partnerId][a.model]) data[a.partnerId][a.model] = { revenue: 0, commission: 0, deals: new Set(), pct: 0, count: 0 };
      const entry = data[a.partnerId][a.model];
      entry.revenue += a.amount;
      entry.commission += a.commissionAmount;
      entry.deals.add(a.dealId);
      entry.pct += a.percentage;
      entry.count += 1;
    });
    return data;
  }, [attributions, partners]);

  // Selected model leaderboard
  const leaderboard = useMemo(() => {
    return Object.entries(partnerModelData)
      .map(([partnerId, models]) => {
        const partner = partners.find((p) => p._id === partnerId);
        const data = models[selectedModel];
        if (!data || !partner) return null;
        return {
          partnerId,
          name: partner.name,
          type: partner.type,
          revenue: Math.round(data.revenue),
          commission: Math.round(data.commission),
          deals: data.deals.size,
          avgPct: data.count > 0 ? data.pct / data.count : 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === "commission") return b.commission - a.commission;
        if (sortBy === "deals") return b.deals - a.deals;
        return b.revenue - a.revenue;
      }) as NonNullable<ReturnType<typeof Object.entries>[0]>[];
  }, [partnerModelData, selectedModel, partners, sortBy]) as Array<{
    partnerId: string; name: string; type: string; revenue: number; commission: number; deals: number; avgPct: number;
  }>;

  // Model comparison
  const modelComparison = useMemo(() => {
    const totals: Record<string, { revenue: number; commission: number; deals: Set<string> }> = {};
    MODELS.forEach((m) => (totals[m] = { revenue: 0, commission: 0, deals: new Set() }));
    attributions.forEach((a) => {
      totals[a.model].revenue += a.amount;
      totals[a.model].commission += a.commissionAmount;
      totals[a.model].deals.add(a.dealId);
    });
    return MODELS.map((m) => ({
      model: m,
      label: MODEL_LABELS[m],
      revenue: Math.round(totals[m].revenue),
      commission: Math.round(totals[m].commission),
      deals: totals[m].deals.size,
    }));
  }, [attributions]);

  // Radar data
  const radarData = useMemo(() => {
    return MODELS.map((model) => {
      const entry: Record<string, string | number> = { model: MODEL_LABELS[model] };
      Object.entries(partnerModelData).forEach(([partnerId, models]) => {
        const partner = partners.find((p) => p._id === partnerId);
        if (!partner || !models[model]) return;
        entry[partner.name] = Math.round(models[model].revenue);
      });
      return entry;
    });
  }, [partnerModelData, partners]);

  const partnerNames = useMemo(() => {
    return partners.filter((p) => partnerModelData[p._id]).map((p) => p.name).slice(0, 5);
  }, [partners, partnerModelData]);

  // Pie data
  const pieData = leaderboard.slice(0, 6).map((p) => ({ name: p.name, value: p.revenue }));

  function handleExport() {
    const headers = ["Partner", "Type", "Revenue", "Commission", "Deals", "Avg Attribution %"];
    const rows = leaderboard.map((p) => [p.name, p.type, p.revenue, p.commission, p.deals, p.avgPct.toFixed(2)]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attribution-report-${selectedModel}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attribution Reports</h1>
          <p className="text-gray-500 mt-1">Compare attribution models and analyze partner performance</p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Model Overview Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Model Comparison — Total Revenue</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: any, name: any) => [formatCurrency(value), name === "revenue" ? "Revenue" : "Commission"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                {modelComparison.map((entry) => <Cell key={entry.model} fill={MODEL_COLORS[entry.model]} />)}
              </Bar>
              <Bar dataKey="commission" name="Commission" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Partner Revenue Across Models</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="model" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                {partnerNames.map((name, i) => (
                  <Radar key={name} name={name} dataKey={name} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.1} />
                ))}
                <Legend />
                <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Split — {MODEL_LABELS[selectedModel]}</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-xs text-gray-600 truncate">{item.name}</span>
                  <span className="text-xs font-semibold text-gray-900 ml-auto">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model selector + Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-gray-50 gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Partner Leaderboard</h3>
          <div className="flex items-center gap-3">
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as AttributionModel)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
              {MODELS.map((m) => <option key={m} value={m}>{MODEL_LABELS[m]}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none">
              <option value="revenue">Sort by Revenue</option>
              <option value="commission">Sort by Commission</option>
              <option value="deals">Sort by Deals</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Partner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Commission</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Deals</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Avg %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboard.map((p, i) => (
                <tr key={p.partnerId} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} size="sm" />
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.type}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(p.revenue)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">{formatCurrency(p.commission)}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{p.deals}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">{formatPercent(p.avgPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <div className="py-12 text-center">
            <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No attribution data for this model</p>
          </div>
        )}
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {MODELS.map((model) => {
          const data = modelComparison.find((m) => m.model === model);
          return (
            <div
              key={model}
              className={`rounded-xl border p-5 cursor-pointer transition-all ${selectedModel === model ? "border-indigo-200 bg-indigo-50/30 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[model] }} />
                <h4 className="text-sm font-semibold text-gray-900">{MODEL_LABELS[model]}</h4>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(data?.revenue || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">{data?.deals || 0} deals · {formatCurrency(data?.commission || 0)} commission</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
