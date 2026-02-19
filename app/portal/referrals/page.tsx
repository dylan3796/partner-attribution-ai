"use client";

import { useState } from "react";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  Users,
  DollarSign,
  Plus,
  TrendingUp,
  Eye,
  ArrowRight,
  Globe,
  QrCode,
  BarChart3,
} from "lucide-react";
import { usePortal } from "@/lib/portal-context";

/* ── Types ── */
interface ReferralLink {
  id: string;
  name: string;
  slug: string;
  campaign: string;
  url: string;
  clicks: number;
  uniqueVisitors: number;
  signups: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  createdAt: string;
  lastClickAt: string;
  status: "active" | "paused";
}

interface ClickDay {
  date: string;
  label: string;
  clicks: number;
}

/* ── Demo Data ── */
const REFERRAL_LINKS: ReferralLink[] = [
  {
    id: "rl1", name: "Main Website Banner", slug: "website-main", campaign: "Q1 Push",
    url: "https://covant.ai/?ref=cf-website-main", clicks: 2847, uniqueVisitors: 2103,
    signups: 186, conversions: 42, revenue: 58400, conversionRate: 1.47,
    createdAt: "2025-11-15", lastClickAt: "2026-02-19", status: "active",
  },
  {
    id: "rl2", name: "LinkedIn Campaign", slug: "linkedin-q1", campaign: "Q1 Push",
    url: "https://covant.ai/?ref=cf-linkedin-q1", clicks: 1523, uniqueVisitors: 1290,
    signups: 97, conversions: 28, revenue: 34200, conversionRate: 1.84,
    createdAt: "2026-01-05", lastClickAt: "2026-02-18", status: "active",
  },
  {
    id: "rl3", name: "Newsletter CTA", slug: "newsletter", campaign: "Evergreen",
    url: "https://covant.ai/?ref=cf-newsletter", clicks: 892, uniqueVisitors: 745,
    signups: 63, conversions: 19, revenue: 22800, conversionRate: 2.13,
    createdAt: "2025-10-20", lastClickAt: "2026-02-17", status: "active",
  },
  {
    id: "rl4", name: "Webinar Follow-up", slug: "webinar-jan", campaign: "Events",
    url: "https://covant.ai/?ref=cf-webinar-jan", clicks: 634, uniqueVisitors: 578,
    signups: 45, conversions: 12, revenue: 15600, conversionRate: 1.89,
    createdAt: "2026-01-20", lastClickAt: "2026-02-15", status: "active",
  },
  {
    id: "rl5", name: "Holiday Promo (Ended)", slug: "holiday-2025", campaign: "Holiday 2025",
    url: "https://covant.ai/?ref=cf-holiday-2025", clicks: 1205, uniqueVisitors: 980,
    signups: 78, conversions: 22, revenue: 27500, conversionRate: 1.83,
    createdAt: "2025-11-28", lastClickAt: "2026-01-02", status: "paused",
  },
  {
    id: "rl6", name: "Blog Post - ROI Guide", slug: "blog-roi", campaign: "Content",
    url: "https://covant.ai/?ref=cf-blog-roi", clicks: 456, uniqueVisitors: 398,
    signups: 34, conversions: 8, revenue: 9600, conversionRate: 1.75,
    createdAt: "2026-02-01", lastClickAt: "2026-02-18", status: "active",
  },
];

