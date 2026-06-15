"use client";

import { useEffect, useRef, useState } from "react";
import ChannelGraph from "@/components/marketing/ChannelGraph";
import styles from "./GraphStory.module.css";

/**
 * Homepage spine: the Channel Graph pinned in a sticky column while the content
 * column scrolls through the hero + 5 sections. Each section, as it crosses the
 * viewport center, sets `activeSection` (the graph's own state value, carried in
 * data-index) — the same state machine the standalone component uses.
 *
 * Copy: messaging.md / copy-rewrite.md · Layout/tokens: design-system.md
 */

type Sub = { t: string; d: string };
type Section = { key: string; eyebrow: string; tag: string; graphState: number; headline: string; body: string; subs: Sub[] };

const SPINE: Section[] = [
  {
    key: "channel-graph",
    eyebrow: "01 — The Channel Graph",
    tag: "Partner intelligence, built",
    graphState: 2,
    headline: "All your partner data, organized.",
    body: "Covant reads across your systems, notes, and documents, then organizes everything into one connected place — your definitions, rules, partners, accounts, opportunities, and the work behind them. That's the Channel Graph, and every answer and recommendation comes from it.",
    subs: [
      { t: "Reads everything", d: "Across your systems, notes, and documents — structured or not." },
      { t: "Organized into clear areas", d: "Definitions, partners, accounts, opportunities, programs." },
      { t: "Connected, and yours", d: "Covant builds the first pass; you sharpen it." },
    ],
  },
  {
    key: "recruit",
    eyebrow: "02 — Recruit & activate",
    tag: "Grow your channel",
    graphState: 3,
    headline: "Recruit and activate partners.",
    body: "Covant scores how likely a partner is to succeed in your program — a proprietary model that matches third-party data against your company and what you sell, all grounded in the channel graph. Recruit the gaps; activate who you already have.",
    subs: [
      { t: "A fit score, not a list", d: "How likely a partner is to win in your program." },
      { t: "Grounded in your graph", d: "Third-party data matched to your company and what you sell." },
      { t: "Recruit and activate", d: "Close the gaps; wake up partners you already have." },
    ],
  },
  {
    key: "attribution",
    eyebrow: "03 — Attribution",
    tag: "Proven, not argued",
    graphState: 4,
    headline: "Attribution, proposed with evidence.",
    body: "Covant proposes who sourced and who influenced every deal, with the records attached. You approve or adjust — it never decides credit on its own — and every correction trains it, so disputes shrink and your team spends less energy arguing credit and more on the actual business.",
    subs: [
      { t: "Sourced and influenced", d: "Covant proposes the split; the call stays yours." },
      { t: "Records attached", d: "Every claim cites the touchpoints behind it." },
      { t: "It learns from you", d: "Corrections train it; disputes shrink over time." },
    ],
  },
  {
    key: "recommend",
    eyebrow: "04 — Recommend",
    tag: "Plan with evidence",
    graphState: 5,
    headline: "The right partner for every deal.",
    body: "Choose an account and an opportunity, and Covant returns a ranked list of partners — each with the reasons it's suggested, drawn from what's worked before for partners in similar deals. Win the deal now with the right expertise, and plan ahead: give partners the work they want and set fair growth targets.",
    subs: [
      { t: "Account and opportunity in", d: "A ranked, reasoned shortlist out." },
      { t: "Based on what's worked", d: "Patterns from partners in similar deals." },
      { t: "Win now, plan ahead", d: "Right expertise today; fair targets next." },
    ],
  },
  {
    key: "copilot",
    eyebrow: "05 — Your copilot",
    tag: "Run it day to day",
    graphState: 6,
    headline: "Your channel copilot.",
    body: "Not a search box — your own partner-program copilot, fluent in your channel graph. Ask it about your channel and the answer comes back with the records attached. It ships as MCP servers for Claude and OpenAI, and each partner sees only their slice.",
    subs: [
      { t: "Fluent in your graph", d: "Answers from your data, with the records attached." },
      { t: "MCP for Claude and OpenAI", d: "Point your assistant at your channel." },
      { t: "Two-sided by design", d: "Each partner sees only their slice." },
    ],
  },
];

export default function GraphStory() {
  const [active, setActive] = useState(0);
  const markers = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Mobile: the sticky interaction doesn't apply — show one static "asset"
    // shot (state 2, the organized Channel Graph) and skip the observer.
    const mq = window.matchMedia("(max-width: 900px)");
    let obs: IntersectionObserver | null = null;

    const setup = () => {
      obs?.disconnect();
      obs = null;
      if (mq.matches) {
        setActive(2);
        return;
      }
      obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(Number((entry.target as HTMLElement).dataset.index));
            }
          }
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
      );
      markers.current.forEach((m) => m && obs!.observe(m));
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      obs?.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* Hero — graph state 0 (assembly). DOM order hero -> graph -> sections
            so mobile stacks as hero -> static shot -> sections. */}
        <section
          ref={(el) => { markers.current[0] = el; }}
          data-index={0}
          className={styles.hero}
        >
          <p className="m-eyebrow">Product</p>
          <h1 className="m-h1" style={{ maxWidth: "18ch" }}>
            Your whole channel, in one place.
          </h1>
          <p className="m-lead">
            Covant organizes your partner data into the Channel Graph. Here&apos;s how it works.
          </p>
          <div className={styles.heroCta}>
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="#spine">See the steps</a>
          </div>
        </section>

        {/* Pinned graph (desktop) / single static asset shot (mobile) */}
        <div className={styles.visual}>
          <ChannelGraph activeSection={active} />
          <p className={styles.caption}>Illustrative — sample data, not customer data</p>
        </div>

        {/* The 5 spine sections */}
        {SPINE.map((s, i) => (
          <section
            key={s.key}
            id={i === 0 ? "spine" : undefined}
            ref={(el) => { markers.current[i + 1] = el; }}
            data-index={s.graphState}
            className={styles.section}
          >
            <p className="m-eyebrow">
              {s.eyebrow} <span className={styles.tag}>· {s.tag}</span>
            </p>
            <h2 className="m-h2" style={{ maxWidth: "18ch" }}>{s.headline}</h2>
            <p className={`m-lead ${styles.body}`}>{s.body}</p>
            <div className={styles.subs}>
              {s.subs.map((sub) => (
                <div className={styles.sub} key={sub.t}>
                  <h3 className={styles.subTitle}>{sub.t}</h3>
                  <p className={styles.subBody}>{sub.d}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
