import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ChannelGraphVisual from "@/components/marketing/ChannelGraphVisual";
import ChannelSignalVisual from "@/components/marketing/ChannelSignalVisual";
import JourneyVisual from "@/components/marketing/JourneyVisual";
import NextMoveVisual from "@/components/marketing/NextMoveVisual";
import AskGraphVisual from "@/components/marketing/AskGraphVisual";
import CTABand from "@/components/marketing/CTABand";

// Narrative spine: the category is Partner Intelligence. The asset is the
// Channel Graph — a semantic layer Covant builds over the vendor's partner
// data (Covant infers the context; the vendor tweaks it). Voice is terse and
// declarative — short headers, one or two sentences of body, no enumerations.
// Hero states category + promise → market stakes (third-party 2026 research) →
// the graph itself (01) → what runs on it (02 attribution, framed against
// dashboards; 03 planning & recommendations incl. Partner Finder) → the
// surfaces (04 journeys, 05 portal, 06 ask) → how it starts (07).

const STAKES = [
  {
    stat: "42%",
    body: "of B2B SaaS can measure partner influence across the funnel. The rest are guessing.",
  },
  {
    stat: "35%",
    body: "of mid-market and enterprise pipeline is partner-influenced — most of it unattributed.",
  },
  {
    stat: "69%",
    body: "are increasing partner investment — into a measurement vacuum.",
  },
];

const RECOMMENDATION_CARDS = [
  {
    title: "Put the right partner on the deal.",
    body: "Open or stalled, the graph names who can move it — evidence attached, in your CRM.",
  },
  {
    title: "Recruit the partner you're missing.",
    body: "Partner Finder spots the gaps and surfaces who to add — by vertical and geography.",
  },
  {
    title: "Plan on evidence, not instinct.",
    body: "Tiers, territories, quota, investment — the gut calls, grounded in the graph.",
  },
];

const PORTAL_CARDS = [
  {
    title: "Deal visibility.",
    body: "Partners see the deals they're on and where each one stands. No chasing the channel manager.",
  },
  {
    title: "One-click enlist.",
    body: "Pull a partner into a deal from the opportunity itself. Covant sets up the call or drafts the email.",
  },
  {
    title: "Two-way by design.",
    body: "Leads, stories, references, posts — partners submit, you act. A channel, not a bulletin board.",
  },
];

const START_STEPS = [
  {
    title: "Connect what you have.",
    body: "CRM, spreadsheets, emails, Slack, notes. Structured or not — every parameter is signal.",
  },
  {
    title: "First pass, then yours.",
    body: "Covant builds the first Channel Graph and writes the context behind it. You refine from there — it's your asset, and it compounds.",
  },
  {
    title: "Build what's missing. Activate what exists.",
    body: "Journeys and the portal go live where you had nothing. What you already run gets ingested and put to work.",
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the category (Partner Intelligence) and the promise */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container m-hero-grid">
          <div>
            <p className="m-eyebrow">Partner Intelligence</p>
            <h1 className="m-h1">Run your partner org on one graph.</h1>
            <p className="m-lead" style={{ maxWidth: "46ch" }}>
              Covant turns your partner data into the Channel Graph — a semantic
              layer your whole org runs on.
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
            <ChannelGraphVisual />
          </Reveal>
        </div>
      </section>

      {/* Ingestion strip */}
      <section className="m-section m-section--flush" style={{ padding: 0 }}>
        <div className="m-container">
          <div className="m-trust">
            <p className="m-trust-label">Builds from the stack you already have</p>
            <ul className="m-trust-items">
              <li>Salesforce</li>
              <li>HubSpot</li>
              <li>Emails &amp; Slack threads</li>
              <li>Notes, tasks &amp; spreadsheets</li>
              <li>Event API &amp; CSV</li>
            </ul>
            <p className="m-trust-note">
              Audit-logged end to end. GDPR &amp; CCPA ready. Your data never trains AI models.{" "}
              <Link href="/security">Security →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* The stakes — the problem, in the market's own numbers */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The state of partnerships, 2026</p>
            <h2 className="m-h2" style={{ maxWidth: "28ch" }}>
              Most companies can&apos;t measure the partner pipeline they&apos;re betting on.
            </h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {STAKES.map((s) => (
              <Reveal className="m-card" key={s.stat}>
                <h3 className="m-h1" style={{ marginBottom: ".5rem" }}>
                  {s.stat}
                </h3>
                <p className="m-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Source: PartnerStack &amp; Wynter, The State of Partnerships in GTM
            2026 (100 senior B2B SaaS leaders).
          </p>
        </div>
      </section>

      {/* 01 — The Channel Graph: the semantic layer */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The graph · 01</p>
            <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
              One graph. Your whole channel.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "52ch" }}>
              Covant reads everything you have — CRM, emails, Slack, notes — and
              writes down what it all means. You tweak it; the graph sharpens.
              Every report, plan, and recommendation runs on what&apos;s
              underneath.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — Attribution, framed against dashboards */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The graph · 02</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                Attribution, not a dashboard.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
                Who sourced, who unblocked, who drove the expansion — across
                every channel and the whole lifecycle. Not a chart you read. An
                answer you ask for, records attached.
              </p>
            </Reveal>
            <Reveal>
              <ChannelSignalVisual />
            </Reveal>
          </div>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            Credit stays your call — your models, your weights. The graph makes
            contribution visible; you decide how it&apos;s split.
          </p>
        </div>
      </section>

      {/* 03 — Planning & recommendations: from live deals to the annual plan */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The graph · 03</p>
              <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
                From the next deal to next year&apos;s plan.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
                The graph names the right partner for a live deal — and the
                tiers, territories, and quotas for the year ahead. Partner
                Finder surfaces who to recruit next.
              </p>
            </Reveal>
            <Reveal>
              <NextMoveVisual />
            </Reveal>
          </div>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {RECOMMENDATION_CARDS.map((c) => (
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

      {/* 04 — Partner journeys */}
      {/* Future scope: the journey-flow engine and validation datasets shown
          here are not yet modeled in convex/ — see JourneyVisual. */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The surfaces · 04</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                You set the milestones. Covant runs them.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
                A certification, a dollar of revenue, a launch — you choose what
                counts. Covant validates each against the data and advances the
                journey. You and the partner watch the same progress, live.
              </p>
            </Reveal>
            <Reveal>
              <JourneyVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — The portal */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The surfaces · 05</p>
            <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
              A portal partners actually open.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "52ch" }}>
              Each partner sees their slice of the graph — their deals, their
              status, their next step. When the graph picks them for a deal, the
              ask lands here: call scheduled or outreach drafted.
            </p>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {PORTAL_CARDS.map((c) => (
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

      {/* 06 — Ask the graph (conversational access over MCP) */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="m-grid m-grid-2" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="m-eyebrow">The surfaces · 06</p>
              <h2 className="m-h2" style={{ maxWidth: "16ch" }}>
                Ask. Don&apos;t dig.
              </h2>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
                The graph ships as MCP servers for Claude and OpenAI. Your team,
                rev ops, and partners all ask in plain language — and the answer
                comes back with the records attached.
              </p>
            </Reveal>
            <Reveal>
              <AskGraphVisual />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 — How it starts */}
      <section id="start" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">07 — How it starts</p>
            <h2 className="m-h2">
              A complete map of your program — what you have, and what you don&apos;t.
            </h2>
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
