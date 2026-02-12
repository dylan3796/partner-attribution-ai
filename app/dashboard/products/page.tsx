"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  Package,
  Plus,
  Search,
  Tag,
  Shield,
  Users,
  Percent,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, productRebates, partnerProductCerts, partners } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // New product form state
  const [newSku, setNewSku] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMsrp, setNewMsrp] = useState("");
  const [newDistPrice, setNewDistPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const msrp = parseFloat(newMsrp);
    const distPrice = parseFloat(newDistPrice);
    if (!newSku || !newName || !newCategory || isNaN(msrp) || isNaN(distPrice)) {
      toast("Please fill in all required fields", "error");
      return;
    }
    addProduct({
      sku: newSku,
      name: newName,
      category: newCategory,
      msrp,
      distributorPrice: distPrice,
      margin: Math.round(((msrp - distPrice) / msrp) * 100),
      status: "active",
      description: newDescription,
    });
    toast(`Product "${newName}" added`);
    setShowAdd(false);
    setNewSku(""); setNewName(""); setNewCategory(""); setNewMsrp(""); setNewDistPrice(""); setNewDescription("");
  }

  const detail = selectedProduct ? products.find((p) => p._id === selectedProduct) : null;
  const detailCerts = detail ? partnerProductCerts.filter((c) => c.productId === detail._id && c.status === "active") : [];
  const detailRebates = detail ? productRebates.filter((r) => r.productId === detail._id) : [];

  const totalActive = products.filter((p) => p.status === "active").length;
  const avgMargin = products.length > 0 ? Math.round(products.reduce((s, p) => s + p.margin, 0) / products.length) : 0;
  const totalCerts = partnerProductCerts.filter((c) => c.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage products, SKUs, pricing, and partner certifications</p>
        </div>
        <button className="btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <Package size={22} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Active Products</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{totalActive}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Tag size={22} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Categories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{categories.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Percent size={22} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Avg Margin</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{avgMargin}%</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Shield size={22} color="#7c3aed" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".75rem" }}>Partner Certifications</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{totalCerts}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, width: "100%" }}
          />
        </div>
        <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowAdd(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 520, width: "90%", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Add New Product</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>SKU *</label>
                  <input className="input" value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="CRM-ENT-100" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Category *</label>
                  <input className="input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="CRM" required />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Product Name *</label>
                <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enterprise CRM Suite" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>MSRP *</label>
                  <input className="input" type="number" value={newMsrp} onChange={(e) => setNewMsrp(e.target.value)} placeholder="2500" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Distributor Price *</label>
                  <input className="input" type="number" value={newDistPrice} onChange={(e) => setNewDistPrice(e.target.value)} placeholder="1750" required />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: ".3rem" }}>Description</label>
                <textarea className="input" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={2} placeholder="Product description..." style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
                <button type="button" className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {detail && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setSelectedProduct(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 16, padding: "2rem", maxWidth: 600, width: "90%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{detail.name}</h2>
                <p className="muted">{detail.sku} · {detail.category}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ padding: ".75rem", borderRadius: 8, background: "var(--subtle)", textAlign: "center" }}>
                <p className="muted" style={{ fontSize: ".75rem" }}>MSRP</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{formatCurrency(detail.msrp)}</p>
              </div>
              <div style={{ padding: ".75rem", borderRadius: 8, background: "#ecfdf5", textAlign: "center" }}>
                <p className="muted" style={{ fontSize: ".75rem" }}>Distributor Price</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#059669" }}>{formatCurrency(detail.distributorPrice)}</p>
              </div>
              <div style={{ padding: ".75rem", borderRadius: 8, background: "#fffbeb", textAlign: "center" }}>
                <p className="muted" style={{ fontSize: ".75rem" }}>Margin</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#d97706" }}>{detail.margin}%</p>
              </div>
            </div>

            {detail.description && <p style={{ fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{detail.description}</p>}

            {/* Product-Specific Rebates */}
            {detailRebates.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".5rem" }}>Product-Specific Rebates</h3>
                {detailRebates.map((r) => (
                  <div key={r._id} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem .75rem", borderRadius: 6, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: ".35rem" }}>
                    <span style={{ fontSize: ".85rem" }}>Min {r.minUnits} units</span>
                    <span style={{ fontWeight: 700, color: "#d97706" }}>{r.rebatePercent}% rebate</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certified Partners */}
            <h3 style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".5rem" }}>Certified Partners ({detailCerts.length})</h3>
            {detailCerts.length === 0 ? (
              <p className="muted" style={{ fontSize: ".85rem" }}>No partners certified for this product yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                {detailCerts.map((cert) => {
                  const p = partners.find((pr) => pr._id === cert.partnerId);
                  const levelColors: Record<string, string> = { authorized: "#6b7280", preferred: "#2563eb", elite: "#d97706" };
                  return (
                    <div key={cert._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem .75rem", borderRadius: 6, background: "var(--subtle)", border: "1px solid var(--border)" }}>
                      <span style={{ fontSize: ".85rem", fontWeight: 600 }}>{p?.name || "Unknown"}</span>
                      <span style={{ padding: ".15rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: `${levelColors[cert.level]}18`, color: levelColors[cert.level], border: `1px solid ${levelColors[cert.level]}40`, textTransform: "capitalize" }}>
                        {cert.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button className="btn-outline" onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {filtered.map((product) => {
          const certs = partnerProductCerts.filter((c) => c.productId === product._id && c.status === "active");
          const rebate = productRebates.find((r) => r.productId === product._id);
          const statusColors: Record<string, { bg: string; fg: string }> = {
            active: { bg: "#dcfce7", fg: "#166534" },
            discontinued: { bg: "#fee2e2", fg: "#991b1b" },
            coming_soon: { bg: "#dbeafe", fg: "#1e40af" },
          };
          const sc = statusColors[product.status] || statusColors.active;
          return (
            <div
              key={product._id}
              className="card card-hover"
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => setSelectedProduct(product._id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".15rem" }}>{product.name}</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{product.sku} · {product.category}</p>
                </div>
                <span style={{ padding: ".2rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: sc.bg, color: sc.fg, textTransform: "capitalize" }}>
                  {product.status.replace("_", " ")}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem", marginBottom: ".75rem" }}>
                <div>
                  <p className="muted" style={{ fontSize: ".7rem" }}>MSRP</p>
                  <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{formatCurrency(product.msrp)}</p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".7rem" }}>Dist. Price</p>
                  <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#059669" }}>{formatCurrency(product.distributorPrice)}</p>
                </div>
                <div>
                  <p className="muted" style={{ fontSize: ".7rem" }}>Margin</p>
                  <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#d97706" }}>{product.margin}%</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                  <Users size={14} color="var(--muted)" />
                  <span className="muted" style={{ fontSize: ".8rem" }}>{certs.length} certified partner{certs.length !== 1 ? "s" : ""}</span>
                </div>
                {rebate && (
                  <span style={{ padding: ".15rem .5rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600, background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>
                    {rebate.rebatePercent}% rebate
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
