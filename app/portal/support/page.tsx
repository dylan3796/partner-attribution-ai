"use client";

import { useState } from "react";
import { usePortal } from "@/lib/portal-context";
import {
  HelpCircle, MessageSquare, Book, Mail, Phone,
  ChevronDown, ChevronUp, Search, ExternalLink,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";

type FAQ = { q: string; a: string; category: string };

const faqs: FAQ[] = [
  { q: "How are my commissions calculated?", a: "Commissions are based on your attributed revenue multiplied by your tier's commission rate. When a deal closes, our role-based attribution model analyzes all partner touchpoints (referrals, demos, co-sell activities) and assigns a percentage. Your commission = deal amount × attribution % × commission rate.", category: "commissions" },
  { q: "When do I get paid?", a: "Payouts are processed on a monthly cycle. Once a commission is calculated, it goes through approval (typically 1-3 business days), then payment is sent via ACH/wire within 5 business days of approval. You'll receive email notifications at each step.", category: "commissions" },
  { q: "How do I register a deal?", a: "Go to My Deals → Register a Deal. Enter the prospect company, estimated value, contact info, and expected close date. Deal registrations are typically reviewed within 24 hours. Approved registrations give you exclusive attribution for 90 days.", category: "deals" },
  { q: "What happens if another partner claims the same deal?", a: "Our channel conflict resolution system flags overlapping claims. The channel team reviews touchpoint history, timing, and engagement level to determine primary attribution. You'll be notified of any conflicts on your registered deals.", category: "deals" },
  { q: "How do I move up to a higher tier?", a: "Tiers are based on your partner score, which combines revenue impact (35%), pipeline contribution (25%), engagement (25%), and deal velocity (15%). Check My Performance to see your current scores and specific tips for improvement.", category: "tiers" },
  { q: "What are the benefits of each tier?", a: "Bronze: 8% commission, standard deal reg. Silver: 10% commission, priority deal reg. Gold: 12% commission, MDF eligibility, shared co-sell. Platinum: 15% commission, full MDF, dedicated co-sell support, early access to new products.", category: "tiers" },
  { q: "How do I access training and certifications?", a: "Go to the Enablement section in the portal sidebar. You'll find video courses, certification exams, and training materials. Completing certifications boosts your partner score and can unlock higher commission tiers.", category: "training" },
  { q: "Can I see my attribution data in real time?", a: "Yes! Your dashboard shows real-time attribution across all active and closed deals. Go to My Commissions to see the breakdown by deal, including your attribution percentage and calculated commission for each.", category: "commissions" },
  { q: "How do I get MDF (marketing development funds)?", a: "MDF is available to Gold and Platinum tier partners. Submit MDF requests through the portal with your campaign details, budget, and expected outcomes. Requests are reviewed within 5 business days.", category: "programs" },
  { q: "What integrations are available?", a: "We integrate with Salesforce, HubSpot, Stripe, Slack, Zapier, and more. Deals sync automatically from connected CRMs, and payouts can be automated through Stripe Connect. Ask your channel manager about setting up integrations.", category: "technical" },
];

type Ticket = {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: number;
};

const DAY = 86400000;
const now = Date.now();

const demoTickets: Ticket[] = [
  { id: "T-1042", subject: "Commission discrepancy on TechBridge deal", status: "resolved", createdAt: now - 12 * DAY },
  { id: "T-1089", subject: "Deal registration not showing in portal", status: "in_progress", createdAt: now - 3 * DAY },
];

const STATUS_CFG = {
  open: { color: "#eab308", icon: Clock, label: "Open" },
  in_progress: { color: "#3b82f6", icon: AlertCircle, label: "In Progress" },
  resolved: { color: "#22c55e", icon: CheckCircle2, label: "Resolved" },
};

export default function SupportPage() {
  const { partner } = usePortal();
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!partner) return null;

  const categories = [...new Set(faqs.map((f) => f.category))];
  const filtered = faqs.filter((f) => {
    if (filterCat !== "all" && f.category !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-.02em" }}>Help & Support</h1>
        <p className="muted">Find answers, submit tickets, or contact your channel manager</p>
      </div>

      {/* Quick Contact Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { icon: <MessageSquare size={20} />, label: "Channel Manager", value: "Sarah Chen", sub: "sarah@horizonsoftware.com", color: "#6366f1" },
          { icon: <Mail size={20} />, label: "Support Email", value: "support@horizonsoftware.com", sub: "Avg response: 4h", color: "#22c55e" },
          { icon: <Phone size={20} />, label: "Priority Line", value: "+1 (888) 555-0199", sub: "Gold+ tier only", color: "#f59e0b" },
          { icon: <Book size={20} />, label: "Documentation", value: "docs.horizonsoftware.com", sub: "API & guides", color: "#8b5cf6" },
        ].map((c, i) => (
          <div key={i} className="card" style={{ padding: "1rem", display: "flex", gap: ".75rem", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color }}>{c.icon}</div>
            <div>
              <div className="muted" style={{ fontSize: ".7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{c.label}</div>
              <div style={{ fontSize: ".9rem", fontWeight: 700 }}>{c.value}</div>
              <div className="muted" style={{ fontSize: ".7rem" }}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Tickets */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: ".95rem" }}>My Support Tickets</h3>
          <button className="btn" onClick={() => { setShowForm(true); setFormSubmitted(false); }} style={{ fontSize: ".8rem", padding: "6px 14px" }}>New Ticket</button>
        </div>
        {demoTickets.length === 0 ? (
          <p className="muted" style={{ textAlign: "center", padding: "1rem" }}>No tickets. That&apos;s a good thing!</p>
        ) : (
          demoTickets.map((t) => {
            const cfg = STATUS_CFG[t.status];
            const Icon = cfg.icon;
            return (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="muted" style={{ fontSize: ".75rem", fontFamily: "monospace" }}>{t.id}</span>
                    <span style={{ fontSize: ".9rem", fontWeight: 600 }}>{t.subject}</span>
                  </div>
                  <span className="muted" style={{ fontSize: ".75rem" }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: ".7rem", fontWeight: 700, background: `${cfg.color}15`, color: cfg.color }}>
                  <Icon size={12} /> {cfg.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Frequently Asked Questions</h2>

        <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 10, top: 9, color: "var(--muted)" }} />
            <input className="input" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, width: "100%" }} />
          </div>
          <select className="input" value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="all">All Topics</option>
            {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((faq, i) => {
            const isOpen = expandedFaq === i;
            return (
              <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : i)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%",
                    padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", textAlign: "left", fontSize: ".9rem", fontWeight: 600,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <HelpCircle size={16} style={{ color: "#6366f1", flexShrink: 0 }} />
                    {faq.q}
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div style={{ padding: "0 16px 14px 40px", fontSize: ".85rem", lineHeight: 1.6, color: "var(--muted)" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
              <HelpCircle size={32} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
              <p className="muted">No matching questions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 480, maxWidth: "100%" }} onClick={(e) => e.stopPropagation()}>
            {formSubmitted ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <CheckCircle2 size={40} style={{ color: "#22c55e", margin: "0 auto 12px" }} />
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Ticket Submitted</h3>
                <p className="muted">We&apos;ll respond within 4 business hours.</p>
                <button className="btn" style={{ marginTop: "1rem" }} onClick={() => setShowForm(false)}>Done</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Submit a Support Ticket</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Subject</label>
                    <input className="input" placeholder="Brief description of your issue" style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Category</label>
                    <select className="input" style={{ width: "100%" }}>
                      <option>Commission / Payout</option>
                      <option>Deal Registration</option>
                      <option>Technical Issue</option>
                      <option>Tier / Scoring</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: ".8rem", fontWeight: 600, display: "block", marginBottom: 4 }}>Description</label>
                    <textarea className="input" rows={4} placeholder="Describe your issue in detail..." style={{ width: "100%", resize: "vertical" }} />
                  </div>
                  <button className="btn" style={{ width: "100%" }} onClick={() => setFormSubmitted(true)}>Submit Ticket</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
