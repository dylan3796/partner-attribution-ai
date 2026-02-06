"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const deal = { name: "Acme Corp Enterprise", amount: 48000, status: "won", closedAt: "2026-02-05", createdAt: "2026-01-15" };
const touchpoints = [
  { partner: "TechStar Solutions", type: "Referral", date: "2026-01-15", weight: 30 },
  { partner: "CloudBridge Partners", type: "Introduction", date: "2026-01-20", weight: 10 },
  { partner: "TechStar Solutions", type: "Demo", date: "2026-01-28", weight: 25 },
  { partner: "TechStar Solutions", type: "Proposal", date: "2026-02-02", weight: 25 },
];
const models = [
  { name: "Equal Split", results: [{ partner: "TechStar Solutions", pct: 50, amount: 24000 }, { partner: "CloudBridge Partners", pct: 50, amount: 24000 }] },
  { name: "First Touch", results: [{ partner: "TechStar Solutions", pct: 100, amount: 48000 }] },
  { name: "Last Touch", results: [{ partner: "TechStar Solutions", pct: 100, amount: 48000 }] },
  { name: "Time Decay", results: [{ partner: "TechStar Solutions", pct: 78, amount: 37440 }, { partner: "CloudBridge Partners", pct: 22, amount: 10560 }] },
  { name: "Role-Based", results: [{ partner: "TechStar Solutions", pct: 89, amount: 42720 }, { partner: "CloudBridge Partners", pct: 11, amount: 5280 }] },
];
const dotColors: Record<string, string> = { Referral: "bg-purple-500", Introduction: "bg-amber-500", Demo: "bg-blue-500", Proposal: "bg-emerald-500" };

export default function DealDetailPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="w-4 h-4" /> Back to Deals</Link>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1></div>
            <p className="text-sm text-gray-500 mt-2">Created {deal.createdAt} · Closed {deal.closedAt}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">${deal.amount.toLocaleString()}</p>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mt-2 inline-block">{deal.status}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Touchpoint Timeline</h3></div>
        <div className="p-6">
          {touchpoints.map((tp, i) => (
            <div key={i} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${dotColors[tp.type] || "bg-gray-400"} shrink-0 mt-1`} />
                {i < touchpoints.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div><p className="text-sm font-medium text-gray-900">{tp.type}</p><p className="text-xs text-gray-500">{tp.partner} · {tp.date}</p></div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Weight: {tp.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Attribution Model Comparison</h3>
          <p className="text-xs text-gray-500 mt-1">See how different models distribute credit</p>
        </div>
        <div className="p-6 space-y-6">
          {models.map((model) => (
            <div key={model.name}>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{model.name}</h4>
              <div className="space-y-2">
                {model.results.map((r) => (
                  <div key={r.partner} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-48 truncate">{r.partner}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div className="bg-primary-500 h-full rounded-full" style={{ width: `${r.pct}%` }} /></div>
                    <span className="text-sm font-bold text-primary-600 w-12 text-right tabular-nums">{r.pct}%</span>
                    <span className="text-xs text-gray-500 w-20 text-right tabular-nums">${r.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
