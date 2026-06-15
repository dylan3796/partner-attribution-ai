"use client";

import { useEffect, useState } from "react";
import styles from "./ChannelGraph.module.css";

/**
 * The Channel Graph — the signature visual.
 *
 * One frozen-layout SVG node-edge graph driven by a single `activeSection`
 * (0–6). Each section maps to a config of node/edge states; transitions are
 * pure CSS on class/attribute changes (never re-rendered or re-simulated).
 * The owner of the scroll (the lab page now, the landing page later) sets
 * `activeSection` — the state machine lives here and is not forked.
 *
 * Spec: channel-graph-spec.md · Tokens: design-system.md
 */

type NodeType = "vendor" | "partner" | "deal" | "account" | "ghost";
type NodeState = "forming" | "idle" | "dimmed" | "active" | "pulse" | "ghost" | "hidden";
type EdgeType = "program" | "sourced" | "influenced" | "deal-account" | "cosell";
type EdgeState = "idle" | "dimmed" | "active-flow" | "hidden";

type GraphNode = { id: string; type: NodeType; label: string; x: number; y: number; signal?: string };
type GraphEdge = { from: string; to: string; type: EdgeType };

// Frozen coordinates on a 1000×700 canvas (authored, not simulated).
const NODES: GraphNode[] = [
  { id: "V", type: "vendor", label: "You", x: 500, y: 350 },
  { id: "P1", type: "partner", label: "Northwind SI", x: 300, y: 200 },
  { id: "P2", type: "partner", label: "Atlas ISV", x: 700, y: 200 },
  { id: "P3", type: "partner", label: "Cedar Resell", x: 250, y: 480 },
  { id: "P4", type: "partner", label: "Vela Cloud", x: 740, y: 470 },
  { id: "P5", type: "partner", label: "Orbit MSP", x: 500, y: 130 },
  { id: "P6", type: "partner", label: "Lumen SI", x: 500, y: 580 },
  { id: "D1", type: "deal", label: "Acme — Exp", x: 380, y: 320 },
  { id: "D2", type: "deal", label: "Globex — New", x: 620, y: 320 },
  { id: "D3", type: "deal", label: "Initech — Ren", x: 430, y: 470 },
  { id: "D4", type: "deal", label: "Umbrella — New", x: 640, y: 450 },
  { id: "A1", type: "account", label: "Acme Co", x: 230, y: 320 },
  { id: "A2", type: "account", label: "Globex", x: 770, y: 320 },
  { id: "A3", type: "account", label: "Initech", x: 340, y: 560 },
  { id: "A4", type: "account", label: "Umbrella", x: 800, y: 470 },
  { id: "G1", type: "ghost", label: "Pinnacle SI", x: 180, y: 140, signal: "M&A" },
  { id: "G2", type: "ghost", label: "Hex ISV", x: 820, y: 150, signal: "new practice" },
];

const EDGES: GraphEdge[] = [
  { from: "V", to: "P1", type: "program" },
  { from: "V", to: "P2", type: "program" },
  { from: "V", to: "P3", type: "program" },
  { from: "V", to: "P4", type: "program" },
  { from: "V", to: "P5", type: "program" },
  { from: "V", to: "P6", type: "program" },
  { from: "P2", to: "D2", type: "sourced" },
  { from: "P5", to: "D2", type: "influenced" },
  { from: "P1", to: "D2", type: "influenced" },
  { from: "P1", to: "D1", type: "sourced" },
  { from: "P6", to: "D3", type: "sourced" },
  { from: "P4", to: "D4", type: "sourced" },
  { from: "D1", to: "A1", type: "deal-account" },
  { from: "D2", to: "A2", type: "deal-account" },
  { from: "D3", to: "A3", type: "deal-account" },
  { from: "D4", to: "A4", type: "deal-account" },
  { from: "P2", to: "P5", type: "cosell" },
];

// Section 5 tier bands — partners glide into Tier 1/2/3, vendor steps aside.
const TIER_POS: Record<string, { x: number; y: number }> = {
  V: { x: 170, y: 350 },
  P1: { x: 560, y: 165 }, P2: { x: 760, y: 165 },
  P5: { x: 560, y: 350 }, P6: { x: 760, y: 350 },
  P3: { x: 560, y: 535 }, P4: { x: 760, y: 535 },
};

