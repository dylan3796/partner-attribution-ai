"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Briefcase,
  ArrowUpRight,
  LayoutGrid,
  List,
} from "lucide-react";

export default function DealsPage() {
  const { deals, addDeal, touchpoints } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"table" | "pipeline">("pipeline");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formName, setFormName] = useState("");
  const [formAmount, setFormAmount] = useState("");

  const filtered = useMemo(() => {
    return deals
      .filter((d) => {
        if (statusFilter !== "all" && d.status !== statusFilter) return false;
        if (search) return d.name.toLowerCase().includes(search.toLowerCase());
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [deals, search, statusFilter]);

  const open = filtered.filter((d) => d.status === "open");
  const won = filtered.filter((d) => d.status === "won");
  const lost = filtered.filter((d) => d.status === "lost");

  function getTouchpointCount(dealId: string) {
    return touchpoints.filter((tp) => tp.dealId === dealId).length;
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addDeal({ name: formName, amount: parseFloat(formAmount) });
    setShowAddModal(false);
    setFormName("");
    setFormAmount("");
  }

  function DealCard({ deal }: { deal: (typeof deals)[0] }) {
    const tpCount = getTouchpointCount(deal._id);
    return (
      <Link
        href={`/dashboard/deals/${deal._id}`}
        className="block bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
      >
        <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{deal.name}</p>
        <p className="text-lg font-semibold text-gray-900 mb-2">{formatCurrency(deal.amount)}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{formatDate(deal.createdAt)}</span>
          {tpCount > 0 && <span className="text-xs text-indigo-600 font-medium">{tpCount} touchpoints</span>}
        </div>
      </Link>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">
            {deals.length} deals · {formatCurrency(deals.filter((d) => d.status === "open").reduce((s, d) => s + d.amount, 0))} pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("pipeline")}
              className={cn("p-2 transition-colors", view === "pipeline" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn("p-2 transition-colors", view === "table" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> New Deal
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        {view === "table" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        )}
      </div>

      {/* Pipeline View */}
      {view === "pipeline" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { items: open, label: "Open", color: "bg-indigo-500", totalColor: "text-gray-500" },
            { items: won, label: "Won", color: "bg-emerald-500", totalColor: "text-emerald-600" },
            { items: lost, label: "Lost", color: "bg-red-500", totalColor: "text-red-500" },
          ].map(({ items, label, color, totalColor }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{items.length}</span>
                </div>
                <span className={`text-xs font-medium ${totalColor}`}>
                  {formatCurrency(items.reduce((s, d) => s + d.amount, 0))}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((deal) => <DealCard key={deal._id} deal={deal} />)}
                {items.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                    <p className="text-sm text-gray-400">No {label.toLowerCase()} deals</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Touchpoints</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((deal) => (
                  <tr key={deal._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/deals/${deal._id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">{deal.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{formatCurrency(deal.amount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={deal.status} /></td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">{getTouchpointCount(deal._id)}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">{formatDate(deal.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/deals/${deal._id}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No deals found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Deal Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Create Deal">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Deal Name" id="deal-name" placeholder="e.g. Enterprise Suite — Acme Corp" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Amount ($)" id="deal-amount" type="number" min="0" step="1000" placeholder="50000" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Create Deal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
