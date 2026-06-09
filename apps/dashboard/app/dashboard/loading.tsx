export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "0" }}>
      {/* Header skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ width: 200, height: 28, background: "var(--border)", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ width: 300, height: 16, background: "var(--border)", borderRadius: 6, opacity: 0.5 }} />
        </div>
      </div>
      {/* Stat cards skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--border)", opacity: 0.3 }} />
            <div>
              <div style={{ width: 80, height: 12, background: "var(--border)", borderRadius: 4, marginBottom: 8, opacity: 0.4 }} />
              <div style={{ width: 60, height: 24, background: "var(--border)", borderRadius: 6, opacity: 0.3 }} />
            </div>
          </div>
        ))}
      </div>
      {/* Content skeleton */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ width: 160, height: 16, background: "var(--border)", borderRadius: 6, marginBottom: 16, opacity: 0.4 }} />
        <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, opacity: 0.2 }} />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 140, height: 18, background: "var(--border)", borderRadius: 6, opacity: 0.4 }} />
              <div style={{ width: 60, height: 20, background: "var(--border)", borderRadius: 10, opacity: 0.2 }} />
            </div>
            <div style={{ width: 80, height: 16, background: "var(--border)", borderRadius: 6, opacity: 0.3 }} />
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[100, 80, 60].map((w, j) => (
              <div key={j} style={{ width: w, height: 12, background: "var(--border)", borderRadius: 4, opacity: 0.2 }} />
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .card { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
