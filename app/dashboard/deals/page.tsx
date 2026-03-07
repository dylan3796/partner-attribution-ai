"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { Plus, Download, LayoutGrid, List, X, Search, Loader2, CheckCircle, XCircle, Clock, Briefcase, Filter, DollarSign, TrendingUp, Target, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { exportDealsCSV } from "@/lib/csv";
import type { Deal, Partner } from "@/lib/types";

type SortField = "name" | "amount" | "status" | "date" | "product";
type SortDir = "asc" | "desc";

export default function DealsPage() {
  // ── Convex ──────────────────────────────────────────────────────────────
  const convexDeals = useQuery(api.dealsCrud.list);
  const convexPartners = useQuery(api.partners.list);
  const addDealMutation = useMutation(api.dealsCrud.create);

  // Deal registration approvals
  const approveDeal = useMutation(api.deals.approveDealRegistration);
  const rejectDeal = useMutation(api.deals.rejectDealRegistration);

  const deals = (convexDeals ?? []) as unknown as Deal[];
  const partners = (convexPartners ?? []) as unknown as Partner[];
  const isLoading = convexDeals === undefined;

  const { toast } = useToast();
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, contactName: "", registeredBy: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Advanced Filters ────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPartner, setFilterPartner] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterAmountMin, setFilterAmountMin] = useState<string>("");
  const [filterAmountMax, setFilterAmountMax] = useState<string>("");
  const [filterRegStatus, setFilterRegStatus] = useState<string>("all");

  // ── Sorting (table view) ────────────────────────────────────────────────
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  // ── Derived data ────────────────────────────────────────────────────────
  const uniqueProducts = useMemo(() => {
    const products = new Set<string>();
    deals.forEach((d: any) => { if (d.productName) products.add(d.productName); });
    return Array.from(products).sort();
  }, [deals]);

  const activePartners = useMemo(() => {
    const partnerIds = new Set<string>();
    deals.forEach((d) => { if (d.registeredBy) partnerIds.add(d.registeredBy); });
    return partners.filter((p) => partnerIds.has(p._id));
  }, [deals, partners]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterStatus !== "all") count++;
    if (filterPartner !== "all") count++;
    if (filterProduct !== "all") count++;
    if (filterAmountMin) count++;
    if (filterAmountMax) count++;
    if (filterRegStatus !== "all") count++;
    return count;
  }, [filterStatus, filterPartner, filterProduct, filterAmountMin, filterAmountMax, filterRegStatus]);

  function clearFilters() {
    setFilterStatus("all");
    setFilterPartner("all");
    setFilterProduct("all");
    setFilterAmountMin("");
    setFilterAmountMax("");
    setFilterRegStatus("all");
  }

  // ── Filtering pipeline ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...deals];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.contactName?.toLowerCase().includes(q) ||
          (d as any).productName?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((d) => d.status === filterStatus);
    }

    // Partner filter
    if (filterPartner !== "all") {
      result = result.filter((d) => d.registeredBy === filterPartner);
    }

    // Product filter
    if (filterProduct !== "all") {
      result = result.filter((d: any) => d.productName === filterProduct);
    }

    // Amount range
    if (filterAmountMin) {
      const min = Number(filterAmountMin);
      if (!isNaN(min)) result = result.filter((d) => d.amount >= min);
    }
    if (filterAmountMax) {
      const max = Number(filterAmountMax);
      if (!isNaN(max)) result = result.filter((d) => d.amount <= max);
    }

    // Registration status
    if (filterRegStatus !== "all") {
      if (filterRegStatus === "none") {
        result = result.filter((d: any) => !d.registrationStatus);
      } else {
        result = result.filter((d: any) => d.registrationStatus === filterRegStatus);
      }
    }

    return result;
  }, [deals, search, filterStatus, filterPartner, filterProduct, filterAmountMin, filterAmountMax, filterRegStatus]);

  // ── Sorted (for table view) ───────────────────────────────────────────
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "amount": cmp = a.amount - b.amount; break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "product": cmp = ((a as any).productName || "").localeCompare((b as any).productName || ""); break;
        case "date": cmp = (a.closedAt || a.createdAt) - (b.closedAt || b.createdAt); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const wonDeals = deals.filter((d) => d.status === "won");
    const lostDeals = deals.filter((d) => d.status === "lost");
    const openDeals = deals.filter((d) => d.status === "open");
    const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const pipeline = openDeals.reduce((s, d) => s + d.amount, 0);
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? (wonDeals.length / closedCount) * 100 : 0;
    const pending = deals.filter((d: any) => d.registrationStatus === "pending").length;
    return { totalRevenue, pipeline, avgDealSize, winRate, pending, wonCount: wonDeals.length, openCount: openDeals.length };
  }, [deals]);

  // ── Pipeline columns (filtered) ────────────────────────────────────────
  const open = filtered.filter((d) => d.status === "open" && (d as any).registrationStatus !== "pending").sort((a, b) => b.amount - a.amount);
  const won = filtered.filter((d) => d.status === "won").sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));
  const lost = filtered.filter((d) => d.status === "lost").sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Deal name is required";
    if (!form.amount || form.amount <= 0) errors.amount = "Amount must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setSaving(true);
    try {
      await addDealMutation({
        name: form.name,
        amount: Number(form.amount),
        contactName: form.contactName || undefined,
        registeredBy: form.registeredBy ? (form.registeredBy as Id<"partners">) : undefined,
      });
      setShowAdd(false);
      setForm({ name: "", amount: 0, contactName: "", registeredBy: "" });
      setFormErrors({});
      toast("Deal imported successfully");
    } catch {
      toast("Failed to add deal. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
    return sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  function PipelineCol({
    title,
    items,
    color,
  }: {
    title: string;
    items: Deal[];
    color: string;
  }) {
    const total = items.reduce((s, d) => s + d.amount, 0);
    return (
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 .5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem" }}>
            {title} <span className="muted">({items.length})</span>
          </h3>
          <span className="muted" style={{ fontSize: ".8rem" }}>{formatCurrencyCompact(total)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          {items.map((d) => (
            <Link
              key={d._id}
              href={`/dashboard/deals/${d._id}`}
              className="card card-hover"
              style={{ padding: "1rem", borderLeft: `3px solid ${color}` }}
            >
              <p style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".3rem" }}>{d.name}</p>
              {(d as any).productName && (
                <span className="badge" style={{ fontSize: ".7rem", marginBottom: ".3rem", display: "inline-block" }}>{(d as any).productName}</span>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{formatCurrencyCompact(d.amount)}</span>
                <span className="muted" style={{ fontSize: ".75rem" }}>
                  {new Date(d.closedAt || d.createdAt).toLocaleDateString()}
                </span>
              </div>
              {d.registeredBy && (
                <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>
                  Registered by: {partners.find((p) => p._id === d.registeredBy)?.name || "Partner"}
                </p>
              )}
            </Link>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              <p style={{ fontSize: ".85rem" }}>No deals in this stage.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Partner-Touched Deals</h1>
          <p className="muted">
            {isLoading
              ? "Loading…"
              : `${deals.length} deals · ${formatCurrencyCompact(stats.pipeline)} partner-influenced pipeline`}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button className="btn" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Import Deal
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {!isLoading && deals.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={16} style={{ color: "#10b981" }} />
              </div>
              <span className="muted" style={{ fontSize: ".8rem" }}>Won Revenue</span>
            </div>
            <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.totalRevenue)}</p>
            <p className="muted" style={{ fontSize: ".75rem" }}>{stats.wonCount} closed-won deals</p>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#6366f120", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} style={{ color: "#6366f1" }} />
              </div>
              <span className="muted" style={{ fontSize: ".8rem" }}>Open Pipeline</span>
            </div>
            <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.pipeline)}</p>
            <p className="muted" style={{ fontSize: ".75rem" }}>{stats.openCount} active deals</p>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f59e0b20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={16} style={{ color: "#f59e0b" }} />
              </div>
              <span className="muted" style={{ fontSize: ".8rem" }}>Avg Deal Size</span>
            </div>
            <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{formatCurrencyCompact(stats.avgDealSize)}</p>
            <p className="muted" style={{ fontSize: ".75rem" }}>across won deals</p>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={16} style={{ color: "#10b981" }} />
              </div>
              <span className="muted" style={{ fontSize: ".8rem" }}>Win Rate</span>
            </div>
            <p style={{ fontSize: "1.4rem", fontWeight: 800 }}>{stats.winRate.toFixed(0)}%</p>
            <p className="muted" style={{ fontSize: ".75rem" }}>of closed deals</p>
          </div>
        </div>
      )}

      {/* Search + Filter + View Controls */}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="Search deals, contacts, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 32, width: "100%", padding: ".5rem .8rem .5rem 2rem", fontSize: ".85rem" }}
          />
        </div>

        <button
          className={activeFilterCount > 0 ? "btn" : "btn-outline"}
          onClick={() => setShowFilters(!showFilters)}
          style={{ fontSize: ".85rem", padding: ".5rem .8rem" }}
        >
          <Filter size={14} />
          Filters{activeFilterCount > 0 && (
            <span style={{ background: "#fff", color: "#000", borderRadius: 10, padding: "1px 6px", fontSize: ".7rem", fontWeight: 700, marginLeft: 4 }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="btn-outline"
            style={{ fontSize: ".8rem", padding: ".5rem .8rem", color: "#ef4444", borderColor: "#ef444430" }}
          >
            <X size={13} /> Clear
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem", alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setView("pipeline")}
              style={{ padding: ".5rem .8rem", background: view === "pipeline" ? "var(--subtle)" : "var(--bg)", border: "none", cursor: "pointer", color: "var(--fg)" }}
              title="Pipeline view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("table")}
              style={{ padding: ".5rem .8rem", background: view === "table" ? "var(--subtle)" : "var(--bg)", border: "none", cursor: "pointer", color: "var(--fg)" }}
              title="Table view"
            >
              <List size={16} />
            </button>
          </div>
          <button className="btn-outline" onClick={() => { exportDealsCSV(deals); toast("Deals exported"); }} style={{ fontSize: ".85rem", padding: ".5rem .8rem" }}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Filter Bar (collapsible) */}
      {showFilters && (
        <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ minWidth: 130 }}>
            <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Status</label>
            <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ fontSize: ".85rem", padding: ".4rem .6rem" }}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Partner</label>
            <select className="input" value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)} style={{ fontSize: ".85rem", padding: ".4rem .6rem" }}>
              <option value="all">All Partners</option>
              {activePartners.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          {uniqueProducts.length > 0 && (
            <div style={{ minWidth: 150 }}>
              <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Product</label>
              <select className="input" value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} style={{ fontSize: ".85rem", padding: ".4rem .6rem" }}>
                <option value="all">All Products</option>
                {uniqueProducts.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ minWidth: 120 }}>
            <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Min Amount</label>
            <input
              className="input"
              type="number"
              placeholder="$0"
              value={filterAmountMin}
              onChange={(e) => setFilterAmountMin(e.target.value)}
              style={{ fontSize: ".85rem", padding: ".4rem .6rem", width: "100%" }}
            />
          </div>

          <div style={{ minWidth: 120 }}>
            <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Max Amount</label>
            <input
              className="input"
              type="number"
              placeholder="No limit"
              value={filterAmountMax}
              onChange={(e) => setFilterAmountMax(e.target.value)}
              style={{ fontSize: ".85rem", padding: ".4rem .6rem", width: "100%" }}
            />
          </div>

          <div style={{ minWidth: 150 }}>
            <label className="muted" style={{ fontSize: ".75rem", display: "block", marginBottom: ".3rem" }}>Registration</label>
            <select className="input" value={filterRegStatus} onChange={(e) => setFilterRegStatus(e.target.value)} style={{ fontSize: ".85rem", padding: ".4rem .6rem" }}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="none">No Registration</option>
            </select>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <span className="muted" style={{ fontSize: ".8rem", lineHeight: "28px" }}>
            Showing {filtered.length} of {deals.length} deals
          </span>
          {filterStatus !== "all" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Status: {filterStatus}
              <button onClick={() => setFilterStatus("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterPartner !== "all" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Partner: {partners.find((p) => p._id === filterPartner)?.name || "Unknown"}
              <button onClick={() => setFilterPartner("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterProduct !== "all" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Product: {filterProduct}
              <button onClick={() => setFilterProduct("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterAmountMin && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Min: {formatCurrency(Number(filterAmountMin))}
              <button onClick={() => setFilterAmountMin("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterAmountMax && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Max: {formatCurrency(Number(filterAmountMax))}
              <button onClick={() => setFilterAmountMax("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterRegStatus !== "all" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "var(--subtle)", fontSize: ".8rem", border: "1px solid var(--border)" }}>
              Registration: {filterRegStatus}
              <button onClick={() => setFilterRegStatus("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Pending Deal Registrations */}
      {(() => {
        const pending = deals.filter((d: any) => d.registrationStatus === "pending");
        if (pending.length === 0) return null;
        return (
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", border: "1px solid #eab30840" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Clock size={16} style={{ color: "#eab308" }} />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Pending Deal Registrations ({pending.length})</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {pending.map((deal: any) => (
                <div key={deal._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: 8, background: "var(--subtle)", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{deal.name}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {deal.contactName} · {formatCurrency(deal.amount)}
                      {deal.registeredBy ? ` · ${partners.find((p) => p._id === deal.registeredBy)?.name || "Partner"}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                      onClick={async () => {
                        try {
                          await approveDeal({ dealId: deal._id as Id<"deals">, reviewerId: "admin" });
                          toast("Deal registration approved");
                        } catch (err: any) { toast(err.message); }
                      }}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      className="btn-outline"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem", color: "#ef4444", borderColor: "#ef444440" }}
                      onClick={async () => {
                        try {
                          await rejectDeal({ dealId: deal._id as Id<"deals">, reviewerId: "admin", reason: "Rejected by admin" });
                          toast("Deal registration rejected");
                        } catch (err: any) { toast(err.message); }
                      }}
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Loader2 size={28} color="var(--muted)" style={{ marginBottom: ".5rem" }} />
          <p className="muted">Loading deals from database…</p>
        </div>
      ) : view === "pipeline" ? (
        <div style={{ display: "flex", gap: "1.5rem", overflow: "auto", paddingBottom: "1rem" }}>
          <PipelineCol title="Open" items={open} color="#6366f1" />
          <PipelineCol title="Won" items={won} color="#10b981" />
          <PipelineCol title="Lost" items={lost} color="#ef4444" />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--subtle)" }}>
                  <th
                    onClick={() => toggleSort("name")}
                    style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Deal <SortIcon field="name" /></span>
                  </th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Partner</th>
                  <th
                    onClick={() => toggleSort("product")}
                    style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Product <SortIcon field="product" /></span>
                  </th>
                  <th
                    onClick={() => toggleSort("amount")}
                    style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Amount <SortIcon field="amount" /></span>
                  </th>
                  <th
                    onClick={() => toggleSort("status")}
                    style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Status <SortIcon field="status" /></span>
                  </th>
                  <th
                    onClick={() => toggleSort("date")}
                    style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Date <SortIcon field="date" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((d) => (
                    <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: ".8rem 1.2rem" }}>
                        <Link href={`/dashboard/deals/${d._id}`} style={{ fontWeight: 600 }}>{d.name}</Link>
                        {d.contactName && <p className="muted" style={{ fontSize: ".75rem", marginTop: 2 }}>{d.contactName}</p>}
                      </td>
                      <td style={{ padding: ".8rem" }}>
                        {d.registeredBy ? (
                          <Link href={`/dashboard/partners/${d.registeredBy}`} style={{ fontSize: ".85rem" }}>
                            {partners.find((p) => p._id === d.registeredBy)?.name || "Partner"}
                          </Link>
                        ) : (
                          <span className="muted" style={{ fontSize: ".85rem" }}>Direct</span>
                        )}
                      </td>
                      <td style={{ padding: ".8rem" }}>
                        {(d as any).productName ? (
                          <span className="badge" style={{ fontSize: ".75rem" }}>{(d as any).productName}</span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td style={{ padding: ".8rem", fontWeight: 700 }}>{formatCurrency(d.amount)}</td>
                      <td style={{ padding: ".8rem" }}>
                        <span className={`badge badge-${d.status === "won" ? "success" : d.status === "lost" ? "danger" : "info"}`}>
                          {d.status}
                        </span>
                        {(d as any).registrationStatus && (
                          <span className={`badge ${(d as any).registrationStatus === "pending" ? "" : (d as any).registrationStatus === "approved" ? "badge-success" : "badge-danger"}`}
                            style={{ fontSize: ".7rem", marginLeft: 4 }}>
                            {(d as any).registrationStatus}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: ".8rem" }} className="muted">{new Date(d.closedAt || d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <Briefcase size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>
                {deals?.length === 0 ? "No deals yet" : "No deals match your filters"}
              </h3>
              <p className="muted" style={{ fontSize: ".85rem", marginBottom: 16 }}>
                {deals?.length === 0
                  ? "Deals track revenue attributed to your partners. Add your first deal to start building your pipeline."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {deals?.length === 0 && (
                <button
                  onClick={() => setShowAdd(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
                    borderRadius: 8, background: "#6366f1", color: "#fff", border: "none",
                    fontWeight: 600, fontSize: ".85rem", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  + Add First Deal
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setShowAdd(false)}
        >
          <div className="card animate-in" style={{ width: 480, maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Import Deal</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Deal Name *</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enterprise CRM — Globex Corp" />
                {formErrors.name && <p style={{ fontSize: ".75rem", color: "#dc2626", marginTop: ".25rem" }}>{formErrors.name}</p>}
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Amount *</label>
                <input className="input" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} placeholder="120000" />
                {formErrors.amount && <p style={{ fontSize: ".75rem", color: "#dc2626", marginTop: ".25rem" }}>{formErrors.amount}</p>}
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Name</label>
                <input className="input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Registered By (Partner)</label>
                <select className="input" value={form.registeredBy} onChange={(e) => setForm({ ...form, registeredBy: e.target.value })}>
                  <option value="">None (internal)</option>
                  {partners.filter((p) => p.status === "active").map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <p className="muted" style={{ fontSize: ".75rem", marginTop: ".5rem", textAlign: "center", lineHeight: 1.4 }}>
                💡 Deals are typically synced from your CRM. Use this form for manual entry.
              </p>
              <button
                className="btn"
                style={{ width: "100%", marginTop: ".5rem" }}
                onClick={handleAdd}
                disabled={!form.name || !form.amount || saving}
              >
                {saving ? "Saving…" : "Import Deal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
