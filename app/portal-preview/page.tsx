import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Eye,
  FileText,
  GraduationCap,
  Megaphone,
  PieChart,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Partner Portal Preview — Covant",
  description:
    "See what your partners experience with Covant. Self-service deal registration, commission tracking, performance analytics, certifications, and more — branded to your program.",
  openGraph: {
    title: "Partner Portal Preview — Covant",
    description:
      "The partner experience that drives engagement. See the self-service portal your partners will use every day.",
  },
};

/* ── Mock UI blocks ────────────────────────────────────── */

function MockStat({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div style={{ padding: "1rem 1.25rem", background:"#f9fafb", borderRadius: 10, border:'1px solid #e5e7eb' }}>
      <p style={{ fontSize: ".7rem", color:"#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</p>
      <p style={{ fontSize: "1.4rem", fontWeight: 700, color:'#0a0a0a' }}>{value}</p>
      {trend && <p style={{ fontSize: ".7rem", color: "#22c55e", marginTop: 2 }}>{trend}</p>}
    </div>
  );
}

function MockDealRow({ name, amount, status, product }: { name: string; amount: string; status: string; product: string }) {
  const statusColor = status === "Closed Won" ? "#22c55e" : status === "Active" ? "#818cf8" : "#f59e0b";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom:'1px solid #e5e7eb' }}>
      <div>
        <p style={{ fontSize: ".85rem", color:'#0a0a0a', fontWeight: 500 }}>{name}</p>
        <p style={{ fontSize: ".7rem", color:"#9ca3af" }}>{product}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: ".85rem", color:"#374151", fontWeight: 500 }}>{amount}</span>
        <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 6, background: `${statusColor}18`, color: statusColor, fontWeight: 600 }}>{status}</span>
      </div>
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

function PortalMockWindow({ title, children }: { title: string; children: React.ReactNode }) {
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "3rem",
        alignItems: "center",
        direction: reverse ? "rtl" : "ltr",
      }}
    >
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

/* ── Page ───────────────────────────────────────────────── */

