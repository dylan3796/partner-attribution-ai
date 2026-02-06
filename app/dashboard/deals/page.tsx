"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

const deals = [
  { id: "1", name: "Acme Corp Enterprise", amount: 48000, status: "won", partner: "TechStar Solutions", touchpoints: 4, closedAt: "2026-02-05" },
  { id: "2", name: "GlobalTech Migration", amount: 32000, status: "open", partner: "CloudBridge Partners", touchpoints: 2, closedAt: null },
  { id: "3", name: "Startup Suite Bundle", amount: 12500, status: "won", partner: "InnovateCo", touchpoints: 1, closedAt: "2026-01-28" },
  { id: "4", name: "DataFlow Integration", amount: 85000, status: "open", partner: "DataPipe Agency", touchpoints: 3, closedAt: null },
  { id: "5", name: "SecureNet Rollout", amount: 23000, status: "lost", partner: "CyberShield Partners", touchpoints: 2, closedAt: "2026-02-01" },
  { id: "6", name: "FinServ Platform Deal", amount: 67000, status: "won", partner: "FinTech Allies", touchpoints: 5, closedAt: "2026-02-04" },
  { id: "7", name: "RetailPro Onboarding", amount: 41000, status: "open", partner: "TechStar Solutions", touchpoints: 2, closedAt: null },
  { id: "8", name: "HealthTech Suite", amount: 56000, status: "open", partner: "CloudBridge Partners", touchpoints: 1, closedAt: null },
];

export default function DealsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const filtered = deals.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.partner.toLowerCase().includes(search.toLowerCase()));
  const open = filtered.filter((d) => d.status === "open");
  const won = filtered.filter((d) => d.status === "won");
  const lost = filtered.filter((d) => d.status === "lost");

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Deals</h1><p className="text-sm text-gray-500 mt-1">Track your partner-sourced pipeline</p></div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"><Plus className="w-4 h-4" /> New Deal</button>
      </div>
      <div className="flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setView("pipeline")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === "pipeline" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Pipeline</button>
          <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Table</button>
        </div>
      </div>

      {view === "pipeline" ? (
        <div className="grid grid-cols-3 gap-4">
          <Column title="Open" deals={open} color="text-gray-900" />
          <Column title="Won" deals={won} color="text-emerald-700" />
          <Column title="Lost" deals={lost} color="text-red-700" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Deal</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Partner</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
              <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4"><Link href={`/dashboard/deals/${d.id}`} className="text-sm font-medium text-gray-900">{d.name}</Link></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{d.partner}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${d.status === "won" ? "bg-emerald-50 text-emerald-700" : d.status === "open" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>{d.status}</span></td>
                  <td className="px-6 py-4 text-right text-sm font-medium tabular-nums">${d.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Column({ title, deals, color }: { title: string; deals: typeof deals; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${color}`}>{title} <span className="text-gray-400 font-normal">({deals.length})</span></h3>
        <span className="text-xs font-medium text-gray-500">${(deals.reduce((s, d) => s + d.amount, 0) / 1000).toFixed(0)}k</span>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition cursor-pointer mb-3">
              <p className="text-sm font-medium text-gray-900">{deal.name}</p>
              <p className="text-xs text-gray-500 mt-1">{deal.partner}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-gray-900 tabular-nums">${deal.amount.toLocaleString()}</span>
                <span className="text-xs text-gray-400">{deal.touchpoints} touchpoints</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
