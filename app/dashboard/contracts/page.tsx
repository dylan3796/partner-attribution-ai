"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  Bell,
} from "lucide-react";

type ContractStatus = "active" | "expiring_soon" | "expired" | "pending_renewal" | "draft" | "terminated";
type ContractType = "partner_agreement" | "reseller" | "referral" | "oem" | "technology" | "co_sell";

interface Contract {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerTier: "Platinum" | "Gold" | "Silver" | "Bronze";
  type: ContractType;
  title: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  value: number;
  commissionRate: number;
  territory: string;
  signedBy: string;
  lastModified: string;
  complianceStatus: "compliant" | "review_needed" | "non_compliant";
  notes: string;
  daysUntilExpiry: number;
}

const TYPE_LABELS: Record<ContractType, string> = {
  partner_agreement: "Partner Agreement",
  reseller: "Reseller Agreement",
  referral: "Referral Agreement",
  oem: "OEM License",
  technology: "Technology Partnership",
  co_sell: "Co-Sell Agreement",
};

const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: "Active", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
  expiring_soon: { label: "Expiring Soon", color: "text-amber-400 bg-amber-400/10", icon: AlertTriangle },
  expired: { label: "Expired", color: "text-red-400 bg-red-400/10", icon: XCircle },
  pending_renewal: { label: "Pending Renewal", color: "text-blue-400 bg-blue-400/10", icon: RefreshCw },
  draft: { label: "Draft", color: "text-zinc-400 bg-zinc-400/10", icon: Clock },
  terminated: { label: "Terminated", color: "text-red-500 bg-red-500/10", icon: XCircle },
};