export default function PortalPreviewPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
      {/* Back link */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: ".85rem", textDecoration: "none", marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Covant
      </Link>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <p style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color:'#374151', marginBottom: ".75rem" }}>
          Partner Portal
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: "1rem" }}>
          The portal your partners will actually use
        </h1>
        <p style={{ fontSize: "1.15rem", color:"#6b7280", maxWidth: 640, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Self-service deal registration, real-time commission tracking, performance analytics, and certifications — all white-labeled to your brand. No more email chains.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#fff", color: "#000", borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
            Try the demo <ArrowRight size={16} />
          </Link>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background:"#f3f4f6", color:'#0a0a0a', borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none", border:'1px solid #e5e7eb' }}>
            Talk to sales
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: "5rem", textAlign: "center" }}>
        {[
          { stat: "< 2 min", label: "Average partner login session" },
          { stat: "Zero", label: "Commission disputes after adoption" },
          { stat: "100%", label: "White-labeled to your brand" },
          { stat: "Self-serve", label: "No training required" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "1.5rem 1rem", background:"#f9fafb", borderRadius: 12, border:'1px solid #e5e7eb' }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, color:'#0a0a0a', marginBottom: 4 }}>{s.stat}</p>
            <p style={{ fontSize: ".75rem", color:"#6b7280" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Section 1: Portal Dashboard ──────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Home Dashboard"
          title="Everything a partner needs at a glance"
          description="Partners log in and immediately see their performance — total earned, pending payouts, deals won, and revenue influenced. No hunting through emails or spreadsheets."
          points={[
            "Real-time commission totals and pending payouts",
            "Recent deal activity feed with status updates",
            "Quick-access deal registration button",
            "Performance trend indicators",
          ]}
        >
          <PortalMockWindow title="portal.yourcompany.com">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <MockStat label="Total Earned" value="$47,850" trend="↑ 12% vs last quarter" />
              <MockStat label="Pending" value="$8,200" />
              <MockStat label="Deals Won" value="14" trend="↑ 3 this month" />
              <MockStat label="Revenue Influenced" value="$312K" />
            </div>
            <p style={{ fontSize: ".7rem", color:"#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Recent Activity</p>
            <MockDealRow name="Acme Corp License" amount="$45,000" status="Closed Won" product="Enterprise License" />
            <MockDealRow name="GlobalTech Upgrade" amount="$28,000" status="Active" product="Platform Add-on" />
            <MockDealRow name="Meridian Expansion" amount="$67,000" status="Pending" product="Enterprise Suite" />
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 2: Deal Registration ──────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Deal Registration"
          title="Register deals in under 60 seconds"
          description="Partners submit deal registrations with customer details, product selection, and estimated value. Approval workflows handle the rest — no more back-and-forth emails."
          points={[
            "One-click deal registration form",
            "Automatic conflict detection before submission",
            "Real-time status tracking (pending → approved → closed)",
            "Product-specific commission rates shown at registration",
          ]}
          reverse
        >
          <PortalMockWindow title="portal.yourcompany.com/deals/register">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <p style={{ fontSize: ".7rem", color:"#6b7280", marginBottom: 4 }}>Customer Company</p>
                <div style={{ padding: "8px 12px", background:"#f9fafb", borderRadius: 6, border:'1px solid #e5e7eb', color:'#0a0a0a', fontSize: ".85rem" }}>Acme Corporation</div>
              </div>
              <div>
                <p style={{ fontSize: ".7rem", color:"#6b7280", marginBottom: 4 }}>Product</p>
                <div style={{ padding: "8px 12px", background:"#f9fafb", borderRadius: 6, border:'1px solid #e5e7eb', color:'#0a0a0a', fontSize: ".85rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Enterprise License</span>
                  <span style={{ color: "#22c55e", fontSize: ".75rem" }}>15% commission</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: ".7rem", color:"#6b7280", marginBottom: 4 }}>Estimated Deal Value</p>
                <div style={{ padding: "8px 12px", background:"#f9fafb", borderRadius: 6, border:'1px solid #e5e7eb', color:'#0a0a0a', fontSize: ".85rem" }}>$85,000</div>
              </div>
              <div style={{ padding: "8px 14px", background: "rgba(129,140,248,.15)", borderRadius: 6, border: "1px solid rgba(129,140,248,.2)", fontSize: ".78rem", color:'#374151', display: "flex", alignItems: "center", gap: 6 }}>
                <Shield size={12} /> No conflicts detected — ready to register
              </div>
              <div style={{ padding: "10px 0", textAlign: "center", background: "#fff", color: "#000", borderRadius: 8, fontWeight: 600, fontSize: ".85rem" }}>Register Deal</div>
            </div>
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 3: Commission Tracking ────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Commission Tracking"
          title="Full transparency kills disputes"
          description="Partners see every payout — calculated, pending, and paid — with the exact attribution logic. No more 'where's my commission?' emails. Every number is auditable."
          points={[
            "Payout history with deal-level detail",
            "Attribution audit trail for every commission",
            "Pending vs paid breakdown",
            "Downloadable statements for accounting teams",
          ]}
        >
          <PortalMockWindow title="portal.yourcompany.com/commissions">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              <MockStat label="Total Earned" value="$47.8K" />
              <MockStat label="Paid" value="$39.6K" />
              <MockStat label="Pending" value="$8.2K" />
            </div>
            <p style={{ fontSize: ".7rem", color:"#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Recent Payouts</p>
            {[
              { deal: "Acme Corp License", amount: "$6,750", rate: "15%", status: "Paid" },
              { deal: "GlobalTech Upgrade", amount: "$2,800", rate: "10%", status: "Paid" },
              { deal: "Meridian Expansion", amount: "$8,200", rate: "12%", status: "Pending" },
            ].map((p) => (
              <div key={p.deal} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom:'1px solid #e5e7eb' }}>
                <div>
                  <p style={{ fontSize: ".85rem", color:'#0a0a0a', fontWeight: 500 }}>{p.deal}</p>
                  <p style={{ fontSize: ".7rem", color:"#9ca3af" }}>{p.rate} commission</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: ".85rem", color: p.status === "Paid" ? "#22c55e" : "#f59e0b", fontWeight: 600 }}>{p.amount}</p>
                  <p style={{ fontSize: ".65rem", color:"#9ca3af" }}>{p.status}</p>
                </div>
              </div>
            ))}
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 4: Performance Analytics ──────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Performance Analytics"
          title="Partners see how they stack up"
          description="Personal performance dashboards show partners their stats, tier progress, leaderboard ranking, and revenue trends — motivating better engagement without manual reporting."
          points={[
            "Tier progress with next-level requirements",
            "Revenue trend charts (monthly)",
            "Leaderboard ranking among peers",
            "Win rate and deal velocity metrics",
          ]}
          reverse
        >
          <PortalMockWindow title="portal.yourcompany.com/performance">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: ".85rem", fontWeight: 600, color:'#0a0a0a' }}>Gold Partner</p>
                  <p style={{ fontSize: ".7rem", color:"#6b7280" }}>72% to Platinum</p>
                </div>
                <span style={{ fontSize: ".7rem", padding: "3px 10px", background: "rgba(234,179,8,.15)", color: "#eab308", borderRadius: 6, fontWeight: 600 }}>Gold</span>
              </div>
              <MockBar percent={72} color="#eab308" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <MockStat label="Win Rate" value="68%" trend="↑ 5% vs avg" />
              <MockStat label="Rank" value="#3" trend="of 28 partners" />
            </div>
            <p style={{ fontSize: ".7rem", color:"#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>6-month revenue trend</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
              {[35, 42, 38, 55, 62, 78].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? "#818cf8" : "rgba(129,140,248,.3)", borderRadius: 3 }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m) => (
                <span key={m} style={{ fontSize: ".6rem", color:"#9ca3af", flex: 1, textAlign: "center" }}>{m}</span>
              ))}
            </div>
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 5: Certifications & Enablement ────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Certifications"
          title="Train, certify, and reward"
          description="Partners complete certification programs to unlock higher commission tiers, new product lines, and premium deal access. Track progress and expiration automatically."
          points={[
            "Certification programs by category (sales, technical, product)",
            "Progress tracking with completion status",
            "Tier-gated certifications for advanced partners",
            "Automatic expiration alerts and renewal reminders",
          ]}
        >
          <PortalMockWindow title="portal.yourcompany.com/certifications">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Sales Fundamentals", level: "Beginner", status: "Completed", color: "#22c55e", progress: 100 },
                { name: "Solution Selling", level: "Intermediate", status: "In Progress", color:'#0a0a0a', progress: 65 },
                { name: "Technical Integration", level: "Advanced", status: "Not Started", color:"#9ca3af", progress: 0 },
                { name: "Enterprise Strategy", level: "Expert", status: "Locked", color: "rgba(255,255,255,.1)", progress: 0 },
              ].map((cert) => (
                <div key={cert.name} style={{ padding: "12px 14px", background:"#f9fafb", borderRadius: 8, border:'1px solid #e5e7eb' }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <p style={{ fontSize: ".85rem", fontWeight: 600, color: cert.status === "Locked" ? "rgba(255,255,255,.3)" : "#fff" }}>{cert.name}</p>
                      <p style={{ fontSize: ".65rem", color:"#9ca3af" }}>{cert.level}</p>
                    </div>
                    <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 6, background: `${cert.color}18`, color: cert.color, fontWeight: 600 }}>
                      {cert.status}
                    </span>
                  </div>
                  {cert.progress > 0 && <MockBar percent={cert.progress} color={cert.color} />}
                </div>
              ))}
            </div>
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Section 6: MDF & Announcements ─────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <SectionBlock
          tag="Program Communication"
          title="MDF requests and announcements in one place"
          description="Partners submit marketing development fund requests and stay informed through the announcements feed — product updates, incentive changes, and events without inbox overload."
          points={[
            "Submit and track MDF requests with budget allocation",
            "Announcements feed with pinned items and categories",
            "No more partner emails lost in spam folders",
            "Program updates reach every partner instantly",
          ]}
          reverse
        >
          <PortalMockWindow title="portal.yourcompany.com/announcements">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { type: "Incentive", title: "Q2 SPIFF: 2x Commissions on Enterprise Deals", date: "2 days ago", color: "#22c55e", pinned: true },
                { type: "Product Update", title: "New API v3 Documentation Available", date: "5 days ago", color:'#0a0a0a', pinned: false },
                { type: "Event", title: "Partner Summit 2026 — Registration Open", date: "1 week ago", color: "#f59e0b", pinned: false },
                { type: "Policy", title: "Updated Deal Registration SLA: 48h → 24h", date: "2 weeks ago", color: "#ef4444", pinned: false },
              ].map((ann) => (
                <div key={ann.title} style={{ padding: "12px 14px", background: ann.pinned ? "rgba(129,140,248,.06)" : "rgba(255,255,255,.03)", borderRadius: 8, border: `1px solid ${ann.pinned ? "rgba(129,140,248,.15)" : "rgba(255,255,255,.06)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {ann.pinned && <span style={{ fontSize: ".6rem", color:'#0a0a0a' }}>📌</span>}
                    <span style={{ fontSize: ".6rem", padding: "1px 6px", borderRadius: 4, background: `${ann.color}15`, color: ann.color, fontWeight: 600 }}>{ann.type}</span>
                    <span style={{ fontSize: ".6rem", color:"#9ca3af", marginLeft: "auto" }}>{ann.date}</span>
                  </div>
                  <p style={{ fontSize: ".82rem", color:"#374151", fontWeight: 500 }}>{ann.title}</p>
                </div>
              ))}
            </div>
          </PortalMockWindow>
        </SectionBlock>
      </div>

      {/* ── Full feature list ─────────────────────────────── */}
      <div style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.2, marginBottom: ".75rem" }}>Everything in the portal</h2>
          <p style={{ color:"#6b7280", maxWidth: 560, margin: "0 auto", fontSize: ".95rem" }}>
            Every feature partners need to be self-sufficient — zero handholding required.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: ClipboardList, title: "Deal Registration", desc: "Submit, track, and manage deal registrations with conflict detection" },
            { icon: DollarSign, title: "Commission Tracking", desc: "Real-time payouts with attribution audit trails" },
            { icon: BarChart3, title: "Performance Analytics", desc: "Personal stats, tier progress, and peer benchmarks" },
            { icon: GraduationCap, title: "Certifications", desc: "Complete programs to unlock tiers and product access" },
            { icon: Wallet, title: "MDF Requests", desc: "Submit and track marketing development fund requests" },
            { icon: Megaphone, title: "Announcements", desc: "Program updates, incentive changes, and events" },
            { icon: FileText, title: "Resources & Enablement", desc: "Co-branded assets, playbooks, and sales tools" },
            { icon: PieChart, title: "Revenue Dashboard", desc: "Revenue influenced, deals won, and trend data" },
            { icon: TrendingUp, title: "Volume & Rebates", desc: "Track volume tiers and projected rebate payouts" },
            { icon: Users, title: "Referral Tracking", desc: "Submit and monitor referral leads through the funnel" },
            { icon: Eye, title: "Territory View", desc: "Assigned accounts, regions, and channel conflict alerts" },
            { icon: Star, title: "Leaderboard", desc: "See how you rank against other partners in the program" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ padding: "1.25rem", background:"#f9fafb", borderRadius: 10, border:'1px solid #e5e7eb' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(129,140,248,.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: ".6rem" }}>
                <Icon size={18} style={{ color:'#0a0a0a' }} />
              </div>
              <h4 style={{ fontSize: ".9rem", fontWeight: 600, marginBottom: 4 }}>{title}</h4>
              <p style={{ fontSize: ".78rem", color:"#6b7280", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── White-label callout ────────────────────────────── */}
      <div style={{ padding: "3rem", background: "rgba(129,140,248,.06)", borderRadius: 16, border: "1px solid rgba(129,140,248,.12)", marginBottom: "5rem", textAlign: "center" }}>
        <Shield size={32} style={{ color:'#0a0a0a', marginBottom: 12 }} />
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: ".75rem" }}>Fully white-labeled</h2>
        <p style={{ color:"#6b7280", maxWidth: 560, margin: "0 auto 1.5rem", lineHeight: 1.7, fontSize: ".95rem" }}>
          Your partners see your brand — your logo, your colors, your domain. No Covant branding anywhere in the portal experience. It&apos;s your program, presented as yours.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {["Custom domain", "Your logo & colors", "Branded emails", "No 'Powered by' badges"].map((item) => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".85rem", color:"#374151" }}>
              <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: ".75rem" }}>
          Give your partners a portal they&apos;ll actually use
        </h2>
        <p style={{ color:"#6b7280", maxWidth: 500, margin: "0 auto 2rem", fontSize: ".95rem", lineHeight: 1.7 }}>
          Start free — no credit card required. Set up your program and invite your first partner in under 10 minutes.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/sign-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#fff", color: "#000", borderRadius: 8, fontWeight: 700, fontSize: ".95rem", textDecoration: "none" }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background:"#f3f4f6", color:'#0a0a0a', borderRadius: 8, fontWeight: 600, fontSize: ".95rem", textDecoration: "none", border:'1px solid #e5e7eb' }}>
            Try the demo
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