// Sources stream in from the periphery and feed the nearest node.
const SOURCES = [
  { label: "CRM", x: 120, y: 110, target: "P1" },
  { label: "Email", x: 110, y: 600, target: "P3" },
  { label: "Slack", x: 890, y: 110, target: "P2" },
  { label: "Notes", x: 900, y: 600, target: "P4" },
  { label: "Sheets", x: 500, y: 40, target: "P5" },
];

const ACTIVE_EDGES: Record<number, string[]> = {
  4: ["P2->D2", "P5->D2", "P1->D2"],
  5: ["P4->D4"],
  6: ["V->P2", "P2->D2", "D2->A2"],
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
    case 3: // Channel TAM — keep partners/vendor lit, recede deals/accounts so ghosts read
      return n.type === "deal" || n.type === "account" ? "dimmed" : "idle";
    case 4: // Attribution — focus D2 and its contributors
      if (n.id === "D2") return "active";
      if (["P1", "P2", "P5", "V"].includes(n.id)) return "idle";
      return "dimmed";
    case 5: // Plan & recommend — tiers, one pulse on the recommended partner
      if (n.type === "partner") return n.id === "P4" ? "pulse" : "idle";
      if (n.id === "V") return "idle";
      if (n.id === "D4") return "active";
      return "dimmed";
    case 6: // Ask — collapse to a partner-scoped slice (P2)
      return ["V", "P2", "D2", "A2"].includes(n.id) ? "active" : "dimmed";
    default:
      return "idle";
  }
}

function edgeStateFor(e: GraphEdge, section: number): EdgeState {
  if (ACTIVE_EDGES[section]?.includes(edgeKey(e))) return "active-flow";
  switch (section) {
    case 3:
      return e.type === "deal-account" ? "dimmed" : "idle";
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
      aria-label="Animated Channel Graph: a vendor connected to partners, deals, and accounts. As each section becomes active, the graph highlights inputs connecting, the formed graph, partners to recruit, deal attribution, partner tiers and recommendations, and a partner-scoped query view."
    >
      <svg className={styles.svg} viewBox="0 0 1000 700" aria-hidden="true">
        {/* scan sweep (Channel TAM) */}
        <g className={styles.scan}>
          <rect x="-200" y="0" width="160" height="700" fill="url(#scanGrad)" />
        </g>
        <defs>
          <linearGradient id="scanGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--m-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--m-accent)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--m-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* feed lines from sources */}
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
          const state = edgeStateFor(e, section);
          return (
            <line
              key={edgeKey(e)}
              className={styles.edge}
              data-type={e.type}
              data-state={state}
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
          const r = n.type === "vendor" ? 26 : n.type === "account" ? 13 : 16;
          return (
            <g
              key={n.id}
              className={styles.node}
              data-type={n.type}
              data-state={state}
              style={{ ["--x" as string]: p.x, ["--y" as string]: p.y, ["--i" as string]: i }}
            >
              <circle className={styles.ring} r={r + 7} />
              <g className={styles.body}>
                {n.type === "deal" ? (
                  <rect className={styles.shape} x={-12} y={-12} width={24} height={24} rx={4} />
                ) : (
                  <circle className={styles.shape} r={r} />
                )}
              </g>
              <text className={styles.label} y={r + 20}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ---- HTML overlay chips (positioned in graph coords) ---- */}
      <div className={styles.overlay}>
        {/* Attribution evidence chip near D2 */}
        <div
          className={`${styles.chip} ${styles.chipEvidence}`}
          data-show={section === 4}
          style={{ left: px(620), top: py(250) }}
        >
          3 touchpoints — proposed
        </div>

        {/* Channel TAM signal badges on ghosts */}
        {NODES.filter((n) => n.type === "ghost").map((g) => (
          <div
            key={`sig-${g.id}`}
            className={`${styles.chip} ${styles.chipSignal}`}
            data-show={section === 3}
            style={{ left: px(g.x), top: py(g.y - 42) }}
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
          { label: "sourced", x: 660, y: 260 },
          { label: "co-sell", x: 600, y: 165 },
          { label: "renewal", x: 465, y: 525 },
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
          Atlas ISV — 1 sourced, 2 influenced
        </div>
      </div>
    </div>
  );
}
