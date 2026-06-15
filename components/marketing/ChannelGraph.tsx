"use client";

import { useEffect, useId, useState } from "react";
import styles from "./ChannelGraph.module.css";

/**
 * The Channel Graph — the signature visual.
 *
 * A frozen-layout SVG graph of the data the Channel Graph unifies: a central
 * "You" surrounded by the data domains (Partners, Accounts, Opportunities,
 * Program, Definitions, Personnel), each holding a few unlabeled record-dots.
 * No company names — the nodes are areas of data, not customers.
 *
 * One `activeSection` (0–6) drives every state; transitions are pure CSS on
 * class/attribute changes (never re-rendered or simulated). The scroll owner
 * sets `activeSection`; the state machine lives here and is not forked.
 *
 * Spec: channel-graph-spec.md · Tokens: design-system.md
 */

type NodeType = "vendor" | "domain" | "record" | "ghost";
type NodeState = "idle" | "dimmed" | "active" | "pulse" | "ghost" | "hidden";
type EdgeType = "program" | "member" | "sourced" | "influenced" | "deal-account" | "cosell";
type EdgeState = "idle" | "dimmed" | "active-flow" | "hidden";

type Dom = "P" | "O" | "A" | "PROG" | "PERS" | "DEF";
type GraphNode = { id: string; type: NodeType; label?: string; x: number; y: number; dom?: Dom; signal?: string };
type GraphEdge = { from: string; to: string; type: EdgeType };

// Frozen coordinates on a 1000×700 canvas (authored, not simulated).
const DOMAINS: GraphNode[] = [
  { id: "DOM_P", type: "domain", label: "Partners", x: 300, y: 170, dom: "P" },
  { id: "DOM_O", type: "domain", label: "Opportunities", x: 700, y: 170, dom: "O" },
  { id: "DOM_A", type: "domain", label: "Accounts", x: 825, y: 350, dom: "A" },
  { id: "DOM_PROG", type: "domain", label: "Program", x: 700, y: 560, dom: "PROG" },
  { id: "DOM_PERS", type: "domain", label: "Personnel", x: 300, y: 560, dom: "PERS" },
  { id: "DOM_DEF", type: "domain", label: "Definitions", x: 175, y: 350, dom: "DEF" },
];

const RECORDS: GraphNode[] = [
  // Partners (six — they organize into tiers in section 5)
  { id: "PR1", type: "record", x: 175, y: 85, dom: "P" },
  { id: "PR2", type: "record", x: 400, y: 90, dom: "P" },
  { id: "PR3", type: "record", x: 110, y: 205, dom: "P" },
  { id: "PR4", type: "record", x: 440, y: 200, dom: "P" },
  { id: "PR5", type: "record", x: 245, y: 285, dom: "P" },
  { id: "PR6", type: "record", x: 330, y: 35, dom: "P" },
  // Opportunities
  { id: "OP1", type: "record", x: 620, y: 110, dom: "O" },
  { id: "OP2", type: "record", x: 810, y: 110, dom: "O" },
  { id: "OP3", type: "record", x: 825, y: 240, dom: "O" },
  // Accounts
  { id: "AC1", type: "record", x: 915, y: 295, dom: "A" },
  { id: "AC2", type: "record", x: 920, y: 415, dom: "A" },
  // Program
  { id: "PG1", type: "record", x: 625, y: 635, dom: "PROG" },
  { id: "PG2", type: "record", x: 795, y: 625, dom: "PROG" },
  // Personnel
  { id: "PE1", type: "record", x: 300, y: 645, dom: "PERS" },
  // Definitions
  { id: "DF1", type: "record", x: 80, y: 360, dom: "DEF" },
];

const GHOSTS: GraphNode[] = [
  { id: "G1", type: "ghost", x: 130, y: 290, dom: "P", signal: "M&A" },
  { id: "G2", type: "ghost", x: 470, y: 120, dom: "P", signal: "new practice" },
];

const VENDOR: GraphNode = { id: "V", type: "vendor", label: "You", x: 500, y: 350 };

const NODES: GraphNode[] = [VENDOR, ...DOMAINS, ...RECORDS, ...GHOSTS];

// Edges: backbone (You→domain), membership (domain→record), and the semantic
// cross-links that the choreography lights up.
const CROSS_EDGES: GraphEdge[] = [
  { from: "PR2", to: "OP1", type: "sourced" },
  { from: "PR5", to: "OP1", type: "influenced" },
  { from: "PR1", to: "OP1", type: "influenced" },
  { from: "PR3", to: "OP3", type: "sourced" },
  { from: "PR4", to: "OP2", type: "sourced" },
  { from: "OP1", to: "AC1", type: "deal-account" },
  { from: "OP2", to: "AC2", type: "deal-account" },
  { from: "PR2", to: "PR5", type: "cosell" },
];

