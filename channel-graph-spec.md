# Channel Graph — Component Spec

The signature visual for the Covant landing page. One animated node-edge graph that serves as the hero **and** the pinned through-line: it assembles as data connects, then transitions to a different subgraph as each of the 6 sections becomes active. This is the thing that makes the page un-clonable — build it precisely, not approximately.

The single most important rule is at the bottom under “Build it this way.” Read it first if you read nothing else.

-----

## 1. What the graph represents

A semantic layer over a vendor’s channel. Four node types and a small set of edges. Keep it legible — this is a marketing visual, not a real graph render. ~20 nodes total.

**Node types**

- `vendor` — one central anchor node (“you”). Visually distinct (largest, accent-ringed).
- `partner` — SIs, ISVs, resellers. The main population. ~6 of them.
- `deal` — opportunities. ~4.
- `account` — end customers the deals are for. ~4.
- `ghost` — *potential* partners (Channel TAM targets). Dashed, hollow. Hidden until section 3.

**Edge types**

- `program` — vendor → partner. The baseline relationship. Thin, always present.
- `sourced` — partner → deal. Bold, solid. The partner that originated it.
- `influenced` — partner → deal. Thin, dashed. Contributing partners.
- `deal-account` — deal → account. Neutral connector.
- `cosell` — partner ↔ partner. One or two, for texture.

-----

## 2. Visual state vocabulary

Every node and edge is always in exactly one state. Sections switch states; they don’t add/remove elements (except ghosts and the query path). Transitions are CSS, ~400ms ease.

**Node states**

- `forming` — scale 0.6→1, opacity 0→1. Used once, during hero assembly.
- `idle` — default resting appearance. Full-color, calm.
- `dimmed` — opacity ~0.25, desaturated. When another subgraph is the focus.
- `active` — brighter, scale ~1.15, subtle outer ring. The focus of the current section.
- `pulse` — `active` plus a slow breathing ring (the recommendation). One node at a time, max.
- `ghost` — dashed stroke, no fill, opacity ~0.5. Potential partner.

**Edge states**

- `forming` — stroke draws in via `stroke-dashoffset`. Used during assembly.
- `idle` — thin, low-contrast.
- `dimmed` — nearly invisible (~0.1).
- `active-flow` — full-contrast, with a directional dash animation traveling along it (data moving). This is how attribution + query paths read as “alive.”

-----

## 3. Section choreography

One state, `activeSection` (0–6), drives everything. Each value maps to a config: which nodes/edges go to which state. Here’s what the eye should do in each.

**0 — Hero / assembly.** Start empty. Sources stream in from the periphery (small labels: CRM, Email, Slack, Notes, Sheets) and nodes `forming` into place; edges draw between them. Settles into a full `idle` graph with gentle ambient drift. This is the “data becomes a graph” beat — let it breathe for ~2s before settling.

**1 — Connect everything.** Re-emphasize the inputs. Peripheral source labels pulse and feed lines run into the nearest nodes. The moment to sell: a few edges get small context tags that snap on (“sourced”, “co-sell”, “renewal”) — Covant *inferring* meaning. Everything `idle` except the feeding lines `active-flow`.

**2 — The graph is the asset.** The beauty shot. Whole graph evenly lit, `idle`, fully labeled, stable. No single focus. This is “the durable thing you own.” Maximum calm and legibility here — it’s the screenshot people remember.

**3 — Channel TAM.** Existing `partner` nodes stay solid. `ghost` nodes fade in at the edges (who you’re missing). A scan/match sweep passes across them. One or two ghosts get a signal badge that blinks on — `M&A`, `new practice`, `new logo` — the SI/ISV intelligence. Reads as “here’s who to recruit, and why now.”

**4 — Attribution.** Pick one `deal` node, set it `active`. Light its incoming partner edges: one `sourced` (bold solid, `active-flow`) and one or two `influenced` (dashed, `active-flow`). An evidence chip appears near the deal: “3 touchpoints — proposed.” Everything else `dimmed`. This is the product decision made visible: Covant *proposes* sourced + influenced with the records attached, vendor approves. Directional flow on the paths sells “with evidence.”

**5 — Plan & recommend.** Two micro-beats, in order:

- *Plan:* partner nodes animate into three horizontal tier bands (Tier 1 / 2 / 3). Reorg, don’t teleport — let them glide into clusters.
- *Recommend:* on one live `deal`, a single best-fit `partner` goes to `pulse`. One pulse only. Reads as “right partner, this deal.”

**6 — Ask Covant.** A query chip enters (“Which partners influenced closed-won in EMEA?”). A path lights up `active-flow` from the query through the relevant nodes and an answer chip returns. Then show the two-sidedness: switch to a partner’s view — the graph collapses to *that partner’s scoped slice* (their nodes `active`, everything else to near-zero `dimmed`/locked). The line to land: same graph, partner controls what the vendor can ask. (Nod to MCP — it ships as servers for Claude/OpenAI.)

-----

## 4. Build it this way (the part that separates real from vibe-coded)

