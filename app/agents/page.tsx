import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Activity,
  TrendingUp,
  Zap,
  ArrowRight,
  Clock,
  FileSearch,
  CheckCircle2,
  Shield,
} from "lucide-react";
import Footer from "@/components/Footer";
import { MockWindow } from "@/components/PlatformMockHelpers";

export const metadata: Metadata = {
  title: "Agents — Covant",
  description:
    "Four role-specific partner agents on your attributed record. Deal & Partner Strategist, Partner Growth, Program Design, Insights & Attribution — each answering one core question for one role.",
  openGraph: {
    title: "Agents — Covant",
    description:
      "Four partner agents, one per role. Each answers a different question: which partner wins this deal, how do we grow this partner, is the system working, what is happening and why.",
  },
};

const AGENTS = [
  {
    key: "psm",
    icon: Target,
    name: "PSM — Deal & Partner Strategist",
    role: "Opportunity-level. Answers: what partner helps us win this deal?",
    reads: "Reads: open opportunities, partner specialization, deal history, delivery capability.",
    recs: [
      "Coverage gap in APAC — 4 enterprise deals in-flight, no active partner.",
      "Warm co-sell path on Acme ($180K) — TechBridge has deal history with the account.",
      "Delivery readiness gap on Northwind close — Bluewave hasn't done the Data Residency add-on before.",
    ],
  },
  {
    key: "pam",
    icon: TrendingUp,
    name: "PAM — Partner Growth & Performance",
    role: "Partner-level. Answers: how do I make this partner more effective over time?",
    reads: "Reads: business-plan progress, capability milestones, activity trend, joint-pipeline contribution.",
    recs: [
      "Ridgeway off-plan at mid-quarter — pipeline contribution $0 vs. $180K trailing avg.",
      "Capability gap — Stackline closed 3 FinServ deals this quarter; no one on their team holds the FinServ specialization.",
      "Market opportunity — 3 PNW mid-market accounts match NexaCloud's past wins; draft a joint-target list.",
    ],
  },
  {
    key: "program",
    icon: Activity,
    name: "Program — Program Design & Optimization",
    role: "Ecosystem-level. Answers: is our system producing the partners we want?",
    reads: "Reads: tier distribution, progression velocity, incentive performance, enablement completion.",
    recs: [
      "27 partners stuck one rung from Gold — 14 of them missing the same specialization.",
      "Silver→Gold gap is 10x — recommend lowering Gold threshold OR adding a Platinum tier (dry-run for both attached).",
      "Gold priority-routing perk isn't moving specialization completion — worth replacing with a capability-tied incentive.",
    ],
  },
  {
    key: "ops",
    icon: Zap,
    name: "Ops — Insights & Attribution Engine",
    role: "Cross-cutting. Answers: what is actually happening, and why?",
    reads: "Reads: every partner-relevant data surface — deals, activity, partner state, program config.",
    recs: [
      "Q2 sourced pipeline down 14% — 11 points from a mid-tier activity drop, 3 points from the April 1 definition change.",
      "Advanced Implementation specialization lifts close rate 34% within 60 days of completion — worth an incentive-design input.",
      "12 CRM sync conflicts — partner field mismatch between Salesforce and the registration form; draft fix attached.",
    ],
  },
];

const MONDAY_TIMELINE = [
  {
    time: "9:02",
    icon: Target,
    title: "Coverage gap — APAC enterprise",
    body: "4 deals open, no registered partner. TechBridge and Apex both have matching certification + deal history.",
    cite: "Evidence: 4 Salesforce opps in Stage 2, TechBridge closed 3 APAC deals last 2 quarters.",
  },
  {
    time: "9:04",
    icon: TrendingUp,
    title: "Warm co-sell on Acme Corp — $180K",
    body: "TechBridge has 2 historical deals with Acme's parent. Suggest reaching out to Sarah (TechBridge lead).",
    cite: "Evidence: 2 closed-won deals with Acme-affiliated accounts in 2024, last touch 6 weeks ago.",
  },
  {
    time: "9:07",
    icon: FileSearch,
    title: "Dormant high-performer — Stackline",
    body: "Stackline closed 3 deals > $100K in H1 then went quiet. 3 matching open opps now in pipeline.",
    cite: "Evidence: zero registrations in 90 days, 3 opps match their specialization tags.",
  },
  {
    time: "9:10",
    icon: CheckCircle2,
    title: "Drafted outreach",
    body: "One email draft per action, pre-filled with context. Approve, edit, or skip — you stay in the loop.",
    cite: "Nothing sends until you say so.",
  },
];