const EDGES: GraphEdge[] = [
  ...DOMAINS.map((d) => ({ from: "V", to: d.id, type: "program" as EdgeType })),
  ...RECORDS.map((r) => ({ from: `DOM_${r.dom}`, to: r.id, type: "member" as EdgeType })),
  ...CROSS_EDGES,
];

// Section 5 tier bands — partner records glide into Tier 1/2/3, vendor steps aside.
const TIER_POS: Record<string, { x: number; y: number }> = {
  V: { x: 165, y: 350 },
  PR1: { x: 560, y: 165 }, PR2: { x: 760, y: 165 },
  PR5: { x: 560, y: 350 }, PR6: { x: 760, y: 350 },
  PR3: { x: 560, y: 535 }, PR4: { x: 760, y: 535 },
};

// Sources stream in from the periphery and feed the nearest domain.
const SOURCES = [
  { label: "CRM", x: 615, y: 35, target: "DOM_O" },
  { label: "Email", x: 110, y: 620, target: "DOM_PERS" },
  { label: "Slack", x: 95, y: 110, target: "DOM_P" },
  { label: "Notes", x: 900, y: 620, target: "DOM_PROG" },
  { label: "Sheets", x: 950, y: 240, target: "DOM_A" },
];

const ACTIVE_EDGES: Record<number, string[]> = {
  4: ["PR2->OP1", "PR5->OP1", "PR1->OP1", "OP1->AC1"],
  5: ["PR4->OP2"],
  6: ["V->DOM_P", "DOM_P->PR2", "PR2->OP1", "OP1->AC1"],
};

const edgeKey = (e: GraphEdge) => `${e.from}->${e.to}`;

function positionFor(section: number): Record<string, { x: number; y: number }> {
  const base: Record<string, { x: number; y: number }> = {};
  for (const n of NODES) base[n.id] = { x: n.x, y: n.y };
  if (section === 5) return { ...base, ...TIER_POS };
  return base;
}

function nodeStateFor(n: GraphNode, section: number): NodeState {
  if (n.type === "ghost") return section === 3 ? "ghost" : "hidden";
  switch (section) {
    case 0:
    case 1:
    case 2:
      return "idle";
    case 3: // Channel TAM — light the Partners domain and its records; ghosts appear
      if (n.id === "DOM_P") return "active";
      if (n.id === "V") return "idle";
      if (n.type === "record" && n.dom === "P") return "idle";
      return "dimmed";
    case 4: // Attribution — one opportunity record + its contributing partner records
      if (n.id === "OP1") return "active";
      if (["PR1", "PR2", "PR5", "AC1", "V", "DOM_O"].includes(n.id)) return "idle";
      return "dimmed";
    case 5: // Plan & recommend — partner records into tiers, one pulse on a live opp
      if (n.type === "record" && n.dom === "P") return n.id === "PR4" ? "pulse" : "idle";
      if (n.id === "V") return "idle";
      if (n.id === "OP2") return "active";
      return "dimmed";
    case 6: // Ask — collapse to a single partner's scoped slice
      return ["V", "DOM_P", "PR2", "OP1", "AC1"].includes(n.id) ? "active" : "dimmed";
    default:
      return "idle";
  }
}

function edgeStateFor(e: GraphEdge, section: number): EdgeState {
  if (ACTIVE_EDGES[section]?.includes(edgeKey(e))) return "active-flow";
  switch (section) {
    case 3: // keep the Partners backbone + memberships lit; recede the rest
      if (e.from === "V" && e.to === "DOM_P") return "idle";
      if (e.from === "DOM_P" && e.type === "member") return "idle";
      return "dimmed";
    case 4:
    case 5:
    case 6:
      return "dimmed";
    default:
      return "idle";
  }
}

// graph coords (1000×700) -> percentage position for HTML overlay chips
const px = (x: number) => `${(x / 1000) * 100}%`;
const py = (y: number) => `${(y / 700) * 100}%`;

