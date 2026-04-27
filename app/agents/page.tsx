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
  Handshake,
  Wrench,
  Layers,
} from "lucide-react";
import Footer from "@/components/Footer";
import { MockWindow } from "@/components/PlatformMockHelpers";

export const metadata: Metadata = {
  title: "Agents — Covant",
  description:
    "Agents on both sides of the channel. Vendor agents (PSM, PAM, Program, Ops) on your side. Partner agents (Co-Sell, Delivery, Practice) inside the partner portal. One ledger between them.",
  openGraph: {
    title: "Agents — Covant",
    description:
      "Two-sided channel agents on a shared ledger. Vendor + partner, coverage gaps + co-sell, hygiene + delivery — all evidence-cited.",
  },
};

type AgentSide = "vendor" | "partner";

const AGENTS: Array<{
  key: string;
  icon: typeof Target;
  name: string;
  role: string;
  reads: string;
  recs: string[];
  side: AgentSide;
}> = [
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
    side: "vendor",
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
    side: "vendor",
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
    side: "vendor",
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
    side: "vendor",
  },
  {
    key: "cosell",
    icon: Handshake,
    name: "Co-Sell Agent",
    role: "For resellers — finds vendor-pipeline overlap on the partner's open accounts and drafts the warm reach-back.",
    reads: "Reads: partner's own open accounts, vendor's partner-visible opps, certs, tier status.",
    recs: [
      "Northwind — vendor opp at Proposal, no registered partner. You have 2 active contacts.",
      "Lumen Series C — same SKU as a deal you closed 60 days ago.",
      "Registered deal stalled at Ridgeway — draft an update to the vendor PSM.",
    ],
    side: "partner",
  },
  {
    key: "delivery",
    icon: Wrench,
    name: "Delivery Agent",
    role: "For implementation firms — surfaces slip risk and cert gaps 14+ days early.",
    reads: "Reads: post-close engagements, cert roster, PSA burn rate, milestone targets.",
    recs: [
      "Acme cutover at slip risk — burn 1.4× plan, lead architect oversubscribed.",
      "Solution Architect cert expiring in 21 days for 2 of 4 engineers on Ridgeway.",
      "Lumen rollout on track — all milestones green.",
    ],
    side: "partner",
  },
  {
    key: "practice",
    icon: Layers,
    name: "Practice Agent",
    role: "For services partners — picks the next vendor SKU on dollar lift, not launch hype.",
    reads: "Reads: 12 months of partner closed-won, vendor commission rules, tier history, cert roster.",
    recs: [
      "Add Cloud Connect — projected +$42K/quarter at year 1, bridges to Platinum.",
      "Tier-drop alarm — 1 vendor in 90 days; here's the SKU mix to hold the tier.",
      "NPI fit-scan — overlaps 3 of your closed-won verticals; cert investment: 2 consultants.",
    ],
    side: "partner",
  },
];

const VENDOR_AGENTS = AGENTS.filter((a) => a.side === "vendor");
const PARTNER_AGENTS = AGENTS.filter((a) => a.side === "partner");

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

