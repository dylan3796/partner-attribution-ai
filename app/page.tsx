import Link from "next/link";
import Reveal from "@/components/marketing/Reveal";
import ModelList from "@/components/marketing/ModelList";
import AttributionSplitVisual from "@/components/marketing/AttributionSplitVisual";
import CTABand from "@/components/marketing/CTABand";

const PROBLEMS = [
  {
    title: "One program, one config.",
    body: "Add resellers, ISVs, referrals, and co-sell and a legacy PRM makes you run three tools — or force everything through one.",
  },
  {
    title: "Six-month rollouts.",
    body: "The market moved twice before you went live. Covant reads your CRM and is useful in days.",
  },
  {
    title: "It stores deals. It never decides.",
    body: "A filing cabinet tells you what happened. It never tells you which partner to call today.",
  },
  {
    title: "Attribution is a quarter-end argument.",
    body: "Credit gets litigated in a spreadsheet every quarter. Covant settles it with a model and an audit trail.",
  },
];

const STEPS = [
  {
    title: "Connect your CRM.",
    body: "Covant reads the deals and partner touchpoints you already have in Salesforce or HubSpot.",
  },
  {
    title: "Pick the motion, get the model.",
    body: "Covant recommends an attribution model per program instead of forcing one onto everything.",
  },
  {
    title: "Run the next move.",
    body: "Every week you get a ranked list of what to do and who to call — by partner, by program.",
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
              The PRM is becoming Partner Experience Management. Covant is building it.
            </h1>
            <p className="m-lead" style={{ maxWidth: "52ch" }}>
              Covant is the AI-native PRM for B2B SaaS running more than one partner
              motion. It scores every partner, recommends the attribution model that fits
              each motion, reconstructs your last 12 months under it, and hands your team
              the next move. Legacy PRM is a filing cabinet. PXM is a system of action.
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

      {/* Problem */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The problem</p>
            <h2 className="m-h2" style={{ maxWidth: "18ch" }}>
              Legacy PRM was built to record. Not to decide.
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

      {/* How it works */}
      <section id="how" className="m-section">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">How it works</p>
            <h2 className="m-h2">Three steps. Live in days.</h2>
          </Reveal>
          <div className="m-grid m-grid-3" style={{ marginTop: "3rem" }}>
            {STEPS.map((s, i) => (
              <Reveal className="m-card" key={s.title}>
                <span className="m-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-h3" style={{ margin: ".6rem 0 .5rem" }}>
                  {s.title}
                </h3>
                <p className="m-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The models — the opinion */}
      <section className="m-section m-section--surface">
        <div className="m-container">
          <Reveal>
            <p className="m-eyebrow">The opinion</p>
            <h2 className="m-h2" style={{ maxWidth: "20ch" }}>
              Attribution isn&apos;t one model. We give you five — and we tell you which one.
            </h2>
            <p className="m-body" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
              Most PRMs make you bolt one model onto every program. Covant matches the
              model to the motion.
            </p>
          </Reveal>
          <Reveal style={{ marginTop: "2.5rem" }}>
            <ModelList />
          </Reveal>
          <p className="m-small" style={{ marginTop: "1.5rem" }}>
            <Link href="/product" style={{ color: "var(--m-accent)", fontWeight: 600 }}>
              See how the models work →
            </Link>
          </p>
        </div>
      </section>

      <CTABand />
    </main>
  );
}
