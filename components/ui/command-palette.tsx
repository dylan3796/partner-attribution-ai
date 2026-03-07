"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search,
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Trophy,
  Award,
  BarChart3,
  Settings,
  Activity,
  Gift,
  Rocket,
  GitBranch,
  Mail,
  Bell,
  Shield,
  Megaphone,
  AlertTriangle,
  Package,
  Zap,
  ExternalLink,
  User,
  FileText,
  Heart,
  Star,
  ClipboardList,
  Target,
  TrendingUp,
  Crosshair,
  Scale,
  PieChart,
  Download,
  CreditCard,
  Key,
  UserPlus,
  Webhook,
  SlidersHorizontal,
  Layers,
  Cpu,
  type LucideIcon,
} from "lucide-react";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  category: "navigation" | "portal" | "actions" | "settings" | "partners" | "deals";
  keywords: string[];
};

const COMMANDS: CommandItem[] = [
  // ── Core Navigation ──
  { id: "dash", label: "Dashboard Home", icon: LayoutDashboard, href: "/dashboard", category: "navigation", keywords: ["home", "overview", "main"] },
  { id: "program-health", label: "Program Health", icon: Heart, href: "/dashboard/health", category: "navigation", keywords: ["health", "score", "program", "status", "overview"] },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/notifications", category: "navigation", keywords: ["notification", "alert", "inbox", "unread"] },

  // ── Partners ──
  { id: "partners", label: "All Partners", icon: Users, href: "/dashboard/partners", category: "navigation", keywords: ["partner", "list", "manage", "channel"] },
  { id: "partner-health", label: "Partner Health Scores", icon: Heart, href: "/dashboard/partner-health", category: "navigation", keywords: ["health", "score", "at risk", "churning", "engagement"] },
  { id: "partner-compare", label: "Partner Comparison", icon: Users, href: "/dashboard/partners/compare", category: "navigation", keywords: ["compare", "side by side", "benchmark", "qbr"] },
  { id: "leads", label: "Leads", icon: Star, href: "/dashboard/leads", category: "navigation", keywords: ["lead", "prospect", "potential", "recruit"] },
  { id: "applications", label: "Partner Applications", icon: ClipboardList, href: "/dashboard/partner-applications", category: "navigation", keywords: ["application", "apply", "inbound", "approve", "reject"] },
  { id: "onboarding", label: "Partner Onboarding", icon: Rocket, href: "/dashboard/onboarding", category: "navigation", keywords: ["onboard", "ramp", "new partner", "kickoff"] },

  // ── Revenue ──
  { id: "deals", label: "Deals", icon: Briefcase, href: "/dashboard/deals", category: "navigation", keywords: ["deal", "opportunity", "sales", "registration"] },
  { id: "pipeline", label: "Pipeline & Co-Sell", icon: GitBranch, href: "/dashboard/pipeline", category: "navigation", keywords: ["pipeline", "cosell", "co-sell", "kanban", "board"] },
  { id: "payouts", label: "Payouts", icon: DollarSign, href: "/dashboard/payouts", category: "navigation", keywords: ["payout", "commission", "payment", "money", "approve"] },
  { id: "contracts", label: "Contracts", icon: FileText, href: "/dashboard/contracts", category: "navigation", keywords: ["contract", "agreement", "document", "sign"] },
  { id: "products", label: "Product Catalog", icon: Package, href: "/dashboard/products", category: "navigation", keywords: ["product", "catalog", "sku", "pricing"] },
  { id: "conflicts", label: "Disputes & Conflicts", icon: Scale, href: "/dashboard/conflicts", category: "navigation", keywords: ["dispute", "conflict", "channel", "territory", "overlap", "resolution"] },

  // ── Program ──
  { id: "scoring", label: "Partner Scoring", icon: Trophy, href: "/dashboard/scoring", category: "navigation", keywords: ["score", "tier", "rank", "performance"] },
  { id: "tier-reviews", label: "Tier Reviews", icon: Shield, href: "/dashboard/scoring/tier-reviews", category: "navigation", keywords: ["tier", "review", "upgrade", "downgrade", "approve"] },
  { id: "incentives", label: "Incentive Programs", icon: Gift, href: "/dashboard/incentives", category: "navigation", keywords: ["incentive", "spif", "bonus", "accelerator", "program"] },
  { id: "certs", label: "Certifications", icon: Award, href: "/dashboard/certifications", category: "navigation", keywords: ["cert", "certification", "badge", "training"] },
  { id: "mdf", label: "MDF Programs", icon: Megaphone, href: "/dashboard/mdf", category: "navigation", keywords: ["mdf", "market", "development", "fund"] },
  { id: "volume", label: "Volume Rebates", icon: BarChart3, href: "/dashboard/volume-rebates", category: "navigation", keywords: ["volume", "rebate", "distributor"] },

  // ── Analytics ──
  { id: "goals", label: "Goals & Targets", icon: Target, href: "/dashboard/goals", category: "navigation", keywords: ["goal", "target", "objective", "kpi", "quarterly"] },
  { id: "leaderboard", label: "Partner Leaderboard", icon: Trophy, href: "/dashboard/leaderboard", category: "navigation", keywords: ["leaderboard", "rank", "top", "gamification", "competition"] },
  { id: "reports-hub", label: "Reports", icon: PieChart, href: "/dashboard/reports", category: "navigation", keywords: ["report", "analytics", "hub", "overview"] },
  { id: "reports", label: "Attribution Reports", icon: PieChart, href: "/dashboard/reports/attribution", category: "navigation", keywords: ["report", "analytics", "chart", "attribution"] },
  { id: "revenue-intel", label: "Revenue Intelligence", icon: TrendingUp, href: "/dashboard/reports/revenue", category: "navigation", keywords: ["revenue", "intelligence", "concentration", "breakdown", "analytics"] },
  { id: "weekly-digest", label: "Weekly Performance Digest", icon: FileText, href: "/dashboard/reports/digest", category: "navigation", keywords: ["weekly", "digest", "summary", "exec", "report", "wow"] },
  { id: "qbr", label: "QBR Reports", icon: PieChart, href: "/dashboard/reports/qbr", category: "navigation", keywords: ["qbr", "quarterly", "business", "review", "executive"] },
  { id: "data-export", label: "Data Export Center", icon: Download, href: "/dashboard/reports/export", category: "navigation", keywords: ["export", "csv", "download", "data", "bulk"] },
  { id: "reconciliation", label: "Reconciliation Report", icon: DollarSign, href: "/dashboard/reports/reconciliation", category: "navigation", keywords: ["reconciliation", "quarter", "end", "payout", "summary"] },
  { id: "win-loss", label: "Win/Loss Analysis", icon: Target, href: "/dashboard/reports/win-loss", category: "navigation", keywords: ["win", "loss", "analysis", "rate", "outcome", "close", "won", "lost", "velocity"] },
  { id: "activity-heatmap", label: "Partner Activity Heatmap", icon: Activity, href: "/dashboard/reports/activity", category: "navigation", keywords: ["activity", "heatmap", "engagement", "daily", "streak", "calendar", "contribution", "touchpoint"] },
  { id: "forecasting", label: "Forecasting", icon: TrendingUp, href: "/dashboard/forecasting", category: "navigation", keywords: ["forecast", "predict", "projection", "pipeline", "growth"] },
  { id: "benchmarks", label: "Benchmarks", icon: Crosshair, href: "/dashboard/benchmarks", category: "navigation", keywords: ["benchmark", "compare", "quartile", "performance"] },
  { id: "cohorts", label: "Cohort Analysis", icon: BarChart3, href: "/dashboard/cohorts", category: "navigation", keywords: ["cohort", "segment", "group", "analysis", "trend"] },
  { id: "recommendations", label: "Recommendations", icon: Zap, href: "/dashboard/recommendations", category: "navigation", keywords: ["recommend", "suggest", "ai", "insight"] },
  { id: "activity", label: "Activity Log", icon: Activity, href: "/dashboard/activity", category: "navigation", keywords: ["activity", "audit", "log", "history", "trail"] },
  { id: "emails", label: "Email Triggers", icon: Mail, href: "/dashboard/emails", category: "navigation", keywords: ["email", "notification", "trigger", "template"] },

  // ── Settings ──
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings", category: "settings", keywords: ["settings", "config", "feature", "flag"] },
  { id: "settings-commission", label: "Commission Rules", icon: SlidersHorizontal, href: "/dashboard/settings/commission-rules", category: "settings", keywords: ["commission", "rule", "rate", "percentage", "override"] },
  { id: "settings-attribution", label: "Attribution Model", icon: Cpu, href: "/dashboard/settings/attribution", category: "settings", keywords: ["attribution", "model", "first touch", "last touch", "deal reg"] },
  { id: "settings-tiers", label: "Partner Tiers", icon: Layers, href: "/dashboard/settings/tiers", category: "settings", keywords: ["tier", "bronze", "silver", "gold", "platinum", "level"] },
  { id: "settings-team", label: "Team Management", icon: UserPlus, href: "/dashboard/settings/team", category: "settings", keywords: ["team", "member", "invite", "role", "admin", "manager"] },
  { id: "settings-api", label: "API Keys", icon: Key, href: "/dashboard/settings/api-keys", category: "settings", keywords: ["api", "key", "token", "developer", "integration"] },
  { id: "settings-webhooks", label: "Webhooks", icon: Webhook, href: "/dashboard/settings/webhooks", category: "settings", keywords: ["webhook", "endpoint", "event", "callback", "integration"] },
  { id: "settings-notifications", label: "Notification Preferences", icon: Bell, href: "/dashboard/settings/notifications", category: "settings", keywords: ["notification", "preference", "digest", "quiet", "email"] },
  { id: "settings-billing", label: "Billing & Subscription", icon: CreditCard, href: "/dashboard/settings/billing", category: "settings", keywords: ["billing", "subscription", "plan", "stripe", "payment", "upgrade"] },
  { id: "integrations", label: "Integrations", icon: Zap, href: "/dashboard/integrations", category: "settings", keywords: ["integration", "salesforce", "hubspot", "crm", "connect"] },

  // ── Portal ──
  { id: "portal", label: "Partner Portal", icon: ExternalLink, href: "/portal", category: "portal", keywords: ["portal", "partner view", "external"] },
  { id: "portal-deals", label: "Portal: My Deals", icon: Briefcase, href: "/portal/deals", category: "portal", keywords: ["portal", "deals", "registration"] },
  { id: "portal-commissions", label: "Portal: Commissions", icon: DollarSign, href: "/portal/commissions", category: "portal", keywords: ["portal", "commission", "earnings"] },
  { id: "portal-notifications", label: "Portal: Notifications", icon: Bell, href: "/portal/notifications", category: "portal", keywords: ["portal", "notification", "alerts"] },
  { id: "portal-profile", label: "Portal: Profile", icon: User, href: "/portal/profile", category: "portal", keywords: ["portal", "profile", "account"] },

  // ── Public/Marketing ──
  { id: "landing", label: "Landing Page", icon: ExternalLink, href: "/", category: "navigation", keywords: ["landing", "home", "marketing", "website"] },
];

