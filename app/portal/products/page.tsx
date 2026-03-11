"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/utils";
import { Package, Search, Tag, TrendingUp, DollarSign, BarChart2 } from "lucide-react";

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ width: 200, height: 28, borderRadius: 6, background: "var(--subtle)" }} />
        <div style={{ width: 300, height: 16, borderRadius: 4, background: "var(--border)", marginTop: 8 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ height: 100 }}>
            <div style={{ width: "60%", height: 14, borderRadius: 4, background: "var(--subtle)", margin: "0 auto 12px" }} />
            <div style={{ width: "40%", height: 28, borderRadius: 4, background: "var(--subtle)", margin: "0 auto" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ height: 180 }}>
            <div style={{ width: "70%", height: 16, borderRadius: 4, background: "var(--subtle)", marginBottom: 8 }} />
            <div style={{ width: "50%", height: 12, borderRadius: 4, background: "var(--border)", marginBottom: 16 }} />
            <div style={{ width: "100%", height: 12, borderRadius: 4, background: "var(--border)", marginBottom: 6 }} />
            <div style={{ width: "80%", height: 12, borderRadius: 4, background: "var(--border)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortalProductsPage() {
  const { partner } = usePortal();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const data = useQuery(
    api.portalProducts.getProducts,
    partner?.id ? { partnerId: partner.id as Id<"partners"> } : "skip"
  );

  if (!partner) return null;
  if (data === undefined) return <LoadingSkeleton />;
  if (data === null) return <EmptyState />;

  const { products, categories, totalProducts, partnerTier, defaultCommissionRate } = data;

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const productsWithDeals = filtered.filter((p) => p.dealsTotal > 0);
  const productsWithoutDeals = filtered.filter((p) => p.dealsTotal === 0);

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const totalDealsWon = products.reduce((s, p) => s + p.dealsWon, 0);

  const tierColors: Record<string, string> = {
    bronze: "#cd7f32",
    silver: "#9ca3af",
    gold: "#d97706",
    platinum: "#818cf8",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Browse products, pricing, and your sales activity
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <Package size={20} color="#6366f1" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Available Products</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{totalProducts}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <Tag size={20} color="#d97706" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Categories</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{categories.length}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <TrendingUp size={20} color="#059669" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Deals Won</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>{totalDealsWon}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <DollarSign size={20} color="#22c55e" style={{ margin: "0 auto .5rem" }} />
          <p className="muted" style={{ fontSize: ".8rem" }}>Revenue Sold</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22c55e" }}>{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Tier badge */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <span
            style={{
              padding: ".25rem .75rem",
              borderRadius: 12,
              fontSize: ".8rem",
              fontWeight: 700,
              background: `${tierColors[partnerTier] || "#6b7280"}18`,
              color: tierColors[partnerTier] || "#6b7280",
              border: `1px solid ${tierColors[partnerTier] || "#6b7280"}40`,
              textTransform: "capitalize",
            }}
          >
            {partnerTier} Partner
          </span>
          <span className="muted" style={{ fontSize: ".85rem" }}>
            Base commission rate: <strong style={{ color: "#fff" }}>{Math.round(defaultCommissionRate * 100)}%</strong>
          </span>
        </div>
        <BarChart2 size={16} color="var(--muted)" />
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, width: "100%" }}
          />
        </div>
        <select
          className="input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products You've Sold */}
      {productsWithDeals.length > 0 && (
        <>
          <h2
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <TrendingUp size={18} color="#059669" /> Products You&apos;ve Sold
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {productsWithDeals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                tierColor={tierColors[partnerTier] || "#6b7280"}
                defaultRate={defaultCommissionRate}
              />
            ))}
          </div>
        </>
      )}

      {/* Other Products */}
      {productsWithoutDeals.length > 0 && (
        <>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: ".5rem" }}>
            {productsWithDeals.length > 0 ? "Other Available Products" : "Available Products"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {productsWithoutDeals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                tierColor={tierColors[partnerTier] || "#6b7280"}
                defaultRate={defaultCommissionRate}
              />
            ))}
          </div>
        </>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <Search size={40} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
          <p className="muted">No products match your search. Try a different term or category.</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  tierColor,
  defaultRate,
}: {
  product: {
    _id: string;
    name: string;
    sku: string;
    category: string;
    msrp: number;
    distributorPrice: number;
    margin: number;
    description?: string;
    commissionRate: number | null;
    dealsTotal: number;
    dealsWon: number;
    revenue: number;
  };
  tierColor: string;
  defaultRate: number;
}) {
  const effectiveRate = product.commissionRate ?? defaultRate;

  return (
    <div
      className="card"
      style={{
        borderLeft: product.dealsTotal > 0 ? `4px solid #059669` : `4px solid ${tierColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: ".75rem",
        }}
      >
        <div>
          <p style={{ fontWeight: 700, fontSize: "1rem" }}>{product.name}</p>
          <p className="muted" style={{ fontSize: ".8rem" }}>
            {product.sku} · {product.category}
          </p>
        </div>
        <span
          style={{
            padding: ".2rem .6rem",
            borderRadius: 12,
            fontSize: ".7rem",
            fontWeight: 600,
            background: "rgba(34,197,94,.12)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,.25)",
          }}
        >
          {Math.round(effectiveRate * 100)}% commission
        </span>
      </div>

      {product.description && (
        <p className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5, marginBottom: ".75rem" }}>
          {product.description}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem", marginBottom: ".75rem" }}>
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>MSRP</p>
          <p style={{ fontWeight: 700, fontSize: ".95rem" }}>{formatCurrency(product.msrp)}</p>
        </div>
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>Partner Price</p>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#059669" }}>
            {formatCurrency(product.distributorPrice)}
          </p>
        </div>
        <div>
          <p className="muted" style={{ fontSize: ".7rem" }}>Margin</p>
          <p style={{ fontWeight: 700, fontSize: ".95rem", color: "#d97706" }}>{product.margin}%</p>
        </div>
      </div>

      {product.dealsTotal > 0 && (
        <div
          style={{
            padding: ".5rem .75rem",
            borderRadius: 6,
            background: "rgba(34,197,94,.08)",
            border: "1px solid rgba(34,197,94,.2)",
            fontSize: ".8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            📊 {product.dealsWon} won / {product.dealsTotal} total deals
          </span>
          {product.revenue > 0 && (
            <span style={{ fontWeight: 700, color: "#22c55e" }}>{formatCurrency(product.revenue)}</span>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Product Catalog</h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>Browse products, pricing, and your sales activity</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <Package size={48} color="var(--muted)" style={{ margin: "0 auto .75rem" }} />
        <h3 style={{ fontWeight: 700, marginBottom: ".5rem" }}>No Products Yet</h3>
        <p className="muted" style={{ maxWidth: 400, margin: "0 auto" }}>
          Your partner program hasn&apos;t added any products to the catalog yet. Products will appear here once your partner manager adds them.
        </p>
      </div>
    </div>
  );
}
