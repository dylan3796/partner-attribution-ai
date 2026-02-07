"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PARTNER_TYPE_LABELS } from "@/lib/types";
import { Search, Plus, Users, ArrowUpRight } from "lucide-react";

export default function PartnersPage() {
  const { partners, attributions, addPartner } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState<"affiliate" | "referral" | "reseller" | "integration">("referral");
  const [formRate, setFormRate] = useState("10");

  // Calculate revenue per partner
  const partnerRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    attributions
      .filter((a) => a.model === "equal_split")
      .forEach((a) => {
        map[a.partnerId] = (map[a.partnerId] || 0) + a.amount;
      });
    return map;
  }, [attributions]);

  const filtered = useMemo(() => {
    return partners
      .filter((p) => {
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (typeFilter !== "all" && p.type !== typeFilter) return false;
        if (search) {
          const s = search.toLowerCase();
          return p.name.toLowerCase().includes(s) || p.email.toLowerCase().includes(s);
        }
        return true;
      })
      .sort((a, b) => (partnerRevenue[b._id] || 0) - (partnerRevenue[a._id] || 0));
  }, [partners, search, statusFilter, typeFilter, partnerRevenue]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addPartner({
      name: formName,
      email: formEmail,
      type: formType,
      commissionRate: parseFloat(formRate),
    });
    setShowAddModal(false);
    setFormName("");
    setFormEmail("");
    setFormType("referral");
    setFormRate("10");
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-500 mt-1">{partners.length} partners in your program</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="referral">Referral</option>
          <option value="affiliate">Affiliate</option>
          <option value="reseller">Reseller</option>
          <option value="integration">Integration</option>
        </select>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attributed Revenue</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((partner) => (
                <tr key={partner._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/partners/${partner._id}`} className="flex items-center gap-3">
                      <Avatar name={partner.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                        <p className="text-xs text-gray-400">{partner.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{PARTNER_TYPE_LABELS[partner.type]}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={partner.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">{partner.commissionRate}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(partnerRevenue[partner._id] || 0)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-500">{formatDate(partner.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/partners/${partner._id}`}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
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
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No partners found</p>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Partner">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Name" id="partner-name" placeholder="Partner name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
          <Input label="Email" id="partner-email" type="email" placeholder="partner@company.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
          <Select
            label="Type"
            id="partner-type"
            value={formType}
            onChange={(e) => setFormType(e.target.value as typeof formType)}
            options={[
              { value: "referral", label: "Referral" },
              { value: "affiliate", label: "Affiliate" },
              { value: "reseller", label: "Reseller" },
              { value: "integration", label: "Integration" },
            ]}
          />
          <Input label="Commission Rate (%)" id="partner-rate" type="number" min="0" max="100" step="0.5" placeholder="10" value={formRate} onChange={(e) => setFormRate(e.target.value)} required />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Partner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
