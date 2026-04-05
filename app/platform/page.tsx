import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  Coins,
  ClipboardList,
  Users,
  CheckCircle2,
  Shield,
  Bell,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Partner Platform — Covant",
  description:
    "Covant is the intelligence layer for your partner program. Track attribution, automate commissions, integrate your CRM, and give partners a portal — one system of record for the entire partner motion.",
  openGraph: {
    title: "The Partner Platform — Covant",
    description:
      "Track which partners drive revenue. Automate commissions. Give partners a portal they'll actually use.",
  },
};

/* ── Mock UI helpers ──────────────────────────────────────── */

function MockWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="l-mock-window">
      <div className="l-mock-titlebar">
        <div className="l-mock-dots">
          <div className="l-mock-dot" />
          <div className="l-mock-dot" />
          <div className="l-mock-dot" />
        </div>
        <span className="l-mock-title">{title}</span>
      </div>
      <div className="l-mock-body">{children}</div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="l-stat-card">
      <div className="l-stat-card-label">{label}</div>
      <div className="l-stat-card-value">{value}</div>
      <div className="l-stat-card-trend">{trend}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className="l-badge-inline" style={{ background: `${color}20`, color }}>
      {text}
    </span>
  );
}

function TourSection({
  id, step, title, subtitle, description, children, reverse,
}: {
  id: string; step: string; title: string; subtitle: string; description: string; children: React.ReactNode; reverse?: boolean;
}) {
  return (
    <section id={id} className="l-tour-section">
      <div className="l-tour-grid">
        <div style={{ order: reverse ? 2 : 1 }}>
          <div className="l-tour-step">{step}</div>
          <h2 className="l-tour-title">{title}</h2>
          <p className="l-tour-subtitle">{subtitle}</p>
          <p className="l-tour-desc">{description}</p>
        </div>
        <div style={{ order: reverse ? 1 : 2 }}>{children}</div>
      </div>
    </section>
  );
}

/* ── Data ─────────────────────────────────────────────────── */

const PROBLEMS = [
  { before: "Who actually drove this deal?", after: "Attribution Engine tracks every touchpoint — referrals, deal registrations, co-sells, introductions — and applies your attribution model automatically. Full audit trail on every deal." },
  { before: "How do I calculate commissions without a spreadsheet?", after: "Commission Engine reads attribution data, applies your rules by tier, deal size, and product line, and queues payouts for approval. Partners get paid via Stripe." },
  { before: "Partners keep asking where their payout is.", after: "Partner Portal gives every partner real-time visibility into their deals, commissions, tier status, and performance — no emails required." },
  { before: "Our CRM has the deals but no partner context.", after: "Covant syncs with Salesforce and HubSpot, matches deals to partners automatically, and feeds everything into the intelligence layer." },
];

const PILLARS = [
  { number: "01", title: "Attribution Engine", description: "The core engine. Ingests partner activity from CRM syncs and deal registrations, applies multi-touch attribution models — first-touch, last-touch, time-decay, role-based, equal-split — and builds a complete, auditable record of who influenced every deal." },
  { number: "02", title: "Commission Engine", description: "Reads from attribution data. Applies your commission rules by partner tier, deal size, product line, or geography. Stacks rules with priority ordering. Queues payouts for bulk approval. Every dollar traces back to the deal, the attribution, and the rule." },
  { number: "03", title: "CRM Integration", description: "Connects to Salesforce and HubSpot via OAuth. Syncs closed-won deals automatically. Matches deals to partners by email, domain, or custom field. Webhook support for custom systems. Bi-directional data flow." },
  { number: "04", title: "Partner Portal", description: "A branded, self-service workspace — free for every partner, forever. Deal registration, commission tracking, performance dashboards, tier status. White-labeled to your brand. No partner caps on portal access." },
  { number: "05", title: "Incentive Programs", description: "SPIFs, MDF budgets, bonuses, and accelerators — configured per tier, tracked per partner, approved through workflows. Deal registration bonuses. Volume rebates for high-performers." },
  { number: "06", title: "Partner Intelligence", description: "Health scores based on revenue, activity, win rate, and deal velocity. Automatic tier progression from Bronze to Platinum. Leaderboards, pipeline analytics, and program health reporting." },
];

