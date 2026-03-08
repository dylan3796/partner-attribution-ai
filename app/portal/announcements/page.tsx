"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Megaphone,
  Pin,
  Calendar,
  Tag,
  Loader2,
} from "lucide-react";

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  general: { bg: "rgba(99,102,241,0.15)", text: "#818cf8", label: "General" },
  product: { bg: "rgba(34,197,94,0.15)", text: "#4ade80", label: "Product Update" },
  incentive: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Incentive" },
  policy: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "Policy Change" },
  event: { bg: "rgba(6,182,212,0.15)", text: "#22d3ee", label: "Event" },
};

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(ts);
}

export default function PortalAnnouncementsPage() {
  const announcements = useQuery(api.announcements.listPublished);

  if (!announcements) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Megaphone size={24} /> Announcements
      </h1>
      <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Latest updates and news from the partner program.
      </p>

      {announcements.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "3rem 1rem",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
        }}>
          <Megaphone size={40} style={{ color: "#333", margin: "0 auto 1rem" }} />
          <p style={{ color: "#888" }}>No announcements yet.</p>
          <p style={{ color: "#666", fontSize: "0.85rem", marginTop: 4 }}>
            Check back soon for updates from the program team.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {announcements.map((a) => {
            const tc = TYPE_COLORS[a.type] ?? TYPE_COLORS.general;
            return (
              <article
                key={a._id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${a.isPinned ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "1.25rem 1.5rem",
                }}
              >
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    background: tc.bg, color: tc.text,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>
                    {tc.label}
                  </span>
                  {a.isPinned && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.7rem", color: "#ef4444" }}>
                      <Pin size={11} /> Pinned
                    </span>
                  )}
                  <span style={{ fontSize: "0.75rem", color: "#666", marginLeft: "auto" }}>
                    {timeAgo(a.publishedAt ?? a.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>{a.title}</h2>

                {/* Body */}
                <p style={{ color: "#bbb", fontSize: "0.9rem", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                  {a.body}
                </p>

                {/* Author */}
                <div style={{ marginTop: 12, fontSize: "0.75rem", color: "#555" }}>
                  Posted by {a.authorName}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
