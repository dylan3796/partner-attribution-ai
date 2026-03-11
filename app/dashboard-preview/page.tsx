import { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FileText,
  HeartPulse,
  Layers,
  LayoutDashboard,
  LineChart,
  PieChart,
  Settings,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dashboard Preview — See Your Command Center | Covant.ai",
  description:
    "See the admin dashboard VPs of Partnerships use to run their programs. Attribution audit trails, commission management, partner intelligence, QBR reports — all in one place.",
  openGraph: {
    title: "Dashboard Preview — Your Partner Program Command Center | Covant.ai",
    description:
      "The admin experience that replaces spreadsheets. See how VPs manage attribution, commissions, and partner intelligence from a single dashboard.",
  },
};

/* ── Reusable Mock Components ────────────────────────── */

function MockWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:'#f9fafb', border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <span style={{ fontSize: ".7rem", color:"#9ca3af", marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

function MockStat({ label, value, trend, color = "#22c55e" }: { label: string; value: string; trend?: string; color?: string }) {
  return (
    <div style={{ padding: "1rem 1.25rem", background:"#f9fafb", borderRadius: 10, border:'1px solid #e5e7eb' }}>
      <p style={{ fontSize: ".7rem", color:"#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</p>
      <p style={{ fontSize: "1.4rem", fontWeight: 700, color:'#0a0a0a' }}>{value}</p>
      {trend && <p style={{ fontSize: ".7rem", color, marginTop: 2 }}>{trend}</p>}
    </div>
  );
}

function MockBar({ percent, color = "#818cf8" }: { percent: number; color?: string }) {
  return (
    <div style={{ width: "100%", height: 6, background:"#f9fafb", borderRadius: 3 }}>
      <div style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: 3 }} />
    </div>
  );
}

function MockTableRow({ cells, highlight }: { cells: string[]; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom:'1px solid #e5e7eb' }}>
      {cells.map((cell, i) => (
        <span key={i} style={{ fontSize: ".8rem", color: highlight && i === cells.length - 1 ? "#22c55e" : i === 0 ? "#fff" : "rgba(255,255,255,.5)", fontWeight: i === 0 ? 500 : 400, flex: i === 0 ? 2 : 1, textAlign: i === 0 ? "left" : "right" }}>
          {cell}
        </span>
      ))}
    </div>
  );
}

function MockBadge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 6, background: `${color}18`, color, fontWeight: 600 }}>{text}</span>
  );
}

function SectionBlock({
  tag,
  title,
  description,
  points,
  children,
  reverse,
}: {
  tag: string;
  title: string;
  description: string;
  points: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", direction: reverse ? "rtl" : "ltr" }}>
      <div style={{ direction: "ltr" }}>
        <p style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color:'#374151', marginBottom: ".5rem" }}>{tag}</p>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2, marginBottom: ".75rem" }}>{title}</h3>
        <p style={{ color:"#6b7280", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: ".95rem" }}>{description}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {points.map((pt) => (
            <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8, color:"#374151", fontSize: ".85rem", lineHeight: 1.5 }}>
              <CheckCircle2 size={14} style={{ color: "#22c55e", marginTop: 3, flexShrink: 0 }} />
              {pt}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ direction: "ltr" }}>{children}</div>
    </div>
  );
}

/* ── Feature Grid ── */
const FEATURES = [
  { icon: LayoutDashboard, title: "Program Health Score", desc: "Composite 0–100 score across engagement, velocity, payouts, and growth" },
  { icon: Workflow, title: "3 Attribution Models", desc: "Deal Reg Protection, Source Wins, Role Split — full audit trail" },
  { icon: DollarSign, title: "Commission Rules Engine", desc: "Tiered rates by partner level, product line, and deal size" },
  { icon: ClipboardList, title: "Deal Registration", desc: "Partners register, admins approve — commissions auto-calculate" },
  { icon: HeartPulse, title: "Partner Health Scores", desc: "Individual 0–100 scores with at-risk and churning alerts" },
  { icon: Trophy, title: "Leaderboard & Gamification", desc: "Ranked partner performance with medals and composite scoring" },
  { icon: BarChart3, title: "QBR Reports", desc: "Executive quarterly reviews with Q-over-Q deltas and print/PDF" },
  { icon: TrendingUp, title: "Revenue Intelligence", desc: "Revenue by partner type, tier, concentration risk analysis" },
  { icon: LineChart, title: "Win/Loss Analysis", desc: "Win rates by partner, product, deal size with auto-generated insights" },
  { icon: Target, title: "Goals & Targets", desc: "Set quarterly objectives and track live progress from real data" },
  { icon: FileText, title: "Weekly Digest", desc: "Automated exec summary with KPIs, top partner, and at-risk alerts" },
  { icon: AlertTriangle, title: "Dispute Resolution", desc: "Full dispute lifecycle with admin review workflow and audit trail" },
  { icon: Shield, title: "API Keys & Webhooks", desc: "Scoped API keys, HMAC-signed webhooks for 15 event types" },
  { icon: Users, title: "Team Management", desc: "Invite teammates, assign roles, admin-only guards, audit logging" },
  { icon: Layers, title: "Bulk Actions & Tags", desc: "Batch tag, tier, status, and export operations across partners" },
  { icon: Settings, title: "Notification Preferences", desc: "Per-event toggles, email digest frequency, quiet hours" },
];

