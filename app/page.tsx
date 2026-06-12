import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import PartnerMapVisual from "@/components/marketing/PartnerMapVisual";
import AttributionExplainVisual from "@/components/marketing/AttributionExplainVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import CTABand from "@/components/marketing/CTABand";
import { MOTIONS } from "@/lib/marketing";

// The page reads as a maturity ladder: see the channel (01), catch what's
// already happening in it (02), run whatever program exists today (03),
// grow into tiers and incentives when ready (04). Nothing early in the
// ladder requires program structure the customer hasn't built yet.

const ECOSYSTEM_CARDS = [
  {
    title: "Know who's good at what — reliably.",
    body: "Notes, emails, solutions, attributions — read into what each partner does well, where, and how consistently.",
  },
  {
    title: "Match on your weights.",
    body: "You set the weights — deal size, industry, prior relationship — and attribution history does the arguing. No black-box picks.",
  },
  {
    title: "Send the ask, book the call.",
    body: "The right partner gets the ask — \"help us on this deal?\" — with the discovery call and contacts attached.",
  },
  {
    title: "Insights where your reps live.",
    body: "Recommendations flow to reps inside your CRM — no new tab to ignore.",
  },
];

const PARTNER_ANSWERS = [
  {
    title: "Why they earned that number.",
    body: "Every percentage ships with its reason — the deal registered, the demo run, the work delivered.",
  },
  {
    title: "What's owed, down to the dollar.",
    body: "Earned, pending, paid — visible the moment it changes, not chased at quarter end.",
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
    title: "Week one — your channel, mapped.",
    body: "We build the map with you — profiles from notes and emails, 12 months of history through five attribution models.",
  },
  {
    title: "First month — your program, live.",
    body: "Portal live under your brand, partners registering deals, every split explained with evidence.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Experience Management</p>
            <h1 className="m-h1">
              Grow partner-sourced revenue you can prove.
            </h1>
            <p className="m-lead" style={{ maxWidth: "50ch" }}>
              Bring partners along for the whole journey — every step in the open,
              no communication lost. Partners who see their credit keep bringing
              deals.
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

      {/* 01 — The map */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">01. Map your channel</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Your data becomes a map of who can do what.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Your opportunities, accounts, and revenue join your partner data;
                Covant maps who can do what — expertise, deal size, progression,
                relationships. We build it with you. No program prerequisites.
              </p>
            </Reveal>
            <Reveal>
              <PartnerMapVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 02 — Catch what's already happening */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">02. Put the ecosystem to work</p>
            <h2 className="m-h2">Source more deals. Unblock the stuck ones.</h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              The map works both directions: provable credit keeps sourced deals
              coming in, and your team pulls the right partner into deals already
              open.
            </p>
          </Reveal>
          <div className="m-grid m-grid-2" style={{ marginTop: "3rem" }}>
            {ECOSYSTEM_CARDS.map((c) => (
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
                No two channels run alike. Registration, five attribution models,
                incentive rules — on when you want them, shaped to your program.
                Every split traces to a source — never an unverified claim.
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
              <p className="m-eyebrow">04. One portal, both sides</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Both sides of the house, working the same system.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                Your team and your partners see the same journey: a portal under
                your brand, surfacing what you choose — opportunity updates, tier
                progress, deal registration — and the journey paths you define.
                Partners watch themselves advance.
              </p>
              <p className="m-body" style={{ marginTop: "1rem", maxWidth: "46ch" }}>
                As the program grows, Covant grows with it — recommending partners
                for coverage and investment, on your parameters. Ask in plain
                language; the map answers, records attached.
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
