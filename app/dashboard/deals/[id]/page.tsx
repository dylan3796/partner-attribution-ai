"use client";

import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, formatPercent, getTouchpointColor, MODEL_COLORS } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MODEL_LABELS, TOUCHPOINT_LABELS, type AttributionModel } from "@/lib/types";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
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

const MODELS: AttributionModel[] = ["equal_split", "first_touch", "last_touch", "time_decay", "role_based"];

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getDeal, getTouchpointsByDeal, getAttributionsByDeal, partners } = useStore();

  const deal = getDeal(id);
  const touchpoints = getTouchpointsByDeal(id);
  const allAttributions = getAttributionsByDeal(id);

  if (!deal) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Deal not found</p>
        <Link href="/dashboard/deals" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Back to deals</Link>
      </div>
    );
  }

  const partnerIds = [...new Set(touchpoints.map((tp) => tp.partnerId))];
  const involvedPartners = partnerIds.map((pid) => partners.find((p) => p._id === pid)).filter(Boolean);

  const timeline = [...touchpoints].sort((a, b) => a.createdAt - b.createdAt);

  // Attribution comparison data
  const partnerModels: Record<string, Record<string, number>> = {};
  allAttributions.forEach((a) => {
    const partner = partners.find((p) => p._id === a.partnerId);
    const name = partner?.name || "Unknown";
    if (!partnerModels[name]) partnerModels[name] = {};
    partnerModels[name][a.model] = a.percentage;
  });

  const comparisonData = Object.entries(partnerModels).map(([name, models]) => ({
    name: name.split(" ")[0],
    fullName: name,
    ...models,
  }));

  const statusIcon = deal.status === "won" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    : deal.status === "lost" ? <XCircle className="h-5 w-5 text-red-500" />
    : <Clock className="h-5 w-5 text-indigo-500" />;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Back + Header */}
      <div>
        <Link href="/dashboard/deals" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Deals
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {statusIcon}
              <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{formatCurrency(deal.amount)}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Created {formatDate(deal.createdAt)}</span>
              {deal.closedAt && <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Closed {formatDate(deal.closedAt)}</span>}
            </div>
          </div>
          <StatusBadge status={deal.status} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Deal Value" value={formatCurrency(deal.amount)} icon={DollarSign} />
        <StatCard title="Partners Involved" value={String(involvedPartners.length)} subtitle={`${touchpoints.length} touchpoints`} icon={Users} />
        <StatCard
          title="Timeline"
          value={timeline.length > 1 ? `${Math.ceil((timeline[timeline.length - 1].createdAt - timeline[0].createdAt) / 86400000)} days` : "—"}
          subtitle="First to last touch"
          icon={Clock}
        />
        <StatCard
          title="Status"
          value={deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          subtitle={deal.closedAt ? formatDate(deal.closedAt) : "In progress"}
          icon={deal.status === "won" ? CheckCircle2 : deal.status === "lost" ? XCircle : Clock}
        />
      </div>

      {/* Touchpoint Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Touchpoint Timeline</h3>
        {timeline.length > 0 ? (
          <div className="relative">
            {timeline.length > 1 && <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />}
            <div className="flex gap-0 overflow-x-auto pb-2">
              {timeline.map((tp) => {
                const partner = partners.find((p) => p._id === tp.partnerId);
                return (
                  <div key={tp._id} className="flex-1 min-w-[160px] relative px-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center relative z-10">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getTouchpointColor(tp.type)}`}>
                          {TOUCHPOINT_LABELS[tp.type]}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1.5">{partner?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(tp.createdAt)}</p>
                        {tp.notes && <p className="text-xs text-gray-400 mt-1 max-w-[140px] truncate">{tp.notes}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No touchpoints recorded</p>
        )}
      </div>

      {/* Attribution Results (only for won deals) */}
      {deal.status === "won" && allAttributions.length > 0 && (
        <>
          {/* Model Comparison Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Attribution Model Comparison</h3>
            <p className="text-xs text-gray-400 mb-6">How each model attributes credit for this {formatCurrency(deal.amount)} deal</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, MODEL_LABELS[name as AttributionModel] || name]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Legend formatter={(value: string) => MODEL_LABELS[value as AttributionModel] || value} />
                  {MODELS.map((model) => (
                    <Bar key={model} dataKey={model} name={model} fill={MODEL_COLORS[model]} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Model Cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Model Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {MODELS.map((model) => {
                const modelAttrs = allAttributions.filter((a) => a.model === model);
                return (
                  <div key={model} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[model] }} />
                      <h4 className="text-sm font-semibold text-gray-900">{MODEL_LABELS[model]}</h4>
                    </div>
                    <div className="space-y-3">
                      {modelAttrs.sort((a, b) => b.percentage - a.percentage).map((attr) => {
                        const partner = partners.find((p) => p._id === attr.partnerId);
                        return (
                          <div key={attr._id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">{partner?.name?.split(" ")[0]}</span>
                              <span className="text-xs font-semibold text-gray-900">{formatPercent(attr.percentage)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="h-full rounded-full" style={{ width: `${attr.percentage}%`, backgroundColor: MODEL_COLORS[model] }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(attr.amount)}</p>
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
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Full Attribution & Commission Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Partner</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Model</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">%</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allAttributions
                    .sort((a, b) => a.partnerId !== b.partnerId ? a.partnerId.localeCompare(b.partnerId) : MODELS.indexOf(a.model) - MODELS.indexOf(b.model))
                    .map((attr) => {
                      const partner = partners.find((p) => p._id === attr.partnerId);
                      return (
                        <tr key={attr._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={partner?.name || "?"} size="sm" />
                              <span className="text-sm font-medium text-gray-900">{partner?.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MODEL_COLORS[attr.model] }} />
                              <span className="text-sm text-gray-700">{MODEL_LABELS[attr.model]}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{formatPercent(attr.percentage)}</td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">{formatCurrency(attr.amount)}</td>
                          <td className="px-6 py-3 text-right text-sm font-medium text-emerald-600">{formatCurrency(attr.commissionAmount)}</td>
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
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Partners Involved</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {involvedPartners.map((partner) => {
            if (!partner) return null;
            const pTouchpoints = touchpoints.filter((tp) => tp.partnerId === partner._id);
            return (
              <Link key={partner._id} href={`/dashboard/partners/${partner._id}`} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <Avatar name={partner.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{partner.name}</p>
                  <p className="text-xs text-gray-400">{pTouchpoints.length} touchpoints · {partner.commissionRate}% rate</p>
                </div>
                <StatusBadge status={partner.status} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
