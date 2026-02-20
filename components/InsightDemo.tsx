import { BarChart2, DollarSign, AlertCircle } from "lucide-react";

const revenueData = [
  { name: "TechBridge Solutions", amount: "$247,400", trend: "↑32%", trendUp: true, pct: 100 },
  { name: "Apex Growth Group", amount: "$189,200", trend: "↑18%", trendUp: true, pct: 76.5 },
  { name: "Stackline Partners", amount: "$134,600", trend: "↓4%", trendUp: false, pct: 54.5 },
  { name: "Northlight Digital", amount: "$89,100", trend: "↑61%", trendUp: true, pct: 36 },
  { name: "Clearpath Ventures", amount: "$52,300", trend: "new", trendUp: null as boolean | null, pct: 21.2 },
];

const commissionData = [
  { name: "TechBridge Solutions", amount: "$18,550", tier: "10% · Gold", status: "Ready", ready: true },
  { name: "Apex Growth Group", amount: "$14,190", tier: "10% · Gold", status: "Ready", ready: true },
  { name: "Stackline Partners", amount: "$6,730", tier: "8% · Silver", status: "Pending", ready: false },
  { name: "Northlight Digital", amount: "$6,680", tier: "8% · Silver", status: "Ready", ready: true },
  { name: "Clearpath Ventures", amount: "$2,615", tier: "8% · Silver", status: "Pending", ready: false },
];

const signalData = [
  { warn: true, name: "Clearpath Ventures", detail: "No deals registered in 34 days · Re-engage" },
  { warn: true, name: "Stackline Partners", detail: "Missed tier threshold by 12% · At risk of downgrade" },
  { warn: false, name: "Northlight Digital", detail: "Up 61% QoQ · Eligible for Gold promotion" },
  { warn: false, name: "TechBridge Solutions", detail: "4 deals closed this month · On track for Platinum" },
];

const headerStyle: React.CSSProperties = {
  fontSize: ".8rem",
  fontWeight: 700,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1rem",
};

const linkStyle: React.CSSProperties = {
  fontSize: ".75rem",
  color: "#555",
  fontWeight: 500,
  textTransform: "none",
  letterSpacing: 0,
};

const nameStyle: React.CSSProperties = {
  fontSize: ".9rem",
  fontWeight: 600,
  color: "#e5e5e5",
  minWidth: 0,
};

const numStyle: React.CSSProperties = {
  fontSize: ".9rem",
  fontWeight: 700,
  color: "#fff",
  fontVariantNumeric: "tabular-nums",
};

const footerStyle: React.CSSProperties = {
  fontSize: ".75rem",
  color: "#555",
  marginTop: ".75rem",
  paddingTop: ".75rem",
  borderTop: "1px solid #111",
};

const widgetStyle: React.CSSProperties = {
  background: "#0d0d0d",
  border: "1px solid #1e1e1e",
  borderRadius: 12,
  padding: "1.25rem 1.5rem",
};

function rowBorder(isLast: boolean): React.CSSProperties {
  return {
    padding: ".6rem 0",
    borderBottom: isLast ? "none" : "1px solid #111",
  };
}

export default function InsightDemo() {
  return (
    <div style={{
      background: "#080808",
      border: "1px solid #1a1a1a",
      borderRadius: 20,
      padding: "clamp(.75rem, 3vw, 1.5rem)",
      maxWidth: 800,
      margin: "0 auto",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: ".5rem",
        marginBottom: "1.25rem",
        paddingBottom: ".75rem",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
        </div>
        <span style={{ flex: 1, textAlign: "center", fontSize: ".75rem", color: "#444", fontWeight: 500 }}>
          Covant — Partner Intelligence
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Widget 1 — Partner Revenue */}
        <div style={widgetStyle}>
          <div style={headerStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <BarChart2 size={14} />
              Partner Revenue · Q1 2026
            </span>
            <span style={linkStyle}>View all →</span>
          </div>
          {revenueData.map((r, i) => (
            <div key={r.name} style={{ ...rowBorder(i === revenueData.length - 1), display: "flex", alignItems: "center", gap: ".75rem" }}>
              <span style={{ ...nameStyle, flex: "1 1 120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
              <div style={{ flex: "2 1 60px", height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${r.pct}%`, height: "100%", background: "#6366f1", borderRadius: 2 }} />
              </div>
              <span style={{ ...numStyle, flex: "0 0 65px", textAlign: "right", fontSize: ".85rem" }}>{r.amount}</span>
              <span style={{
                flex: "0 0 36px",
                textAlign: "right",
                fontSize: ".8rem",
                fontWeight: 600,
                color: r.trendUp === null ? "#666" : r.trendUp ? "#22c55e" : "#ef4444",
              }}>
                {r.trend}
              </span>
            </div>
          ))}
          <div style={footerStyle}>Total attributed: $712,600 · 68% of closed revenue</div>
        </div>

        {/* Widget 2 — Commissions Due */}
        <div style={widgetStyle}>
          <div style={headerStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <DollarSign size={14} />
              Commissions Due · Q1 2026
            </span>
            <span style={linkStyle}>Approve all →</span>
          </div>
          {commissionData.map((c, i) => (
            <div key={c.name} style={{ ...rowBorder(i === commissionData.length - 1), display: "flex", alignItems: "center", gap: ".75rem" }}>
              <span style={{ ...nameStyle, flex: "1 1 120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              <span style={{ ...numStyle, flex: "0 0 60px", fontSize: ".85rem" }}>{c.amount}</span>
              <span style={{ flex: 1, fontSize: ".8rem", color: "#555" }}>{c.tier}</span>
              <span style={{
                fontSize: ".75rem",
                fontWeight: 600,
                padding: ".2rem .6rem",
                borderRadius: 4,
                background: c.ready ? "rgba(34,197,94,.08)" : "rgba(245,158,11,.08)",
                color: c.ready ? "#22c55e" : "#f59e0b",
              }}>
                {c.status}
              </span>
            </div>
          ))}
          <div style={footerStyle}>$48,765 total due · Calculated automatically · 0 disputes</div>
        </div>

        {/* Widget 3 — Partner Signals */}
        <div style={widgetStyle}>
          <div style={headerStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <AlertCircle size={14} />
              Partner Signals
              <span style={{
                fontSize: ".7rem",
                fontWeight: 700,
                padding: ".15rem .5rem",
                borderRadius: 10,
                background: "rgba(239,68,68,.15)",
                color: "#ef4444",
                textTransform: "none",
                letterSpacing: 0,
              }}>
                2 need action
              </span>
            </span>
          </div>
          {signalData.map((s, i) => (
            <div key={s.name} style={{ ...rowBorder(i === signalData.length - 1), display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
              <span style={{ color: s.warn ? "#f59e0b" : "#22c55e", flexShrink: 0, fontSize: ".9rem" }}>
                {s.warn ? "⚠️" : "✓"}
              </span>
              <div>
                <span style={nameStyle}>{s.name}</span>
                <span style={{ color: "#555", marginLeft: ".5rem", fontSize: ".85rem" }}> — {s.detail}</span>
              </div>
            </div>
          ))}
          <div style={footerStyle}>Signals update automatically as deal data changes</div>
        </div>
      </div>
    </div>
  );
}
