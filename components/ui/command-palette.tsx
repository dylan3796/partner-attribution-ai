"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  MapPin,
  Zap,
  ExternalLink,
  User,
  FileText,
  type LucideIcon,
} from "lucide-react";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  category: "navigation" | "portal" | "actions" | "settings";
  keywords: string[];
};

const COMMANDS: CommandItem[] = [
  // Dashboard navigation
  { id: "dash", label: "Dashboard Home", icon: LayoutDashboard, href: "/dashboard", category: "navigation", keywords: ["home", "overview", "main"] },
  { id: "partners", label: "Partners", icon: Users, href: "/dashboard/partners", category: "navigation", keywords: ["partner", "list", "manage"] },
  { id: "deals", label: "Deals", icon: Briefcase, href: "/dashboard/deals", category: "navigation", keywords: ["deal", "opportunity", "sales"] },
  { id: "pipeline", label: "Pipeline & Co-Sell", icon: GitBranch, href: "/dashboard/pipeline", category: "navigation", keywords: ["pipeline", "cosell", "co-sell", "revenue", "accounts"] },
  { id: "payouts", label: "Payouts", icon: DollarSign, href: "/dashboard/payouts", category: "navigation", keywords: ["payout", "commission", "payment", "money"] },
  { id: "scoring", label: "Partner Scoring", icon: Trophy, href: "/dashboard/scoring", category: "navigation", keywords: ["score", "tier", "rank", "performance"] },
  { id: "tier-reviews", label: "Tier Reviews", icon: Shield, href: "/dashboard/scoring/tier-reviews", category: "navigation", keywords: ["tier", "review", "upgrade", "downgrade", "approve"] },
  { id: "certs", label: "Certifications", icon: Award, href: "/dashboard/certifications", category: "navigation", keywords: ["cert", "certification", "badge", "training"] },
  { id: "onboarding", label: "Partner Onboarding", icon: Rocket, href: "/dashboard/onboarding", category: "navigation", keywords: ["onboard", "ramp", "new partner", "kickoff"] },
  { id: "incentives", label: "Incentive Programs", icon: Gift, href: "/dashboard/incentives", category: "navigation", keywords: ["incentive", "spif", "bonus", "accelerator", "program"] },
  { id: "volume", label: "Volume Rebates", icon: BarChart3, href: "/dashboard/volume-rebates", category: "navigation", keywords: ["volume", "rebate", "distributor"] },
  { id: "mdf", label: "MDF Programs", icon: Megaphone, href: "/dashboard/mdf", category: "navigation", keywords: ["mdf", "market", "development", "fund"] },
  { id: "products", label: "Product Catalog", icon: Package, href: "/dashboard/products", category: "navigation", keywords: ["product", "catalog", "sku"] },
  { id: "conflicts", label: "Channel Conflicts", icon: AlertTriangle, href: "/dashboard/conflicts", category: "navigation", keywords: ["conflict", "channel", "territory", "overlap"] },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, href: "/dashboard/reports", category: "navigation", keywords: ["report", "analytics", "chart", "attribution"] },
  { id: "activity", label: "Activity Log", icon: Activity, href: "/dashboard/activity", category: "navigation", keywords: ["activity", "audit", "log", "history"] },
  { id: "emails", label: "Email Triggers", icon: Mail, href: "/dashboard/emails", category: "navigation", keywords: ["email", "notification", "trigger", "template"] },
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings", category: "settings", keywords: ["settings", "config", "attribution", "model", "feature", "flag"] },

  // Portal
  { id: "portal", label: "Partner Portal", icon: ExternalLink, href: "/portal", category: "portal", keywords: ["portal", "partner view", "external"] },
  { id: "portal-deals", label: "Portal: My Deals", icon: Briefcase, href: "/portal/deals", category: "portal", keywords: ["portal", "deals", "registration"] },
  { id: "portal-commissions", label: "Portal: Commissions", icon: DollarSign, href: "/portal/commissions", category: "portal", keywords: ["portal", "commission", "earnings"] },
  { id: "portal-notifications", label: "Portal: Notifications", icon: Bell, href: "/portal/notifications", category: "portal", keywords: ["portal", "notification", "alerts"] },
  { id: "portal-profile", label: "Portal: Profile", icon: User, href: "/portal/profile", category: "portal", keywords: ["portal", "profile", "account"] },

  // Landing/public
  { id: "landing", label: "Landing Page", icon: ExternalLink, href: "/", category: "navigation", keywords: ["landing", "home", "marketing", "website"] },
  { id: "program", label: "Partner Program Page", icon: FileText, href: "/program", category: "navigation", keywords: ["program", "apply", "public", "showcase"] },
];

const CATEGORY_LABELS: Record<string, string> = {
  navigation: "Dashboard",
  portal: "Partner Portal",
  actions: "Actions",
  settings: "Settings",
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

  // Filter commands
  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.keywords.some((kw) => kw.includes(q))
    );
  }, [query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      const list = groups.get(cmd.category) || [];
      list.push(cmd);
      groups.set(cmd.category, list);
    }
    return groups;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatList = useMemo(() => {
    const items: CommandItem[] = [];
    for (const [, cmds] of grouped) items.push(...cmds);
    return items;
  }, [grouped]);

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
            placeholder="Search pages, actions..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: ".95rem", fontFamily: "inherit", color: "var(--fg)",
            }}
          />
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
                    <span style={{ flex: 1, fontSize: ".875rem", fontWeight: isSelected ? 600 : 400 }}>{cmd.label}</span>
                    {cmd.href && pathname === cmd.href && (
                      <span style={{ fontSize: ".65rem", padding: "1px 6px", borderRadius: 999, background: "#6366f120", color: "#6366f1", fontWeight: 600 }}>current</span>
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
    </div>
  );
}
