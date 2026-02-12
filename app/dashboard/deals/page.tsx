"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { Plus, Download, LayoutGrid, List, X, Search } from "lucide-react";
import { exportDealsCSV } from "@/lib/csv";

export default function DealsPage() {
  const { deals, addDeal, partners } = useStore();
  const { toast } = useToast();
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, contactName: "", registeredBy: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? deals.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.contactName?.toLowerCase().includes(search.toLowerCase()))
    : deals;
  const open = filtered.filter((d) => d.status === "open").sort((a, b) => b.amount - a.amount);
  const won = filtered.filter((d) => d.status === "won").sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));
  const lost = filtered.filter((d) => d.status === "lost").sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Deal name is required";
    if (!form.amount || form.amount <= 0) errors.amount = "Amount must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    addDeal({ ...form, amount: Number(form.amount), status: "open", registeredBy: form.registeredBy || undefined, registrationStatus: form.registeredBy ? "pending" : undefined });
    setShowAdd(false);
    setForm({ name: "", amount: 0, contactName: "", registeredBy: "" });
    setFormErrors({});
    toast("Deal imported successfully");
  }

  function PipelineCol({ title, items, color }: { title: string; items: typeof deals; color: string }) {
    const total = items.reduce((s, d) => s + d.amount, 0);
    return (
      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 .5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem" }}>{title} <span className="muted">({items.length})</span></h3>
          <span className="muted" style={{ fontSize: ".8rem" }}>{formatCurrencyCompact(total)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          {items.map((d) => (
            <Link key={d._id} href={`/dashboard/deals/${d._id}`} className="card card-hover" style={{ padding: "1rem", borderLeft: `3px solid ${color}` }}>
              <p style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".3rem" }}>{d.name}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{formatCurrencyCompact(d.amount)}</span>
                <span className="muted" style={{ fontSize: ".75rem" }}>{new Date(d.closedAt || d.createdAt).toLocaleDateString()}</span>
              </div>
              {d.registeredBy && <p className="muted" style={{ fontSize: ".75rem", marginTop: ".3rem" }}>Registered by: {partners.find((p) => p._id === d.registeredBy)?.name || "Partner"}</p>}
            </Link>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              <p style={{ fontSize: ".85rem" }}>No partner-touched deals</p>
              <a href="/dashboard/settings#crm-connection" style={{ fontSize: ".75rem", color: "#6366f1", fontWeight: 500 }}>
                Connect your CRM to sync deals automatically
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Partner-Touched Deals</h1>
          <p className="muted">{deals.length} deals from CRM · {formatCurrencyCompact(deals.filter((d) => d.status === "open").reduce((s, d) => s + d.amount, 0))} partner-influenced pipeline</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              className="input"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: 200, padding: ".5rem .8rem .5rem 2rem", fontSize: ".85rem" }}
            />
          </div>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => setView("pipeline")} style={{ padding: ".5rem .8rem", background: view === "pipeline" ? "var(--subtle)" : "var(--bg)", border: "none", cursor: "pointer", color: "var(--fg)" }}><LayoutGrid size={16} /></button>
            <button onClick={() => setView("table")} style={{ padding: ".5rem .8rem", background: view === "table" ? "var(--subtle)" : "var(--bg)", border: "none", cursor: "pointer", color: "var(--fg)" }}><List size={16} /></button>
          </div>
          <button className="btn-outline" onClick={() => { exportDealsCSV(deals); toast("Deals exported"); }}><Download size={15} /> Export</button>
          <button className="btn" onClick={() => setShowAdd(true)}><Plus size={15} /> Import Deal</button>
        </div>
      </div>

      {view === "pipeline" ? (
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
                  <th style={{ padding: ".8rem 1.2rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Deal</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Amount</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Status</th>
                  <th style={{ padding: ".8rem", textAlign: "left", fontWeight: 600, fontSize: ".8rem", color: "var(--muted)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.sort((a, b) => b.createdAt - a.createdAt).map((d) => (
                  <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: ".8rem 1.2rem" }}><Link href={`/dashboard/deals/${d._id}`} style={{ fontWeight: 600 }}>{d.name}</Link></td>
                    <td style={{ padding: ".8rem", fontWeight: 700 }}>{formatCurrency(d.amount)}</td>
                    <td style={{ padding: ".8rem" }}><span className={`badge badge-${d.status === "won" ? "success" : d.status === "lost" ? "danger" : "info"}`}>{d.status}</span></td>
                    <td style={{ padding: ".8rem" }} className="muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowAdd(false)}>
          <div className="card animate-in" style={{ width: 480, maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Import Deal</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
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
              <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Contact Name</label><input className="input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="John Smith" /></div>
              <div><label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Registered By (Partner)</label>
                <select className="input" value={form.registeredBy} onChange={(e) => setForm({ ...form, registeredBy: e.target.value })}>
                  <option value="">None (internal)</option>
                  {partners.filter((p) => p.status === "active").map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <p className="muted" style={{ fontSize: ".75rem", marginTop: ".5rem", textAlign: "center", lineHeight: 1.4 }}>💡 Deals are typically synced from your CRM. Use this form for manual entry when CRM integration isn&apos;t set up yet.</p>
              <button className="btn" style={{ width: "100%", marginTop: ".5rem" }} onClick={handleAdd} disabled={!form.name || !form.amount}>Import Deal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
