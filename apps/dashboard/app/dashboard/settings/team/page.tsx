"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft, Users, Plus, Shield, UserCog, User, X, Save,
  MoreHorizontal, Mail, Clock, ChevronDown, Trash2, Crown,
} from "lucide-react";

type Role = "admin" | "manager" | "member";

const ROLE_META: Record<Role, { label: string; icon: typeof Shield; color: string; bg: string; description: string }> = {
  admin: {
    label: "Admin",
    icon: Crown,
    color: "#f59e0b",
    bg: "#f59e0b15",
    description: "Full access — manage team, billing, settings, and all data",
  },
  manager: {
    label: "Manager",
    icon: UserCog,
    color: "#6366f1",
    bg: "#6366f115",
    description: "Manage partners, deals, payouts, and reports",
  },
  member: {
    label: "Member",
    icon: User,
    color: "#22c55e",
    bg: "#22c55e15",
    description: "View dashboards and reports, manage assigned partners",
  },
};

function timeAgo(ts: number | undefined) {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ height: 20, width: 120, background: "var(--border)", borderRadius: 4, marginBottom: "1.5rem" }} />
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ height: 48, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
        <div style={{ height: 48, background: "var(--border)", borderRadius: 4, marginBottom: 12 }} />
        <div style={{ height: 48, background: "var(--border)", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function TeamSettingsPage() {
  const { toast } = useToast();
  const members = useQuery(api.team.list);
  const inviteMember = useMutation(api.team.invite);
  const updateRole = useMutation(api.team.updateRole);
  const removeMember = useMutation(api.team.remove);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "member" as Role });
  const [inviting, setInviting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [roleDropdown, setRoleDropdown] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  if (members === undefined) return <LoadingSkeleton />;

  const adminCount = members.filter((m) => m.role === "admin").length;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    setInviting(true);
    try {
      await inviteMember({
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
        role: inviteForm.role,
      });
      toast("Team member invited");
      setShowInvite(false);
      setInviteForm({ name: "", email: "", role: "member" });
    } catch (err: any) {
      toast(err.message || "Failed to invite member", "error");
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(userId: Id<"users">, newRole: Role) {
    try {
      await updateRole({ userId, role: newRole });
      toast("Role updated");
      setRoleDropdown(null);
    } catch (err: any) {
      toast(err.message || "Failed to update role", "error");
    }
  }

  async function handleRemove(userId: Id<"users">, name: string) {
    try {
      await removeMember({ userId });
      toast(`${name} removed from team`);
      setConfirmRemove(null);
      setMenuOpen(null);
    } catch (err: any) {
      toast(err.message || "Failed to remove member", "error");
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Link href="/dashboard/settings" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", marginBottom: ".75rem", fontSize: ".85rem" }} className="muted">
            <ArrowLeft size={15} /> Settings
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-.02em", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Users size={24} /> Team
          </h1>
          <p className="muted" style={{ marginTop: ".25rem", fontSize: ".9rem" }}>
            Manage who has access to your partner program. {members.length} member{members.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowInvite(true)}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={16} /> Invite Member
        </button>
      </div>

      {/* Role legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: ".75rem", marginBottom: "1.5rem" }}>
        {(["admin", "manager", "member"] as Role[]).map((role) => {
          const meta = ROLE_META[role];
          const Icon = meta.icon;
          const count = members.filter((m) => m.role === role).length;
          return (
            <div key={role} className="card" style={{ padding: ".75rem 1rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={meta.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{meta.label}<span className="muted" style={{ fontWeight: 400, marginLeft: 6 }}>({count})</span></div>
                <div className="muted" style={{ fontSize: ".75rem" }}>{meta.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member list */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 48px",
          padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          fontSize: ".75rem",
          fontWeight: 600,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: ".05em",
        }}>
          <span>Member</span>
          <span>Role</span>
          <span>Last Active</span>
          <span />
        </div>

        {members.length === 0 ? (
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <Users size={32} color="var(--muted)" style={{ marginBottom: ".75rem" }} />
            <p className="muted">No team members yet. Invite your first teammate to get started.</p>
          </div>
        ) : (
          members.map((member) => {
            const meta = ROLE_META[member.role];
            const Icon = meta.icon;
            const isPending = !member.clerkId;
            const isLastAdmin = member.role === "admin" && adminCount <= 1;

            return (
              <div
                key={member._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 48px",
                  padding: "14px 20px",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Name + Email */}
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div className="avatar" style={{
                    width: 36, height: 36, fontSize: ".8rem",
                    opacity: isPending ? 0.5 : 1,
                  }}>
                    {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".9rem", display: "flex", alignItems: "center", gap: 6 }}>
                      {member.name}
                      {isPending && (
                        <span style={{
                          fontSize: ".65rem", fontWeight: 600, padding: "1px 6px",
                          borderRadius: 4, background: "#f59e0b20", color: "#f59e0b",
                          textTransform: "uppercase", letterSpacing: ".04em",
                        }}>
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <Mail size={12} /> {member.email}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setRoleDropdown(roleDropdown === member._id ? null : member._id)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "4px 10px", borderRadius: 6,
                      background: meta.bg, border: `1px solid ${meta.color}30`,
                      color: meta.color, fontSize: ".8rem", fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <Icon size={13} />
                    {meta.label}
                    <ChevronDown size={12} style={{ opacity: 0.6 }} />
                  </button>
                  {roleDropdown === member._id && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 50 }}
                        onClick={() => setRoleDropdown(null)}
                      />
                      <div style={{
                        position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 51,
                        background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,.3)", minWidth: 180, overflow: "hidden",
                      }}>
                        {(["admin", "manager", "member"] as Role[]).map((r) => {
                          const rm = ROLE_META[r];
                          const RIcon = rm.icon;
                          const isCurrent = r === member.role;
                          const disabled = isLastAdmin && r !== "admin";
                          return (
                            <button
                              key={r}
                              onClick={() => !disabled && !isCurrent && handleRoleChange(member._id, r)}
                              disabled={disabled}
                              style={{
                                display: "flex", alignItems: "center", gap: 8, width: "100%",
                                padding: "8px 12px", border: "none",
                                background: isCurrent ? "var(--subtle)" : "transparent",
                                color: disabled ? "var(--muted)" : "var(--fg)",
                                cursor: disabled ? "not-allowed" : "pointer",
                                fontSize: ".85rem", fontWeight: isCurrent ? 600 : 400,
                                textAlign: "left", transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--subtle)"; }}
                              onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                            >
                              <RIcon size={14} color={rm.color} />
                              {rm.label}
                              {isCurrent && <span style={{ marginLeft: "auto", fontSize: ".75rem", color: "var(--muted)" }}>Current</span>}
                            </button>
                          );
                        })}
                        {isLastAdmin && (
                          <div style={{ padding: "6px 12px", fontSize: ".7rem", color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
                            Last admin — promote someone else first
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Last active */}
                <div className="muted" style={{ fontSize: ".8rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} />
                  {isPending ? "Invited" : timeAgo(member.lastLoginAt)}
                </div>

                {/* Actions */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setMenuOpen(menuOpen === member._id ? null : member._id)}
                    style={{
                      background: "none", border: "1px solid transparent", borderRadius: 6,
                      padding: "4px", cursor: "pointer", color: "var(--muted)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen === member._id && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 50 }}
                        onClick={() => { setMenuOpen(null); setConfirmRemove(null); }}
                      />
                      <div style={{
                        position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 51,
                        background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,.3)", minWidth: 180, overflow: "hidden",
                      }}>
                        {confirmRemove === member._id ? (
                          <div style={{ padding: "12px" }}>
                            <p style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: 8 }}>
                              Remove {member.name}?
                            </p>
                            <p className="muted" style={{ fontSize: ".75rem", marginBottom: 12 }}>
                              They'll lose access to the dashboard immediately.
                            </p>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                className="btn-outline"
                                style={{ flex: 1, fontSize: ".8rem", padding: "6px 0" }}
                                onClick={() => { setConfirmRemove(null); setMenuOpen(null); }}
                              >
                                Cancel
                              </button>
                              <button
                                style={{
                                  flex: 1, fontSize: ".8rem", padding: "6px 0",
                                  background: "#ef4444", color: "#fff", border: "none",
                                  borderRadius: 6, fontWeight: 600, cursor: "pointer",
                                }}
                                onClick={() => handleRemove(member._id, member.name)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (isLastAdmin) {
                                toast("Cannot remove the last admin", "error");
                                setMenuOpen(null);
                              } else {
                                setConfirmRemove(member._id);
                              }
                            }}
                            style={{
                              display: "flex", alignItems: "center", gap: 8, width: "100%",
                              padding: "8px 12px", border: "none", background: "transparent",
                              color: isLastAdmin ? "var(--muted)" : "#ef4444",
                              cursor: isLastAdmin ? "not-allowed" : "pointer",
                              fontSize: ".85rem", textAlign: "left", transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--subtle)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <Trash2 size={14} /> Remove from team
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
          onClick={() => setShowInvite(false)}
        >
          <div
            className="card animate-in"
            style={{ width: 460, maxWidth: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} /> Invite Team Member
              </h2>
              <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Name</label>
                <input
                  className="input"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Jane Smith"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Email</label>
                <input
                  className="input"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="jane@company.com"
                  required
                />
              </div>
              <div>
                <label className="muted" style={{ fontSize: ".8rem", display: "block", marginBottom: ".3rem" }}>Role</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".5rem" }}>
                  {(["admin", "manager", "member"] as Role[]).map((r) => {
                    const rm = ROLE_META[r];
                    const RIcon = rm.icon;
                    const isSelected = inviteForm.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setInviteForm({ ...inviteForm, role: r })}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                          padding: "12px 8px", borderRadius: 8,
                          border: `1.5px solid ${isSelected ? rm.color : "var(--border)"}`,
                          background: isSelected ? rm.bg : "transparent",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        <RIcon size={18} color={isSelected ? rm.color : "var(--muted)"} />
                        <span style={{ fontSize: ".8rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? rm.color : "var(--fg)" }}>
                          {rm.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="muted" style={{ fontSize: ".75rem", marginTop: ".4rem" }}>
                  {ROLE_META[inviteForm.role].description}
                </p>
              </div>
              <button
                className="btn"
                type="submit"
                disabled={inviting}
                style={{ width: "100%", marginTop: ".5rem" }}
              >
                {inviting ? "Inviting..." : "Send Invite"}
              </button>
              <p className="muted" style={{ fontSize: ".75rem", textAlign: "center" }}>
                They'll receive an email invite to join your team. Their access starts once they sign up.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
