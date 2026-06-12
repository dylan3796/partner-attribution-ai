import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import AttributionExplainVisual from "@/components/marketing/AttributionExplainVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import CTABand from "@/components/marketing/CTABand";
import { MOTIONS } from "@/lib/marketing";

// The page reads as a maturity ladder: see the channel (01), catch what's
// already happening in it (02), run whatever program exists today (03),
// grow into tiers and incentives when ready (04). Nothing early in the
// ladder requires program structure the customer hasn't built yet.

const CONTEXT_CARDS = [
  {
    title: "Partners, with a record.",
    body: "Every partner's history in one place — solutions, verticals, logged work, closed wins. A track record, not a contact list.",
  },
  {
    title: "Customers and deals, connected.",
    body: "Which partners touch which accounts and deals — sourced, influenced, or quietly working in the background.",
  },
  {
    title: "Signal from everywhere.",
    body: "Registrations, meetings, logged touches, portal activity, the spreadsheet that never made it into a system — gathered into one record.",
  },
];

const SIGNAL_CARDS = [
  {
    title: "Know who's good at what.",
    body: "Verticals, solutions, closed wins — each partner's proven strengths on the record, readable by the AE working the deal.",
  },
  {
    title: "Unblock the stalled deal.",
    body: "A deal needs healthcare integration expertise; the partner who's delivered it four times gets flagged to bring in.",
  },
  {
    title: "Document who's already there.",
    body: "A partner's logged work on the account becomes intel on the record — credited and visible, not tribal knowledge.",
  },
];

const PARTNER_ANSWERS = [
  {
    title: "Why they earned that number.",
    body: "Every percentage arrives with its reason attached — the deal they registered, the demo they ran, the work they delivered.",
  },
  {
    title: "What's owed, down to the dollar.",
    body: "Earned, pending, paid — every commission calculated and tracked in Covant, visible the moment it changes, not chased at quarter end.",
  },
  {
    title: "Where they stand, and what's next.",
    body: "Tier, score, and the bar for the next level made explicit — with the next best action to get there.",
  },
];

const START_STEPS = [
  {
    title: "First 15 minutes — connected.",
    body: "CRM connectors, CSV import, or the event API. Nothing to rip out.",
  },
  {
    title: "Week one — your channel, visible.",
    body: "Every partner, customer, and deal in one picture — with the first signals flagged: partners already on open deals, your last 12 months through five attribution models.",
  },
  {
    title: "First month — your program, live.",
    body: "Portal live under your brand, partners registering deals, every split and commission explained with the evidence attached.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">The Partner Hub</p>
            <h1 className="m-h1">
              Partners bring deals when they trust the credit.
            </h1>
            <p className="m-lead" style={{ maxWidth: "50ch" }}>
              Covant proves every partner&apos;s contribution from records anyone can
              open — so registering deals with you is worth their while. Then it puts
              the ecosystem to work: partner expertise matched to your open deals,
              stalled ones unblocked. Seeing what&apos;s hidden is the floor;
              partner-sourced pipeline is the point.
            </p>
            <div className="m-hero-cta">
              <a className="m-btn" href="#demo">
                Request a demo
              </a>
              <a className="m-btn-ghost" href="#start">
                See how it starts
              </a>
            </div>
          </div>
          <Reveal>
            <ChannelSignalVisual />
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

      {/* 01 — See your channel */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">01. See your channel</p>
            <h2 className="m-h2">See every partner, customer, and deal in one picture.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              Day one is context, not configuration. Connect your data and see the
              channel as it actually is — who works with whom, what each partner has
              actually delivered, where the revenue comes from. No tiers required, no
              program prerequisites.
            </p>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {CONTEXT_CARDS.map((c) => (
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

      {/* 02 — Catch what's already happening */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">02. Put the ecosystem to work</p>
            <h2 className="m-h2">Unblock deals with the partner who&apos;s done it before.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              Your AEs don&apos;t know which partner is good at what — Covant does,
              from the record. It matches proven expertise to open deals, every
              suggestion citing the records behind it, and when a partner is already
              on the account, it captures that intel where it belongs.
            </p>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {SIGNAL_CARDS.map((c) => (
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

      {/* 03 — Run your program */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">03. Run your program</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Whatever shape your program is, the engine fits.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                No two channels run alike, and some are just getting started.
                Registration flows, five attribution models, incentive rules — each
                piece turns on when you want it, configured to the program
                you&apos;ve promised your partners. Every split traces to a source —
                never an unverified claim.
              </p>
            </Reveal>
            <Reveal>
              <AttributionExplainVisual />
            </Reveal>
          </div>
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
            Underneath: five attribution models, a rules engine for incentives, and an audit
            log on every change.{" "}
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              See the platform →
            </Link>
          </p>
        </div>
      </section>

      {/* 04 — Grow when you're ready */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">04. Grow when you&apos;re ready</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Partners don&apos;t want another portal. They want answers.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                A portal under your brand, shaped to the experience you want partners
                to have. And when you&apos;re ready for tiers and incentives,
                they&apos;re built in — partners see the bar, the progress, and the
                payoff, and every incentive flags with its evidence, awaiting your
                approval. Partners who see their credit keep bringing deals.
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

      {/* 05 — Getting started */}
      <section id="start" className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">05. Getting started</p>
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
