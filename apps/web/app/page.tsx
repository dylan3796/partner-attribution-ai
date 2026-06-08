import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";
import { PILLARS, OUTCOMES } from "@/lib/marketing";

const PROBLEMS = [
  {
    title: "Spot the partners gaining momentum.",
    body: "Some of your strongest partners are the quiet ones — heads-down and closing, not filling your inbox. Covant surfaces who's accelerating, so the relationship gets attention while it counts.",
  },
  {
    title: "See revenue before it's reported.",
    body: "Engagement, enablement, and deal velocity all move before revenue does. Covant reads those leading signals, so you can shape a quarter while it's still in motion.",
  },
  {
    title: "Notice a partner going quiet — early.",
    body: "Disengagement rarely announces itself; a partner just slows down. Covant flags the shift while a conversation can still turn it around.",
  },
  {
    title: "Meet every partner where they are.",
    body: "A platinum reseller and a week-one referral need different things. Covant tailors what each partner sees and does next, so the experience fits the partner — not the average.",
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
              Your partners are telling you everything. None of your tools are listening.
            </h1>
            <p className="m-lead" style={{ maxWidth: "54ch" }}>
              Every deal, every touch, every silence is a signal about where your channel is
              headed — and almost all of it goes unread. Covant is AI-native Partner Experience
              Management: it reads the full signal, learns how each program actually works, and
              turns it into the next move — for every partner and the team running them. Not
              another dashboard to check. Judgment, at the speed your channel moves.
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
            <p className="m-eyebrow">What you could be doing</p>
            <h2 className="m-h2" style={{ maxWidth: "24ch" }}>
              There&apos;s a layer of your channel you haven&apos;t been able to see.
            </h2>
            <p className="m-small" style={{ marginTop: ".9rem", maxWidth: "54ch" }}>
              Not for lack of looking — the signals that predict partner growth have lived in
              systems built to record the past, not act on it. Covant turns that layer on.
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
            <h2 className="m-h2">Signal in. Judgment out.</h2>
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
            And every partner gets their own home base — revenue, payments, and the next move —
            in a portal you brand and control.{" "}
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              See the platform →
            </Link>
          </p>
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

      <CTABand />
    </main>
  );
}
