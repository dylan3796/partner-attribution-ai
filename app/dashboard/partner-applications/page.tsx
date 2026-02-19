"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  Mail, 
  Globe, 
  User,
  Briefcase,
  Calendar,
  ExternalLink,
  Loader2,
  Inbox,
  Filter,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const partnerTypeLabels: Record<string, string> = {
  reseller: "Reseller",
  referral: "Referral",
  integration: "Integration",
  agency: "Agency",
};

const statusStyles: Record<string, { bg: string; color: string; icon: typeof Clock }> = {
  pending: { bg: "#fef3c7", color: "#92400e", icon: Clock },
  approved: { bg: "#d1fae5", color: "#065f46", icon: CheckCircle },
  rejected: { bg: "#fee2e2", color: "#991b1b", icon: XCircle },
};

export default function PartnerApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const { toast } = useToast();

  const applications = useQuery(
    api.partnerApplications.getApplications,
    statusFilter === "all" ? {} : { status: statusFilter as "pending" | "approved" | "rejected" }
  );

  const updateStatus = useMutation(api.partnerApplications.updateApplicationStatus);

  const handleUpdateStatus = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      await updateStatus({
        applicationId: applicationId as Id<"partnerApplications">,
        status,
        reviewedBy: "admin", // In real app, get from auth context
      });
      toast(
        status === "approved" 
          ? "Application approved successfully" 
          : "Application rejected",
        status === "approved" ? "success" : "info"
      );
      setSelectedApp(null);
    } catch {
      toast("Failed to update application status", "error");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = applications?.filter(a => a.status === "pending").length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Partner Applications
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Review and manage incoming partner program applications
          </p>
        </div>

        {pendingCount > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#fef3c7",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#92400e",
          }}>
            <Clock size={16} />
            {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Filter size={16} color="var(--muted)" />
        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>Filter:</span>
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              border: statusFilter === status ? "1px solid #6366f1" : "1px solid var(--border)",
              background: statusFilter === status ? "rgba(99, 102, 241, 0.1)" : "transparent",
              color: statusFilter === status ? "#6366f1" : "var(--muted)",
              fontWeight: 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {applications === undefined ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Loader2 size={24} className="spin" style={{ margin: "0 auto 1rem" }} />
          <p className="muted">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            background: "var(--subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <Inbox size={28} color="var(--muted)" />
          </div>
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No applications yet</h3>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            {statusFilter === "all" 
              ? "Partner applications will appear here when submitted." 
              : `No ${statusFilter} applications found.`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {applications.map((app) => {
            const statusStyle = statusStyles[app.status];
            const StatusIcon = statusStyle.icon;
            const isExpanded = selectedApp === app._id;

            return (
              <div
                key={app._id}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  border: isExpanded ? "2px solid #6366f1" : undefined,
                }}
              >
                {/* Summary Row */}
                <button
                  onClick={() => setSelectedApp(isExpanded ? null : app._id)}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {/* Company Avatar */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: "var(--fg)",
                    color: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}>
                    {app.company.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Main Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 600, fontSize: "1rem" }}>{app.company}</span>
                      <span className="badge" style={{ fontSize: "0.7rem", textTransform: "capitalize" }}>
                        {partnerTypeLabels[app.partnerType]}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--muted)", fontSize: "0.85rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <User size={14} /> {app.name}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Mail size={14} /> {app.email}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}>
                    <StatusIcon size={14} />
                    {app.status}
                  </div>

                  {/* Date */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    <Calendar size={14} />
                    {formatDate(app.submittedAt)}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{
                    padding: "1.5rem",
                    borderTop: "1px solid var(--border)",
                    background: "var(--subtle)",
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Contact
                        </p>
                        <p style={{ fontWeight: 500 }}>{app.name}{app.title && <span style={{ color: "var(--muted)" }}> · {app.title}</span>}</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{app.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Company
                        </p>
                        <p style={{ fontWeight: 500 }}>{app.company}</p>
                        {app.website && (
                          <a 
                            href={app.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.9rem", color: "#6366f1", display: "flex", alignItems: "center", gap: "0.25rem" }}
                          >
                            <Globe size={14} /> {app.website.replace(/^https?:\/\//, "")}
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Partner Type
                        </p>
                        <p style={{ fontWeight: 500 }}>{partnerTypeLabels[app.partnerType]}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Est. Deals/Quarter
                        </p>
                        <p style={{ fontWeight: 500 }}>{app.estimatedDeals}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        About Their Business
                      </p>
                      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--fg)" }}>
                        {app.description}
                      </p>
                    </div>

                    {app.source && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          How They Heard About Us
                        </p>
                        <p style={{ fontSize: "0.9rem" }}>{app.source}</p>
                      </div>
                    )}

                    {app.reviewedAt && (
                      <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border)" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                          {app.status === "approved" ? "Approved" : "Rejected"} by {app.reviewedBy || "admin"} on {formatDate(app.reviewedAt)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {app.status === "pending" && (
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                        <button
                          className="btn-outline"
                          onClick={() => handleUpdateStatus(app._id, "rejected")}
                          style={{ borderColor: "#fca5a5", color: "#991b1b" }}
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleUpdateStatus(app._id, "approved")}
                          style={{ background: "#059669" }}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