const CATEGORY_LABELS: Record<string, string> = {
  partners: "Partners",
  deals: "Deals",
  navigation: "Pages",
  portal: "Partner Portal",
  actions: "Actions",
  settings: "Settings",
};

// Order categories so data results appear first
const CATEGORY_ORDER = ["partners", "deals", "navigation", "portal", "settings", "actions"];

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  active: { bg: "#22c55e18", fg: "#22c55e" },
  inactive: { bg: "#ef444418", fg: "#ef4444" },
  pending: { bg: "#eab30818", fg: "#eab308" },
  won: { bg: "#22c55e18", fg: "#22c55e" },
  lost: { bg: "#ef444418", fg: "#ef4444" },
  open: { bg: "#3b82f618", fg: "#3b82f6" },
};

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Only mount on dashboard routes
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/portal");

  // Live search from Convex — only fires when palette is open and query has 2+ chars
  const searchQuery = open && query.trim().length >= 2 ? query.trim() : "";
  const searchResults = useQuery(
    api.search.globalSearch,
    searchQuery ? { query: searchQuery } : "skip"
  );

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build dynamic commands from search results
  const dataCommands = useMemo<CommandItem[]>(() => {
    if (!searchResults) return [];
    const items: CommandItem[] = [];

    for (const p of searchResults.partners) {
      const tierLabel = p.tier ? ` · ${p.tier}` : "";
      items.push({
        id: `partner-${p._id}`,
        label: p.name,
        description: `${p.type} · ${p.status}${tierLabel}`,
        icon: Users,
        href: `/dashboard/partners/${p._id}`,
        category: "partners",
        keywords: [],
      });
    }

    for (const d of searchResults.deals) {
      items.push({
        id: `deal-${d._id}`,
        label: d.name,
        description: `${formatCurrency(d.amount)} · ${d.status}`,
        icon: Briefcase,
        href: `/dashboard/deals/${d._id}`,
        category: "deals",
        keywords: [],
      });
    }

    return items;
  }, [searchResults]);

  // Filter static commands
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.keywords.some((kw) => kw.includes(q))
    );
  }, [query]);

  // Merge: data results first, then navigation
  const allCommands = useMemo(() => {
    return [...dataCommands, ...filteredCommands];
  }, [dataCommands, filteredCommands]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const cmd of allCommands) {
      const list = groups.get(cmd.category) || [];
      list.push(cmd);
      groups.set(cmd.category, list);
    }
    // Sort by CATEGORY_ORDER
    const sorted = new Map<string, CommandItem[]>();
    for (const cat of CATEGORY_ORDER) {
      const items = groups.get(cat);
      if (items) sorted.set(cat, items);
    }
    return sorted;
  }, [allCommands]);

  // Flat list for keyboard nav
  const flatList = useMemo(() => {
    const items: CommandItem[] = [];
    for (const [, cmds] of grouped) items.push(...cmds);
    return items;
  }, [grouped]);

  // Clamp selectedIndex when results change
  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, flatList.length - 1)));
  }, [flatList.length]);

  const execute = useCallback((cmd: CommandItem) => {
    setOpen(false);
    if (cmd.href) router.push(cmd.href);
    if (cmd.action) cmd.action();
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatList[selectedIndex]) {
        e.preventDefault();
        execute(flatList[selectedIndex]);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, flatList, selectedIndex, execute]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!isDashboard || !open) return null;

  let flatIdx = 0;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        zIndex: 600, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "15vh 1rem 1rem",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        className="card"
        style={{ width: 560, maxWidth: "100%", padding: 0, overflow: "hidden", maxHeight: "60vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={18} style={{ color: "var(--muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search partners, deals, pages..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: ".95rem", fontFamily: "inherit", color: "var(--fg)",
            }}
          />
          {searchQuery && !searchResults && (
            <div style={{
              width: 16, height: 16, border: "2px solid var(--border)", borderTopColor: "var(--muted)",
              borderRadius: "50%", animation: "spin 0.6s linear infinite",
            }} />
          )}
          <kbd style={{
            padding: "2px 6px", borderRadius: 4, fontSize: ".65rem", fontWeight: 600,
            background: "var(--subtle)", border: "1px solid var(--border)", color: "var(--muted)",
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: "auto", padding: "8px 0" }}>
          {flatList.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p className="muted" style={{ fontSize: ".875rem" }}>No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}
          {[...grouped.entries()].map(([category, cmds]) => (
            <div key={category}>
              <div style={{ padding: "6px 16px", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)" }}>
                {CATEGORY_LABELS[category] || category}
              </div>
              {cmds.map((cmd) => {
                const idx = flatIdx++;
                const isSelected = idx === selectedIndex;
                const Icon = cmd.icon;
                const statusColor = cmd.description
                  ? STATUS_COLORS[cmd.description.split(" · ").pop()?.trim() || ""] 
                  : null;
                return (
                  <div
                    key={cmd.id}
                    data-index={idx}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 16px",
                      cursor: "pointer", background: isSelected ? "var(--subtle)" : "transparent",
                      transition: "background 0.1s",
                    }}
                  >
                    <Icon size={16} style={{ color: isSelected ? "#6366f1" : "var(--muted)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: ".875rem", fontWeight: isSelected ? 600 : 400 }}>{cmd.label}</span>
                      {cmd.description && (
                        <span style={{ fontSize: ".75rem", color: "var(--muted)", marginLeft: 8 }}>{cmd.description}</span>
                      )}
                    </div>
                    {cmd.href && pathname === cmd.href && (
                      <span style={{ fontSize: ".65rem", padding: "1px 6px", borderRadius: 999, background: "#6366f120", color: "#6366f1", fontWeight: 600 }}>current</span>
                    )}
                    {(cmd.category === "partners" || cmd.category === "deals") && (
                      <span style={{ fontSize: ".65rem", padding: "1px 6px", borderRadius: 999, background: "#6366f108", color: "#6366f1", fontWeight: 500 }}>→</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, justifyContent: "center" }}>
          {[
            { keys: "↑↓", label: "Navigate" },
            { keys: "↵", label: "Open" },
            { keys: "esc", label: "Close" },
          ].map((h) => (
            <span key={h.label} className="muted" style={{ fontSize: ".7rem", display: "flex", alignItems: "center", gap: 4 }}>
              <kbd style={{ padding: "1px 4px", borderRadius: 3, fontSize: ".65rem", background: "var(--subtle)", border: "1px solid var(--border)" }}>{h.keys}</kbd>
              {h.label}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
