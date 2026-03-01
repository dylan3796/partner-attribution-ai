"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Zap,
  Rocket,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    color: "#22c55e",
    icon: <CheckCircle size={14} />,
  },
  trialing: {
    label: "Trial",
    color: "#818cf8",
    icon: <Clock size={14} />,
  },
  past_due: {
    label: "Past Due",
    color: "#f59e0b",
    icon: <AlertCircle size={14} />,
  },
  canceled: {
    label: "Canceled",
    color: "#ef4444",
    icon: <AlertCircle size={14} />,
  },
  incomplete: {
    label: "Incomplete",
    color: "rgba(255,255,255,.4)",
    icon: <AlertCircle size={14} />,
  },
};

function BillingLoader() {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, []);
  if (timedOut) {
    return (
      <div style={{ padding: "24px", borderRadius: 14, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <AlertCircle size={18} color="rgba(255,255,255,.4)" />
          <span style={{ fontWeight: 600, color: "rgba(255,255,255,.7)" }}>Billing not configured</span>
        </div>
        <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.4)", lineHeight: 1.5 }}>
          Add your Stripe API keys in environment variables to enable billing.
        </p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.4)" }}>
      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
      <span style={{ fontSize: ".85rem" }}>Loading billing info…</span>
    </div>
  );
}

export default function BillingPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const subscription = useQuery(
    api.subscriptions.getSubscriptionByUserId,
    userId ? { userId } : "skip"
  );

  async function openBillingPortal() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error ?? "Failed to open billing portal");
      }
    } catch {
      setPortalError("Failed to connect to billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  const isLoading = subscription === undefined;
  const hasSubscription =
    subscription &&
    subscription.status !== "canceled" &&
    subscription.status !== "incomplete";

  const statusConfig = subscription
    ? (STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.incomplete)
    : null;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 640 }}>
      <h1
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 4,
          color: "#fff",
        }}
      >
        Billing & Subscription
      </h1>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem", marginBottom: 32 }}>
        Manage your Covant subscription and payment details.
      </p>

      {isLoading ? (
        <BillingLoader />
      ) : hasSubscription && subscription ? (
        /* Active subscription card */
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.03)",
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {subscription.plan === "growth" ? (
                <Zap size={18} color="#818cf8" />
              ) : (
                <Rocket size={18} color="rgba(255,255,255,.5)" />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>
                  {PLAN_LABELS[subscription.plan] ?? subscription.plan} Plan
                </div>
                <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.4)" }}>
                  Billed {subscription.interval === "year" ? "annually" : "monthly"}
                </div>
              </div>
            </div>

            {statusConfig && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: `1px solid ${statusConfig.color}33`,
                  background: `${statusConfig.color}11`,
                  color: statusConfig.color,
                  fontSize: ".75rem",
                  fontWeight: 600,
                }}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ padding: "20px 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 24px",
                marginBottom: 24,
              }}
            >
              <div>
                <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.35)", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".05em" }}>
                  Next Billing Date
                </div>
                <div style={{ fontSize: ".9rem", color: "#fff", fontWeight: 600 }}>
                  {formatDate(subscription.currentPeriodEnd)}
                </div>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div>
                  <div style={{ fontSize: ".72rem", color: "#f59e0b", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".05em" }}>
                    Cancels On
                  </div>
                  <div style={{ fontSize: ".9rem", color: "#f59e0b", fontWeight: 600 }}>
                    {formatDate(subscription.currentPeriodEnd)}
                  </div>
                </div>
              )}
            </div>

            {subscription.status === "past_due" && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(245,158,11,.08)",
                  border: "1px solid rgba(245,158,11,.2)",
                  color: "#f59e0b",
                  fontSize: ".82rem",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={14} />
                Payment failed. Please update your payment method to avoid service interruption.
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={openBillingPortal}
                disabled={portalLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "transparent",
                  color: "#fff",
                  fontSize: ".85rem",
                  fontWeight: 600,
                  cursor: portalLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: portalLoading ? 0.6 : 1,
                }}
              >
                {portalLoading ? (
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <CreditCard size={14} />
                )}
                Manage Billing
                <ExternalLink size={12} color="rgba(255,255,255,.4)" />
              </button>

              {subscription.plan === "starter" && (
                <button
                  onClick={() => router.push("/pricing")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#6366f1",
                    color: "#fff",
                    fontSize: ".85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Zap size={14} />
                  Upgrade to Growth
                  <ArrowUpRight size={12} />
                </button>
              )}
            </div>

            {portalError && (
              <p style={{ marginTop: 10, fontSize: ".8rem", color: "#ef4444" }}>
                {portalError}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* No active subscription */
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.02)",
            padding: 28,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <CreditCard size={20} color="rgba(255,255,255,.35)" />
            <div style={{ fontWeight: 600, color: "rgba(255,255,255,.7)" }}>No active subscription</div>
          </div>
          <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.4)", marginBottom: 20, lineHeight: 1.5 }}>
            You&apos;re currently on the free trial. Upgrade to unlock full attribution, commission automation, and partner portal access.
          </p>
          <button
            onClick={() => router.push("/pricing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#fff",
              color: "#000",
              fontSize: ".85rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            View Plans <ArrowUpRight size={14} />
          </button>
        </div>
      )}

      <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,.25)", lineHeight: 1.5 }}>
        Billing is managed securely through Stripe. Covant never stores your payment details.
        For billing questions, email{" "}
        <a href="mailto:billing@covant.ai" style={{ color: "rgba(255,255,255,.4)" }}>
          billing@covant.ai
        </a>
      </p>
    </div>
  );
}
