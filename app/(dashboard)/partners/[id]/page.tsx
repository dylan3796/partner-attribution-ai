"use client";

import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, formatPercent, getTouchpointColor } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MODEL_LABELS, TOUCHPOINT_LABELS, PARTNER_TYPE_LABELS, type AttributionModel } from "@/lib/types";
import { MODEL_COLORS } from "@/lib/utils";
import {
  ArrowLeft,
  DollarSign,
  Briefcase,
  Percent,
  PiggyBank,
  Mail,
  Calendar,
} from "lucide-react";
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

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPartner, getTouchpointsByPartner, getAttributionsByPartner, deals } = useStore();

  const partner = getPartner(id);
  const touchpoints = getTouchpointsByPartner(id);
  const allAttributions = getAttributionsByPartner(id);

  if (!partner) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Partner not found</p>
        <Link href="/dashboard/partners" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
          Back to partners
        </Link>
      </div>
    );
  }

  // Stats
  const uniqueDeals = [...new Set(touchpoints.map((tp) => tp.dealId))];
  const equalSplitAttrs = allAttributions.filter((a) => a.model === "equal_split");
  const totalRevenue = equalSplitAttrs.reduce((s, a) => s + a.amount, 0);
  const totalCommission = equalSplitAttrs.reduce((s, a) => s + a.commissionAmount, 0);
  const avgPct = equalSplitAttrs.length > 0
    ? equalSplitAttrs.reduce((s, a) => s + a.percentage, 0) / equalSplitAttrs.length
    : 0;

  // Attribution by model chart
  const models: AttributionModel[] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];
  const modelData = models.map((model) => {
    const attrs = allAttributions.filter((a) => a.model === model);
    return {
      model: MODEL_LABELS[model],
      revenue: Math.round(attrs.reduce((s, a) => s + a.amount, 0)),
      commission: Math.round(attrs.reduce((s, a) => s + a.commissionAmount, 0)),
    };
  });

  // Touchpoints sorted by date
  const sortedTouchpoints = [...touchpoints].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/partners"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Partners
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar name={partner.name} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
              <StatusBadge status={partner.status} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {partner.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {formatDate(partner.createdAt)}
              </span>
            </div>
          </div>
          <Badge variant="info">{PARTNER_TYPE_LABELS[partner.type]}</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attributed Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Equal split model"
          icon={DollarSign}
        />
        <StatCard
          title="Total Commission"
          value={formatCurrency(totalCommission)}
          subtitle={`${partner.commissionRate}% rate`}
          icon={PiggyBank}
        />
        <StatCard
          title="Deals Involved"
          value={String(uniqueDeals.length)}
          subtitle={`${touchpoints.length} touchpoints`}
          icon={Briefcase}
        />
        <StatCard
          title="Avg Attribution"
          value={formatPercent(avgPct)}
          subtitle="Equal split avg"
          icon={Percent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribution by Model */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Attribution Model</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="model"
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
                  formatter={(value: number, name: string) => [formatCurrency(value), name === "revenue" ? "Revenue" : "Commission"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" name="Commission" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Touchpoint History */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Touchpoint History ({touchpoints.length})
          </h3>
          <div className="space-y-0 max-h-72 overflow-y-auto">
            {sortedTouchpoints.map((tp, i) => {
              const deal = deals.find((d) => d._id === tp.dealId);
              return (
                <div key={tp._id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    {i < sortedTouchpoints.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getTouchpointColor(tp.type)}`}>
                        {TOUCHPOINT_LABELS[tp.type]}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(tp.createdAt)}</span>
                    </div>
                    {deal && (
                      <Link
                        href={`/dashboard/deals/${deal._id}`}
                        className="text-sm text-gray-700 hover:text-indigo-600"
                      >
                        {deal.name}
                      </Link>
                    )}
                    {tp.notes && <p className="text-xs text-gray-400 mt-0.5">{tp.notes}</p>}
                  </div>
                </div>
              );
            })}
            {sortedTouchpoints.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No touchpoints recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Attribution Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Attribution Breakdown by Deal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Deal</th>
                {models.map((m) => (
                  <th key={m} className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                    {MODEL_LABELS[m]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...new Set(allAttributions.map((a) => a.dealId))].map((dealId) => {
                const deal = deals.find((d) => d._id === dealId);
                return (
                  <tr key={dealId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      <Link href={`/dashboard/deals/${dealId}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                        {deal?.name || dealId}
                      </Link>
                      <p className="text-xs text-gray-400">{formatCurrency(deal?.amount || 0)}</p>
                    </td>
                    {models.map((model) => {
                      const attr = allAttributions.find((a) => a.dealId === dealId && a.model === model);
                      return (
                        <td key={model} className="px-4 py-3 text-right">
                          {attr ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{formatPercent(attr.percentage)}</p>
                              <p className="text-xs text-gray-400">{formatCurrency(attr.amount)}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
