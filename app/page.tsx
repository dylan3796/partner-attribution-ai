import ChannelGraph from "@/components/marketing/ChannelGraph";
import HeroGraph from "@/components/marketing/home/HeroGraph";
import Reveal from "@/components/marketing/Reveal";

// Covant homepage — the Partner Intelligence Layer.
// Editorial and restrained: near-black ink on warm white, one pine-green accent,
// a monospace voice for data labels. The Channel Graph motif recurs lightly.
// Built on the .m-* marketing system; homepage-specific styles are scoped .cv-*.

const BELIEFS = [
  "Partners are signal, not overhead.",
  "The relationship was never the problem — the blindness was.",
  "Software should do the figuring-out, so “better together” takes weeks instead of a decade.",
];

const MOVES = [
  {
    n: "1",
    title: "Ends the attribution headache.",
    body: "Every dollar credited with the reason attached — sourced or influenced, one number both sides read the same way. No black box, no quarter-end fights. Trust in the number is what brings the next deal.",
  },
  {
    n: "2",
    title: "Makes partners faster.",
    body: "Two-minute deal registration that flows straight into your CRM. Every touch logs automatically. Incentives flag the moment they’re earned — you sign off, Covant never moves the money. Independent of tiers, every partner sees their standing in real time.",
  },
  {
    n: "3",
    title: "Recommends the right partner.",
    body: "When a deal stalls, Covant surfaces who can save it — the SI proven in that vertical, the co-sell partner already in the account. Need coverage for an open deal or a new territory? Ask, and it returns the right partner, ranked from your own channel data. The shift: from proving what partners did to putting the right partner on the right deal at the right moment.",
  },
];

const PERSONAS = [
  {
    role: "Heads of Partnerships",
    body: "Running several motions at once, who need one place where the whole channel adds up.",
  },
  {
    role: "Partner managers",
    body: "Buried in reconciliation, who want registration, touches, and incentives to track themselves.",
  },
  {
    role: "CROs",
    body: "Who want a partner-revenue number they can trust — and stand behind in the board deck.",
  },
];

const LOOP = ["Data", "Attribution", "Recommendations", "Programs", "More data"];

