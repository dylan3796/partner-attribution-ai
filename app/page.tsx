import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionExplainVisual from "@/components/marketing/AttributionExplainVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import CTABand from "@/components/marketing/CTABand";
import { PILLARS, MOTIONS, OUTCOMES } from "@/lib/marketing";

// The moments most programs can't prove — each one maps to product surface
// that makes it provable (touchpoint attribution, audit log, health signals,
// commission rules).
const PROBLEMS = [
  {
    title: "The influence you can't see.",
    body: "Your SI specs the architecture and delivers the rollout — and never touches the paper. Their fingerprints are on the deal; your system says they weren't there.",
  },
  {
    title: "The quarter-end credit fight.",
    body: "Sales, marketing, and three partners claim the same deal. It gets settled by spreadsheet diplomacy, and someone leaves the table trusting you less.",
  },
  {
    title: "The partner going quiet.",
    body: "Disengagement doesn't announce itself — registrations slow, touches thin out. By the QBR it's a post-mortem.",
  },
  {
    title: "The incentive nobody can verify.",
    body: "A partner believes they've earned the bonus. Finance wants evidence. Without a paper trail, every payout is a negotiation.",
  },
];

const PARTNER_ANSWERS = [
  {
    title: "Why they earned that number.",
    body: "Every percentage arrives with its reason attached — the deal they registered, the demo they ran, the work they delivered. No black box, nothing to take on faith.",
  },
  {
    title: "What's owed, and where it stands.",
    body: "Earned, pending, projected — visible the moment it changes, not chased down over email at the end of the quarter.",
  },
  {
    title: "Where they stand, and what's next.",
    body: "Tier, score, and the bar for the next level made explicit — with the next best action to get there.",
  },
];

const START_STEPS = [
  {
    title: "Day one — connect what you have.",
    body: "CRM connectors, CSV import, or the event API. Nothing to rip out, no six-month rollout standing between you and the first number.",
  },
  {
    title: "Week one — attribution on your history.",
    body: "Covant runs your last 12 months of pipeline through five attribution models, side by side — so you choose the model per motion with evidence, not instinct.",
  },
  {
    title: "First month — the machine is running.",
    body: "Portal live under your brand, registrations flowing, incentives flagging with evidence attached. Your partners see where they stand; your CFO sees why.",
  },
];

export default function Home() {
  return (
    <main className="site">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Experience Management</p>
            <h1 className="m-h1">
              Partner revenue you can prove. Partners who know their next move.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              The signal that runs a great channel is scattered — across your CRM, inboxes,
              spreadsheets, and marketplace portals — and most of it is never read. Covant
              pulls it together, generates the signal you&apos;re missing, and turns it into a
              machine: attribution with a paper trail under every dollar, incentives flagged
              the moment they&apos;re earned, and a portal that shows every partner where to
              push next.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
              <a className="m-btn-ghost" href="#how">
                See how it works
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
            <p className="m-trust-label">Built on the systems you already run</p>
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

      {/* The gap */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The gap</p>
            <h2 className="m-h2" style={{ maxWidth: "26ch" }}>
              Seven partners touch the average deal. Most programs can prove one.
            </h2>
            <p className="m-small" style={{ marginTop: ".9rem", maxWidth: "54ch" }}>
              Deal registration and sourced pipeline are the only moments most programs
              measure. Everything else — the SI who ran the eval, the integration that saved
              the renewal, the cloud rep who opened the door — happens off the books.
              Unmeasured means unrewarded, and partners learn the lesson fast.
            </p>
          </Reveal>
          <Reveal className="m-list" style={{ marginTop: "2.5rem" }}>
            {PROBLEMS.map((p, i) => (
              <div className="m-list-item" key={p.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="m-h3" style={{ marginBottom: ".35rem" }}>
                    {p.title}
                  </h3>
                  <p className="m-body">{p.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* How it works — the pipeline */}
      <section id="how" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How it works</p>
            <h2 className="m-h2">From scattered signal to a running machine.</h2>
          </Reveal>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {PILLARS.map((p, i) => (
              <Reveal className="m-card" key={p.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-h3" style={{ margin: ".6rem 0 .5rem" }}>
                  {p.title}
                </h3>
                <p className="m-body">{p.body}</p>
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

      {/* Program motions */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Built for how channels really run</p>
            <h2 className="m-h2">Whatever your motion, Covant speaks it.</h2>
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
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Run them all at once, from one console — rolled up to one partner-revenue number.
          </p>
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
                Partners who trust the math bring you more: every registration and logged
                touch is new signal, and the machine gets sharper with each one.
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

      {/* The shift — outcomes */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">What changes</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              The work shifts from upkeep to growth.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              The hours that used to disappear into reconciliation, credit disputes, and CRM
              hygiene come back as time spent growing partners. Partner, rep, and CRO finally
              read from the same page — and act before the moment passes.
            </p>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {OUTCOMES.map((o) => (
              <Reveal className="m-card" key={o.title}>
                <h3 className="m-h3" style={{ marginBottom: ".5rem" }}>
                  {o.title}
                </h3>
                <p className="m-body">{o.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Getting started */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Getting started</p>
            <h2 className="m-h2">Weeks, not quarters.</h2>
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
            We&apos;re building with our first customers — you&apos;ll work directly with the
            team.
          </p>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
