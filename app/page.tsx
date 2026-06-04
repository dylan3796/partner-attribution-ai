import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";
import { PILLARS, OUTCOMES } from "@/lib/marketing";

const PROBLEMS = [
  {
    title: "Billions of signals, no time to read them.",
    body: "Deals, touchpoints, certifications, program activity — across every motion, more than any partner team can hold in its head.",
  },
  {
    title: "Every partner needs a different focus.",
    body: "Some should be driving revenue, some running lead gen, some deep in enablement or co-marketing. Today you're guessing which is which.",
  },
  {
    title: "Your reps don't know who to call.",
    body: "The highest-leverage intro — the right rep, the right partner, the right reason — almost never happens, because no one can see it in time.",
  },
  {
    title: "“Better together” stays a slide.",
    body: "The ecosystem story you sell your board takes years of manual relationship-building to make real. Most teams never get there.",
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
              You can&apos;t read a billion partner signals. Covant can.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              Which partners should focus on revenue, which on lead gen, which on
              enablement — and which rep should call whom, about what? The answer is sitting
              in your partner data. Covant is AI-native Partner Experience Management: it
              reads that data, learns how each of your programs works, and turns it into the
              next move — so the &ldquo;better together&rdquo; story takes weeks, not a lifetime.
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
            <AttributionSplitVisual />
          </Reveal>
        </div>
      </section>

      {/* The problem */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">Why now</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              The answer&apos;s in your data. Reading it isn&apos;t humanly possible.
            </h2>
            <p className="m-small" style={{ marginTop: ".9rem", maxWidth: "52ch" }}>
              PRM stored your partners. PEM mapped them. Neither one ever lifted a single
              partner toward their next win.
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
            <h2 className="m-h2">Data in. Your programs, learned. The next move out.</h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
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
            And every partner gets their own home base — revenue, payments, and their next
            move — in a portal you brand and control.{" "}
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              See the platform →
            </Link>
          </p>
        </div>
      </section>

      {/* The lift — outcomes */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The lift</p>
            <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
              &ldquo;Better together&rdquo; — in weeks, not a lifetime.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              The work that used to take years of relationship-building, spreadsheet
              archaeology, and guesswork — Covant compresses it. Everyone ends up pointed at
              the same wins.
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

      <CTABand />
    </main>
  );
}