export default function ChannelGraph({ activeSection = 0 }: { activeSection?: number }) {
  const [assembled, setAssembled] = useState(false);
  // unique per instance so multiple graphs on one page don't share gradient ids
  const scanId = `scan-${useId().replace(/:/g, "")}`;

  // Play the intro assembly once, after first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAssembled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const section = Math.max(0, Math.min(6, activeSection));
  const pos = positionFor(section);
  const showSources = section === 0 || section === 1;

  return (
    <div
      className={styles.graph}
      data-section={section}
      data-assembled={assembled}
      role="img"
      aria-label="Animated Channel Graph: a central 'You' connected to your data domains — Partners, Accounts, Opportunities, Program, Definitions, and Personnel — each holding records. As each section becomes active, the graph highlights data connecting, the formed graph, partners to recruit, deal attribution, partner tiers and a recommendation, and a partner-scoped query view."
    >
      <svg className={styles.svg} viewBox="0 0 1000 700" aria-hidden="true">
        <defs>
          <linearGradient id={scanId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--m-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--m-accent)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--m-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* scan sweep (Channel TAM) */}
        <g className={styles.scan}>
          <rect x="-200" y="0" width="160" height="700" fill={`url(#${scanId})`} />
        </g>

        {/* feed lines from sources to nearest domain */}
        {SOURCES.map((s, i) => {
          const t = pos[s.target];
          const state = section === 1 ? "active-flow" : section === 0 ? "faint" : "off";
          return (
            <line
              key={`feed-${s.label}`}
              className={styles.feed}
              data-state={state}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              style={{ ["--i" as string]: i }}
            />
          );
        })}

        {/* edges */}
        {EDGES.map((e, i) => {
          const a = pos[e.from];
          const b = pos[e.to];
          return (
            <line
              key={edgeKey(e)}
              className={styles.edge}
              data-type={e.type}
              data-state={edgeStateFor(e, section)}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{ ["--i" as string]: i }}
            />
          );
        })}

        {/* source labels */}
        {SOURCES.map((s) => (
          <text
            key={`src-${s.label}`}
            className={styles.source}
            data-on={showSources ? 1 : 0}
            x={s.x}
            y={s.y - 14}
          >
            {s.label}
          </text>
        ))}

        {/* nodes */}
        {NODES.map((n, i) => {
          const p = pos[n.id];
          const state = nodeStateFor(n, section);
          const r = n.type === "vendor" ? 26 : n.type === "domain" ? 19 : 7;
          return (
            <g
              key={n.id}
              className={styles.node}
              data-type={n.type}
              data-state={state}
              style={{ ["--x" as string]: p.x, ["--y" as string]: p.y, ["--i" as string]: i }}
            >
              <circle className={styles.ring} r={r + 6} />
              <g className={styles.body}>
                <circle className={styles.shape} r={r} />
              </g>
              {n.label ? (
                <text className={styles.label} y={r + 20}>
                  {n.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* ---- HTML overlay chips (positioned in graph coords) ---- */}
      <div className={styles.overlay}>
        {/* Attribution evidence chip near OP1 */}
        <div
          className={`${styles.chip} ${styles.chipEvidence}`}
          data-show={section === 4}
          style={{ left: px(560), top: py(55) }}
        >
          3 touchpoints — proposed
        </div>

        {/* Channel TAM signal badges on ghost partner records */}
        {GHOSTS.map((g) => (
          <div
            key={`sig-${g.id}`}
            className={`${styles.chip} ${styles.chipSignal}`}
            data-show={section === 3}
            style={{ left: px(g.x), top: py(g.y - 34) }}
          >
            {g.signal}
          </div>
        ))}

        {/* Plan tier band labels */}
        {section === 5 &&
          [
            { label: "Tier 1", y: 165 },
            { label: "Tier 2", y: 350 },
            { label: "Tier 3", y: 535 },
          ].map((t) => (
            <div
              key={t.label}
              className={`${styles.chip} ${styles.chipTier}`}
              data-show={true}
              style={{ left: px(430), top: py(t.y) }}
            >
              {t.label}
            </div>
          ))}

        {/* Connect — context tags snapping onto edges */}
        {[
          { label: "sourced", x: 510, y: 105 },
          { label: "co-sell", x: 320, y: 195 },
          { label: "renewal", x: 760, y: 360 },
        ].map((c) => (
          <div
            key={`ctx-${c.label}`}
            className={`${styles.chip} ${styles.chipContext}`}
            data-show={section === 1}
            style={{ left: px(c.x), top: py(c.y) }}
          >
            {c.label}
          </div>
        ))}

        {/* Ask — query + answer chips */}
        <div
          className={`${styles.chip} ${styles.chipQuery}`}
          data-show={section === 6}
          style={{ left: px(330), top: py(70) }}
        >
          Which partners influenced closed-won in EMEA?
        </div>
        <div
          className={`${styles.chip} ${styles.chipAnswer}`}
          data-show={section === 6}
          style={{ left: px(720), top: py(560) }}
        >
          One partner — 1 sourced, 2 influenced
        </div>
      </div>
    </div>
  );
}
