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
    "Partner agents that read your attributed record and surface the moves worth making this week. PSM, PAM, Program, and Ops to start — coverage gaps, tier-up nudges, stale registrations, CRM hygiene.",
  openGraph: {
    title: "Agents — Covant",
    description:
      "Partner agents on your CRM data. Coverage gaps, tier-up nudges, hygiene — surfaced with the attribution evidence cited.",
  },
};

const AGENTS = [
  {
    key: "psm",
    icon: Target,
    name: "PSM Agent",
    role: "Partner Sales Manager — finds the partner moves that close pipeline.",
    reads: "Reads: open opportunities, partner specialization, deal history.",
    recs: [
      "Coverage gap in APAC — 4 enterprise deals in-flight, no active partner.",
      "Warm co-sell path on Acme ($180K) — TechBridge has deal history with the account.",
      "Dormant high-performer — Stackline last closed 90d ago; 3 matching opps now open.",
    ],
  },
  {
    key: "pam",
    icon: TrendingUp,
    name: "PAM Agent",
    role: "Partner Account Manager — runs the 1:1 motion at 100:1 scale.",
    reads: "Reads: tier progress, certifications, partner health, last-touch recency.",
    recs: [
      "4 partners within 1 deal of tier-up — nudge this week to close the lift.",
      "Certification drift — NexaCloud's solution architect cert expires in 30 days.",
      "Health drop — Ridgeway win rate down 14pts QoQ; book a check-in.",
    ],
  },
  {
    key: "program",
    icon: Activity,
    name: "Program Agent",
    role: "Program lead — watches program health and flags drift before it breaks.",
    reads: "Reads: NPI adoption, new-partner ramp, tier distribution, deal-reg throughput.",
    recs: [
      "NPI launch adoption below bar — Cloud Connect: 3 of 28 partners trained.",
      "Ramp time up to 87 days — 2x the Q3 baseline; worth a structured review.",
      "Tier drift — 4 Gold partners eligible for downgrade per the new thresholds.",
    ],
  },
  {
    key: "ops",
    icon: Zap,
    name: "Ops Agent",
    role: "Partner Ops — the cleanup nobody has time for.",
    reads: "Reads: CRM sync state, attribution conflicts, duplicate records, review queues.",
    recs: [
      "12 CRM sync conflicts — partner field mismatch between Salesforce and the registration form.",
      "Attribution conflict on $92K deal — two partners registered within the window.",
      "7 overdue tier reviews on partners with active pipeline.",
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
            moves worth making this week — coverage gaps, tier-up nudges, stale
            registrations, CRM hygiene. They amplify the work a partner team is already
            doing so more of it gets done. PSM, PAM, Program, and Ops to start;
            more ship as we learn.
          </p>
        </div>

        {/* Anchor feed mockup */}
        <div className="wrap" style={{ marginTop: "3.5rem", textAlign: "left", maxWidth: 920 }}>
          <MockWindow title="covant.ai/dashboard/agents">
            <div className="l-section-label" style={{ marginBottom: 12 }}>Today&apos;s feed</div>
            {[
              { agent: "PSM", icon: Target, title: "Coverage gap in APAC", detail: "No active partner for 4 enterprise deals in-flight. TechBridge & Apex both qualify." },
              { agent: "PAM", icon: TrendingUp, title: "4 partners within 1 deal of tier-up", detail: "TechBridge, Stackline, NexaCloud, Ridgeway. Platinum unlocks co-sell benefits." },
              { agent: "Program", icon: Activity, title: "NPI launch adoption below bar", detail: "Cloud Connect: 3 of 28 partners trained. Target is 70% by end of quarter." },
              { agent: "Ops", icon: Zap, title: "12 CRM sync conflicts", detail: "Partner field mismatch between Salesforce and the registration form. Auto-merge ready." },
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
              Four agents reading the same record.
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
