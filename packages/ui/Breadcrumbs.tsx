"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Human-readable labels for URL segments
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  partners: "Partners",
  deals: "Deals",
  pipeline: "Pipeline",
  payouts: "Payouts",
  contracts: "Contracts",
  products: "Products",
  reports: "Reports",
  reconciliation: "Reconciliation",
  forecasting: "Forecasting",
  benchmarks: "Benchmarks",
  cohorts: "Cohorts",
  settings: "Settings",
  "commission-rules": "Commission Rules",
  "api-keys": "API Keys",
  webhooks: "Webhooks",
  team: "Team",
  billing: "Billing",
  notifications: "Notifications",
  attribution: "Attribution",
  commissions: "Commissions",
  "event-sources": "Event Sources",
  events: "Events",
  tiers: "Tiers",
  scoring: "Scoring & Tiers",
  "tier-reviews": "Tier Reviews",
  incentives: "Incentives",
  certifications: "Certifications",
  mdf: "MDF",
  setup: "Setup",
  "volume-rebates": "Volume Rebates",
  create: "Create",
  health: "Program Health",
  "partner-health": "Partner Health",
  "partner-applications": "Applications",
  onboarding: "Onboarding",
  leads: "Leads",
  activity: "Activity Log",
  emails: "Email Triggers",
  integrations: "Integrations",
  conflicts: "Conflicts",
  recommendations: "Recommendations",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show on dashboard root
  if (pathname === "/dashboard") return null;

  const segments = pathname.split("/").filter(Boolean);
  // Remove "dashboard" prefix for display but keep it in hrefs
  const displaySegments = segments.slice(1);

  if (displaySegments.length === 0) return null;

  // Detect dynamic segments (UUIDs, IDs)
  const isDynamic = (s: string) =>
    /^[a-z0-9]{20,}$/i.test(s) || // Convex IDs
    /^[0-9a-f-]{36}$/i.test(s);   // UUIDs

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/dashboard" className="breadcrumb-link breadcrumb-home" title="Dashboard">
            <Home size={14} />
          </Link>
        </li>
        {displaySegments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 2).join("/");
          const isLast = i === displaySegments.length - 1;
          const label = isDynamic(segment)
            ? "Detail"
            : SEGMENT_LABELS[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

          return (
            <li key={href}>
              <ChevronRight size={12} className="breadcrumb-sep" />
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">{label}</span>
              ) : (
                <Link href={href} className="breadcrumb-link">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          padding: 0 0 12px;
        }
        ol {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        li {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </nav>
  );
}
