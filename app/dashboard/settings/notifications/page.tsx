"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/toast";
import {
  ArrowLeft, Bell, Mail, Moon, Save, Loader2,
  Briefcase, DollarSign, UserPlus, Trophy, AlertTriangle,
  Info, ClipboardList, CheckCircle, Shield,
} from "lucide-react";

/* ── Event metadata ──────────────────────────────────────────────────── */

type EventKey = "deal_approved" | "deal_registered" | "deal_disputed" | "commission_paid" | "partner_joined" | "partner_application" | "tier_change" | "payout_ready" | "system";

const EVENT_META: { key: EventKey; label: string; description: string; icon: typeof Bell; color: string; category: string }[] = [
  { key: "deal_approved",       label: "Deal Approved",          description: "When a registered deal is approved",                 icon: CheckCircle,   color: "#22c55e", category: "Deals" },
  { key: "deal_registered",     label: "Deal Registered",        description: "When a partner registers a new deal",                icon: Briefcase,     color: "#3b82f6", category: "Deals" },
  { key: "deal_disputed",       label: "Deal Disputed",          description: "When an attribution dispute is filed",               icon: AlertTriangle, color: "#ef4444", category: "Deals" },
  { key: "commission_paid",     label: "Commission Paid",        description: "When a commission payment is processed",             icon: DollarSign,    color: "#22c55e", category: "Revenue" },
  { key: "payout_ready",        label: "Payout Ready",           description: "When a payout is ready for approval",                icon: DollarSign,    color: "#f59e0b", category: "Revenue" },
  { key: "partner_joined",      label: "Partner Joined",         description: "When a partner accepts an invite and joins",         icon: UserPlus,      color: "#8b5cf6", category: "Partners" },
  { key: "partner_application", label: "Partner Application",    description: "When a new partner application is submitted",        icon: ClipboardList, color: "#06b6d4", category: "Partners" },
  { key: "tier_change",         label: "Tier Change",            description: "When a partner's tier changes based on performance", icon: Trophy,        color: "#f59e0b", category: "Partners" },
  { key: "system",              label: "System Updates",         description: "Platform updates, maintenance, and announcements",   icon: Info,          color: "#64748b", category: "System" },
];

const CATEGORIES = ["Deals", "Revenue", "Partners", "System"];

/* ── Toggle component ────────────────────────────────────────────────── */

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: "relative", width: 44, height: 24, borderRadius: 12,
        background: checked ? "var(--primary, #6366f1)" : "var(--border)",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s", flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: 10,
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.3)",
      }} />
    </button>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */

type InAppPrefs = Record<EventKey, boolean>;
type EmailPrefs = Record<Exclude<EventKey, "system">, boolean>;
type DigestFreq = "off" | "instant" | "daily" | "weekly";

