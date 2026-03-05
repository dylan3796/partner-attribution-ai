"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Package,
  Plus,
  Search,
  Tag,
  Inbox,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Loader2,
} from "lucide-react";

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div className="skeleton" style={{ height: 32, width: 240, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: 400 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ padding: "1rem" }}>
            <div className="skeleton" style={{ height: 48 }} />
          </div>
        ))}
      </div>
      <div className="card"><div className="skeleton" style={{ height: 240 }} /></div>
    </div>
  );
}

type ProductFormData = {
  sku: string;
  name: string;
  category: string;
  msrp: string;
  distributorPrice: string;
  description: string;
};

const emptyForm: ProductFormData = {
  sku: "",
  name: "",
  category: "",
  msrp: "",
  distributorPrice: "",
  description: "",
};

export default function ProductsPage() {
  const products = useQuery(api.products.list);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const toggleStatus = useMutation(api.products.toggleStatus);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Id<"products"> | null>(null);

  if (products === undefined) return <LoadingSkeleton />;

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalActive = products.filter((p) => p.status === "active").length;
  const totalInactive = products.filter((p) => p.status === "inactive").length;
  const avgMargin =
    products.length > 0
      ? Math.round(products.reduce((s, p) => s + p.margin, 0) / products.length)
      : 0;
  const totalMsrp = products.reduce((s, p) => s + p.msrp, 0);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(product: NonNullable<typeof products>[0]) {
    setEditingId(product._id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      msrp: String(product.msrp),
      distributorPrice: String(product.distributorPrice),
      description: product.description || "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msrp = parseFloat(form.msrp);
    const distributorPrice = parseFloat(form.distributorPrice);
    if (!form.sku || !form.name || !form.category || isNaN(msrp) || isNaN(distributorPrice)) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct({
          id: editingId,
          sku: form.sku,
          name: form.name,
          category: form.category,
          msrp,
          distributorPrice,
          description: form.description || undefined,
        });
      } else {
        await createProduct({
          sku: form.sku,
          name: form.name,
          category: form.category,
          msrp,
          distributorPrice,
          description: form.description || undefined,
        });
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"products">) {
    await removeProduct({ id });
    setConfirmDelete(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Manage products, SKUs, and pricing for partner deal registration and commission rules
          </p>
        </div>
        <button className="btn" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="card" style={{ padding: "1.5rem", border: "2px solid var(--fg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <button className="btn-ghost" onClick={closeForm} style={{ padding: 4 }}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>SKU *</label>
              <input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="PROD-001" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Product Name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enterprise Suite" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Category *</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Software" required list="product-categories" />
              {categories.length > 0 && (
                <datalist id="product-categories">
                  {categories.map((c) => <option key={c} value={c} />)}
                </datalist>
              )}
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>MSRP *</label>
              <input className="input" type="number" step="0.01" min="0" value={form.msrp} onChange={(e) => setForm({ ...form, msrp: e.target.value })} placeholder="999.00" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Distributor Price *</label>
              <input className="input" type="number" step="0.01" min="0" value={form.distributorPrice} onChange={(e) => setForm({ ...form, distributorPrice: e.target.value })} placeholder="749.00" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Preview Margin</label>
              <div className="input" style={{ background: "var(--subtle)", display: "flex", alignItems: "center" }}>
                {form.msrp && form.distributorPrice
                  ? `${Math.round(((parseFloat(form.msrp) - parseFloat(form.distributorPrice)) / parseFloat(form.msrp)) * 100)}%`
                  : "—"}
              </div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Description</label>
              <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional product description..." rows={2} />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
              <button type="button" className="btn-outline" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? <Loader2 size={16} className="spin" /> : null}
                {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Row */}
      {products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} color="#6366f1" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Total Products</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{products.length}</div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tag size={20} color="#10b981" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Active / Inactive</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{totalActive}<span className="muted" style={{ fontSize: ".9rem", fontWeight: 500 }}> / {totalInactive}</span></div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tag size={20} color="#f59e0b" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Avg Margin</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{avgMargin}%</div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} color="#6366f1" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Catalog Value</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{formatCurrency(totalMsrp)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Product List or Empty State */}
      {products.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <Inbox size={48} style={{ color: "var(--muted)", margin: "0 auto 1rem" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: ".5rem" }}>No Products Configured</h3>
          <p className="muted" style={{ marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
            Add your product catalog to enable product-level commission rules and let partners select products when registering deals.
          </p>
          <button className="btn" onClick={openAdd}>
            <Plus size={16} /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {/* Search + Filter bar */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input
                className="input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            {categories.length > 1 && (
              <select
                className="input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: "auto", padding: "0.5rem 0.8rem", fontSize: "0.85rem" }}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
            <span className="muted" style={{ fontSize: ".8rem", marginLeft: "auto" }}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>SKU</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>MSRP</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Partner Price</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Margin</th>
                  <th style={{ textAlign: "center", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product._id} style={{ borderBottom: "1px solid var(--border)", opacity: product.status === "inactive" ? 0.5 : 1 }}>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".85rem", fontFamily: "monospace" }}>{product.sku}</td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{product.name}</div>
                      {product.description && <div className="muted" style={{ fontSize: ".75rem", marginTop: 2 }}>{product.description}</div>}
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".85rem" }}>{product.category}</td>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".9rem", fontWeight: 600, textAlign: "right" }}>{formatCurrency(product.msrp)}</td>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".9rem", textAlign: "right", color: "var(--muted)" }}>{formatCurrency(product.distributorPrice)}</td>
                    <td style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: ".75rem",
                        fontWeight: 600,
                        background: product.margin >= 30 ? "rgba(16,185,129,0.15)" : product.margin >= 20 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                        color: product.margin >= 30 ? "#10b981" : product.margin >= 20 ? "#f59e0b" : "#ef4444",
                      }}>
                        {product.margin}%
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem", textAlign: "center" }}>
                      <button
                        onClick={() => toggleStatus({ id: product._id })}
                        title={product.status === "active" ? "Deactivate" : "Activate"}
                        style={{ background: "none", border: "none", cursor: "pointer", color: product.status === "active" ? "#10b981" : "var(--muted)" }}
                      >
                        {product.status === "active" ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: ".25rem", justifyContent: "flex-end" }}>
                        <button
                          className="btn-ghost"
                          onClick={() => openEdit(product)}
                          title="Edit"
                          style={{ padding: "4px 6px" }}
                        >
                          <Edit2 size={14} />
                        </button>
                        {confirmDelete === product._id ? (
                          <div style={{ display: "flex", gap: ".25rem", alignItems: "center" }}>
                            <button
                              className="btn-ghost"
                              onClick={() => handleDelete(product._id)}
                              style={{ padding: "4px 8px", fontSize: ".75rem", color: "#ef4444" }}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn-ghost"
                              onClick={() => setConfirmDelete(null)}
                              style={{ padding: "4px 6px" }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn-ghost"
                            onClick={() => setConfirmDelete(product._id)}
                            title="Delete"
                            style={{ padding: "4px 6px", color: "var(--muted)" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && products.length > 0 && (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <p className="muted">No products match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
