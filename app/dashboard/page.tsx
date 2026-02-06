"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  ArrowRight,
  Target,
  Percent,
  PiggyBank,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CHART_COLORS, MODEL_COLORS } from "@/lib/utils";
import { MODEL_LABELS, type AttributionModel } from "@/lib/types";

export default function DashboardPage() {
  const { stats, deals, partners, attributions, org } = useStore();

  // Top partners by attributed revenue (equal_split model)
  const partnerRevenueMap: Record<string, { name: string; revenue: number; deals: number }> = {};
  attributions
    .filter((a) => a.model === "equal_split")
    .forEach((a) => {
      const partner = partners.find((p) => p._id === a.partnerId);
      if (!partner) return;
      if (!partnerRevenueMap[a.partnerId]) {
        partnerRevenueMap[a.partnerId] = { name: partner.name, revenue: 0, deals: 0 };
      }
      partnerRevenueMap[a.partnerId].revenue += a.amount;
      partnerRevenueMap[a.partnerId].deals += 1;
    });

  const topPartners = Object.entries(partnerRevenueMap)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue by deal for chart
  const wonDeals = deals
    .filter((d) => d.status === "won")
    .sort((a, b) => (a.closedAt || a.createdAt) - (b.closedAt || b.createdAt))
    .map((d) => ({
      name: d.name.length > 20 ? d.name.slice(0, 18) + "…" : d.name,
      revenue: d.amount,
    }));

  // Attribution model distribution
  const modelTotals: Record<string, number> = {};
  attributions.forEach((a) => {
    modelTotals[a.model] = (modelTotals[a.model] || 0) + a.amount;
  });
  // Deduplicate — each deal is counted multiple times (once per model), so divide by unique deals
  const uniqueModels = [...new Set(attributions.map((a) => a.model))];
  const pieData = uniqueModels.map((model) => ({
    name: MODEL_LABELS[model as AttributionModel],
    value: Math.round(modelTotals[model]),
    model,
  }));

  // Recent deals (last 5)
  const recentDeals = [...deals].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  // Deal status distribution for chart
  const dealStatusData = [
    { name: "Open", value: stats.openDeals, fill: "#6366f1" },
    { name: "Won", value: stats.wonDeals, fill: "#10b981" },
    { name: "Lost", value: stats.lostDeals, fill: "#ef4444" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {org?.name}. Here&apos;s your partner attribution overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle={`${stats.wonDeals} won deals`}
          icon={DollarSign}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          subtitle={`${stats.openDeals} open deals`}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Partners"
          value={String(stats.activePartners)}
          subtitle={`${stats.totalPartners} total`}
          icon={Users}
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          subtitle={`${stats.totalDeals} total deals`}
          icon={Target}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Deal */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Won Deal Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wonDeals} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deal Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Deal Pipeline</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dealStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dealStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 pr-4 min-w-fit">
              {dealStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Deals */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Recent Deals</h3>
            <Link
              href="/dashboard/deals"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDeals.map((deal) => (
              <Link
                key={deal._id}
                href={`/dashboard/deals/${deal._id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{deal.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(deal.createdAt)}</p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(deal.amount)}
                </div>
                <StatusBadge status={deal.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Top Partners */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Top Partners</h3>
            <Link
              href="/dashboard/partners"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topPartners.map((p, i) => (
              <Link
                key={p.id}
                href={`/dashboard/partners/${p.id}`}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-300 w-4">#{i + 1}</span>
                <Avatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.deals} deals</p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(p.revenue)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