const WHO = [
  { role: "VP of Partnerships", pain: "Runs a $10M+ indirect channel on spreadsheets and hope.", after: "Finally has a system of record that shows exactly what's working." },
  { role: "Channel Sales Manager", pain: "Spends 40% of time resolving commission disputes and chasing deal status.", after: "Disputes drop. Partner satisfaction goes up. Time goes back to selling." },
  { role: "Head of Alliances", pain: "Can't prove partner ROI to the board, so budget stays flat.", after: "Has the attribution data to show partner-sourced revenue clearly." },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function PlatformPage() {
  return (
    <div style={{ background: "#fff", color: "#0a0a0a" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="l-center l-section-border-b" style={{ padding: "8rem 0 6rem" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p className="l-section-tag" style={{ marginBottom: "1.5rem" }}>
            Partner Intelligence Platform
          </p>
          <h1 className="l-heading-xl" style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)", marginBottom: "1.75rem" }}>
            Your partner program<br />deserves a real platform.
          </h1>
          <p className="l-subtitle" style={{ color: "#4b5563", maxWidth: 560 }}>
            Most partner programs run on spreadsheets, email threads, and gut instinct.
            Covant is the intelligence layer that replaces all of it — attribution, commissions,
            CRM sync, and a partner portal — so you have one system of record for the entire motion.
          </p>
          <div className="l-flex-center">
            <Link href="/dashboard?demo=true" className="l-btn">Try it live →</Link>
            <Link href="/sign-up" className="l-btn-outline">Get started free →</Link>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ───────────────────────────────────────── */}
      <section className="l-section-alt">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <p className="l-section-tag l-center">
            The problem
          </p>
          <h2 className="l-heading-lg l-center">
            Partner ops is the last function<br />still running on spreadsheets.
          </h2>
          <p className="l-center" style={{ color: "#6b7280", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto 3.5rem", lineHeight: 1.65 }}>
            Sales has Salesforce. Marketing has HubSpot. Finance has NetSuite.
            Partner teams have a shared Google Sheet and a quarterly argument about who drove what.
          </p>
          <div className="l-problem-grid">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="l-problem-row">
                <div className="l-problem-before">
                  <span className="l-problem-icon-bad">✗</span>
                  <span className="l-problem-text" style={{ color: "#6b7280" }}>{p.before}</span>
                </div>
                <div className="l-problem-after">
                  <span className="l-problem-icon-good">✓</span>
                  <span className="l-problem-text" style={{ color: "#374151" }}>{p.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT COVANT IS ────────────────────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="l-tour-grid">
            <div>
              <p className="l-section-tag">What Covant is</p>
              <h2 className="l-heading-lg" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", marginBottom: "1.25rem" }}>
                The rules engine between<br />&ldquo;someone did something&rdquo;<br />and &ldquo;someone gets paid.&rdquo;
              </h2>
              <p className="l-body" style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>
                Covant connects to your CRM, ingests deal activity, applies your attribution
                rules, calculates commissions, and surfaces everything to partners through
                a branded portal. One pipeline. One audit trail. One payout workflow.
              </p>
              <p className="l-body" style={{ fontSize: "1rem" }}>
                Think of it as the intelligence layer for partner economics.
                The rules are yours. The execution is Covant.
              </p>
            </div>
            <div className="l-flex-col" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: "2rem", gap: "1rem" }}>
              {[
                { label: "Partner-sourced revenue", value: "$1.2M", trend: "+24% QoQ", color: "#22c55e" },
                { label: "Active partners", value: "47", trend: "12 pending onboard", color: "#3b82f6" },
                { label: "Commissions owed", value: "$38,400", trend: "Payout scheduled Apr 1", color: "#a78bfa" },
                { label: "Open deal registrations", value: "9", trend: "3 need review", color: "#f59e0b" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "#ffffff", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e5e7eb" }}>
                  <div>
                    <div className="l-stat-card-label">{stat.label}</div>
                    <div className="l-stat-card-value">{stat.value}</div>
                  </div>
                  <div style={{ color: stat.color, fontSize: ".75rem", textAlign: "right" }}>{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SIX PILLARS ───────────────────────────────────── */}
      <section className="l-section-alt l-section-border-b">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <p className="l-section-tag l-center">What&apos;s inside</p>
          <h2 className="l-heading-lg l-center" style={{ marginBottom: "3.5rem" }}>
            The full intelligence layer.
          </h2>
          <div className="l-grid-3">
            {PILLARS.map((p) => (
              <div key={p.number} className="l-pillar-card">
                <div className="l-pillar-num">{p.number}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.6rem" }}>{p.title}</h3>
                <p className="l-body" style={{ lineHeight: 1.65 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT TOUR ──────────────────────────────────────── */}
      <section className="l-section-border-b" style={{ padding: "5rem 0 2rem", background: "#fff" }}>
        <div className="wrap l-center" style={{ maxWidth: 960 }}>
          <p className="l-section-tag">How it works</p>
          <h2 className="l-heading-lg" style={{ marginBottom: "2rem" }}>
            See Covant in action.
          </h2>
          {/* Jump links */}
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { label: "Setup", href: "#setup" },
              { label: "Dashboard", href: "#dashboard" },
              { label: "Attribution", href: "#attribution" },
              { label: "Partner Portal", href: "#portal" },
              { label: "Commissions", href: "#commissions" },
              { label: "Deal Registration", href: "#deals" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="l-tour-step" style={{ marginBottom: 0 }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Step 1 — AI Setup */}
      <TourSection
        id="setup"
        step="Step 1 — Setup"
        title="Tell us about your program. We'll configure everything."
        subtitle="AI-powered setup in under 5 minutes."
        description="No forms. No 40-field wizards. Just describe your partner program in plain English — Covant's AI extracts your attribution model, commission rules, interaction types, and module preferences. A live preview panel updates in real time as you talk."
      >
        <MockWindow title="covant.ai/onboard">
          <div className="l-flex-col" style={{ gap: 12 }}>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Brain size={16} style={{ color: "#888", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ color: "#888", fontSize: ".7rem", marginBottom: 4 }}>Covant AI</div>
                <div style={{ color: "#374151", fontSize: ".82rem", lineHeight: 1.6 }}>Tell me about your partner program — how many partners, what types, how do you attribute deals today?</div>
              </div>
            </div>
            <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 8, padding: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Users size={16} style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ color: "#22c55e", fontSize: ".7rem", marginBottom: 4 }}>You</div>
                <div style={{ color: "#374151", fontSize: ".82rem", lineHeight: 1.6 }}>We have 35 reseller partners. Deal registration is how we attribute — whoever registers first gets credit. 15% commission on closed-won.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <Badge text="Deal Reg Protection" color="#3b82f6" />
              <Badge text="35 Partners" color="#22c55e" />
              <Badge text="15% Commission" color="#eab308" />
            </div>
            <div style={{ color: "#9ca3af", fontSize: ".7rem", textAlign: "center", marginTop: 4 }}>Live config preview updates as you talk ↑</div>
          </div>
        </MockWindow>
      </TourSection>

      {/* Step 2 — Dashboard */}
      <TourSection
        id="dashboard"
        step="Step 2 — Dashboard"
        title="Your partner program, at a glance."
        subtitle="Real-time metrics, action items, and trends."
        description="No more logging into Salesforce, exporting to Excel, and building a pivot table to figure out how your partners are doing. Covant shows partner-sourced revenue, pipeline, win rates, and commission burn — all updating in real time from your CRM."
        reverse
      >
        <MockWindow title="covant.ai/dashboard">
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <StatCard label="Partner Revenue" value="$2.4M" trend="↑ 18% vs last quarter" />
            <StatCard label="Active Partners" value="28" trend="↑ 3 this month" />
            <StatCard label="Win Rate" value="34%" trend="↑ 6pts vs direct" />
          </div>
          <div className="l-section-label">Action Items</div>
          {[
            { icon: ClipboardList, text: "3 deal registrations pending review", color: "#3b82f6" },
            { icon: Coins, text: "$12,400 in commissions ready to pay", color: "#eab308" },
            { icon: Users, text: "2 partners haven't completed onboarding", color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
              <item.icon size={14} style={{ color: item.color, flexShrink: 0 }} />
              <span style={{ color: "#6b7280", fontSize: ".8rem" }}>{item.text}</span>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* Step 3 — Attribution */}
      <TourSection
        id="attribution"
        step="Step 3 — Attribution"
        title="Attribution that partners actually trust."
        subtitle="Every number has a paper trail."
        description="When an AE questions a partner's credit, you don't open a spreadsheet — you open the audit trail. Every deal shows exactly which partner touched it, when, what model was applied, and how the commission was calculated. Step by step. No black boxes."
      >
        <MockWindow title="covant.ai/dashboard/deals/d-7291">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <div style={{ color: "#0a0a0a", fontSize: "1rem", fontWeight: 700 }}>Acme Corp — Enterprise</div>
                <div style={{ color: "#6b7280", fontSize: ".75rem" }}>Deal value: $180,000</div>
              </div>
              <Badge text="Closed Won" color="#22c55e" />
            </div>
            <div className="l-section-label">Attribution Audit Trail</div>
            {[
              { partner: "TechBridge Solutions", action: "Registered deal", date: "Jan 12", credit: "100%" },
              { partner: "TechBridge Solutions", action: "Sourced intro meeting", date: "Jan 8", credit: "—" },
              { partner: "Apex Growth", action: "Technical demo assist", date: "Jan 22", credit: "0%" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: i === 0 ? "rgba(34,197,94,.08)" : "transparent", border: i === 0 ? "1px solid rgba(34,197,94,.2)" : "none", borderRadius: 6, marginBottom: 4 }}>
                <div>
                  <span style={{ color: i === 0 ? "#22c55e" : "#6b7280", fontSize: ".8rem", fontWeight: 600 }}>{row.partner}</span>
                  <span style={{ color: "#374151", fontSize: ".75rem", marginLeft: 8 }}>{row.action}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "#374151", fontSize: ".7rem" }}>{row.date}</span>
                  <span style={{ color: i === 0 ? "#22c55e" : "#9ca3af", fontSize: ".75rem", fontWeight: 700, minWidth: 40, textAlign: "right" }}>{row.credit}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={14} style={{ color: "#3b82f6", flexShrink: 0 }} />
              <span style={{ color: "#6b7280", fontSize: ".75rem", lineHeight: 1.5 }}>
                <strong style={{ color: "#374151" }}>Model: Deal Reg Protection</strong> — TechBridge registered first (Jan 12). Credit: 100% → $180,000 × 15% = <strong style={{ color: "#22c55e" }}>$27,000 commission</strong>
              </span>
            </div>
          </div>
        </MockWindow>
      </TourSection>

      {/* Step 4 — Partner Portal */}
      {/* Step 4 — Partner Portal */}
      <TourSection
        id="portal"
        step="Step 4 — Partner Portal"
        title="The portal partners will actually use."
        subtitle="Always free. Infused with AI."
        description="Every partner gets their own branded workspace — register deals, track commissions, see performance, and ask AI questions about their pipeline. Set up bi-directional syncs, customize flows per partner, white-label everything. It's everything partner teams have been asking PRMs for, built from scratch and free forever."
        reverse
      >
        <MockWindow title="partners.covant.ai/portal">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ color: "#0a0a0a", fontSize: ".95rem", fontWeight: 700 }}>Welcome back, Sarah</div>
                <div style={{ color: "#6b7280", fontSize: ".75rem" }}>TechBridge Solutions · Gold Partner</div>
              </div>
              <Badge text="Gold" color="#eab308" />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <StatCard label="Your Revenue" value="$840K" trend="↑ 24% YoY" />
              <StatCard label="Commissions" value="$126K" trend="3 pending" />
            </div>
            {/* AI Chat UI */}
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, color: "#818cf8", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span>✦</span> Ask your portal AI
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "7px 10px", marginBottom: 6 }}>
                <span style={{ color: "#6b7280", fontSize: ".78rem" }}>"What's my projected commission if I close GlobalTech?"</span>
              </div>
              <div style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 6, padding: "7px 10px" }}>
                <span style={{ color: "#374151", fontSize: ".78rem" }}>
                  Based on your Gold tier rate (18%) and GlobalTech's registered value of $95K — your commission would be <strong style={{ color: "#22c55e" }}>$17,100</strong>. That would bring your Q2 total to <strong style={{ color: "#22c55e" }}>$41,420</strong>.
                </span>
              </div>
            </div>
            <div className="l-section-label">Recent Activity</div>
            {[
              { icon: CheckCircle2, text: "Deal approved: Acme Corp ($180K)", color: "#22c55e", time: "2h ago" },
              { icon: Coins, text: "Commission paid: $14,200", color: "#eab308", time: "1d ago" },
              { icon: Bell, text: "New deal registered: GlobalTech", color: "#3b82f6", time: "3d ago" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <item.icon size={14} style={{ color: item.color }} />
                  <span style={{ color: "#6b7280", fontSize: ".8rem" }}>{item.text}</span>
                </div>
                <span style={{ color: "#9ca3af", fontSize: ".7rem" }}>{item.time}</span>
              </div>
            ))}
          </div>
        </MockWindow>
      </TourSection>

      {/* Step 5 — Commissions */}
      <TourSection
        id="commissions"
        step="Step 5 — Commission Engine"
        title="Commission rules that match reality."
        subtitle="Not just flat percentages."
        description="Configure commission rules by product line, partner tier, deal size, or geography. Stack rules with priority ordering. Bulk approve payouts at end of quarter. Every payout links back to the deal, the attribution, and the rule that triggered it."
      >
        <MockWindow title="covant.ai/dashboard/settings/commission-rules">
          <div className="l-section-label" style={{ marginBottom: 12 }}>Commission Rules</div>
          {[
            { name: "Enterprise Reseller", condition: "Deal > $100K + Gold tier", rate: "18%", active: true },
            { name: "Standard Referral", condition: "All referral partners", rate: "12%", active: true },
            { name: "New Partner Bonus", condition: "First 3 deals, any tier", rate: "20%", active: true },
            { name: "APAC Override", condition: "Territory = APAC", rate: "+3%", active: false },
          ].map((rule, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f9fafb", borderRadius: 6, marginBottom: 6, opacity: rule.active ? 1 : 0.5 }}>
              <div>
                <div style={{ color: "#374151", fontSize: ".82rem", fontWeight: 600 }}>{rule.name}</div>
                <div style={{ color: "#6b7280", fontSize: ".7rem" }}>{rule.condition}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#22c55e", fontSize: ".85rem", fontWeight: 700 }}>{rule.rate}</span>
                <div style={{ width: 32, height: 18, borderRadius: 9, background: rule.active ? "#22c55e" : "#d1d5db", position: "relative" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: rule.active ? 16 : 2 }} />
                </div>
              </div>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* Step 6 — Deal Registration */}
      <TourSection
        id="deals"
        step="Step 6 — Deal Registration"
        title="Deal registration that actually works."
        subtitle="Partners register. You approve. Attribution happens."
        description="Partners submit deals through their portal. You review, approve, or reject from your dashboard. Approved deals automatically trigger the right commission rule. No CSV imports, no email chains, no 'who registered this?' debates."
        reverse
      >
        <MockWindow title="covant.ai/dashboard/deals">
          <div className="l-section-label" style={{ marginBottom: 12 }}>Pending Deal Registrations</div>
          {[
            { company: "GlobalTech Inc", partner: "TechBridge Solutions", value: "$95,000", status: "pending", date: "Mar 1" },
            { company: "DataFlow Systems", partner: "Apex Growth", value: "$220,000", status: "pending", date: "Feb 28" },
            { company: "NexaCloud", partner: "Stackline", value: "$45,000", status: "approved", date: "Feb 25" },
          ].map((deal, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 12px", background: "#f9fafb", borderRadius: 6, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#374151", fontSize: ".82rem", fontWeight: 600 }}>{deal.company}</div>
                <div style={{ color: "#6b7280", fontSize: ".7rem" }}>via {deal.partner} · {deal.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#374151", fontSize: ".82rem", fontWeight: 600 }}>{deal.value}</span>
                {deal.status === "pending" ? (
                  <div style={{ display: "flex", gap: 4 }}>
                    <div style={{ padding: "4px 10px", borderRadius: 4, background: "#22c55e20", color: "#22c55e", fontSize: ".7rem", fontWeight: 600 }}>Approve</div>
                    <div style={{ padding: "4px 10px", borderRadius: 4, background: "#ef444420", color: "#ef4444", fontSize: ".7rem", fontWeight: 600 }}>Reject</div>
                  </div>
                ) : (
                  <Badge text="Approved" color="#22c55e" />
                )}
              </div>
            </div>
          ))}
        </MockWindow>
      </TourSection>

      {/* ── WHO IT'S FOR ──────────────────────────────────────── */}
      <section className="l-section-alt l-section-border-b">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p className="l-section-tag l-center">Who it&apos;s for</p>
          <h2 className="l-heading-lg l-center" style={{ marginBottom: "3.5rem" }}>
            Built for the people who run partner programs.
          </h2>
          <div className="l-grid-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {WHO.map((w) => (
              <div key={w.role} className="l-who-card">
                <div className="l-who-header">
                  <div className="l-font-700" style={{ fontSize: "1rem" }}>{w.role}</div>
                </div>
                <div className="l-who-body">
                  <div>
                    <div className="l-who-label-before">Before Covant</div>
                    <p className="l-body" style={{ lineHeight: 1.6 }}>{w.pain}</p>
                  </div>
                  <div>
                    <div className="l-who-label-after">After Covant</div>
                    <p style={{ color: "#374151", fontSize: ".9rem", lineHeight: 1.6 }}>{w.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="l-section-dark l-center">
        <div className="wrap" style={{ maxWidth: 600 }}>
          <h2 className="l-heading-lg" style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Ready to run your partner program<br />on something real?
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "1.05rem", marginBottom: "2rem", lineHeight: 1.65 }}>
            Free for up to 5 partners. No credit card required.
          </p>
          <div className="l-flex-center">
            <Link href="/sign-up" style={{ background: "#fff", color: "#0a0a0a", padding: ".85rem 2rem", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: ".95rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Get started free <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard?demo=true" style={{ border: "1px solid #333", color: "#fff", padding: ".85rem 2rem", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: ".95rem" }}>
              Try it live
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