export default function Home() {
  return (
    <main className="cv-home">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="m-section m-section--flush cv-hero">
        <div className="m-container">
          <p className="cv-label cv-label--accent">The Partner Intelligence Layer</p>
          <h1 className="m-h1">Partners are signal, not overhead.</h1>
          <p className="cv-hero-lead">
            The most underused data in B2B software is sitting in your channel — billions of
            datapoints about what&apos;s working and where to grow. Covant turns it into action.
          </p>
          <div className="cv-hero-cta">
            <a className="m-btn" href="#channel-graph">
              See the Channel Graph
            </a>
            <a className="m-btn-ghost" href="#how-it-works">
              How it works
            </a>
          </div>

          <div className="cv-graph-frame">
            <HeroGraph />
            <p className="cv-graph-cap">
              The Channel Graph — partners, deals, accounts and people, connected
            </p>
          </div>
        </div>
      </section>

      {/* ── The conviction ───────────────────────────────── */}
      <section className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The conviction</p>
            <h2 className="m-h2" style={{ maxWidth: "16ch" }}>
              Three things we believe.
            </h2>
          </Reveal>
          <div className="cv-conviction-list">
            {BELIEFS.map((b, i) => (
              <Reveal key={b} className="cv-belief">
                <span className="cv-belief-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="cv-belief-text">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Channel Graph ────────────────────────────── */}
      <section id="channel-graph" className="m-section m-section--surface">
        <div className="m-container">
          <div className="cv-split">
            <Reveal>
              <p className="m-eyebrow">The Channel Graph</p>
              <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
                One graph, both sides can act on.
              </h2>
              <p className="m-lead">
                Most channel work happens in the partner&apos;s world and never crosses back into
                yours, so it stays invisible and unrewarded. The Channel Graph fixes that
                blindness — partner data organized into one place.
              </p>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                It isn&apos;t a PRM and it isn&apos;t an attribution tool. It&apos;s the layer that
                sits on the graph, proves the revenue partners drive, and tells you what to do next.
              </p>
              <div className="cv-notline">
                <span className="cv-not">not a PRM</span>
                <span className="cv-not">not an attribution tool</span>
                <span className="cv-not">the layer on top</span>
              </div>
            </Reveal>
            <Reveal className="cv-graph-card">
              <ChannelGraph activeSection={4} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Three moves that grow revenue ────────────────── */}
      <section id="how-it-works" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Three moves that grow revenue</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              From proving the past to shaping the next deal.
            </h2>
          </Reveal>
          <div className="cv-moves">
            {MOVES.map((m) => (
              <Reveal key={m.n} className="cv-move">
                <span className="cv-move-num">{m.n}</span>
                <div>
                  <h3 className="cv-move-title">{m.title}</h3>
                  <p className="cv-move-body">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Copilot ──────────────────────────────────────── */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <div className="cv-split">
            <Reveal className="cv-chat">
              <div className="cv-chat-head">
                <span className="cv-chat-dot" aria-hidden="true" />
                <span className="cv-chat-title">Ask the graph</span>
              </div>
              <div className="cv-chat-body">
                <p className="cv-q">Who are my top partners this quarter?</p>
                <p className="cv-a">
                  Three accounts for 62% of sourced revenue. Northwind leads, up two spots since Q1.
                </p>
                <p className="cv-q">Where should I invest next?</p>
                <p className="cv-a">
                  Healthcare — two influenced deals stalled with no SI coverage. One partner is
                  proven in that vertical.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <p className="m-eyebrow">Copilot</p>
              <h2 className="m-h2" style={{ maxWidth: "16ch" }}>
                Ask the graph anything.
              </h2>
              <p className="m-lead">
                A copilot sits on the Channel Graph and answers in plain language — from
                &ldquo;who are my top partners this quarter?&rdquo; to &ldquo;where should I invest
                next?&rdquo; Every answer is grounded in your own channel data, not a generic
                model&apos;s best guess.
              </p>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                And it works both ways: partners can query their own slice — the grain of data you
                govern to them — to see their pipeline, their standing, and their next best move,
                without ever seeing what isn&apos;t theirs.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Programs ─────────────────────────────────────── */}
      <section className="m-section">
        <div className="m-container">
          <div className="cv-split">
            <Reveal>
              <p className="m-eyebrow">Programs</p>
              <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
                Run the program, not just the report.
              </h2>
              <p className="m-lead">
                Build or house your partner tiering inside Covant, and let partners watch their
                progress toward the next tier in real time. Stand up incentives and carry them out
                end to end — you sign off, Covant never moves the money.
              </p>
              <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "46ch" }}>
                And because every tier, every incentive, and every deal rides on the Channel Graph,
                Covant compounds: the more your program runs, the more it learns about how to grow
                your partners and where the program itself should go next.
              </p>
            </Reveal>
            <Reveal className="cv-tiers">
              <div className="cv-chat-head" style={{ border: 0, paddingLeft: 0, background: "transparent" }}>
                <span className="cv-chat-title">Tier progress</span>
              </div>
              {[
                { name: "Platinum", pct: 100, val: "8 / 8" },
                { name: "Gold", pct: 72, val: "5 / 7" },
                { name: "Silver", pct: 40, val: "2 / 5" },
                { name: "Registered", pct: 18, val: "1 / 6" },
              ].map((t) => (
                <div key={t.name} className="cv-tier">
                  <span className="cv-tier-name">{t.name}</span>
                  <span className="cv-tier-track">
                    <span className="cv-tier-fill" style={{ width: `${t.pct}%` }} />
                  </span>
                  <span className="cv-tier-val">{t.val}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Why it compounds ─────────────────────────────── */}
      <section className="m-section m-section--surface">
        <div className="m-container" style={{ textAlign: "center" }}>
          <Reveal>
            <p className="m-eyebrow">Why it compounds</p>
            <h2 className="m-h2" style={{ maxWidth: "22ch", margin: "0 auto" }}>
              Everything ties back to the graph, so Covant keeps getting smarter.
            </h2>
            <p className="m-lead" style={{ margin: "1.25rem auto 0", textAlign: "center" }}>
              The longer you run it, the more it learns — about your partners and your program.
            </p>
          </Reveal>
          <Reveal className="cv-loop">
            {LOOP.map((node, i) => (
              <span key={node} style={{ display: "inline-flex", alignItems: "center", gap: ".6rem" }}>
                <span className="cv-loop-node">{node}</span>
                <span className="cv-loop-arrow" aria-hidden="true">
                  →
                </span>
                {i === LOOP.length - 1 ? (
                  <span className="cv-loop-node" style={{ opacity: 0.55 }}>
                    Data
                  </span>
                ) : null}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Easy to adopt ────────────────────────────────── */}
      <section className="m-section">
        <div className="m-container">
          <Reveal className="cv-adopt">
            <div>
              <p className="m-eyebrow">Easy to adopt</p>
              <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
                Rides alongside your CRM, which stays the system of record.
              </h2>
            </div>
            <p className="cv-adopt-note">Self-serve setup in about fifteen minutes.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────── */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Who it&apos;s for</p>
            <h2 className="m-h2" style={{ maxWidth: "16ch" }}>
              Built for the missing middle.
            </h2>
          </Reveal>
          <div className="cv-audience">
            {PERSONAS.map((p) => (
              <Reveal key={p.role} className="cv-persona">
                <h3 className="cv-persona-role">{p.role}</h3>
                <p className="cv-persona-body">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────── */}
      <section id="demo" className="m-section m-section--ink cv-close">
        <div className="m-container">
          <p className="m-eyebrow">Get started</p>
          <h2 className="m-h2">Put the right partner on the right deal.</h2>
          <div className="cv-close-cta">
            <a className="m-btn" href="/sign-in">
              Get started
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
