import ChannelGraph from "@/components/marketing/ChannelGraph";
import CTABand from "@/components/marketing/CTABand";
import styles from "./Home.module.css";

// Covant HOME — sells the OUTCOME to the exec who signs (VP/SVP Partnerships,
// CRO, CPO). Organized by 4 business outcomes; the Channel Graph is the hero
// spectacle (assembles once, drifts) and each outcome gets a tight self-contained
// crop. PRODUCT carries the mechanism (the 6-step explainer). Copy: home-messaging.md
// Visuals: home-visual-spec.md. No fabricated proof.

type Outcome = {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  surface?: boolean;
  graph: React.ComponentProps<typeof ChannelGraph>;
};

const OUTCOMES: Outcome[] = [
  {
    eyebrow: "Bring in more partner revenue",
    headline: "Prove your partner number.",
    body: "See sourced and influenced revenue, with the records — the number you take to the board.",
    bullets: [
      "Sourced and influenced, with the records",
      "A number that holds up in the QBR",
      "Grow what you can finally measure",
    ],
    graph: { activeSection: 4, crop: { x: 110, y: 40, w: 610, h: 330 } },
  },
  {
    eyebrow: "Build your ecosystem",
    headline: "Recruit the partners you're missing.",
    body: "See who fits your channel, who you're missing, and which moves to make before the market does.",
    bullets: [
      "The right partners, not more partners",
      "Recruit the gaps by vertical and geography",
      "See M&A and consolidation coming",
    ],
    surface: true,
    graph: { activeSection: 3, crop: { x: 40, y: 10, w: 520, h: 360 }, still: true },
  },
  {
    eyebrow: "Craft the program you want",
    headline: "Design the program you want.",
    body: "See where to add coverage, who to invest in, and who should build a solution — then design the program around it.",
    bullets: [
      "Launch incentives where they'll land",
      "Add managed coverage where it's thin",
      "Spot the partners who should build",
    ],
    graph: {
      activeSection: 5,
      crop: { x: 380, y: 110, w: 470, h: 500 },
      still: true,
      recommendChip: "Strong in fins · HLS gap → build a solution",
    },
  },
  {
    eyebrow: "Every question at your fingertips",
    headline: "Answers without the ops ticket.",
    body: "Ask in plain language, get the answer with the records — no two-week ops project.",
    bullets: [
      "Plain-language answers, records attached",
      "No ops ticket, no waiting",
      "For your team and your partners",
    ],
    surface: true,
    graph: { activeSection: 6, crop: { x: 270, y: 30, w: 680, h: 560 } },
  },
];

export default function Home() {
  return (
    <main className="site site--story">
      {/* Hero — the graph assembles once, then drifts (the spectacle) */}
      <section className="m-section m-section--flush m-hero">
        <div className="m-container">
          <p className="m-eyebrow">Covant</p>
          <h1 className="m-h1" style={{ maxWidth: "15ch" }}>
            Partner Intelligence for Startups.
          </h1>
          <p className="m-lead" style={{ maxWidth: "46ch" }}>
            Covant organizes your scattered partner data into the Channel Graph.
          </p>
          <div className="m-hero-cta">
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="#outcomes">See what you get</a>
          </div>
          <div className={styles.heroVisual}>
            <ChannelGraph activeSection={2} ambient large />
          </div>
        </div>
      </section>

      {/* The 4 exec outcomes */}
      <div id="outcomes">
        {OUTCOMES.map((o, i) => (
          <section
            key={o.headline}
            className={`m-section${o.surface ? " m-section--surface" : ""}`}
          >
            <div className="m-container">
              <div className={`${styles.grid}${i % 2 ? " " + styles.flip : ""}`}>
                <div className={styles.text}>
                  <p className="m-eyebrow">{o.eyebrow}</p>
                  <h2 className="m-h2" style={{ maxWidth: "18ch" }}>{o.headline}</h2>
                  <p className="m-lead" style={{ marginTop: "1rem", maxWidth: "42ch" }}>{o.body}</p>
                  <ul className={styles.bullets}>
                    {o.bullets.map((b) => (
                      <li className={styles.bullet} key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.visual}>
                  <ChannelGraph {...o.graph} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CTABand
        eyebrow="Get started"
        heading="See it on your data."
        body="We build your first Channel Graph from your real partner data — not a demo dataset."
      />
    </main>
  );
}
