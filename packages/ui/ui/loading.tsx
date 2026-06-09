"use client";

export function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

export function LoadingPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
      <div style={{ textAlign: "center" }}>
        <LoadingSpinner size={32} />
        <p className="muted" style={{ marginTop: "1rem" }}>Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="stat-grid" style={{ marginBottom: "2rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: "1.5rem" }}>
          <div className="skeleton skeleton-text" style={{ width: "60%", height: "0.75rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "40%", height: "1.8rem", marginTop: "0.5rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "50%", height: "0.65rem", marginTop: "0.5rem" }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "0.8rem 1.2rem", background: "var(--subtle)", borderBottom: "1px solid var(--border)" }}>
        <div className="skeleton skeleton-text" style={{ width: "30%", height: "0.75rem" }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "2rem", padding: "1rem 1.2rem", borderBottom: "1px solid var(--border)" }}>
          <div className="skeleton skeleton-text" style={{ width: "40%", height: "0.85rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "20%", height: "0.85rem" }} />
          <div className="skeleton skeleton-text" style={{ width: "15%", height: "0.85rem" }} />
        </div>
      ))}
    </div>
  );
}
