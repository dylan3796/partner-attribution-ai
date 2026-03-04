"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Building2,
  Globe,
  Users,
  Loader2,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#eab308", bg: "#eab30815", icon: Clock },
  approved: { label: "Approved", color: "#22c55e", bg: "#22c55e15", icon: CheckCircle },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#ef444415", icon: XCircle },
};

const TYPE_LABELS: Record<string, string> = {
  reseller: "Reseller",
  referral: "Referral",
  integration: "Technology",
  affiliate: "Affiliate",
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PartnerApplicationsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const { toast } = useToast();
  const applications = useQuery(
    api.partnerApplications.list,
    filter === "all" ? {} : { status: filter }
  );
  const counts = useQuery(api.partnerApplications.getCounts);
  const approveMut = useMutation(api.partnerApplications.approve);
  const rejectMut = useMutation(api.partnerApplications.reject);

  const isLoading = applications === undefined;

  async function handleApprove(id: Id<"partnerApplications">) {
    setActionLoading(id);
    try {
      await approveMut({ id, reviewNote: reviewNote.trim() || undefined });
      toast("Application approved");
      setReviewingId(null);
      setReviewNote("");
    } catch (err: any) {
      toast(err.message || "Failed to approve", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: Id<"partnerApplications">) {
    setActionLoading(id);
    try {
      await rejectMut({ id, reviewNote: reviewNote.trim() || undefined });
      toast("Application rejected");
      setReviewingId(null);
      setReviewNote("");
    } catch (err: any) {
      toast(err.message || "Failed to reject", "error");
    } finally {
      setActionLoading(null);
    }
  }

  function copyApplyLink() {
    navigator.clipboard.writeText("https://covant.ai/apply");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Partner Applications</h1>
          <p className="muted">Review and manage inbound partner applications</p>
        </div>
        <button className="btn-outline" onClick={copyApplyLink} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
          {copiedLink ? <Check size={15} /> : <Copy size={15} />}
          {copiedLink ? "Copied!" : "Copy Apply Link"}
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: "1.5rem", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total", value: counts?.total ?? 0, color: "var(--foreground)" },
          { label: "Pending", value: counts?.pending ?? 0, color: "#eab308" },
          { label: "Approved", value: counts?.approved ?? 0, color: "#22c55e" },
          { label: "Rejected", value: counts?.rejected ?? 0, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1rem 1.2rem" }}>
            <p className="muted" style={{ fontSize: ".75rem", marginBottom: ".2rem" }}>{s.label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.25rem" }}>
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: ".45rem .85rem",
              borderRadius: 8,
              border: filter === f ? "2px solid var(--primary, #6366f1)" : "1px solid var(--border)",
              background: filter === f ? "var(--primary-muted, rgba(99,102,241,.08))" : "transparent",
              color: filter === f ? "var(--primary, #6366f1)" : "var(--muted)",
              fontWeight: 600,
              fontSize: ".85rem",
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all .15s",
            }}
          >
            {f}
            {f !== "all" && counts && (
              <span style={{ marginLeft: ".35rem", fontSize: ".75rem", opacity: 0.7 }}>
                ({counts[f as keyof typeof counts]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <Loader2 size={28} color="var(--muted)" className="animate-spin" />
          <p className="muted" style={{ marginTop: ".5rem" }}>Loading applications…</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && applications?.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <UserPlus size={48} color="var(--muted)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontWeight: 600, marginBottom: ".5rem" }}>
            {filter === "all" ? "No applications yet" : `No ${filter} applications`}
          </h3>
          <p className="muted" style={{ fontSize: ".9rem", maxWidth: 420, margin: "0 auto 1.5rem" }}>
            {filter === "all"
              ? "Share your partner application link to start receiving inbound partner requests."
              : "Try a different filter to see more applications."}
          </p>
          {filter === "all" && (
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn" onClick={copyApplyLink} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                <Copy size={15} /> Copy Application Link
              </button>
              <a
                href="/apply"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
              >
                Preview Form <ExternalLink size={15} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Application Cards */}
      {!isLoading && applications && applications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {applications.map((app) => {
            const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG];
            const Icon = cfg.icon;
            const isReviewing = reviewingId === app._id;

            return (
              <div
                key={app._id}
                className="card"
                style={{ padding: "1.25rem", transition: "border-color .15s" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  {/* Left: Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".35rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{app.companyName}</h3>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 700, background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", gap: ".25rem" }}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                      <span className="chip" style={{ fontSize: ".7rem" }}>
                        {TYPE_LABELS[app.partnerType] || app.partnerType}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: ".4rem" }}>
                      <span className="muted" style={{ fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                        <Users size={13} /> {app.contactName}
                      </span>
                      <span className="muted" style={{ fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                        <Mail size={13} /> {app.email}
                      </span>
                      {app.website && (
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: ".85rem", display: "flex", alignItems: "center", gap: ".3rem", color: "var(--primary, #6366f1)" }}
                        >
                          <Globe size={13} /> Website
                        </a>
                      )}
                    </div>

                    {app.partnerCount && (
                      <p className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                        <Building2 size={12} /> Team: {app.partnerCount}
                      </p>
                    )}

                    {app.message && (
                      <div style={{ marginTop: ".5rem", padding: ".5rem .75rem", borderRadius: 8, background: "var(--subtle)", fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.5 }}>
                        <MessageSquare size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: ".3rem" }} />
                        {app.message}
                      </div>
                    )}

                    {app.reviewNote && app.status !== "pending" && (
                      <div style={{ marginTop: ".5rem", padding: ".5rem .75rem", borderRadius: 8, background: app.status === "approved" ? "rgba(34,197,94,.06)" : "rgba(239,68,68,.06)", fontSize: ".8rem", fontStyle: "italic", color: "var(--muted)" }}>
                        Review note: {app.reviewNote}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions + Time */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p className="muted" style={{ fontSize: ".8rem", marginBottom: ".5rem" }}>
                      {timeAgo(app.createdAt)}
                    </p>

                    {app.status === "pending" && !isReviewing && (
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <button
                          className="btn"
                          style={{ fontSize: ".8rem", padding: ".35rem .65rem", background: "#22c55e", display: "flex", alignItems: "center", gap: ".25rem" }}
                          onClick={() => handleApprove(app._id as Id<"partnerApplications">)}
                          disabled={actionLoading === app._id}
                        >
                          {actionLoading === app._id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                          Approve
                        </button>
                        <button
                          className="btn-outline"
                          style={{ fontSize: ".8rem", padding: ".35rem .65rem", color: "#ef4444", borderColor: "#ef444440" }}
                          onClick={() => { setReviewingId(app._id); setReviewNote(""); }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Reject with note */}
                    {app.status === "pending" && isReviewing && (
                      <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", minWidth: 200 }}>
                        <textarea
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="Reason (optional)"
                          rows={2}
                          style={{ fontSize: ".8rem", padding: ".4rem .6rem", borderRadius: 6, border: "1px solid var(--border)", background: "var(--subtle)", color: "var(--foreground)", resize: "none", fontFamily: "inherit" }}
                        />
                        <div style={{ display: "flex", gap: ".35rem" }}>
                          <button
                            className="btn"
                            style={{ flex: 1, fontSize: ".75rem", padding: ".3rem .5rem", background: "#ef4444" }}
                            onClick={() => handleReject(app._id as Id<"partnerApplications">)}
                            disabled={actionLoading === app._id}
                          >
                            {actionLoading === app._id ? <Loader2 size={12} className="animate-spin" /> : "Confirm Reject"}
                          </button>
                          <button
                            className="btn-outline"
                            style={{ fontSize: ".75rem", padding: ".3rem .5rem" }}
                            onClick={() => { setReviewingId(null); setReviewNote(""); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {app.status !== "pending" && app.reviewedAt && (
                      <p className="muted" style={{ fontSize: ".7rem" }}>
                        Reviewed {timeAgo(app.reviewedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply link promotion */}
      {!isLoading && (
        <div style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: 12, background: "var(--subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: ".9rem" }}>Share your partner application form</p>
            <p className="muted" style={{ fontSize: ".8rem" }}>
              Send this link to potential partners:{" "}
              <code style={{ background: "var(--border)", padding: "1px 6px", borderRadius: 4, fontSize: ".8rem" }}>
                covant.ai/apply
              </code>
            </p>
          </div>
          <a
            href="/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ display: "flex", alignItems: "center", gap: ".35rem", whiteSpace: "nowrap" }}
          >
            Preview <ExternalLink size={14} />
          </a>
        </div>
      )}
    </>
  );
}
