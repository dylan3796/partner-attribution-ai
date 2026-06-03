import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";
import { PILLARS, CATEGORY } from "@/lib/marketing";

const PROBLEMS = [
  {
    title: "The whole market is leaving.",
    body: "Companies are walking away from Salesforce PRM and the legacy partner stack. What they need next isn't another filing cabinet.",
  },
  {
    title: "PRM recorded. It never guided.",
    body: "A system of record: one program, slow to stand up, stores the deal. It never tells a partner what to do, or your team who to call.",
  },
  {
    title: "PEM mapped. It never moved anyone.",
    body: "Ecosystem maps showed who knows whom. They never showed a single partner the path from where they are to their next win.",
  },
  {
    title: "The team is stuck in the spreadsheet.",
    body: "Partner managers spend the quarter reconciling numbers and arguing over credit instead of building the relationships that actually grow revenue.",
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
              PRM managed partners. PEM mapped them. Covant grows them.
            </h1>
            <p className="m-lead" style={{ maxWidth: "52ch" }}>
              Covant is Partner Experience Management. It guides every partner to their
              next win, tells your team which partners to back and what to do this week,
              and settles attribution underneath — intelligence doing the work, not another
              system of record. Your partners grow. You grow with them.
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

      {/* The shift */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The shift</p>
            <h2 className="m-h2" style={{ maxWidth: "22ch" }}>
              The tools managed the relationship. None of them served the partner.
            </h2>
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

      {/* What Covant does — three pillars */}
      <section id="how" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How it works</p>
            <h2 className="m-h2">What Covant does.</h2>
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
            And ask your partner data anything —{" "}
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              see the platform →
            </Link>
          </p>
        </div>
      </section>

      {/* The category moment — PRM → PEM → PXM */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">A new category</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              Nobody was building for the partner. So we did.
            </h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {CATEGORY.map((c) => (
              <Reveal
                className="m-card"
                key={c.term}
                style={
                  c.accent
                    ? { borderColor: "var(--m-accent)", boxShadow: "0 0 0 1px var(--m-accent)" }
                    : undefined
                }
              >
                <h3
                  className="m-h3"
                  style={{
                    marginBottom: ".15rem",
                    color: c.accent ? "var(--m-accent)" : undefined,
                  }}
                >
                  {c.term}
                </h3>
                <p className="m-small" style={{ marginBottom: ".6rem", fontWeight: 600 }}>
                  {c.gloss}
                </p>
                <p className="m-body">{c.line}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
