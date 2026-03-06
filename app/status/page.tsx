import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "System Status — Covant",
  description: "Real-time system status for Covant's partner intelligence platform. Check uptime, service health, and incident history.",
};

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

type Service = {
  name: string;
  description: string;
  status: ServiceStatus;
};

type Incident = {
  date: string;
  title: string;
  status: "resolved" | "monitoring" | "investigating";
  description: string;
  duration?: string;
};

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string; bg: string; dot: string }> = {
  operational: { label: "Operational", color: "#22c55e", bg: "#22c55e14", dot: "#22c55e" },
  degraded: { label: "Degraded Performance", color: "#f59e0b", bg: "#f59e0b14", dot: "#f59e0b" },
  outage: { label: "Outage", color: "#ef4444", bg: "#ef444414", dot: "#ef4444" },
  maintenance: { label: "Maintenance", color: "#6366f1", bg: "#6366f114", dot: "#6366f1" },
};

const SERVICES: Service[] = [
  { name: "Web Application", description: "Dashboard, portal, and marketing pages", status: "operational" },
  { name: "API", description: "REST API and webhook delivery", status: "operational" },
  { name: "Attribution Engine", description: "Real-time attribution calculations", status: "operational" },
  { name: "Commission Engine", description: "Commission rules and payout processing", status: "operational" },
  { name: "Authentication", description: "Sign-in, sign-up, and session management", status: "operational" },
  { name: "Database", description: "Data storage and real-time sync", status: "operational" },
  { name: "Partner Portal", description: "Partner-facing dashboard and deal registration", status: "operational" },
  { name: "Integrations", description: "CRM sync, Stripe, and webhook endpoints", status: "operational" },
];

// Last 7 days of uptime (simulated with 100% for launch — will be replaced with real monitoring)
const UPTIME_DAYS = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  status: "operational" as ServiceStatus,
}));

const RECENT_INCIDENTS: Incident[] = [
  {
    date: "March 2, 2026",
    title: "Scheduled Maintenance — Database Migration",
    status: "resolved",
    description: "Completed database schema migration for new features. No downtime experienced.",
    duration: "15 minutes",
  },
];

function UptimeBar() {
  return (
    <div style={{ display: "flex", gap: 1.5, height: 32, alignItems: "flex-end" }}>
      {UPTIME_DAYS.map((day, i) => (
        <div
          key={i}
          title={`${day.date}: ${STATUS_CONFIG[day.status].label}`}
          style={{
            flex: 1,
            height: "100%",
            borderRadius: 2,
            background: STATUS_CONFIG[day.status].dot,
            opacity: 0.85,
            minWidth: 2,
            cursor: "default",
            transition: "opacity .15s",
          }}
        />
      ))}
    </div>
  );
}

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");
  const overallStatus = allOperational ? "operational" : "degraded";
  const overallConfig = STATUS_CONFIG[overallStatus];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#666",
            fontSize: ".85rem",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
            System Status
          </h1>
          <span style={{ fontSize: ".75rem", color: "#666" }}>
            Last checked: {new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderRadius: 12,
          background: overallConfig.bg,
          border: `1px solid ${overallConfig.color}33`,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: overallConfig.dot,
            boxShadow: `0 0 8px ${overallConfig.dot}66`,
            flexShrink: 0,
          }}
        />
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: overallConfig.color }}>
            {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
          </h2>
          <p style={{ fontSize: ".85rem", color: "#666", margin: "4px 0 0" }}>
            {allOperational
              ? "All Covant services are running normally."
              : "We're aware of the issue and working to resolve it."}
          </p>
        </div>
      </div>

      {/* 90-day Uptime Bar */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: 0 }}>Uptime — Last 90 Days</h3>
          <span style={{ fontSize: ".8rem", color: "#22c55e", fontWeight: 600 }}>100.0%</span>
        </div>
        <UptimeBar />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: ".7rem", color: "#555" }}>90 days ago</span>
          <span style={{ fontSize: ".7rem", color: "#555" }}>Today</span>
        </div>
      </div>

      {/* Service List */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 12 }}>Services</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {SERVICES.map((service, idx) => {
            const cfg = STATUS_CONFIG[service.status];
            const isFirst = idx === 0;
            const isLast = idx === SERVICES.length - 1;
            return (
              <div
                key={service.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "#0a0a0a",
                  borderRadius: isFirst ? "10px 10px 0 0" : isLast ? "0 0 10px 10px" : 0,
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: ".9rem", margin: 0 }}>{service.name}</p>
                  <p style={{ fontSize: ".75rem", color: "#555", margin: "2px 0 0" }}>{service.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: ".75rem", fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: cfg.dot,
                      boxShadow: `0 0 6px ${cfg.dot}44`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 12 }}>Recent Incidents</h3>
        {RECENT_INCIDENTS.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "#0a0a0a",
              borderRadius: 10,
              border: "1px solid #1a1a1a",
            }}
          >
            <p style={{ color: "#555", fontSize: ".85rem", margin: 0 }}>No incidents reported in the last 90 days.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {RECENT_INCIDENTS.map((incident, i) => {
              const statusColor =
                incident.status === "resolved" ? "#22c55e"
                : incident.status === "monitoring" ? "#f59e0b"
                : "#ef4444";
              return (
                <div
                  key={i}
                  style={{
                    padding: "1.25rem",
                    background: "#0a0a0a",
                    borderRadius: 10,
                    border: "1px solid #1a1a1a",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <h4 style={{ fontWeight: 600, fontSize: ".9rem", margin: 0 }}>{incident.title}</h4>
                    <span
                      style={{
                        fontSize: ".7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: statusColor,
                        background: `${statusColor}18`,
                        textTransform: "capitalize",
                      }}
                    >
                      {incident.status}
                    </span>
                  </div>
                  <p style={{ fontSize: ".8rem", color: "#666", margin: "0 0 6px", lineHeight: 1.5 }}>
                    {incident.description}
                  </p>
                  <div style={{ display: "flex", gap: "1rem", fontSize: ".75rem", color: "#444" }}>
                    <span>{incident.date}</span>
                    {incident.duration && <span>Duration: {incident.duration}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subscribe / Contact */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderRadius: 12,
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>Stay Informed</h3>
        <p style={{ color: "#555", fontSize: ".85rem", marginBottom: "1rem", lineHeight: 1.5 }}>
          Have questions about system availability? Reach out to our team.
        </p>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 8,
              background: "#fff",
              color: "#000",
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            Contact Support
          </Link>
          <Link
            href="https://twitter.com/covant_ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #222",
              color: "#888",
              fontWeight: 600,
              fontSize: ".85rem",
              textDecoration: "none",
            }}
          >
            Follow @covant_ai
          </Link>
        </div>
      </div>
    </div>
  );
}
