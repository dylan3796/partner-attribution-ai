export default function PortalLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <div style={{ width: 240, height: 28, background: "var(--border)", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ width: 320, height: 16, background: "var(--border)", borderRadius: 6, opacity: 0.5 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ width: 80, height: 12, background: "var(--border)", borderRadius: 4, margin: "0 auto 8px", opacity: 0.4 }} />
            <div style={{ width: 60, height: 28, background: "var(--border)", borderRadius: 6, margin: "0 auto", opacity: 0.3 }} />
          </div>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ width: 180, height: 16, background: "var(--border)", borderRadius: 6, marginBottom: 12, opacity: 0.4 }} />
          <div style={{ width: "100%", height: 8, background: "var(--border)", borderRadius: 4, opacity: 0.2 }} />
        </div>
      ))}
      <style>{`
        @keyframes shimmer { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
        .card { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
