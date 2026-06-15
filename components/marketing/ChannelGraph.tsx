"use client";

import { useEffect, useState } from "react";
import styles from "./ChannelGraph.module.css";

/**
 * The Channel Graph — the signature visual.
 *
 * A frozen-layout SVG *mesh* of how a partnerships org actually runs: five
 * labeled layers — Definitions & rules, Where things live, The work, Programs
 * & investment, External signals — each a cluster of labeled nodes wrapped in a
 * soft group lasso. The clusters interconnect (no single hub); "Your Channel"
 * is a low-emphasis label at the core, the layer the graph lives in, never a
 * node in it.
 *
 * One `activeSection` (0–6) drives every state; transitions are pure CSS on
 * class/attribute changes (never re-rendered or simulated). Each step lights
 * the clusters it's about and the sub-web between them.
 *
 * Spec: channel-graph-spec.md · Tokens: design-system.md
 */

type CL = 1 | 2 | 3 | 4 | 5;
type NodeType = "core" | "cluster" | "leaf";
type NodeState = "core" | "idle" | "dimmed" | "active";
type GroupState = "idle" | "dimmed" | "active";
type EdgeType = "mesh" | "member";
type EdgeState = "idle" | "dimmed" | "active-flow";

type GNode = { id: string; type: NodeType; label?: string; x: number; y: number; cl?: CL; labelAbove?: boolean };
type GEdge = { from: string; to: string; type: EdgeType };
type Group = { cl: CL; cx: number; cy: number; rx: number; ry: number };

// Frozen coordinates on a 1000×700 canvas (authored, not simulated).
const CORE: GNode = { id: "core", type: "core", label: "Your Channel", x: 500, y: 350 };

const CLUSTERS: GNode[] = [
  { id: "C1", type: "cluster", label: "Where things live", x: 500, y: 130, cl: 1 },
  { id: "C2", type: "cluster", label: "The work", x: 840, y: 250, cl: 2 },
  { id: "C3", type: "cluster", label: "Programs & investment", x: 710, y: 590, cl: 3, labelAbove: true },
  { id: "C4", type: "cluster", label: "External signals", x: 290, y: 590, cl: 4, labelAbove: true },
  { id: "C5", type: "cluster", label: "Definitions & rules", x: 160, y: 250, cl: 5 },
];

const LEAVES: GNode[] = [
  // 1 — Where things live
  { id: "l_partners", type: "leaf", label: "Partners", x: 375, y: 70, cl: 1 },
  { id: "l_accounts", type: "leaf", label: "Accounts", x: 510, y: 48, cl: 1 },
  { id: "l_opps", type: "leaf", label: "Opportunities", x: 650, y: 70, cl: 1 },
  // 2 — The work (evidence)
  { id: "l_reg", type: "leaf", label: "Registrations", x: 930, y: 162, cl: 2 },
  { id: "l_act", type: "leaf", label: "Activities", x: 958, y: 275, cl: 2 },
  { id: "l_docs", type: "leaf", label: "Documents", x: 915, y: 382, cl: 2 },
  // 3 — Programs & investment
  { id: "l_inc", type: "leaf", label: "Incentives", x: 838, y: 600, cl: 3 },
  { id: "l_mdf", type: "leaf", label: "MDF & claims", x: 700, y: 668, cl: 3, labelAbove: true },
  { id: "l_cert", type: "leaf", label: "Certifications", x: 560, y: 652, cl: 3, labelAbove: true },
  // 4 — External signals
  { id: "l_analyst", type: "leaf", label: "Analyst data", x: 168, y: 605, cl: 4 },
  { id: "l_mkt", type: "leaf", label: "Marketplace", x: 320, y: 672, cl: 4, labelAbove: true },
  // 5 — Definitions & rules
  { id: "l_roe", type: "leaf", label: "Rules of engagement", x: 80, y: 162, cl: 5 },
  { id: "l_models", type: "leaf", label: "Attribution models", x: 55, y: 290, cl: 5 },
  { id: "l_metrics", type: "leaf", label: "Metrics & tiers", x: 95, y: 398, cl: 5 },
];

const NODES: GNode[] = [CORE, ...CLUSTERS, ...LEAVES];

const GROUPS: Group[] = [
  { cl: 1, cx: 512, cy: 92, rx: 172, ry: 80 },
  { cl: 2, cx: 902, cy: 272, rx: 96, ry: 138 },
  { cl: 3, cx: 700, cy: 626, rx: 172, ry: 80 },
  { cl: 4, cx: 250, cy: 630, rx: 138, ry: 74 },
  { cl: 5, cx: 95, cy: 288, rx: 98, ry: 142 },
];

// Inter-cluster mesh: a ring plus three diagonals — a web, not a hub.
const MESH: [string, string][] = [
  ["C1", "C2"], ["C2", "C3"], ["C3", "C4"], ["C4", "C5"], ["C5", "C1"],
  ["C1", "C3"], ["C1", "C4"], ["C2", "C5"],
];

const EDGES: GEdge[] = [
  ...MESH.map(([from, to]) => ({ from, to, type: "mesh" as EdgeType })),
  ...LEAVES.map((l) => ({ from: `C${l.cl}`, to: l.id, type: "member" as EdgeType })),
];

const clOf: Record<string, CL> = Object.fromEntries(
  [...CLUSTERS, ...LEAVES].map((n) => [n.id, n.cl as CL])
);

