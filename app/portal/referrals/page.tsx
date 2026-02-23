"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import {
  Link2, Copy, Check, Users, DollarSign, TrendingUp, Briefcase, Loader2, ExternalLink, Info,
} from "lucide-react";

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function ReferralLinksPage() {
  const { partner, myDeals, myTouchpoints, myAttributions } = usePortal();
  const [copied, setCopied] = useState(false);

  if (!partner) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  // Generate unique referral link
  const slug = partner.companyName?.toLowerCase().replace(/\s+/g, "-").slice(0, 20) || partner.id?.slice(-8) || "partner";
  const referralUrl = `https://horizonsoftware.com/?ref=${slug}`;

  // Referral touchpoints (type = "referral" or "introduction")
  const referralTouchpoints = myTouchpoints.filter(
    (t) => t.type === "referral" || t.type === "introduction"
  );

  // Deals that came through referral attribution
  const referralDeals = myDeals.filter((d) =>
    myAttributions.some((a) => a.dealId === d._id)
  );
  const wonReferralDeals = referralDeals.filter((d) => d.status === "won");
  const referralRevenue = wonReferralDeals.reduce((s, d) => s + d.amount, 0);

  function copyLink() {
    navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <Link2 size={24} style={{ color: "#6366f1" }} />
          Referral Links
        </h1>
        <p className="muted" style={{ marginTop: ".25rem" }}>Share your referral link to earn commissions on new business</p>
      </div>

      {/* Referral Link Card */}
      <div className="card" style={{ padding: "1.5rem", border: "2px solid #6366f130" }}>
        <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12 }}>Your Referral Link</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <code style={{
            flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 8,
            background: "var(--subtle)", border: "1px solid var(--border)",
            fontSize: ".85rem", color: "#6366f1", wordBreak: "break-all",
          }}>
            {referralUrl}
          </code>
          <button
            onClick={copyLink}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
              borderRadius: 8, border: "none", background: "#6366f1", color: "#fff",
              fontWeight: 600, fontSize: ".85rem", cursor: "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
          </button>
        </div>
        <p className="muted" style={{ fontSize: ".78rem", marginTop: 10 }}>
          Share this link in emails, social media, or with prospects. Any signups through this link will be attributed to you.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Referral Touchpoints", value: String(referralTouchpoints.length), icon: <Users size={18} />, color: "#6366f1" },
          { label: "Deals Attributed", value: String(referralDeals.length), icon: <Briefcase size={18} />, color: "#3b82f6" },
          { label: "Deals Won", value: String(wonReferralDeals.length), icon: <TrendingUp size={18} />, color: "#22c55e" },
          { label: "Revenue Generated", value: fmt(referralRevenue), icon: <DollarSign size={18} />, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Referral Deals */}
      {referralDeals.length > 0 ? (
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: 12 }}>Attributed Deals ({referralDeals.length})</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Deal", "Value", "Status", "Date"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referralDeals.map((d) => {
                  const statusColor = d.status === "won" ? "#22c55e" : d.status === "lost" ? "#ef4444" : "#f59e0b";
                  return (
                    <tr key={d._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{fmt(d.amount)}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: ".7rem", fontWeight: 700, color: statusColor, background: `${statusColor}18`, textTransform: "capitalize" }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: ".8rem" }}>
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <Link2 size={40} style={{ color: "var(--muted)", marginBottom: 12 }} />
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>No referrals tracked yet</h3>
          <p className="muted" style={{ fontSize: ".85rem", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
            Share your referral link with prospects. When they sign up or a deal is created through your link, it will appear here automatically with full attribution tracking.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="card" style={{ padding: "1.25rem", background: "#6366f108", border: "1px solid #6366f120" }}>
        <h4 style={{ fontSize: ".8rem", fontWeight: 700, marginBottom: 8, color: "#6366f1", display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={14} /> Referral Tips
        </h4>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.8 }}>
          <li>Add your referral link to your email signature for passive lead generation</li>
          <li>Share it on LinkedIn when discussing relevant solutions</li>
          <li>Include it in proposals and case studies you share with prospects</li>
          <li>Each successful referral earns you a {partner.commissionRate || 15}% commission</li>
        </ul>
      </div>
    </div>
  );
}
