"use client";
import { useState } from "react";
import { Download, Calendar } from "lucide-react";

const modelData = [
  { partner: "TechStar Solutions", equalSplit: 20, firstTouch: 35, lastTouch: 42, timeDecay: 31, roleBased: 28, totalRevenue: 124500 },
  { partner: "CloudBridge Partners", equalSplit: 20, firstTouch: 25, lastTouch: 18, timeDecay: 22, roleBased: 19, totalRevenue: 89000 },
  { partner: "FinTech Allies", equalSplit: 20, firstTouch: 15, lastTouch: 20, timeDecay: 18, roleBased: 28, totalRevenue: 67000 },
  { partner: "InnovateCo", equalSplit: 20, firstTouch: 10, lastTouch: 12, timeDecay: 16, roleBased: 15, totalRevenue: 45000 },
  { partner: "DataPipe Agency", equalSplit: 20, firstTouch: 15, lastTouch: 8, timeDecay: 13, roleBased: 10, totalRevenue: 38000 },
];
const trend = [
  { month: "Sep", revenue: 18000 }, { month: "Oct", revenue: 32000 }, { month: "Nov", revenue: 45000 },
  { month: "Dec", revenue: 52000 }, { month: "Jan", revenue: 78000 }, { month: "Feb", revenue: 59500 },
];

export default function ReportsPage() {
  const [selectedModel, setSelectedModel] = useState("roleBased");
  const maxRev = Math.max(...trend.map((t) => t.revenue));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Reports</h1><p className="text-sm text-gray-500 mt-1">Attribution analytics & insights</p></div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Last 6 months</span></div>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="equalSplit">Equal Split</option><option value="firstTouch">First Touch</option><option value="lastTouch">Last Touch</option><option value="timeDecay">Time Decay</option><option value="roleBased">Role-Based</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Partner Revenue Trend</h3></div>
        <div className="p-6">
          <div className="flex items-end gap-3 h-48">
            {trend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-900 tabular-nums">${(m.revenue / 1000).toFixed(0)}k</span>
                <div className="w-full flex items-end" style={{ height: "140px" }}>
                  <div className="w-full bg-primary-500 rounded-t-lg hover:bg-primary-600 transition" style={{ height: `${(m.revenue / maxRev) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Attribution Model Comparison</h3>
          <p className="text-xs text-gray-500 mt-1">Credit distribution under each model (%)</p>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Partner</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Equal</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">First</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Last</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Decay</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Role</th>
            <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Revenue</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {modelData.map((r) => (
              <tr key={r.partner} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.partner}</td>
                <td className="px-6 py-4 text-right text-sm tabular-nums text-gray-600">{r.equalSplit}%</td>
                <td className="px-6 py-4 text-right text-sm tabular-nums text-gray-600">{r.firstTouch}%</td>
                <td className="px-6 py-4 text-right text-sm tabular-nums text-gray-600">{r.lastTouch}%</td>
                <td className="px-6 py-4 text-right text-sm tabular-nums text-gray-600">{r.timeDecay}%</td>
                <td className="px-6 py-4 text-right text-sm tabular-nums font-medium text-primary-600">{r.roleBased}%</td>
                <td className="px-6 py-4 text-right text-sm font-medium tabular-nums">${r.totalRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200 p-5">
          <p className="text-xs font-medium text-primary-600">💡 Insight</p>
          <p className="text-sm text-primary-900 mt-2"><strong>TechStar</strong> dominates Last Touch (42%) — they close deals.</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 p-5">
          <p className="text-xs font-medium text-amber-600">⚡ Opportunity</p>
          <p className="text-sm text-amber-900 mt-2"><strong>FinTech Allies</strong> scores high in Role-Based (28%) despite fewer deals.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-5">
          <p className="text-xs font-medium text-emerald-600">📈 Growth</p>
          <p className="text-sm text-emerald-900 mt-2">Revenue up <strong>333%</strong> over 6 months. January peaked at $78k.</p>
        </div>
      </div>
    </div>
  );
}