// Which layers each step is about. Sections 0–2 show the whole graph.
const ACTIVE: Record<number, CL[]> = {
  3: [4, 1], // Recruit & activate — external signals feed partner fit
  4: [5, 2], // Attribution — definitions + the evidence
  5: [1, 2], // Recommend — entities + the work behind them
  6: [5, 1, 2], // Copilot — an answer traced across the mesh
};

const isActive = (cl: CL | undefined, section: number) =>
  cl !== undefined && (ACTIVE[section]?.includes(cl) ?? false);

function nodeStateFor(n: GNode, section: number): NodeState {
  if (n.type === "core") return "core";
  if (section <= 2) return "idle";
  if (!isActive(n.cl, section)) return "dimmed";
  return n.type === "cluster" ? "active" : "idle";
}

function groupStateFor(g: Group, section: number): GroupState {
  if (section <= 2) return "idle";
  return isActive(g.cl, section) ? "active" : "dimmed";
}

function edgeStateFor(e: GEdge, section: number): EdgeState {
  if (section <= 2) return "idle";
  if (e.type === "member") {
    return isActive(clOf[e.to], section) ? "idle" : "dimmed";
  }
  // mesh: light it only when both clusters are in play this step
  return isActive(clOf[e.from], section) && isActive(clOf[e.to], section)
    ? "active-flow"
    : "dimmed";
}

const px = (x: number) => `${(x / 1000) * 100}%`;
const py = (y: number) => `${(y / 700) * 100}%`;

export default function ChannelGraph({
  activeSection = 0,
  ambient = false,
  still = false,
  large = false,
}: {
  activeSection?: number;
  /** Slow ambient drift after the one-time assembly. */
  ambient?: boolean;
  /** Disable looping flow dashes for an at-a-glance still. */
  still?: boolean;
  /** Render at the larger cinematic width. */
  large?: boolean;
}) {
  const [assembled, setAssembled] = useState(false);

  // Play the intro assembly once, after first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAssembled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const section = Math.max(0, Math.min(6, activeSection));
  const posOf = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div
      className={`${styles.graph} ${large ? styles.large : ""}`}
      data-section={section}
      data-assembled={assembled}
      data-ambient={ambient}
      data-still={still}
      role="img"
      aria-label="The Channel Graph: your channel at the core, surrounded by five interconnected layers — Definitions & rules, Where things live, The work, Programs & investment, and External signals — each a cluster of labeled records, woven into one mesh."
    >
      <svg className={styles.svg} viewBox="0 0 1000 700" aria-hidden="true">
        <g className={styles.scene}>
          {/* cluster group lassos (behind everything) */}
          {GROUPS.map((g) => (
            <ellipse
              key={`g-${g.cl}`}
              className={styles.group}
              data-state={groupStateFor(g, section)}
              cx={g.cx}
              cy={g.cy}
              rx={g.rx}
              ry={g.ry}
            />
          ))}

          {/* edges */}
          {EDGES.map((e, i) => {
            const a = posOf(e.from);
            const b = posOf(e.to);
            return (
              <line
                key={`${e.from}->${e.to}`}
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

          {/* nodes */}
          {NODES.map((n, i) => {
            const r = n.type === "core" ? 46 : n.type === "cluster" ? 16 : 6;
            const ly = n.type === "core" ? 6 : n.labelAbove ? -(r + 12) : r + 20;
            return (
              <g
                key={n.id}
                className={styles.node}
                data-type={n.type}
                data-state={nodeStateFor(n, section)}
                style={{ ["--x" as string]: n.x, ["--y" as string]: n.y, ["--i" as string]: i }}
              >
                <circle className={styles.ring} r={r + 6} />
                <g className={styles.body}>
                  <circle className={styles.shape} r={r} />
                </g>
                {n.label ? (
                  <text className={styles.label} y={ly}>
                    {n.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>

      {/* ---- HTML overlay chips (positioned in graph coords) ---- */}
      <div className={styles.overlay}>
        {/* Recruit & activate — fit + signal */}
        <div className={`${styles.chip} ${styles.chipSignal}`} data-show={section === 3} style={{ left: px(375), top: py(36) }}>
          fit score
        </div>
        <div className={`${styles.chip} ${styles.chipSignal}`} data-show={section === 3} style={{ left: px(250), top: py(540) }}>
          analyst + marketplace
        </div>

        {/* Attribution — credit with the records */}
        <div className={`${styles.chip} ${styles.chipEvidence}`} data-show={section === 4} style={{ left: px(845), top: py(195) }}>
          credit, with the records
        </div>

        {/* Recommend — best-fit partner */}
        <div className={`${styles.chip} ${styles.chipEvidence}`} data-show={section === 5} style={{ left: px(510), top: py(178) }}>
          best-fit partner
        </div>

        {/* Copilot — query + answer */}
        <div className={`${styles.chip} ${styles.chipQuery}`} data-show={section === 6} style={{ left: px(300), top: py(120) }}>
          Which partners influenced closed-won in EMEA?
        </div>
        <div className={`${styles.chip} ${styles.chipAnswer}`} data-show={section === 6} style={{ left: px(720), top: py(560) }}>
          One partner — 1 sourced, 2 influenced
        </div>
      </div>
    </div>
  );
}
