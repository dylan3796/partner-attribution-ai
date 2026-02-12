"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Package, Search, Shield, Tag } from "lucide-react";

export default function PortalProductsPage() {
  const { partner } = usePortal();
  const { products, partnerProductCerts, productRebates } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  if (!partner) return null;

  const linkedIds = partner.linkedPartnerIds;
  const myCerts = partnerProductCerts.filter((c) => linkedIds.includes(c.partnerId) && c.status === "active");
  const myCertProductIds = new Set(myCerts.map((c) => c.productId));

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products
    .filter((p) => p.status !== "discontinued")
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });

  const certifiedProducts = filtered.filter((p) => myCertProductIds.has(p._id));
  const otherProducts = filtered.filter((p) => !myCertProductIds.has(p._id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Browse products, pricing, and your certifications</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <Package size={20} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Available Products</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{filtered.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Shield size={20} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Your Certifications</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{myCerts.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Tag size={20} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Product Categories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{categories.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="Search products..."
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

      {/* Certified Products */}
      {certifiedProducts.length > 0 && (
        <>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Shield size={18} color="#059669" /> Products You&apos;re Certified to Sell
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {certifiedProducts.map((product) => {
              const cert = myCerts.find((c) => c.productId === product._id);
              const rebate = productRebates.find((r) => r.productId === product._id);
              const levelColors: Record<string, string> = { authorized: "#6b7280", preferred: "#2563eb", elite: "#d97706" };

              return (
                <div key={product._id} className="card" style={{ borderLeft: `4px solid ${levelColors[cert?.level || "authorized"]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "1rem" }}>{product.name}</p>
                      <p className="muted" style={{ fontSize: ".8rem" }}>{product.sku} · {product.category}</p>
                    </div>
                    {cert && (
                      <span style={{
                        padding: ".2rem .6rem", borderRadius: 12, fontSize: ".7rem", fontWeight: 600,
                        background: `${levelColors[cert.level]}18`, color: levelColors[cert.level],
                        border: `1px solid ${levelColors[cert.level]}40`, textTransform: "capitalize"
                      }}>
                        {cert.level}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, marginBottom: ".75rem" }}>{product.description}</p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem" }}>
                    <div>
                      <p className="muted" style={{ fontSize: ".7rem" }}>MSRP</p>
                      <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{formatCurrency(product.msrp)}</p>
                    </div>
                    <div>
                      <p className="muted" style={{ fontSize: ".7rem" }}>Your Price</p>
                      <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#059669" }}>{formatCurrency(product.distributorPrice)}</p>
                    </div>
                    <div>
                      <p className="muted" style={{ fontSize: ".7rem" }}>Margin</p>
                      <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#d97706" }}>{product.margin}%</p>
                    </div>
                  </div>
                  {rebate && (
                    <div style={{ marginTop: ".75rem", padding: ".4rem .75rem", borderRadius: 6, background: "#fffbeb", border: "1px solid #fde68a", fontSize: ".8rem" }}>
                      🎯 Additional {rebate.rebatePercent}% rebate available (min {rebate.minUnits} units)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Other Available Products */}
      {otherProducts.length > 0 && (
        <>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: ".5rem" }}>
            Other Available Products
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {otherProducts.map((product) => (
              <div key={product._id} className="card" style={{ opacity: 0.8 }}>
                <div style={{ marginBottom: ".75rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "1rem" }}>{product.name}</p>
                  <p className="muted" style={{ fontSize: ".8rem" }}>{product.sku} · {product.category}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginBottom: ".75rem" }}>
                  <div>
                    <p className="muted" style={{ fontSize: ".7rem" }}>MSRP</p>
                    <p style={{ fontWeight: 700 }}>{formatCurrency(product.msrp)}</p>
                  </div>
                  <div>
                    <p className="muted" style={{ fontSize: ".7rem" }}>Dist. Price</p>
                    <p style={{ fontWeight: 700, color: "#059669" }}>{formatCurrency(product.distributorPrice)}</p>
                  </div>
                </div>
                <div style={{ padding: ".5rem .75rem", borderRadius: 6, background: "#fef3c7", border: "1px solid #fde68a", fontSize: ".8rem", color: "#92400e" }}>
                  ⚠️ Certification required — contact your partner manager
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