**Freeze the layout. Do not use a live force simulation.** Author the node coordinates once (or run a force layout, then capture the final positions and hard-code them). A running physics sim looks clever for five seconds, then jitters and you can never reliably say “highlight the deal node” because it’s moved. Frozen positions = every highlight is repeatable and intentional. This is the single biggest difference between a real product visual and a generated one.

**Use SVG, not Canvas.** ~20 nodes with CSS-driven state changes is trivial in SVG and gives you free styling, transitions, and `stroke-dasharray` path-draws. Canvas is overkill and harder to theme.

**One state machine, classes do the work.** `activeSection` is the only state. A config object maps each section → `{ nodeStates, edgeStates }`. Apply by toggling CSS classes/attributes — never re-render or rebuild the graph. All motion is CSS transitions on `opacity`, `transform`, `stroke`, `stroke-dashoffset`.

**Drive `activeSection` with IntersectionObserver.** The graph is a sticky/pinned column; the content column scrolls past it. Each content section, when it crosses center viewport, sets `activeSection`. This is a pinned visual + scroll-linked active state — **not** a carousel and not a scroll-jacker. The user scrolls normally; the pinned graph reacts.

**Respect `prefers-reduced-motion`.** If set: graph appears already assembled, kill ambient drift and directional flow, make section transitions instant cross-fades. No path-draw animations.

**Performance.** Toggling classes on 20 SVG elements is nothing. Avoid layout thrash by animating only `transform`/`opacity`/`stroke-*`. No JS animation loops except the optional ambient drift (use CSS or a single rAF, throttled).

-----

## 5. Starter data (build against this literally)

Approximate positions on a 1000×700 canvas. Adjust for aesthetics, but start authored, not random.

```js
const nodes = [
  { id: "V",  type: "vendor",  label: "You",            x: 500, y: 350 },

  { id: "P1", type: "partner", label: "Northwind SI",   x: 300, y: 200 },
  { id: "P2", type: "partner", label: "Atlas ISV",      x: 700, y: 200 },
  { id: "P3", type: "partner", label: "Cedar Resell",   x: 250, y: 480 },
  { id: "P4", type: "partner", label: "Vela Cloud",     x: 740, y: 470 },
  { id: "P5", type: "partner", label: "Orbit MSP",      x: 500, y: 130 },
  { id: "P6", type: "partner", label: "Lumen SI",       x: 500, y: 580 },

  { id: "D1", type: "deal",    label: "Acme — Exp",      x: 380, y: 320 },
  { id: "D2", type: "deal",    label: "Globex — New",    x: 620, y: 320 },
  { id: "D3", type: "deal",    label: "Initech — Ren",   x: 430, y: 470 },
  { id: "D4", type: "deal",    label: "Umbrella — New",  x: 640, y: 450 },

  { id: "A1", type: "account", label: "Acme Co",         x: 230, y: 320 },
  { id: "A2", type: "account", label: "Globex",          x: 770, y: 320 },
  { id: "A3", type: "account", label: "Initech",         x: 340, y: 560 },
  { id: "A4", type: "account", label: "Umbrella",        x: 800, y: 470 },

  // hidden until section 3
  { id: "G1", type: "ghost",   label: "Pinnacle SI",     x: 180, y: 140, signal: "M&A" },
  { id: "G2", type: "ghost",   label: "Hex ISV",         x: 820, y: 150, signal: "new practice" },
];

const edges = [
  // program (always on, thin)
  { from: "V", to: "P1", type: "program" },
  { from: "V", to: "P2", type: "program" },
  { from: "V", to: "P3", type: "program" },
  { from: "V", to: "P4", type: "program" },
  { from: "V", to: "P5", type: "program" },
  { from: "V", to: "P6", type: "program" },

  // attribution — D2 is the section-4 focus deal
  { from: "P2", to: "D2", type: "sourced"    },
  { from: "P5", to: "D2", type: "influenced" },
  { from: "P1", to: "D2", type: "influenced" },

  { from: "P1", to: "D1", type: "sourced"    },
  { from: "P6", to: "D3", type: "sourced"    },
  { from: "P4", to: "D4", type: "sourced"    },

  // deal -> account
  { from: "D1", to: "A1", type: "deal-account" },
  { from: "D2", to: "A2", type: "deal-account" },
  { from: "D3", to: "A3", type: "deal-account" },
  { from: "D4", to: "A4", type: "deal-account" },

  // texture
  { from: "P2", to: "P5", type: "cosell" },
];

// section 4 focus = "D2", its sourced/influenced edges, evidence chip "3 touchpoints — proposed"
// section 5 tiers: T1 [P1,P2]  T2 [P5,P6]  T3 [P3,P4];  recommend pulse = P4 on D4
// section 6 partner-scoped view = P2: keep V, P2, D2, A2 + P2's edges active; dim all else
```

All partner/account names above are fictional placeholders for the visual — not customer references. Keep it that way: no real logos, names, or metrics anywhere on the page.
