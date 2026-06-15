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
    body: "Covant reads your CRM, email, Slack, and notes, then organizes everything into one connected place — Partners, Accounts, Opportunities, Program, Definitions, Personnel. That's the Channel Graph, and every answer, plan, and recommendation comes from it.",
    subs: [
      { t: "Reads your whole stack", d: "CRM, email, Slack, notes, spreadsheets — structured or not." },
      { t: "Organized into clear areas", d: "Partners, Accounts, Opportunities, Program, Definitions, Personnel." },
      { t: "Connected, and yours", d: "Covant builds the first pass; you sharpen it." },
    ],
  },
  {
    key: "tam",
    eyebrow: "02 — Channel TAM",
    tag: "Grow your channel",
    graphState: 3,
    headline: "Find the partners you're missing.",
    body: "Covant maps who fits your channel and flags who's missing — then reads the market, M&A and new-practice moves, for when to act. Recruit the gaps; activate who you already have.",
    subs: [
      { t: "Fit, not a list", d: "Partners matched to your verticals and deal sizes." },
      { t: "Timing signals", d: "M&A, consolidation, and new-practice moves." },
      { t: "Recruit and activate", d: "Close the gaps; wake up partners you already have." },
    ],
  },
  {
    key: "attribution",
    eyebrow: "03 — Attribution",
    tag: "Prove the impact",
    graphState: 4,
    headline: "Attribution, proposed with evidence.",
    body: "Covant proposes who sourced and who influenced every deal — or whatever your team measures — with the records attached. You approve or adjust; it never decides credit on its own, and every call you make teaches it how your team rules.",
    subs: [
      { t: "Sourced, influenced — or however you measure", d: "Covant proposes the split in your categories; the call stays yours." },
      { t: "Records attached", d: "Every claim cites the touchpoints behind it." },
      { t: "Every call teaches it", d: "Approve or override with a reason — the next proposal reflects how your team actually rules." },
    ],
  },
  {
    key: "plan",
    eyebrow: "04 — Plan & recommend",
    tag: "Plan with evidence",
    graphState: 5,
    headline: "The right partner, every deal.",
    body: "Covant names the best-fit partner for a live deal, with the evidence — and grounds the calls you used to make on instinct: tiers, territories, quota, investment. Partner Finder surfaces who to recruit next.",
    subs: [
      { t: "The right partner, this deal", d: "Best-fit partner for an open or stalled deal." },
      { t: "Plan on evidence", d: "Tiers, territories, quota, and investment." },
      { t: "Partner Finder", d: "Who to add next, by vertical and geography." },
    ],
  },
  {
    key: "ask",
    eyebrow: "05 — Ask Covant",
    tag: "Run it day to day",
    graphState: 6,
    headline: "Ask your channel anything.",
    body: "Ask in plain language and the answer comes back with the records attached. Covant ships as MCP servers for Claude and OpenAI. Each partner sees only their slice, and controls what you can ask.",
    subs: [
      { t: "Plain-language answers", d: "Sourced, with the records attached." },
      { t: "MCP for Claude and OpenAI", d: "Point an assistant at your channel." },
      { t: "Two-sided by design", d: "Partners control their own slice." },
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
          <p className="m-eyebrow">Covant</p>
          <h1 className="m-h1" style={{ maxWidth: "15ch" }}>
            Partner Intelligence for Startups.
          </h1>
          <p className="m-lead">
            Covant organizes your scattered partner data into the Channel Graph.
          </p>
          <div className={styles.heroCta}>
            <a className="m-btn" href="#demo">Request a demo</a>
            <a className="m-btn-ghost" href="#spine">See how it works</a>
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
