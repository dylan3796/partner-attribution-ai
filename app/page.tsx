import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionExplainVisual from "@/components/marketing/AttributionExplainVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import CTABand from "@/components/marketing/CTABand";
import { PILLARS, WORKFLOWS, MOTIONS } from "@/lib/marketing";

const PARTNER_ANSWERS = [
  {
    title: "Why they earned that number.",
    body: "Every percentage arrives with its reason attached — the deal they registered, the demo they ran, the work they delivered.",
  },
  {
    title: "What's owed, and when it pays.",
    body: "Earned, pending, paid — payouts run out of Covant, visible the moment they change, not chased at quarter end.",
  },
  {
    title: "Where they stand, and what's next.",
    body: "Tier, score, and the bar for the next level made explicit — with the next best action to get there.",
  },
];

const START_STEPS = [
  {
    title: "First 15 minutes — self-serve, connected.",
    body: "CRM connectors, CSV import, or the event API. Nothing to rip out.",
  },
  {
    title: "Week one — credit on your history.",
    body: "Your last 12 months of pipeline through five attribution models, side by side — every split with the why attached.",
  },
  {
    title: "First month — the channel runs in Covant.",
    body: "Portal live under your brand, deals registering and progressing, commissions paying out with the reason attached.",
  },
];

export default function Home() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Pipeline &amp; Progression</p>
            <h1 className="m-h1">
              Partner-driven revenue, without hiring a channel sales team.
            </h1>
            <p className="m-lead" style={{ maxWidth: "50ch" }}>
              Covant is the revenue engine for your channel: deals get registered in
              Covant, progress in Covant, get credited in Covant, and pay out of Covant —
              your partner motion in one place, not scattered across PRM and CRM reports.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
              <a className="m-btn-ghost" href="#workflows">
                See the workflows
              </a>
            </div>
          </div>
          <Reveal>
            <AttributionExplainVisual />
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="m-section m-section--flush" style={{ padding: 0 }}>
        <div className="m-container">
          <div className="m-trust">
            <p className="m-trust-label">Plumbing included — closed-deal data flows in from</p>
            <ul className="m-trust-items">
              <li>Salesforce</li>
              <li>HubSpot</li>
              <li>CSV import</li>
              <li>Event API &amp; webhooks</li>
            </ul>
            <p className="m-trust-note">
              Audit-logged end to end. GDPR &amp; CCPA ready. Your data never trains AI models.{" "}
              <Link href="/security">Security →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* What you run on Covant */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">What you run on Covant</p>
            <h2 className="m-h2">Register it. Progress it. Pay it.</h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {PILLARS.map((p) => (
              <Reveal className="m-card" key={p.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {p.title}
                </h3>
                <p className="m-body">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section id="workflows" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Workflows</p>
            <h2 className="m-h2">Three loops your team will run in week one.</h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {WORKFLOWS.map((w) => (
              <Reveal className="m-card" key={w.title}>
                <p className="m-flow-label">{w.label}</p>
                <h3 className="m-h3">{w.title}</h3>
                <ol className="m-flow-steps">
                  {w.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Underneath: five attribution models, a rules engine for incentives, and an audit
            log on every change.{" "}
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              See the platform →
            </Link>
          </p>
        </div>
      </section>

      {/* Every shape of ecosystem */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Every shape of ecosystem</p>
            <h2 className="m-h2">Your data. Your priorities. Your program.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              No two channels run alike. Covant takes the program you&apos;ve already
              promised your partners — your tiers, your rules, your registration flow —
              and runs it end to end: pipeline in, progression tracked, credit explained,
              payouts out. Five partners or five hundred, one motion or four.
            </p>
          </Reveal>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {MOTIONS.map((m) => (
              <Reveal className="m-card" key={m.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {m.title}
                </h3>
                <p className="m-body">{m.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What partners get */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">What partners get</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Partners don&apos;t want another portal. They want answers.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Partners who trust the credit bring you more pipeline: every commission
                ships with a why, so disputes disappear and registrations keep coming.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {PARTNER_ANSWERS.map((c) => (
              <Reveal className="m-card" key={c.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {c.title}
                </h3>
                <p className="m-body">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Getting started</p>
            <h2 className="m-h2">Minutes to start. Weeks to full speed.</h2>
          </Reveal>
          <Reveal className="m-list" style={{ marginTop: "2.5rem" }}>
            {START_STEPS.map((s, i) => (
              <div className="m-list-item" key={s.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="m-h3" style={{ marginBottom: ".35rem" }}>
                    {s.title}
                  </h3>
                  <p className="m-body">{s.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Transparent pricing, about a tenth the cost of legacy PRM — and you&apos;ll work
            directly with the team.
          </p>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
