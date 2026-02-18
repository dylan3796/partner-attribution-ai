"use client";
import { usePortal } from "@/lib/portal-context";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Award, ArrowUp, Globe, CreditCard, CheckCircle, ExternalLink, Loader2, Zap, LinkIcon, AlertCircle } from "lucide-react";

import { formatCurrencyCompact as fmt, formatCurrency } from "@/lib/utils";
const TIER_LABELS: Record<string, string> = { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" };
const TYPE_LABELS: Record<string, string> = { reseller: "Reseller", referral: "Referral", affiliate: "Affiliate", integration: "Integration" };

export default function PortalProfilePage() {
  const { partner, setPartnerId, allPartners, myDeals, myAttributions, stats } = usePortal();
  const searchParams = useSearchParams();
  const [stripeConfigured, setStripeConfigured] = useState<boolean | null>(null);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  // Check if returning from Stripe onboarding
  useEffect(() => {
    if (searchParams.get("stripe_connected") === "true") {
      setStripeSuccess(true);
      // Clear the URL param without reload
      window.history.replaceState({}, "", "/portal/profile");
    }
  }, [searchParams]);

  // Check Stripe configuration
  useEffect(() => {
    fetch("/api/stripe/status")
      .then((res) => res.json())
      .then((data) => setStripeConfigured(data.configured))
      .catch(() => setStripeConfigured(false));
  }, []);

  if (!partner) return <div style={{ textAlign: "center", padding: "3rem" }}><p className="muted">Select a partner to view profile.</p></div>;

  const totalRevenue = myAttributions.reduce((s, a) => s + a.amount, 0);
  const totalCommission = myAttributions.reduce((s, a) => s + a.commissionAmount, 0);

  // Note: In demo mode, we simulate the Stripe connection status
  // In production, this would come from the partner's stripeOnboarded field
  const stripeOnboarded = partner.stripeOnboarded || stripeSuccess;
  const stripeAccountId = partner.stripeAccountId;

  async function handleConnectStripe() {
    setConnectingStripe(true);
    try {
      // In production, use the actual partner ID from Convex
      // For demo, we'll use the linkedPartnerIds
      const partnerId = partner.linkedPartnerIds?.[0] || partner.id;
      
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          partnerId,
          returnUrl: `${window.location.origin}/portal/profile?stripe_connected=true`,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.onboardingUrl) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboardingUrl;
      } else {
        console.error("Failed to start Stripe onboarding:", data.error);
        alert(data.error || "Failed to start Stripe onboarding. Please try again.");
      }
    } catch (err) {
      console.error("Stripe connect error:", err);
      alert("Failed to connect to Stripe. Please try again.");
    } finally {
      setConnectingStripe(false);
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "1.5rem" }}>Partner Profile</h1>

        {/* Switch Partner (Demo) */}
        <div className="card" style={{ marginBottom: "1.5rem", background: "#fffbeb", border: "1px solid #fde68a" }}>
          <p style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: ".5rem" }}>🎭 Demo Mode — Switch Partner View</p>
          <select className="input" style={{ width: "auto" }} value={partner.id} onChange={(e) => setPartnerId(e.target.value)}>
            {allPartners.map((p) => (
              <option key={p.id} value={p.id}>{p.companyName} ({p.type})</option>
            ))}
          </select>
        </div>

        {/* Company Info */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginBottom: "1.5rem" }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: "1.2rem" }}>{partner.companyName.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}</div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{partner.companyName}</h2>
              <div style={{ display: "flex", gap: ".75rem", marginTop: ".3rem" }}>
                <span className="chip">{TYPE_LABELS[partner.type] || partner.type}</span>
                <span className={`badge badge-${partner.tier === "platinum" ? "info" : partner.tier === "gold" ? "success" : "neutral"}`}>{TIER_LABELS[partner.tier] || partner.tier}</span>
                <span className="badge badge-success">{partner.status}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}><Mail size={16} color="var(--muted)" /> {partner.contactEmail}</span>
            {partner.phone && <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}><Phone size={16} color="var(--muted)" /> {partner.phone}</span>}
            {partner.address && <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}><MapPin size={16} color="var(--muted)" /> {partner.address}</span>}
            {partner.website && <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}><Globe size={16} color="var(--muted)" /> {partner.website}</span>}
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".9rem" }}>👤 Primary Contact: {partner.contactName}</span>
          </div>
        </div>

        {/* Performance */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}><Award size={18} style={{ display: "inline", verticalAlign: "-3px", marginRight: ".4rem" }} /> Performance Summary</h3>
          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.totalDeals}</p>
              <p className="muted" style={{ fontSize: ".8rem" }}>Total Deals</p>
            </div>
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{fmt(stats.totalRevenue)}</p>
              <p className="muted" style={{ fontSize: ".8rem" }}>Partner-Influenced Revenue</p>
            </div>
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{fmt(stats.totalEarned)}</p>
              <p className="muted" style={{ fontSize: ".8rem" }}>Commission Earned</p>
            </div>
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{partner.commissionRate}%</p>
              <p className="muted" style={{ fontSize: ".8rem" }}>Commission Rate</p>
            </div>
          </div>
        </div>

        {/* Tier Info */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Tier Status</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>{TIER_LABELS[partner.tier] || partner.tier} Tier</p>
              <p className="muted" style={{ fontSize: ".85rem" }}>Based on trailing 12-month performance</p>
            </div>
            <button className="btn-outline" style={{ fontSize: ".85rem" }} onClick={() => alert("Upgrade request submitted! Your partner manager will be in touch within 48 hours.")}><ArrowUp size={14} /> Request Upgrade</button>
          </div>
          <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: partner.tier === "platinum" ? "100%" : partner.tier === "gold" ? "75%" : partner.tier === "silver" ? "50%" : "25%", height: "100%", background: "var(--fg)", borderRadius: 4 }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".3rem" }}>
            <span className="muted" style={{ fontSize: ".75rem" }}>Bronze</span>
            <span className="muted" style={{ fontSize: ".75rem" }}>Silver</span>
            <span className="muted" style={{ fontSize: ".75rem" }}>Gold</span>
            <span className="muted" style={{ fontSize: ".75rem" }}>Platinum</span>
          </div>
        </div>

        {/* Partner Manager */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Your Partner Manager</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="avatar" style={{ width: 48, height: 48 }}>{partner.partnerManager.name.split(" ").map((w: string) => w[0]).join("")}</div>
            <div>
              <p style={{ fontWeight: 600 }}>{partner.partnerManager.name}</p>
              <p className="muted" style={{ fontSize: ".85rem" }}>Partner Account Manager</p>
              <p className="muted" style={{ fontSize: ".85rem" }}>{partner.partnerManager.email} · {partner.partnerManager.phone}</p>
            </div>
          </div>
        </div>
    </div>
  );
}
