"use client";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar } from "lucide-react";

const partner = { id: "1", name: "TechStar Solutions", email: "partners@techstar.io", type: "Reseller", status: "active", commissionRate: 10, createdAt: "2025-09-15", revenue: 124500, deals: 8, commission: 12450 };
const touchpoints = [
  { date: "2026-02-05", deal: "Acme Corp Enterprise", type: "Demo", weight: 25 },
  { date: "2026-02-03", deal: "Acme Corp Enterprise", type: "Referral", weight: 30 },
  { date: "2026-01-28", deal: "FinServ Platform Deal", type: "Introduction", weight: 10 },
  { date: "2026-01-20", deal: "FinServ Platform Deal", type: "Proposal", weight: 25 },
  { date: "2026-01-15", deal: "DataFlow Integration", type: "Negotiation", weight: 20 },
];
const attributions = [
  { deal: "Acme Corp Enterprise", amount: 48000, pct: 65, commission: 3120 },
  { deal: "FinServ Platform Deal", amount: 67000, pct: 45, commission: 3015 },
  { deal: "Startup Suite Bundle", amount: 12500, pct: 100, commission: 1250 },
];
const typeColors: Record<string, string> = { Referral: "bg-purple-50 text-purple-700", Demo: "bg-blue-50 text-blue-700", Introduction: "bg-amber-50 text-amber-700", Proposal: "bg-emerald-50 text-emerald-700", Negotiation: "bg-pink-50 text-pink-700" };

export default function PartnerDetailPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/partners" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"><ArrowLeft className="w-4 h-4" /> Back to Partners</Link>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">{partner.status}</span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {partner.email}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {partner.createdAt}</span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">{partner.type}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Attributed Revenue", value: `$${(partner.revenue / 1000).toFixed(1)}k` },
          { label: "Deals Involved", value: partner.deals },
          { label: "Commission Earned", value: `$${partner.commission.toLocaleString()}`, green: true },
          { label: "Commission Rate", value: `${partner.commissionRate}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.green ? "text-emerald-600" : "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Touchpoint History</h3></div>
          <div className="divide-y divide-gray-100">
            {touchpoints.map((tp, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div><p className="text-sm font-medium text-gray-900">{tp.deal}</p><p className="text-xs text-gray-500">{tp.date}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[tp.type] || "bg-gray-100 text-gray-600"}`}>{tp.type}</span>
                  <span className="text-xs text-gray-400 tabular-nums">{tp.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Attribution Results</h3></div>
          <div className="divide-y divide-gray-100">
            {attributions.map((attr, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{attr.deal}</p>
                  <span className="text-sm font-bold text-primary-600">{attr.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2"><div className="bg-primary-500 h-2 rounded-full" style={{ width: `${attr.pct}%` }} /></div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Deal: ${attr.amount.toLocaleString()}</span>
                  <span className="text-emerald-600 font-medium">Commission: ${attr.commission.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
