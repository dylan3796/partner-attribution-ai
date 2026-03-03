export default function SetupLoading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "3px solid var(--border)",
          borderTopColor: "#6366f1", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
        }} />
        <p className="muted" style={{ fontSize: ".9rem" }}>Loading setup...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