const CLICK_HISTORY: ClickDay[] = [
  { date: "2026-02-13", label: "Thu", clicks: 78 },
  { date: "2026-02-14", label: "Fri", clicks: 95 },
  { date: "2026-02-15", label: "Sat", clicks: 42 },
  { date: "2026-02-16", label: "Sun", clicks: 38 },
  { date: "2026-02-17", label: "Mon", clicks: 112 },
  { date: "2026-02-18", label: "Tue", clicks: 104 },
  { date: "2026-02-19", label: "Wed", clicks: 89 },
];

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function fmtMoney(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

/* ── Component ── */
export default function ReferralLinksPage() {
  const { partner } = usePortal();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkCampaign, setNewLinkCampaign] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused">("all");

  const filteredLinks = REFERRAL_LINKS.filter((l) => filter === "all" || l.status === filter);

  const totalClicks = REFERRAL_LINKS.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = REFERRAL_LINKS.reduce((s, l) => s + l.conversions, 0);
  const totalRevenue = REFERRAL_LINKS.reduce((s, l) => s + l.revenue, 0);
  const avgConvRate = REFERRAL_LINKS.reduce((s, l) => s + l.conversionRate, 0) / REFERRAL_LINKS.length;
  const maxClicks = Math.max(...CLICK_HISTORY.map((d) => d.clicks));

  function copyLink(link: ReferralLink) {
    navigator.clipboard.writeText(link.url).catch(() => {});
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            <Link2 size={22} style={{ marginRight: 8, verticalAlign: "middle", color: "#6366f1" }} />
            Referral Links
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".85rem", margin: "4px 0 0" }}>
            Track, manage, and create referral links for your campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            borderRadius: 8, border: "none", background: "#6366f1", color: "#fff",
            fontWeight: 600, fontSize: ".85rem", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Plus size={16} /> Create Link
        </button>
      </div>

      {/* ── Create Link Form ── */}
      {showCreate && (
        <div className="card" style={{ border: "2px solid #6366f1", marginBottom: 20 }}>
          <h3 style={{ fontSize: ".9rem", fontWeight: 700, margin: "0 0 12px" }}>New Referral Link</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>Link Name</label>
              <input
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="e.g. Twitter Bio Link"
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--subtle)",
                  fontSize: ".85rem", fontFamily: "inherit", color: "var(--fg)",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>Campaign</label>
              <input
                value={newLinkCampaign}
                onChange={(e) => setNewLinkCampaign(e.target.value)}
                placeholder="e.g. Q1 Push"
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--subtle)",
                  fontSize: ".85rem", fontFamily: "inherit", color: "var(--fg)",
                }}
              />
            </div>
            <button
              onClick={() => { setShowCreate(false); setNewLinkName(""); setNewLinkCampaign(""); }}
              style={{
                padding: "8px 20px", borderRadius: 8, border: "none",
                background: "#6366f1", color: "#fff", fontWeight: 600,
                fontSize: ".85rem", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Generate
            </button>
          </div>
          <p style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 8 }}>
            <Globe size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Your link will be: <code style={{ background: "var(--subtle)", padding: "1px 6px", borderRadius: 4 }}>
              covant.ai/?ref={partner?.companyName?.toLowerCase().replace(/\s+/g, "").slice(0, 4) || "partner"}-{newLinkName.toLowerCase().replace(/\s+/g, "-").slice(0, 20) || "new-link"}
            </code>
          </p>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Clicks", value: fmt(totalClicks), icon: <MousePointerClick size={18} />, color: "#6366f1" },
          { label: "Conversions", value: totalConversions.toString(), icon: <Users size={18} />, color: "#22c55e" },
          { label: "Revenue Generated", value: fmtMoney(totalRevenue), icon: <DollarSign size={18} />, color: "#3b82f6" },
          { label: "Avg Conv. Rate", value: `${avgConvRate.toFixed(1)}%`, icon: <TrendingUp size={18} />, color: "#f59e0b" },
        ].map((card, i) => (
          <div key={i} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em" }}>{card.label}</span>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ── Click Sparkline (7 days) ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: ".85rem", fontWeight: 700, margin: "0 0 14px" }}>
          <BarChart3 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Clicks — Last 7 Days
        </h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
          {CLICK_HISTORY.map((d) => {
            const h = (d.clicks / maxClicks) * 80;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: ".65rem", fontWeight: 700, marginBottom: 3 }}>{d.clicks}</span>
                <div style={{ height: h, width: "100%", maxWidth: 40, background: "#6366f1", borderRadius: 6, opacity: 0.8 }} />
                <span style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 5, fontWeight: 600 }}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["all", "active", "paused"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px", borderRadius: 8, fontSize: ".78rem", fontWeight: 600,
              border: filter === f ? "2px solid #6366f1" : "1px solid var(--border)",
              background: filter === f ? "#6366f120" : "var(--bg)",
              color: filter === f ? "#6366f1" : "var(--muted)",
              cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
            }}
          >
            {f} {f === "all" ? `(${REFERRAL_LINKS.length})` : `(${REFERRAL_LINKS.filter((l) => l.status === f).length})`}
          </button>
        ))}
      </div>

      {/* ── Links List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredLinks.map((link) => (
          <div
            key={link.id}
            className="card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, margin: 0 }}>{link.name}</h3>
                  <span
                    style={{
                      padding: "2px 8px", borderRadius: 12, fontSize: ".65rem", fontWeight: 700,
                      background: link.status === "active" ? "#22c55e20" : "#6b728020",
                      color: link.status === "active" ? "#22c55e" : "#6b7280",
                    }}
                  >
                    {link.status}
                  </span>
                  <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: ".65rem", fontWeight: 600, background: "var(--subtle)", color: "var(--muted)" }}>
                    {link.campaign}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <code style={{ fontSize: ".75rem", color: "#6366f1", background: "var(--subtle)", padding: "2px 8px", borderRadius: 6 }}>
                    {link.url}
                  </code>
                  <button
                    onClick={() => copyLink(link)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
                      borderRadius: 6, border: "1px solid var(--border)", background: "var(--subtle)",
                      cursor: "pointer", fontSize: ".7rem", color: "var(--muted)", fontFamily: "inherit",
                    }}
                  >
                    {copiedId === link.id ? <><Check size={12} color="#22c55e" /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {[
                { label: "Clicks", value: fmt(link.clicks), sub: `${fmt(link.uniqueVisitors)} unique` },
                { label: "Signups", value: link.signups.toString() },
                { label: "Conversions", value: link.conversions.toString() },
                { label: "Conv. Rate", value: `${link.conversionRate}%` },
                { label: "Revenue", value: fmtMoney(link.revenue) },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: ".65rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".03em", marginBottom: 2 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 800 }}>{stat.value}</div>
                  {stat.sub && <div style={{ fontSize: ".65rem", color: "var(--muted)" }}>{stat.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tips ── */}
      <div className="card" style={{ marginTop: 24, background: "#6366f108", border: "1px solid #6366f130" }}>
        <h4 style={{ fontSize: ".8rem", fontWeight: 700, margin: "0 0 8px", color: "#6366f1" }}>💡 Referral Tips</h4>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.8 }}>
          <li>Use unique links per campaign to measure which channels convert best</li>
          <li>Your <strong>LinkedIn Campaign</strong> link has the highest conversion rate — consider boosting that channel</li>
          <li>Share referral links in email signatures, blog posts, and social media bios for passive traffic</li>
          <li>Paused links still resolve but no longer track new attribution data</li>
        </ul>
      </div>
    </div>
  );
}