/* ── Page Component ── */
export default function DashboardPreviewPage() {
  return (
    <div style={{ background:'#f9fafb', color:'#0a0a0a', minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color:"#6b7280", fontSize: ".85rem", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={14} /> Back to Covant
        </Link>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, background: "rgba(129,140,248,.1)", border: "1px solid rgba(129,140,248,.2)", marginBottom: 20 }}>
            <LayoutDashboard size={14} style={{ color:'#0a0a0a' }} />
            <span style={{ fontSize: ".75rem", fontWeight: 600, color:'#0a0a0a' }}>Admin Dashboard</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
            Your Partner Program<br />Command Center
          </h1>
          <p style={{ fontSize: "1.1rem", color:"#6b7280", lineHeight: 1.6, marginBottom: "2rem" }}>
            Everything a VP of Partnerships needs to manage attribution, commissions, partner health, and program performance — from one dashboard. No spreadsheets, no guesswork.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "#fff", color: "#000", borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              Try the Demo <ArrowRight size={14} />
            </Link>
            <Link href="/portal-preview" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "transparent", color:'#0a0a0a', border:'1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              See Partner View
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "1.5rem", borderRadius: 12, background:"#f9fafb", border:'1px solid #e5e7eb' }}>
          {[
            { label: "Dashboard Pages", value: "55+" },
            { label: "Report Types", value: "8" },
            { label: "Admin Features", value: "45+" },
            { label: "Setup Time", value: "<5 min" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color:'#0a0a0a' }}>{s.value}</p>
              <p style={{ fontSize: ".7rem", color:"#9ca3af", textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Program Dashboard ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="PROGRAM OVERVIEW"
          title="One Dashboard. Full Visibility."
          description="See partner-influenced revenue, pipeline, win rates, and program health at a glance. Real-time data from Convex — not cached reports that lag behind."
          points={[
            "Program Health Score (0–100) across 4 weighted categories",
            "Period-over-period trend badges on every KPI",
            "Action items: tier reviews, unpaid commissions, pending deals",
            "Getting started checklist for new program setup",
          ]}
        >
          <MockWindow title="covant.ai/dashboard">
            {/* Health Score */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={16} style={{ color: "#22c55e" }} />
                <span style={{ fontSize: ".85rem", fontWeight: 600 }}>Program Health</span>
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#22c55e" }}>78<span style={{ fontSize: ".7rem", color:"#9ca3af" }}>/100</span></span>
            </div>
            <MockBar percent={78} color="#22c55e" />
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
              <MockStat label="Revenue" value="$1.2M" trend="↑ 18% vs last month" />
              <MockStat label="Pipeline" value="$3.4M" trend="↑ 12% vs last month" color="#818cf8" />
              <MockStat label="Active Partners" value="38" trend="↑ 3 this month" />
              <MockStat label="Win Rate" value="67%" trend="↑ 5% vs last month" color="#f59e0b" />
            </div>
            {/* Action Items */}
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "3 tier reviews", color: "#8b5cf6" },
                { label: "$24K unpaid", color: "#ef4444" },
                { label: "5 pending regs", color: "#eab308" },
              ].map((a) => (
                <span key={a.label} style={{ fontSize: ".68rem", padding: "3px 8px", borderRadius: 6, background: `${a.color}15`, color: a.color, fontWeight: 600 }}>{a.label}</span>
              ))}
            </div>
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 2: Attribution Engine ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="ATTRIBUTION ENGINE"
          title="Every Dollar Traced Back to a Partner"
          description="Three real-world attribution models with a full audit trail for every calculation. When an AE questions a payout, show them the exact logic — step by step."
          points={[
            "Deal Reg Protection — registering partner wins (80% of programs)",
            "Source Wins — whoever sourced the opportunity gets credit",
            "Role Split — predefined % by partner type for co-sell",
            "Tamper-evident audit trail with calculation chain",
          ]}
          reverse
        >
          <MockWindow title="covant.ai/dashboard/deals/deal_abc123">
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: ".9rem", fontWeight: 600, color:'#0a0a0a', marginBottom: 2 }}>CloudSync Enterprise License</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>$85,000</span>
                <MockBadge text="Closed Won" color="#22c55e" />
                <MockBadge text="Deal Reg Protection" color="#818cf8" />
              </div>
            </div>
            <p style={{ fontSize: ".7rem", fontWeight: 600, color:"#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Attribution Audit Trail</p>
            {[
              { partner: "TechBridge Partners", type: "Deal Registration", pct: "100%", amount: "$15,300" },
            ].map((row) => (
              <div key={row.partner} style={{ padding: "10px 12px", borderRadius: 8, border:'1px solid #e5e7eb', background:"#f9fafb", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: ".8rem", fontWeight: 600, color:'#0a0a0a' }}>{row.partner}</span>
                  <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#22c55e" }}>{row.amount}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: ".7rem", color:"#6b7280" }}>{row.type}</span>
                  <span style={{ fontSize: ".65rem", color:"#9ca3af" }}>→</span>
                  <span style={{ fontSize: ".7rem", color:"#6b7280" }}>{row.pct} credit</span>
                  <span style={{ fontSize: ".65rem", color:"#9ca3af" }}>→</span>
                  <span style={{ fontSize: ".7rem", color:"#6b7280" }}>18% commission</span>
                  <span style={{ fontSize: ".65rem", color:"#9ca3af" }}>→</span>
                  <span style={{ fontSize: ".7rem", color: "#22c55e", fontWeight: 600 }}>{row.amount}</span>
                </div>
              </div>
            ))}
            {/* Touchpoints */}
            <p style={{ fontSize: ".7rem", fontWeight: 600, color:"#6b7280", textTransform: "uppercase", marginTop: 14, marginBottom: 6 }}>Touchpoints</p>
            {[
              { type: "Deal Registration", date: "Jan 8", icon: "📋" },
              { type: "Product Demo", date: "Jan 12", icon: "🎯" },
              { type: "Proposal Review", date: "Jan 15", icon: "📄" },
              { type: "Closed Won", date: "Jan 18", icon: "🏆" },
            ].map((tp) => (
              <div key={tp.type} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom:'1px solid #e5e7eb' }}>
                <span style={{ fontSize: ".75rem" }}>{tp.icon}</span>
                <span style={{ fontSize: ".78rem", color:"#374151", flex: 1 }}>{tp.type}</span>
                <span style={{ fontSize: ".7rem", color:"#9ca3af" }}>{tp.date}</span>
              </div>
            ))}
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 3: Commission Management ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="COMMISSION ENGINE"
          title="Rules That Scale. Payouts That Reconcile."
          description="Define commission rules by partner tier, product line, and deal size. Bulk-approve payouts. Run end-of-quarter reconciliation. Export everything to CSV."
          points={[
            "Tiered rates: Gold 20%, Silver 15%, Bronze 10% — or custom",
            "Product-line rules match against your actual catalog",
            "Bulk payout approval with checkbox select",
            "Dispute resolution with full admin review workflow",
          ]}
        >
          <MockWindow title="covant.ai/dashboard/settings/commission-rules">
            <p style={{ fontSize: ".7rem", fontWeight: 600, color:"#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Active Commission Rules</p>
            {[
              { rule: "Gold Tier Partners", rate: "20%", scope: "All Products", deals: "142" },
              { rule: "Silver Tier Partners", rate: "15%", scope: "All Products", deals: "89" },
              { rule: "Enterprise Deals (>$100K)", rate: "12%", scope: "Enterprise Suite", deals: "23" },
              { rule: "Referral Partners", rate: "10%", scope: "All Products", deals: "67" },
            ].map((r) => (
              <div key={r.rule} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom:'1px solid #e5e7eb' }}>
                <div>
                  <p style={{ fontSize: ".8rem", color:'#0a0a0a', fontWeight: 500 }}>{r.rule}</p>
                  <p style={{ fontSize: ".68rem", color:"#9ca3af" }}>{r.scope} · {r.deals} deals matched</p>
                </div>
                <span style={{ fontSize: ".85rem", fontWeight: 700, color:'#0a0a0a' }}>{r.rate}</span>
              </div>
            ))}
            {/* Payout Summary */}
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(34,197,94,.08)", textAlign: "center" }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#22c55e" }}>$184K</p>
                <p style={{ fontSize: ".65rem", color:"#9ca3af" }}>Paid This Quarter</p>
              </div>
              <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(245,158,11,.08)", textAlign: "center" }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f59e0b" }}>$42K</p>
                <p style={{ fontSize: ".65rem", color:"#9ca3af" }}>Pending Approval</p>
              </div>
              <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239,68,68,.08)", textAlign: "center" }}>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#ef4444" }}>3</p>
                <p style={{ fontSize: ".65rem", color:"#9ca3af" }}>Open Disputes</p>
              </div>
            </div>
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 4: Partner Intelligence ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="PARTNER INTELLIGENCE"
          title="Know Which Partners Need Attention"
          description="Health scores computed from real deal data. At-risk detection before churn happens. Leaderboard rankings to drive competition. Recommendations backed by performance data."
          points={[
            "Individual partner health scores (0–100) across 5 dimensions",
            "Auto-classification: healthy, at-risk, churning, new",
            "Partner comparison — benchmark 2–4 partners side by side",
            "Scorecards: print-ready partner performance reports",
          ]}
          reverse
        >
          <MockWindow title="covant.ai/dashboard/partner-health">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: ".85rem", fontWeight: 600 }}>Partner Health Overview</span>
              <div style={{ display: "flex", gap: 8 }}>
                <MockBadge text="32 Healthy" color="#22c55e" />
                <MockBadge text="4 At Risk" color="#f59e0b" />
                <MockBadge text="2 Churning" color="#ef4444" />
              </div>
            </div>
            {[
              { name: "TechBridge Partners", score: 92, tier: "Gold", trend: "↑", status: "Healthy" },
              { name: "Apex Growth Group", score: 78, tier: "Silver", trend: "↑", status: "Healthy" },
              { name: "Northlight Solutions", score: 65, tier: "Gold", trend: "→", status: "Healthy" },
              { name: "Clearpath Consulting", score: 38, tier: "Bronze", trend: "↓", status: "At Risk" },
              { name: "Stackline Agency", score: 22, tier: "Bronze", trend: "↓", status: "Churning" },
            ].map((p) => {
              const scoreColor = p.score >= 70 ? "#22c55e" : p.score >= 40 ? "#f59e0b" : "#ef4444";
              return (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom:'1px solid #e5e7eb' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${scoreColor}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: ".75rem", fontWeight: 700, color: scoreColor }}>{p.score}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: ".8rem", fontWeight: 500, color:'#0a0a0a' }}>{p.name}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <MockBadge text={p.tier} color="#818cf8" />
                      <span style={{ fontSize: ".65rem", color:"#9ca3af" }}>{p.trend} {p.status}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} style={{ color:"#9ca3af" }} />
                </div>
              );
            })}
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 5: Reports & Analytics ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="REPORTS & ANALYTICS"
          title="QBR-Ready. Board-Ready. Always."
          description="8 report types cover every question a VP faces — from weekly exec updates to quarterly business reviews. Print/PDF support, copy-to-clipboard, and export to CSV."
          points={[
            "QBR Reports with Q-over-Q deltas and top partner leaderboard",
            "Win/Loss Analysis by partner, product, and deal size",
            "Revenue Intelligence with concentration risk warnings",
            "Weekly Digest with copy-as-text for Slack or email",
          ]}
        >
          <MockWindow title="covant.ai/dashboard/reports">
            <p style={{ fontSize: ".7rem", fontWeight: 600, color:"#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Reports Hub — 8 Report Types</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { name: "Attribution Reports", icon: "🎯", desc: "Full audit trail per deal" },
                { name: "QBR Reports", icon: "📊", desc: "Quarterly exec summary" },
                { name: "Revenue Intelligence", icon: "💰", desc: "Revenue source analysis" },
                { name: "Win/Loss Analysis", icon: "📈", desc: "Deal outcome patterns" },
                { name: "Weekly Digest", icon: "📋", desc: "Automated exec update" },
                { name: "Activity Heatmap", icon: "🗓️", desc: "12-month engagement grid" },
                { name: "Data Export", icon: "📁", desc: "Bulk CSV downloads" },
                { name: "Reconciliation", icon: "✅", desc: "End-of-quarter payouts" },
              ].map((r) => (
                <div key={r.name} style={{ padding: "10px 12px", borderRadius: 8, border:'1px solid #e5e7eb', background:"#f9fafb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: ".9rem" }}>{r.icon}</span>
                    <span style={{ fontSize: ".78rem", fontWeight: 600, color:'#0a0a0a' }}>{r.name}</span>
                  </div>
                  <p style={{ fontSize: ".68rem", color:"#9ca3af" }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 6: Operations ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <SectionBlock
          tag="OPERATIONS"
          title="Manage 140 Partners Without the Chaos"
          description="Bulk actions, pipeline views, deal registration workflows, and team management. Everything that used to take a spreadsheet and 3 hours now takes 3 clicks."
          points={[
            "Pipeline kanban board with drag-style status columns",
            "Bulk partner operations: tag, tier change, status, export",
            "Deal registration: partners submit, admins approve in one click",
            "Team management with Admin/Manager/Member roles",
          ]}
          reverse
        >
          <MockWindow title="covant.ai/dashboard/pipeline">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { stage: "Pending Reg", count: 5, value: "$180K", color: "#f59e0b" },
                { stage: "Active", count: 12, value: "$1.2M", color:'#0a0a0a' },
                { stage: "Won", count: 8, value: "$680K", color: "#22c55e" },
                { stage: "Lost", count: 3, value: "$145K", color: "#ef4444" },
              ].map((col) => (
                <div key={col.stage} style={{ background:"#f9fafb", borderRadius: 8, padding: 10, border:'1px solid #e5e7eb' }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: ".7rem", fontWeight: 600, color: col.color }}>{col.stage}</span>
                    <span style={{ fontSize: ".6rem", background: `${col.color}18`, color: col.color, padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>{col.count}</span>
                  </div>
                  <p style={{ fontSize: ".85rem", fontWeight: 700, color:"#374151", marginBottom: 4 }}>{col.value}</p>
                  {/* Mini cards */}
                  {Array.from({ length: Math.min(col.count, 2) }).map((_, i) => (
                    <div key={i} style={{ background:"#f9fafb", borderRadius: 6, padding: "6px 8px", marginTop: 4, border:'1px solid #e5e7eb' }}>
                      <div style={{ width: "70%", height: 4, borderRadius: 2, background:"#f3f4f6" }} />
                      <div style={{ width: "50%", height: 3, borderRadius: 2, background:"#f9fafb", marginTop: 4 }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </MockWindow>
        </SectionBlock>
      </div>

      {/* ── Feature Grid ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>16 Admin Capabilities. One Platform.</h2>
          <p style={{ color:"#6b7280", fontSize: ".95rem", marginTop: ".5rem" }}>Everything a VP of Partnerships needs to run, measure, and grow their program.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: ".75rem" }}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ padding: "1.25rem", borderRadius: 10, background:"#f9fafb", border:'1px solid #e5e7eb', transition: "border-color 0.2s" }}>
                <Icon size={18} style={{ color:'#0a0a0a', marginBottom: 8 }} />
                <h4 style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: 4 }}>{f.title}</h4>
                <p style={{ fontSize: ".75rem", color:"#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Comparison CTA ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", padding: "2.5rem", borderRadius: 12, background:"#f9fafb", border:'1px solid #e5e7eb' }}>
          <Sparkles size={24} style={{ color:'#0a0a0a', marginBottom: 12 }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: ".5rem" }}>Ready to Replace Your Spreadsheets?</h3>
          <p style={{ color:"#6b7280", fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 480, margin: "0 auto 1.5rem" }}>
            Try Covant free with up to 5 partners. No credit card. No time limit. See your dashboard in under 5 minutes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/sign-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 28px", background: "#fff", color: "#000", borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", background: "transparent", color:"#374151", border:'1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.5rem" }}>
        <Footer />
      </div>
    </div>
  );
}