const PARTNER_TIMELINE = [
  {
    time: "9:03",
    icon: Handshake,
    title: "Northwind — vendor-pipeline overlap",
    body: "Vendor opp at Proposal stage, no registered partner. The reseller has 2 active contacts and a recent similar close.",
    cite: "Evidence: 2 contacts at Northwind, 1 closed-won at Lumen 60 days ago on the same SKU.",
  },
  {
    time: "9:08",
    icon: Wrench,
    title: "Acme cutover at slip risk (18d)",
    body: "Burn rate 1.4× plan; lead architect oversubscribed across 2 other engagements. Drafted heads-up to vendor PAM with mitigation.",
    cite: "Evidence: PSA burn-rate variance, cert roster availability, milestone target May 14.",
  },
  {
    time: "9:12",
    icon: Layers,
    title: "Add Cloud Connect to the practice",
    body: "Projected +$42K/quarter at year 1; 6 of 8 verticals already match. Cert investment: 4 consultants × 24h.",
    cite: "Evidence: 12-month closed-won mix, vendor commission rules, current cert coverage.",
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
            Agents on both<br />sides of the channel.
          </h1>
          <p className="l-subtitle" style={{ color: "#4b5563", maxWidth: 640, margin: "0 auto" }}>
            Two-sided by design: vendor agents on your side, partner agents on theirs,
            one ledger between them. Each agent reads its own slice of the same
            attributed record and surfaces the moves worth making this week — with the
            evidence cited. PSM, PAM, Program, Ops on the vendor side; Co-Sell, Delivery,
            Practice inside the partner portal.
          </p>
        </div>

        {/* Anchor feed mockup */}
        <div className="wrap" style={{ marginTop: "3.5rem", textAlign: "left", maxWidth: 920 }}>
          <MockWindow title="covant.ai/dashboard/agents">
            <div className="l-section-label" style={{ marginBottom: 12 }}>Today&apos;s feed — vendor side</div>
            {[
              { agent: "PSM", icon: Target, title: "Coverage gap in APAC", detail: "No active partner for 4 enterprise deals in-flight. TechBridge & Apex both qualify.", partner: false },
              { agent: "PAM", icon: TrendingUp, title: "4 partners within 1 deal of tier-up", detail: "TechBridge, Stackline, NexaCloud, Ridgeway. Platinum unlocks co-sell benefits.", partner: false },
              { agent: "Program", icon: Activity, title: "NPI launch adoption below bar", detail: "Cloud Connect: 3 of 28 partners trained. Target is 70% by end of quarter.", partner: false },
              { agent: "Ops", icon: Zap, title: "12 CRM sync conflicts", detail: "Partner field mismatch between Salesforce and the registration form. Auto-merge ready.", partner: false },
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
            <div className="l-section-label" style={{ marginTop: 18, marginBottom: 12 }}>Same morning — partner side (inside the portal)</div>
            {[
              { agent: "CO-SELL", icon: Handshake, title: "Northwind — vendor-pipeline overlap", detail: "Vendor opp at Proposal, no registered partner. Partner has 2 active contacts." },
              { agent: "DELIVERY", icon: Wrench, title: "Acme cutover at slip risk (18d)", detail: "Burn 1.4× plan. Drafted heads-up to vendor PAM with mitigation." },
              { agent: "PRACTICE", icon: Layers, title: "Add Cloud Connect to the practice", detail: "Projected +$42K/q in year 1; bridges Gold partner to Platinum." },
            ].map((item, i, arr) => (
              <div key={`p-${i}`} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "flex-start" }}>
                <item.icon size={16} style={{ color: "#6366f1", marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ color: "#6366f1", fontSize: ".62rem", fontWeight: 700, letterSpacing: "0.08em", background: "rgba(99,102,241,.1)", padding: "3px 7px", borderRadius: 4 }}>{item.agent}</span>
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
              Every agent reads its slice of the same record.
            </h2>
            <p className="l-body" style={{ marginTop: "1rem" }}>
              Every recommendation cites the attribution evidence behind it — deal
              registrations, closed-won history, certifications, touchpoint timestamps.
              Nothing is black-box. Vendor agents read the full ledger; partner agents
              read the partner-scoped, vendor-permissioned slice.
            </p>
          </div>

          {/* Vendor side */}
          <p className="l-section-tag" style={{ marginBottom: "1rem", color: "#6b7280" }}>Vendor-side agents</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {VENDOR_AGENTS.map((a) => (
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

          {/* Partner side */}
          <p className="l-section-tag" style={{ marginBottom: "1rem", color: "#6366f1" }}>Partner-side agents — inside the portal</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {PARTNER_AGENTS.map((a) => (
              <div key={a.key} style={{ background: "#fff", border: "1px dashed #c7d2fe", borderRadius: 12, padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                  <a.icon size={18} style={{ color: "#6366f1" }} />
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
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/for-partners" className="l-link-arrow">
              See the partner-side track →
            </Link>
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

          {/* Partner-side parallel timeline */}
          <div style={{ marginTop: "3rem", marginBottom: "1.25rem", maxWidth: 640 }}>
            <p className="l-section-tag" style={{ color: "#6366f1" }}>Same morning, on the partner side</p>
            <h3 className="l-heading-md" style={{ fontSize: "clamp(1.3rem, 2.8vw, 1.75rem)" }}>
              The portal opens to a list, too.
            </h3>
            <p className="l-body" style={{ marginTop: ".75rem" }}>
              The reseller, the implementation PM, the practice lead each get the same
              shape of feed — partner-scoped, vendor-permissioned, evidence-cited.
            </p>
          </div>
          <div style={{ background: "#fff", border: "1px dashed #c7d2fe", borderRadius: 14, overflow: "hidden" }}>
            {PARTNER_TIMELINE.map((m, i, arr) => (
              <div key={`pt-${i}`} style={{ display: "grid", gridTemplateColumns: "72px 28px 1fr", gap: "1rem", padding: "1.5rem 1.75rem", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", alignItems: "flex-start" }}>
                <div style={{ color: "#9ca3af", fontSize: ".8rem", fontVariantNumeric: "tabular-nums", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} />
                  <span>{m.time}</span>
                </div>
                <m.icon size={18} style={{ color: "#6366f1", marginTop: 1 }} />
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
          <div style={{ marginBottom: "2rem", maxWidth: 660 }}>
            <p className="l-section-tag">More agents ship as we learn</p>
            <h2 className="l-heading-lg" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              The roster isn&apos;t fixed.
            </h2>
            <p className="l-body" style={{ marginTop: ".75rem" }}>
              Partner-side agents (Co-Sell, Delivery, Practice) are spec-stage today and
              ship behind the partner portal as design partners come online. Vendor-side
              additions below are next on the queue.
            </p>
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
