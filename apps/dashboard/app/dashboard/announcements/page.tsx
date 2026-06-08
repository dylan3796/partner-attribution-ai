"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Megaphone,
  Plus,
  Pin,
  PinOff,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  X,
  Send,
  FileText,
  Tag,
  Calendar,
  Loader2,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "general" as const, label: "General", color: "#6366f1" },
  { value: "product" as const, label: "Product Update", color: "#22c55e" },
  { value: "incentive" as const, label: "Incentive", color: "#f59e0b" },
  { value: "policy" as const, label: "Policy Change", color: "#ef4444" },
  { value: "event" as const, label: "Event", color: "#06b6d4" },
];

function typeColor(type: string) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.color ?? "#6366f1";
}
function typeLabel(type: string) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type;
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
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function AnnouncementsPage() {
  const announcements = useQuery(api.announcements.list);
  const counts = useQuery(api.announcements.getCounts);
  const createAnnouncement = useMutation(api.announcements.create);
  const updateAnnouncement = useMutation(api.announcements.update);
  const removeAnnouncement = useMutation(api.announcements.remove);

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<Id<"announcements"> | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"general" | "product" | "incentive" | "policy" | "event">("general");
  const [isPinned, setIsPinned] = useState(false);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setType("general");
    setIsPinned(false);
    setShowCreate(false);
    setEditId(null);
  };

  const handleCreate = async (publish: boolean) => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await createAnnouncement({
        title: title.trim(),
        body: body.trim(),
        type,
        isPinned,
        isPublished: publish,
        authorName: "Admin",
        authorEmail: "admin@covant.ai",
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (publish?: boolean) => {
    if (!editId || !title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await updateAnnouncement({
        id: editId,
        title: title.trim(),
        body: body.trim(),
        type,
        isPinned,
        ...(publish !== undefined ? { isPublished: publish } : {}),
      });
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (a: NonNullable<typeof announcements>[number]) => {
    setEditId(a._id);
    setTitle(a.title);
    setBody(a.body);
    setType(a.type);
    setIsPinned(a.isPinned ?? false);
    setShowCreate(true);
  };

  const filtered = announcements?.filter((a) => {
    if (filter === "published") return a.isPublished;
    if (filter === "draft") return !a.isPublished;
    return true;
  });

  if (!announcements || !counts) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Megaphone size={24} /> Announcements
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
            Broadcast updates, product news, and incentive campaigns to your partner network.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.5rem 1rem", borderRadius: 8,
            background: "var(--fg)", color: "var(--bg)",
            border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
          }}
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total", value: counts.total, icon: FileText, color: "#6366f1" },
          { label: "Published", value: counts.published, icon: Eye, color: "#22c55e" },
          { label: "Drafts", value: counts.drafts, icon: EyeOff, color: "#f59e0b" },
          { label: "Pinned", value: counts.pinned, icon: Pin, color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "1rem", display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <div style={{ background: `${s.color}22`, borderRadius: 8, padding: 8 }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "1.5rem", width: "100%", maxWidth: 560,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                {editId ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Type selector */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>Type</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    style={{
                      padding: "0.35rem 0.75rem", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                      border: type === t.value ? `2px solid ${t.color}` : "1px solid var(--border)",
                      background: type === t.value ? `${t.color}22` : "transparent",
                      color: type === t.value ? t.color : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title..."
                style={{
                  width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8,
                  background: "var(--subtle)", border: "1px solid var(--border)",
                  color: "var(--fg)", fontSize: "0.9rem", outline: "none",
                }}
              />
            </div>

            {/* Body */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your announcement..."
                rows={5}
                style={{
                  width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, resize: "vertical",
                  background: "var(--subtle)", border: "1px solid var(--border)",
                  color: "var(--fg)", fontSize: "0.85rem", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>

            {/* Pin toggle */}
            <label style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--fg)",
            }}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                style={{ accentColor: "#ef4444" }}
              />
              <Pin size={14} /> Pin to top of partner feed
            </label>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={resetForm}
                style={{
                  padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem",
                  background: "transparent", border: "1px solid var(--border)",
                  color: "var(--muted)", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              {editId ? (
                <>
                  <button
                    onClick={() => handleUpdate()}
                    disabled={saving || !title.trim() || !body.trim()}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem",
                      background: "var(--subtle)", border: "none",
                      color: "var(--fg)", cursor: "pointer", fontWeight: 600,
                      opacity: saving || !title.trim() || !body.trim() ? 0.5 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => handleUpdate(true)}
                    disabled={saving || !title.trim() || !body.trim()}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem",
                      background: "var(--fg)", border: "none",
                      color: "var(--bg)", cursor: "pointer", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 6,
                      opacity: saving || !title.trim() || !body.trim() ? 0.5 : 1,
                    }}
                  >
                    <Send size={14} /> Publish
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleCreate(false)}
                    disabled={saving || !title.trim() || !body.trim()}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem",
                      background: "var(--subtle)", border: "none",
                      color: "var(--fg)", cursor: "pointer", fontWeight: 600,
                      opacity: saving || !title.trim() || !body.trim() ? 0.5 : 1,
                    }}
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleCreate(true)}
                    disabled={saving || !title.trim() || !body.trim()}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem",
                      background: "var(--fg)", border: "none",
                      color: "var(--bg)", cursor: "pointer", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 6,
                      opacity: saving || !title.trim() || !body.trim() ? 0.5 : 1,
                    }}
                  >
                    <Send size={14} /> Publish Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1rem" }}>
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.4rem 0.85rem", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
              background: filter === f ? "var(--subtle)" : "transparent",
              border: "1px solid " + (filter === f ? "var(--border)" : "transparent"),
              color: filter === f ? "var(--fg)" : "var(--muted)", cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? `All (${counts.total})` : f === "published" ? `Published (${counts.published})` : `Drafts (${counts.drafts})`}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      {filtered && filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "3rem 1rem",
          background: "var(--subtle)", border: "1px solid var(--border)",
          borderRadius: 12,
        }}>
          <Megaphone size={40} style={{ color: "var(--muted)", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No announcements yet.</p>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 4 }}>
            Create your first announcement to broadcast to all partners.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered?.map((a) => (
            <div
              key={a._id}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${a.isPinned ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                borderRadius: 10, padding: "1rem 1.25rem",
                position: "relative",
              }}
            >
              {/* Top row: type badge + pin + status + time */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                  background: `${typeColor(a.type)}22`, color: typeColor(a.type),
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  {typeLabel(a.type)}
                </span>
                {a.isPinned && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.7rem", color: "#ef4444" }}>
                    <Pin size={11} /> Pinned
                  </span>
                )}
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                  background: a.isPublished ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                  color: a.isPublished ? "#22c55e" : "#f59e0b",
                }}>
                  {a.isPublished ? "Published" : "Draft"}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "auto" }}>
                  <Calendar size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />
                  {timeAgo(a.publishedAt ?? a.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{a.title}</h3>

              {/* Body preview */}
              <p style={{
                color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {a.body}
              </p>

              {/* Author + actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  by {a.authorName}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => updateAnnouncement({ id: a._id, isPinned: !a.isPinned })}
                    title={a.isPinned ? "Unpin" : "Pin"}
                    style={{
                      background: "var(--subtle)", border: "none", borderRadius: 6,
                      padding: "0.35rem", cursor: "pointer", color: a.isPinned ? "#ef4444" : "var(--muted)",
                    }}
                  >
                    {a.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                  </button>
                  <button
                    onClick={() => updateAnnouncement({ id: a._id, isPublished: !a.isPublished })}
                    title={a.isPublished ? "Unpublish" : "Publish"}
                    style={{
                      background: "var(--subtle)", border: "none", borderRadius: 6,
                      padding: "0.35rem", cursor: "pointer", color: a.isPublished ? "#22c55e" : "var(--muted)",
                    }}
                  >
                    {a.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(a)}
                    title="Edit"
                    style={{
                      background: "var(--subtle)", border: "none", borderRadius: 6,
                      padding: "0.35rem", cursor: "pointer", color: "var(--muted)",
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this announcement?")) removeAnnouncement({ id: a._id });
                    }}
                    title="Delete"
                    style={{
                      background: "var(--subtle)", border: "none", borderRadius: 6,
                      padding: "0.35rem", cursor: "pointer", color: "var(--muted)",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