const DEMO_CONTRACTS: Contract[] = [
  {
    id: "CTR-001", partnerId: "P-101", partnerName: "TechBridge", partnerTier: "Platinum",
    type: "partner_agreement", title: "Strategic Partner Agreement 2025",
    status: "active", startDate: "2025-01-15", endDate: "2026-01-14", autoRenew: true,
    value: 500000, commissionRate: 25, territory: "North America",
    signedBy: "Sarah Chen (VP Partnerships)", lastModified: "2025-01-15",
    complianceStatus: "compliant", notes: "Includes co-marketing budget of $50k",
    daysUntilExpiry: 330,
  },
  {
    id: "CTR-002", partnerId: "P-102", partnerName: "Stackline", partnerTier: "Gold",
    type: "reseller", title: "Authorized Reseller Agreement",
    status: "expiring_soon", startDate: "2024-06-01", endDate: "2026-03-01", autoRenew: false,
    value: 250000, commissionRate: 20, territory: "EMEA",
    signedBy: "Marcus Weber (Director)", lastModified: "2025-11-20",
    complianceStatus: "review_needed", notes: "Renewal discussion scheduled for Feb 2026",
    daysUntilExpiry: 10,
  },
  {
    id: "CTR-003", partnerId: "P-103", partnerName: "TechBridge", partnerTier: "Silver",
    type: "referral", title: "Referral Partner Agreement",
    status: "active", startDate: "2025-06-01", endDate: "2026-05-31", autoRenew: true,
    value: 75000, commissionRate: 15, territory: "APAC",
    signedBy: "Lin Wei (CEO)", lastModified: "2025-06-01",
    complianceStatus: "compliant", notes: "Strong pipeline in Singapore market",
    daysUntilExpiry: 101,
  },
  {
    id: "CTR-004", partnerId: "P-104", partnerName: "Northlight", partnerTier: "Gold",
    type: "oem", title: "OEM Embedding License",
    status: "pending_renewal", startDate: "2024-03-01", endDate: "2026-02-28", autoRenew: false,
    value: 1200000, commissionRate: 30, territory: "Global",
    signedBy: "James Park (CTO)", lastModified: "2026-01-15",
    complianceStatus: "compliant", notes: "Negotiating expanded embedding rights",
    daysUntilExpiry: 9,
  },
  {
    id: "CTR-005", partnerId: "P-105", partnerName: "Clearpath", partnerTier: "Bronze",
    type: "referral", title: "Referral Agreement (Trial)",
    status: "expired", startDate: "2025-01-01", endDate: "2025-12-31", autoRenew: false,
    value: 25000, commissionRate: 10, territory: "North America",
    signedBy: "Amy Torres (Partner Mgr)", lastModified: "2025-12-31",
    complianceStatus: "non_compliant", notes: "Did not meet minimum referral threshold",
    daysUntilExpiry: -50,
  },
  {
    id: "CTR-006", partnerId: "P-106", partnerName: "Apex Growth", partnerTier: "Platinum",
    type: "technology", title: "Technology Integration Partnership",
    status: "active", startDate: "2025-04-01", endDate: "2027-03-31", autoRenew: true,
    value: 800000, commissionRate: 22, territory: "North America + EMEA",
    signedBy: "Rachel Kim (SVP Alliances)", lastModified: "2025-09-12",
    complianceStatus: "compliant", notes: "Joint product launch Q2 2026",
    daysUntilExpiry: 770,
  },
  {
    id: "CTR-007", partnerId: "P-107", partnerName: "Stackline", partnerTier: "Silver",
    type: "co_sell", title: "Co-Sell Partnership Agreement",
    status: "draft", startDate: "", endDate: "", autoRenew: true,
    value: 150000, commissionRate: 18, territory: "North America",
    signedBy: "", lastModified: "2026-02-10",
    complianceStatus: "review_needed", notes: "Legal review in progress, expected sign by March",
    daysUntilExpiry: 999,
  },
  {
    id: "CTR-008", partnerId: "P-108", partnerName: "Northlight", partnerTier: "Gold",
    type: "reseller", title: "DACH Region Reseller Agreement",
    status: "active", startDate: "2025-07-01", endDate: "2026-06-30", autoRenew: true,
    value: 350000, commissionRate: 20, territory: "DACH",
    signedBy: "Thomas Müller (Geschäftsführer)", lastModified: "2025-07-01",
    complianceStatus: "compliant", notes: "Exceeded Q4 targets by 140%",
    daysUntilExpiry: 131,
  },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ComplianceDot({ status }: { status: Contract["complianceStatus"] }) {
  const colors = { compliant: "bg-green-400", review_needed: "bg-amber-400", non_compliant: "bg-red-400" };
  const labels = { compliant: "Compliant", review_needed: "Review Needed", non_compliant: "Non-Compliant" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
      <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
      {labels[status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: Contract["partnerTier"] }) {
  const colors = {
    Platinum: "text-violet-300 bg-violet-400/10",
    Gold: "text-amber-300 bg-amber-400/10",
    Silver: "text-zinc-300 bg-zinc-400/10",
    Bronze: "text-orange-300 bg-orange-400/10",
  };
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[tier]}`}>{tier}</span>;
}

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContractType | "all">("all");
  const [sortBy, setSortBy] = useState<"expiry" | "value" | "partner">("expiry");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = DEMO_CONTRACTS
    .filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.partnerName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "expiry") return (a.daysUntilExpiry - b.daysUntilExpiry) * dir;
      if (sortBy === "value") return (a.value - b.value) * dir;
      return a.partnerName.localeCompare(b.partnerName) * dir;
    });

  const stats = {
    total: DEMO_CONTRACTS.length,
    active: DEMO_CONTRACTS.filter((c) => c.status === "active").length,
    expiringSoon: DEMO_CONTRACTS.filter((c) => c.status === "expiring_soon" || c.status === "pending_renewal").length,
    totalValue: DEMO_CONTRACTS.filter((c) => c.status !== "expired" && c.status !== "terminated").reduce((s, c) => s + c.value, 0),
  };

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  }

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-400" />
            Contracts & Agreements
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage partner contracts, renewals, and compliance</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Contracts", value: stats.total, icon: FileText, color: "text-zinc-300" },
          { label: "Active", value: stats.active, icon: CheckCircle, color: "text-green-400" },
          { label: "Needs Attention", value: stats.expiringSoon, icon: AlertTriangle, color: "text-amber-400" },
          { label: "Portfolio Value", value: formatCurrency(stats.totalValue), icon: Calendar, color: "text-indigo-400" },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              {s.label}
            </div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Renewal Alerts */}
      {stats.expiringSoon > 0 && (
        <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              {stats.expiringSoon} contract{stats.expiringSoon > 1 ? "s" : ""} need{stats.expiringSoon === 1 ? "s" : ""} attention
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {DEMO_CONTRACTS.filter((c) => c.status === "expiring_soon" || c.status === "pending_renewal")
                .map((c) => c.partnerName)
                .join(", ")}{" "}
              — review renewal terms before expiry
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contracts..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContractType | "all")}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("partner")}>
                  <span className="inline-flex items-center gap-1">Partner <SortIcon col="partner" /></span>
                </th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("expiry")}>
                  <span className="inline-flex items-center gap-1">Expiry <SortIcon col="expiry" /></span>
                </th>
                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("value")}>
                  <span className="inline-flex items-center gap-1">Value <SortIcon col="value" /></span>
                </th>
                <th className="px-4 py-3">Compliance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((c) => (
                <>
                  <tr
                    key={c.id}
                    className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-xs">{c.id}</div>
                      <div className="text-zinc-400 text-xs truncate max-w-[200px]">{c.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">{c.partnerName}</span>
                        <TierBadge tier={c.partnerTier} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{TYPE_LABELS[c.type]}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      {c.endDate ? (
                        <div>
                          <div className="text-zinc-300 text-xs">{c.endDate}</div>
                          {c.daysUntilExpiry <= 30 && c.daysUntilExpiry > 0 && (
                            <div className="text-amber-400 text-[10px]">{c.daysUntilExpiry}d remaining</div>
                          )}
                          {c.daysUntilExpiry < 0 && (
                            <div className="text-red-400 text-[10px]">{Math.abs(c.daysUntilExpiry)}d overdue</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{formatCurrency(c.value)}</td>
                    <td className="px-4 py-3"><ComplianceDot status={c.complianceStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors" title="Download">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-detail`} className="bg-zinc-800/20">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-zinc-500">Start Date</span>
                            <p className="text-zinc-300 mt-0.5">{c.startDate || "—"}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">Commission Rate</span>
                            <p className="text-zinc-300 mt-0.5">{c.commissionRate}%</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">Territory</span>
                            <p className="text-zinc-300 mt-0.5">{c.territory}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">Auto-Renew</span>
                            <p className={`mt-0.5 ${c.autoRenew ? "text-green-400" : "text-zinc-500"}`}>
                              {c.autoRenew ? "Yes" : "No"}
                            </p>
                          </div>
                          <div>
                            <span className="text-zinc-500">Signed By</span>
                            <p className="text-zinc-300 mt-0.5">{c.signedBy || "—"}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">Last Modified</span>
                            <p className="text-zinc-300 mt-0.5">{c.lastModified}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-zinc-500">Notes</span>
                            <p className="text-zinc-300 mt-0.5">{c.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No contracts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
