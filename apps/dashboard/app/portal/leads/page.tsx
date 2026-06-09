"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePortal } from "@/lib/portal-context";
import Link from "next/link";
import { Send, Inbox } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  demo_scheduled: "Demo Scheduled",
  demo_completed: "Demo Done",
  qualified: "Qualified",
  customer: "Won",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#6366f1",
  contacted: "#f59e0b",
  demo_scheduled: "#3b82f6",
  demo_completed: "#8b5cf6",
  qualified: "#10b981",
  customer: "#22c55e",
  lost: "#6b7280",
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatValue(v?: number) {
  if (!v) return "—";
  if (v >= 200000) return "$100k+";
  if (v >= 100000) return "$50-100k";
  if (v >= 50000) return "$10-50k";
  return "<$10k";
}

export default function PartnerLeadsPage() {
  const { partner } = usePortal();
  const leads = useQuery(api.leads.getByPartner, partner ? { partnerEmail: partner.contactEmail } : "skip") ?? [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>My Leads</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Track leads you&apos;ve submitted and their progress.</p>
        </div>
        <Link
          href="/portal/submit-lead"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 1.25rem",
            borderRadius: 8,
            background: "#6366f1",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          <Send size={14} /> Submit a New Lead
        </Link>
      </div>

      {leads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <Inbox size={36} style={{ color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>You haven&apos;t submitted any leads yet.</p>
          <Link
            href="/portal/submit-lead"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 8,
              background: "#6366f1",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <Send size={14} /> Submit Your First Lead
          </Link>
        </div>
      ) : (
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Contact", "Company", "Submitted", "Status", "Est. Value"].map((h) => (
                    <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={lead._id} style={{ borderBottom: i < leads.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{lead.contactName || lead.email}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{lead.email}</div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "var(--muted)", fontSize: "0.9rem" }}>{lead.company || "—"}</td>
                    <td style={{ padding: "1rem 1.25rem", color: "var(--muted)", fontSize: "0.85rem" }}>{formatDate(lead.createdAt)}</td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: (STATUS_COLORS[lead.status] || "#666") + "20",
                        color: STATUS_COLORS[lead.status] || "#666",
                      }}>
                        {STATUS_LABELS[lead.status] || lead.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "var(--muted)", fontSize: "0.85rem" }}>{formatValue(lead.estimatedValue)}</td>
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
