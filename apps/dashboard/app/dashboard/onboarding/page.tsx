"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/utils";
import {
  Rocket,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Target,
  UserCheck,
  XCircle,
  DollarSign,
  Loader2,
  UserPlus,
} from "lucide-react";

/* ── helpers ── */

function tierColor(tier: string) {
  const m: Record<string, string> = {
    bronze: "#cd7f32",
    silver: "#94a3b8",
    gold: "#eab308",
    platinum: "#a78bfa",
  };
  return m[tier] || "#64748b";
}

function rampStatus(wonDeals: number): { label: string; color: string } {
  if (wonDeals === 0) return { label: "Just Started", color: "#ef4444" };
  if (wonDeals <= 2) return { label: "Ramping", color: "#eab308" };
  return { label: "Established", color: "#22c55e" };
}

/* ── components ── */

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent || "#6366f1"}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent || "#6366f1",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          className="muted"
          style={{
            fontSize: ".75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        <div
          style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {value}
        </div>
        {sub && (
          <div className="muted" style={{ fontSize: ".8rem" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1" }} />
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Loading partners...</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "1rem",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="card"
            style={{ padding: "1.25rem", height: 90, background: "var(--subtle)" }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="card"
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "#6366f118",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UserPlus size={32} style={{ color: "#6366f1" }} />
      </div>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 4 }}>
          No Partners Yet
        </h3>
        <p className="muted" style={{ maxWidth: 400 }}>
          Partners will appear here once they&apos;re added to your organization. Start
          by adding your first partner.
        </p>
      </div>
    </div>
  );
}

type PartnerWithStats = {
  _id: Id<"partners">;
  name: string;
  email: string;
  type: "affiliate" | "referral" | "reseller" | "integration";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "inactive" | "pending";
  commissionRate: number;
  createdAt: number;
  dealCount: number;
  wonDealCount: number;
  revenue: number;
  pendingPayouts: number;
  totalPaid: number;
};

function PartnerCard({
  partner,
  showApproveReject,
  onApprove,
  onReject,
}: {
  partner: PartnerWithStats;
  showApproveReject?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const ramp = rampStatus(partner.wonDealCount);
  const daysSinceJoin = Math.floor(
    (Date.now() - partner.createdAt) / 86400000
  );

  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>{partner.name}</span>
          {partner.tier && (
            <span
              style={{
                padding: "1px 8px",
                borderRadius: 999,
                fontSize: ".7rem",
                fontWeight: 700,
                background: `${tierColor(partner.tier)}22`,
                color: tierColor(partner.tier),
                textTransform: "uppercase",
              }}
            >
              {partner.tier}
            </span>
          )}
          <span className="muted" style={{ fontSize: ".8rem" }}>
            {partner.type}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: ".7rem",
              fontWeight: 600,
              background: `${ramp.color}18`,
              color: ramp.color,
            }}
          >
            {ramp.label}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          fontSize: ".78rem",
          marginBottom: showApproveReject ? 12 : 0,
        }}
      >
        <span className="muted">
          <Target size={12} style={{ verticalAlign: -2 }} /> {partner.dealCount} deals
        </span>
        <span className="muted">
          <CheckCircle2 size={12} style={{ verticalAlign: -2 }} /> {partner.wonDealCount}{" "}
          won
        </span>
        <span className="muted">
          <DollarSign size={12} style={{ verticalAlign: -2 }} />{" "}
          {formatCurrency(partner.revenue)} revenue
        </span>
        <span className="muted">
          <Clock size={12} style={{ verticalAlign: -2 }} /> {daysSinceJoin}d since joining
        </span>
      </div>

      {showApproveReject && (
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            onClick={onApprove}
            className="btn-primary"
            style={{
              padding: "6px 14px",
              fontSize: ".8rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <CheckCircle2 size={14} /> Approve
          </button>
          <button
            onClick={onReject}
            className="btn-outline"
            style={{
              padding: "6px 14px",
              fontSize: ".8rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#ef4444",
              borderColor: "#ef4444",
            }}
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const partnersRaw = useQuery(api.partners.listWithStats);
  const updatePartner = useMutation(api.partners.update);

  const partners = partnersRaw as PartnerWithStats[] | undefined;

  const handleApprove = async (id: Id<"partners">) => {
    await updatePartner({ id, status: "active" });
  };

  const handleReject = async (id: Id<"partners">) => {
    await updatePartner({ id, status: "inactive" });
  };

  const { pendingPartners, activePartners, stats, tierGroups } = useMemo((): {
    pendingPartners: PartnerWithStats[];
    activePartners: PartnerWithStats[];
    stats: { totalActive: number; pendingReview: number; totalRevenue: number } | null;
    tierGroups: Record<string, PartnerWithStats[]>;
  } => {
    const emptyGroups: Record<string, PartnerWithStats[]> = {
      platinum: [],
      gold: [],
      silver: [],
      bronze: [],
    };

    if (!partners)
      return { pendingPartners: [], activePartners: [], stats: null, tierGroups: emptyGroups };

    const pending = partners.filter((p) => p.status === "pending");
    const active = partners.filter((p) => p.status === "active");

    const totalRevenue = active.reduce((s, p) => s + p.revenue, 0);

    const groups: Record<string, PartnerWithStats[]> = {
      platinum: [],
      gold: [],
      silver: [],
      bronze: [],
    };
    active.forEach((p) => {
      const tier = p.tier || "bronze";
      if (groups[tier]) groups[tier].push(p);
    });

    return {
      pendingPartners: pending,
      activePartners: active,
      stats: {
        totalActive: active.length,
        pendingReview: pending.length,
        totalRevenue,
      },
      tierGroups: groups,
    };
  }, [partners]);

  if (partners === undefined) {
    return <LoadingSkeleton />;
  }

  if (partners.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Partner Onboarding
          </h1>
          <p className="muted" style={{ marginTop: "0.25rem" }}>
            Track partner journey from signup to revenue production
          </p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Partner Onboarding
        </h1>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Track partner journey from signup to revenue production
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "1rem",
          }}
        >
          <StatCard
            icon={<Users size={22} />}
            label="Active Partners"
            value={String(stats.totalActive)}
            accent="#22c55e"
          />
          <StatCard
            icon={<Clock size={22} />}
            label="Pending Review"
            value={String(stats.pendingReview)}
            sub={stats.pendingReview > 0 ? "needs attention" : "all clear"}
            accent="#eab308"
          />
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Total Revenue Driven"
            value={formatCurrency(stats.totalRevenue)}
            accent="#6366f1"
          />
        </div>
      )}

      {/* Pending Partners */}
      {pendingPartners.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <UserCheck size={18} style={{ color: "#eab308" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Awaiting Approval ({pendingPartners.length})
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {pendingPartners.map((p) => (
              <PartnerCard
                key={p._id}
                partner={p}
                showApproveReject
                onApprove={() => handleApprove(p._id)}
                onReject={() => handleReject(p._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Partners by Tier */}
      {activePartners.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Rocket size={18} style={{ color: "#6366f1" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Active Partners ({activePartners.length})
            </h2>
          </div>

          {(["platinum", "gold", "silver", "bronze"] as const).map((tier) => {
            const group = tierGroups[tier];
            if (!group || group.length === 0) return null;
            return (
              <div key={tier} style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: tierColor(tier),
                    }}
                  />
                  <span
                    style={{
                      fontSize: ".85rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {tier} Tier ({group.length})
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
                >
                  {group
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((p) => (
                      <PartnerCard key={p._id} partner={p} />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
