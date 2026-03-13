"use client";

import Link from "next/link";


const tools = [
  {
    href: "/tools/commission-calculator",
    engine: "Incentives Engine",
    engineColor: "#10b981",
    title: "Commission Calculator",
    description: "Calculate partner commission rates by type and tier. See monthly and annual totals instantly.",
    time: "30 seconds",
    icon: "💰",
  },
  {
    href: "/tools/attribution-quiz",
    engine: "Attribution Engine",
    engineColor: "#6366f1",
    title: "Attribution Model Quiz",
    description: "6 questions that tell you which attribution model fits your program — and why.",
    time: "2 minutes",
    icon: "🎯",
  },
  {
    href: "/tools/partner-health",
    engine: "Intelligence Engine",
    engineColor: "#f59e0b",
    title: "Partner Health Scorecard",
    description: "Grade your partner program across 4 dimensions. See exactly where you're leaving revenue on the table.",
    time: "60 seconds",
    icon: "📊",
  },
];

export default function ToolsPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
          Covant.ai
        </Link>
        <Link href="/sign-up" style={{ background: "#fff", color: "#000", padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>
          Get Started Free
        </Link>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-block", background: "#111", border: "1px solid #222", borderRadius: "100px", padding: "0.35rem 1rem", fontSize: "0.8rem", color: "#888", marginBottom: "1.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Free Tools
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.15 }}>
            Free partner program tools.
          </h1>
          <p style={{ color: "#888", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
            No signup required. Built by the team behind Covant.
          </p>
        </div>

        {/* Tool cards */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                transition: "border-color 0.15s",
                cursor: "pointer",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#333"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a"; }}
              >
                <div style={{ fontSize: "2.5rem", flexShrink: 0 }}>{tool.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>{tool.title}</h2>
                    <span style={{ background: "#111", border: `1px solid ${tool.engineColor}33`, color: tool.engineColor, fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: 500 }}>
                      {tool.engine}
                    </span>
                    <span style={{ color: "#555", fontSize: "0.8rem" }}>{tool.time}</span>
                  </div>
                  <p style={{ color: "#888", margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>{tool.description}</p>
                </div>
                <div style={{ color: "#444", fontSize: "1.25rem", flexShrink: 0 }}>→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: "center", marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid #111" }}>
          <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Ready to automate all of this?
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{ background: "#fff", color: "#000", padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
              Get Started Free →
            </Link>
            <Link href="/pricing" style={{ border: "1px solid #333", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 500 }}>
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
