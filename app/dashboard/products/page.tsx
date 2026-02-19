"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Tag,
  Inbox,
} from "lucide-react";

// Local state for products (no backend table yet)
interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  msrp: number;
  distributorPrice: number;
  margin: number;
  status: "active" | "inactive";
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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
    return matchSearch;
  });

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const msrp = parseFloat(newMsrp);
    const distPrice = parseFloat(newDistPrice);
    if (!newSku || !newName || !newCategory || isNaN(msrp) || isNaN(distPrice)) {
      return;
    }
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      sku: newSku,
      name: newName,
      category: newCategory,
      msrp,
      distributorPrice: distPrice,
      margin: Math.round(((msrp - distPrice) / msrp) * 100),
      status: "active",
      description: newDescription,
    };
    setProducts([...products, newProduct]);
    setShowAdd(false);
    setNewSku(""); setNewName(""); setNewCategory(""); setNewMsrp(""); setNewDistPrice(""); setNewDescription("");
  }

  const totalActive = products.filter((p) => p.status === "active").length;
  const avgMargin = products.length > 0 ? Math.round(products.reduce((s, p) => s + p.margin, 0) / products.length) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Manage products, SKUs, and pricing for partner deal registration</p>
        </div>
        <button className="btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="card" style={{ padding: "1.5rem", border: "2px solid #6366f1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Add New Product</h2>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
          <form onSubmit={handleAddProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>SKU *</label>
              <input className="input" value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="PROD-001" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Product Name *</label>
              <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enterprise Suite" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Category *</label>
              <input className="input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Software" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>MSRP *</label>
              <input className="input" type="number" value={newMsrp} onChange={(e) => setNewMsrp(e.target.value)} placeholder="999.00" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Distributor Price *</label>
              <input className="input" type="number" value={newDistPrice} onChange={(e) => setNewDistPrice(e.target.value)} placeholder="749.00" required />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="muted" style={{ fontSize: ".75rem", fontWeight: 600, display: "block", marginBottom: ".25rem" }}>Description</label>
              <textarea className="input" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Optional product description..." rows={2} />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
              <button type="button" className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="btn">Add Product</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Row */}
      {products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} color="#4338ca" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Total Products</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{products.length}</div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tag size={20} color="#047857" />
            </div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase" }}>Avg Margin</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{avgMargin}%</div>
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
            Products you add here will be available for partner deal registration. Add your product catalog to enable partners to select products when submitting deals.
          </p>
          <button className="btn" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input 
                className="input" 
                placeholder="Search products..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>SKU</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>MSRP</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 1.25rem", fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".85rem", fontFamily: "monospace" }}>{product.sku}</td>
                    <td style={{ padding: "0.75rem 1.25rem" }}>
                      <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{product.name}</div>
                      {product.description && <div className="muted" style={{ fontSize: ".75rem" }}>{product.description}</div>}
                    </td>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".85rem" }}>{product.category}</td>
                    <td style={{ padding: "0.75rem 1.25rem", fontSize: ".9rem", fontWeight: 600, textAlign: "right" }}>${product.msrp.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>
                      <span style={{ 
                        padding: "2px 8px", 
                        borderRadius: 999, 
                        fontSize: ".75rem", 
                        fontWeight: 600, 
                        background: product.margin >= 30 ? "#d1fae5" : product.margin >= 20 ? "#fef3c7" : "#fee2e2",
                        color: product.margin >= 30 ? "#047857" : product.margin >= 20 ? "#92400e" : "#991b1b"
                      }}>
                        {product.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