const TRUST = [
  {
    title: "Per-signal sharing controls",
    desc: "Everything an agent surfaces is internal-only by default. A signal can only be shown to partners after an explicit compliance review.",
  },
  {
    title: "Inference, not tagging",
    desc: "Partner specialization comes from deal history and certifications — never a field the partner self-selects and you can't defend.",
  },
  {
    title: "Full audit trail",
    desc: "Every partner-visible surface writes to the log, with the user and signal kind that authorized it.",
  },
];

const COMING_SOON = [
  { name: "Forecast Agent", desc: "Partner-sourced pipeline forecast by quarter, with confidence intervals." },
  { name: "Relationship Agent", desc: "Surfaces warm paths between your team and partner contacts across deals." },
  { name: "Enablement Agent", desc: "Spots which partner reps need certification refreshers before the next quarter." },
];

export default function AgentsPage() {
  return (
    <div style={{ background: "#fff", color: "#0a0a0a" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="l-center l-section-border-b" style={{ padding: "8rem 0 3rem" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p className="l-section-tag" style={{ marginBottom: "1.5rem" }}>Agents</p>
          <h1 className="l-heading-xl" style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)", marginBottom: "1.75rem" }}>
            Leverage<br />for your partner team.
          </h1>
          <p className="l-subtitle" style={{ color: "#4b5563", maxWidth: 620, margin: "0 auto" }}>
            Covant&apos;s agents read your attributed record and surface the handful of
            moves worth making this week — the partner who wins the live deal, the
            partner drifting off-plan, the bottleneck in progression, the real story
            behind the number. Four agents to start, one per role; more ship as we learn.
          </p>
        </div>

        {/* Anchor feed mockup */}
        <div className="wrap" style={{ marginTop: "3.5rem", textAlign: "left", maxWidth: 920 }}>
          <MockWindow title="covant.ai/dashboard/agents">
            <div className="l-section-label" style={{ marginBottom: 12 }}>Today&apos;s feed</div>
            {[
              { agent: "PSM", icon: Target, title: "Coverage gap in APAC", detail: "No active partner for 4 enterprise deals in-flight. TechBridge & Apex both qualify." },
              { agent: "PAM", icon: TrendingUp, title: "Ridgeway off-plan at mid-quarter", detail: "Pipeline contribution $0 this month vs. $180K trailing avg. Two certifications paused 4 weeks ago." },
              { agent: "Program", icon: Activity, title: "27 partners stuck one rung from Gold", detail: "14 of them missing the same specialization. Group enablement campaign would move half." },
              { agent: "Ops", icon: Zap, title: "Q2 sourced pipeline down 14%", detail: "11 points from mid-tier activity drop (6 partners). 3 points from the April 1 definition change." },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "flex-start" }}>
                <item.icon size={16} style={{ color: "#0a0a0a", marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ color: "#0a0a0a", fontSize: ".65rem", fontWeight: 700, letterSpacing: "0.08em", background: "#f3f4f6", padding: "3px 7px", borderRadius: 4 }}>{item.agent}</span>
                    <span style={{ color: "#0a0a0a", fontSize: ".88rem", fontWeight: 600 }}>{item.title}</span>
                  </div>
                  <div style={{ color: "#6b7280", fontSize: ".82rem", lineHeight: 1.55 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </MockWindow>
        </div>
      </section>

      {/* ── WHAT EACH AGENT DOES ─────────────────────────────── */}
      <section className="l-section-alt l-section-border-b">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div style={{ marginBottom: "3rem", maxWidth: 640 }}>
            <p className="l-section-tag">What each agent does</p>
            <h2 className="l-heading-lg">
              Every agent reads the same record.
            </h2>
            <p className="l-body" style={{ marginTop: "1rem" }}>
              Every recommendation cites the attribution evidence behind it — deal
              registrations, closed-won history, certifications, touchpoint timestamps.
              Nothing is black-box.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {AGENTS.map((a) => (
              <div key={a.key} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                  <a.icon size={18} style={{ color: "#0a0a0a" }} />
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>{a.name}</h3>
                </div>
                <p style={{ color: "#374151", fontSize: ".9rem", lineHeight: 1.55, marginBottom: "1rem" }}>{a.role}</p>
                <div style={{ color: "#9ca3af", fontSize: ".7rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".6rem" }}>
                  Example recommendations
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                  {a.recs.map((r, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#9ca3af", marginTop: 2, flexShrink: 0 }}>—</span>
                      <span style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.55 }}>{r}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ color: "#9ca3af", fontSize: ".78rem", margin: 0, fontStyle: "italic" }}>{a.reads}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MONDAY MORNING WALKTHROUGH ───────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap" style={{ maxWidth: 920 }}>
          <div style={{ marginBottom: "3rem", maxWidth: 640 }}>
            <p className="l-section-tag">A Monday morning with the PSM Agent</p>
            <h2 className="l-heading-lg">
              Open the feed. Work the list.
            </h2>
            <p className="l-body" style={{ marginTop: "1rem" }}>
              This is what a PSM sees at 9am on a Monday. No dashboards to build, no
              CRM reports to run, no spreadsheets to reconcile — just the handful of
              moves worth making today, each with the evidence cited.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            {MONDAY_TIMELINE.map((m, i, arr) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 28px 1fr", gap: "1rem", padding: "1.5rem 1.75rem", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "flex-start" }}>
                <div style={{ color: "#9ca3af", fontSize: ".8rem", fontVariantNumeric: "tabular-nums", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} />
                  <span>{m.time}</span>
                </div>
                <m.icon size={18} style={{ color: "#0a0a0a", marginTop: 1 }} />
                <div>
                  <div style={{ color: "#0a0a0a", fontSize: "1rem", fontWeight: 600, marginBottom: ".35rem" }}>{m.title}</div>
                  <div style={{ color: "#6b7280", fontSize: ".88rem", lineHeight: 1.55, marginBottom: ".6rem" }}>{m.body}</div>
                  <div style={{ color: "#9ca3af", fontSize: ".78rem", fontStyle: "italic", lineHeight: 1.5 }}>{m.cite}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ─────────────────────────────────────────────── */}
      <section className="l-section-alt l-section-border-b">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <div style={{ marginBottom: "2.5rem", maxWidth: 640 }}>
            <p className="l-section-tag">Antitrust-safe by construction</p>
            <h2 className="l-heading-lg">
              Partner-visible only by permission.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {TRUST.map((t) => (
              <div key={t.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".6rem" }}>
                  <Shield size={16} style={{ color: "#0a0a0a" }} />
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, margin: 0 }}>{t.title}</h3>
                </div>
                <p style={{ color: "#6b7280", fontSize: ".85rem", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING SOON ───────────────────────────────────────── */}
      <section className="l-section l-section-border-b">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <div style={{ marginBottom: "2rem", maxWidth: 640 }}>
            <p className="l-section-tag">More agents ship as we learn</p>
            <h2 className="l-heading-lg" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              The roster isn&apos;t fixed.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {COMING_SOON.map((c) => (
              <div key={c.name} style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: "1.25rem", background: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ".4rem" }}>
                  <span style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", color: "#9ca3af", background: "#fff", border: "1px solid #e5e7eb", padding: "2px 7px", borderRadius: 4 }}>
                    COMING SOON
                  </span>
                </div>
                <div style={{ fontSize: ".95rem", fontWeight: 600, color: "#0a0a0a", marginBottom: ".25rem" }}>{c.name}</div>
                <p style={{ color: "#6b7280", fontSize: ".82rem", lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="l-section-dark l-center">
        <div className="wrap" style={{ maxWidth: 640 }}>
          <h2 className="l-heading-lg" style={{ color: "#fff", marginBottom: "1.25rem" }}>
            Agents run on your<br />attributed record.
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "1.05rem", marginBottom: "2rem", lineHeight: 1.65 }}>
            Connect the CRM, get the record, turn the agents on. That&apos;s the whole flow.
          </p>
          <div className="l-flex-center">
            <Link href="/sign-up" style={{ background: "#fff", color: "#0a0a0a", padding: ".85rem 2rem", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: ".95rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Get started free <ArrowRight size={16} />
            </Link>
            <Link href="/platform" style={{ border: "1px solid #333", color: "#fff", padding: ".85rem 2rem", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: ".95rem" }}>
              See the platform →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