export default function NotificationPreferencesPage() {
  const { toast } = useToast();
  const prefs = useQuery(api.notificationPreferences.get);
  const savePrefs = useMutation(api.notificationPreferences.save);

  const [inApp, setInApp] = useState<InAppPrefs | null>(null);
  const [emailDigest, setEmailDigest] = useState<DigestFreq>("daily");
  const [emailEvents, setEmailEvents] = useState<EmailPrefs | null>(null);
  const [quietEnabled, setQuietEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Hydrate from server
  useEffect(() => {
    if (prefs && !inApp) {
      setInApp(prefs.inApp as InAppPrefs);
      setEmailDigest(prefs.emailDigest as DigestFreq);
      setEmailEvents(prefs.emailEvents as EmailPrefs);
      setQuietEnabled(prefs.quietHoursEnabled);
      setQuietStart(prefs.quietHoursStart ?? "22:00");
      setQuietEnd(prefs.quietHoursEnd ?? "08:00");
    }
  }, [prefs, inApp]);

  const updateInApp = useCallback((key: EventKey, val: boolean) => {
    setInApp(prev => prev ? { ...prev, [key]: val } : prev);
    setDirty(true);
  }, []);

  const updateEmail = useCallback((key: Exclude<EventKey, "system">, val: boolean) => {
    setEmailEvents(prev => prev ? { ...prev, [key]: val } : prev);
    setDirty(true);
  }, []);

  async function handleSave() {
    if (!inApp || !emailEvents) return;
    setSaving(true);
    try {
      await savePrefs({
        inApp,
        emailDigest,
        emailEvents,
        quietHoursEnabled: quietEnabled,
        quietHoursStart: quietStart,
        quietHoursEnd: quietEnd,
      });
      setDirty(false);
      toast("Notification preferences saved");
    } catch {
      toast("Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (prefs === undefined || !inApp || !emailEvents) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
          <Link href="/dashboard/settings" style={{ color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={16} /> Settings
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ height: 200 }}>
              <div className="skeleton" style={{ height: 20, width: 200, marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 48, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 48, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 48 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Link href="/dashboard/settings" style={{ color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: ".85rem" }}>
          <ArrowLeft size={14} /> Settings
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={22} /> Notification Preferences
          </h1>
          <p className="muted" style={{ fontSize: ".85rem" }}>Choose what you get notified about and how.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 8,
            background: dirty ? "var(--primary, #6366f1)" : "var(--border)",
            color: dirty ? "#fff" : "var(--muted)",
            border: "none", fontWeight: 600, fontSize: ".85rem",
            cursor: dirty ? "pointer" : "default",
            opacity: dirty ? 1 : 0.5,
            transition: "all 0.2s",
          }}
        >
          {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* In-App Notifications */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1" }}>
            <Bell size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>In-App Notifications</h2>
            <p className="muted" style={{ fontSize: ".75rem", margin: 0 }}>Appear in the notification bell in your dashboard</p>
          </div>
        </div>

        {CATEGORIES.map(cat => {
          const events = EVENT_META.filter(e => e.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)", marginBottom: 8, paddingLeft: 4 }}>
                {cat}
              </div>
              {events.map(evt => {
                const Icon = evt.icon;
                return (
                  <div key={evt.key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8,
                    marginBottom: 2, transition: "background 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--border)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: `${evt.color}15`, color: evt.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{evt.label}</div>
                        <div className="muted" style={{ fontSize: ".75rem" }}>{evt.description}</div>
                      </div>
                    </div>
                    <Toggle checked={inApp[evt.key]} onChange={v => updateInApp(evt.key, v)} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Email Notifications */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(59,130,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <Mail size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Email Notifications</h2>
            <p className="muted" style={{ fontSize: ".75rem", margin: 0 }}>Receive updates to your email address</p>
          </div>
        </div>

        {/* Digest frequency */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: ".8rem", fontWeight: 600, marginBottom: 8 }}>Email frequency</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {([
              { value: "off", label: "Off" },
              { value: "instant", label: "Instant" },
              { value: "daily", label: "Daily digest" },
              { value: "weekly", label: "Weekly digest" },
            ] as { value: DigestFreq; label: string }[]).map(opt => (
              <button
                key={opt.value}
                onClick={() => { setEmailDigest(opt.value); setDirty(true); }}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: ".8rem", fontWeight: 600,
                  border: emailDigest === opt.value ? "1px solid var(--primary, #6366f1)" : "1px solid var(--border)",
                  background: emailDigest === opt.value ? "rgba(99,102,241,.1)" : "transparent",
                  color: emailDigest === opt.value ? "var(--primary, #6366f1)" : "var(--muted)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email event toggles (disabled if digest is off) */}
        {CATEGORIES.filter(c => c !== "System").map(cat => {
          const events = EVENT_META.filter(e => e.category === cat && e.key !== "system");
          return (
            <div key={cat} style={{ marginBottom: 16, opacity: emailDigest === "off" ? 0.4 : 1, pointerEvents: emailDigest === "off" ? "none" : "auto" }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)", marginBottom: 8, paddingLeft: 4 }}>
                {cat}
              </div>
              {events.map(evt => {
                const Icon = evt.icon;
                const key = evt.key as Exclude<EventKey, "system">;
                return (
                  <div key={key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--border)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: `${evt.color}15`, color: evt.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: ".85rem", fontWeight: 600 }}>{evt.label}</div>
                        <div className="muted" style={{ fontSize: ".75rem" }}>{evt.description}</div>
                      </div>
                    </div>
                    <Toggle
                      checked={emailEvents[key]}
                      onChange={v => updateEmail(key, v)}
                      disabled={emailDigest === "off"}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139,92,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
              <Moon size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Quiet Hours</h2>
              <p className="muted" style={{ fontSize: ".75rem", margin: 0 }}>Pause non-critical notifications during specific hours</p>
            </div>
          </div>
          <Toggle checked={quietEnabled} onChange={v => { setQuietEnabled(v); setDirty(true); }} />
        </div>

        {quietEnabled && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, background: "var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap" }}>From</label>
              <input
                type="time"
                value={quietStart}
                onChange={e => { setQuietStart(e.target.value); setDirty(true); }}
                style={{
                  padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)",
                  background: "var(--card-bg)", color: "var(--foreground)",
                  fontSize: ".85rem",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: ".8rem", fontWeight: 600, whiteSpace: "nowrap" }}>To</label>
              <input
                type="time"
                value={quietEnd}
                onChange={e => { setQuietEnd(e.target.value); setDirty(true); }}
                style={{
                  padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)",
                  background: "var(--card-bg)", color: "var(--foreground)",
                  fontSize: ".85rem",
                }}
              />
            </div>
            <span className="muted" style={{ fontSize: ".75rem" }}>(your local time)</span>
          </div>
        )}

        {quietEnabled && (
          <p className="muted" style={{ fontSize: ".75rem", marginTop: 10, paddingLeft: 4 }}>
            <Shield size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Critical notifications (disputes, system alerts) will still come through during quiet hours.
          </p>
        )}
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
