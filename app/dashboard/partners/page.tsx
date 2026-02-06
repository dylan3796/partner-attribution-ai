"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";

const partners = [
  { id: "1", name: "TechStar Solutions", email: "partners@techstar.io", type: "Reseller", status: "active", revenue: 124500, deals: 8, commission: 12450 },
  { id: "2", name: "CloudBridge Partners", email: "hello@cloudbridge.com", type: "Referral", status: "active", revenue: 89000, deals: 5, commission: 8900 },
  { id: "3", name: "FinTech Allies", email: "team@fintechallies.co", type: "Alliance", status: "active", revenue: 67000, deals: 4, commission: 6700 },
  { id: "4", name: "InnovateCo", email: "biz@innovateco.dev", type: "Affiliate", status: "active", revenue: 45000, deals: 6, commission: 4500 },
  { id: "5", name: "DataPipe Agency", email: "info@datapipe.agency", type: "Integration", status: "active", revenue: 38000, deals: 3, commission: 3800 },
  { id: "6", name: "CyberShield Partners", email: "sales@cybershield.net", type: "Reseller", status: "inactive", revenue: 12000, deals: 1, commission: 1200 },
  { id: "7", name: "GrowthLab Consulting", email: "partners@growthlab.co", type: "Referral", status: "pending", revenue: 0, deals: 0, commission: 0 },
];

const typeColors: Record<string, string> = { Reseller: "bg-blue-50 text-blue-700", Referral: "bg-purple-50 text-purple-700", Alliance: "bg-amber-50 text-amber-700", Affiliate: "bg-emerald-50 text-emerald-700", Integration: "bg-pink-50 text-pink-700" };
const statusColors: Record<string, string> = { active: "bg-emerald-50 text-emerald-700", inactive: "bg-gray-100 text-gray-500", pending: "bg-amber-50 text-amber-700" };

export default function PartnersPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your partner network</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">New Partner</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Partner name" className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <input type="email" placeholder="Email" className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <select className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option>Reseller</option><option>Referral</option><option>Alliance</option><option>Affiliate</option><option>Integration</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">Create Partner</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500">Total Partners</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{partners.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500">Total Attributed Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${(partners.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500">Total Commissions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${(partners.reduce((s, p) => s + p.commission, 0) / 1000).toFixed(1)}k</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Partner</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
              <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Revenue</th>
              <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Deals</th>
              <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Commission</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-6 py-4">
                  <Link href={`/dashboard/partners/${partner.id}`}>
                    <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                    <p className="text-xs text-gray-500">{partner.email}</p>
                  </Link>
                </td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[partner.type]}`}>{partner.type}</span></td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[partner.status]}`}>{partner.status}</span></td>
                <td className="px-6 py-4 text-right text-sm font-medium tabular-nums">${partner.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">{partner.deals}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-emerald-600 tabular-nums">${partner.commission.toLocaleString()}</td>
                <td className="px-3 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
