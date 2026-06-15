# home-visual-spec.md — HOME graph visuals (plan only)

> HOME and PRODUCT use the **same `ChannelGraph` component**, configured
> differently — no new components. PRODUCT = explainer (one pinned graph,
> scroll-linked through the states). HOME = proof + atmosphere (assemble-once
> hero + four self-contained crops). Reuses the nodes/edges/states/tokens from
> `channel-graph-spec.md` + `design-system.md`. Frozen layout holds.
> Build in a throwaway `graph-lab` first, then wire into `app/page.tsx`.

---

## New config props on `ChannelGraph` (recompose, don't reinvent)

| Prop | Type | Purpose |
|---|---|---|
| `activeSection` | number | Locks the graph to one state (already exists). HOME passes a fixed value; no external observer. |
| `crop` | `{x,y,w,h}` | Overrides the SVG `viewBox` to frame a subregion of the same 1000×700 layout. Default = full. Coordinates are unchanged (frozen layout); only the framing changes. |
| `ambient` | boolean | Hero only: after the one-time assembly, apply a slow, subtle node drift. Off by default; disabled under reduced-motion. |
| `still` | boolean | Disables looping motion (active-flow march, pulse) for at-a-glance stills. Forced true under reduced-motion and on mobile. |

Implementation note (the one non-trivial bit): the HTML overlay chips are
positioned by `%` of the full 1000×700. With a `crop`, chip positions must remap
to the cropped frame: `left% = (x − crop.x)/crop.w × 100`, `top% = (y − crop.y)/crop.h × 100`.

---

## 1. HERO — assemble once, then drift

- **Config:** `activeSection={2}` (the organized "asset" state), `ambient`, no crop (full graph), no observer.
- **Behavior:** large, cinematic. Assembly plays **once** on view (nodes form in, edges draw), settles, then a slow ambient drift. **No state-cycling, no scroll-linking.** The assembly *is* the spectacle.
- **Layout:** larger than the current hero graph — it's the centerpiece, not a sidebar.
- **prefers-reduced-motion:** appears fully assembled, no drift.
- **Mobile:** static assembled still.
- New work: `ambient` drift (a subtle CSS keyframe; small per-node translate, staggered). Everything else already exists.

---

## 2. FOUR SECTION CROPS — one moment each, at a glance

Each outcome section gets its own `ChannelGraph` instance locked to one state and
framed to one region. Not pinned, not morphing. Crop boxes below are starting
values to tune in graph-lab.

### Revenue → attribution (state 4) · short loop
- **Frames:** the focus opportunity record **OP1** with its incoming partner records (**PR2** sourced, **PR1/PR5** influenced) converging, plus the **"3 touchpoints — proposed"** evidence chip.
- **Crop:** `{x:110, y:40, w:610, h:330}`.
- **Motion:** short loop of the active-flow dashes converging on the deal. Still under reduced-motion / mobile.

### Ecosystem → Channel TAM (state 3) · static (badges visible)
- **Frames:** the **Partners** domain + its records, with **ghost** nodes **G1/G2** lit and their **M&A** / **new-practice** signal badges.
- **Crop:** `{x:40, y:10, w:520, h:360}`.
- **Motion:** static still with ghosts + badges shown (skip the scan sweep in the crop). Optional one-time badge blink on view.

### Craft the program → recommendation highlight (state 5) · static (one pulse)
- **Reframed:** this section is program *design* (incentives, coverage,
  solution-building), not tier mechanics — so the crop frames the **recommend**
  beat, not literal tier bands.
- **Frames:** partners grouped by strength, with **one partner highlighted**
  (the `pulse`) and a **recommendation chip** naming the strategic move —
  e.g. *"Strong in fins · HLS gap → build a solution"* or *"Invest here."*
- **Crop:** `{x:380, y:110, w:470, h:500}` (tune to the highlighted partner).
- **Motion:** static still; the single `pulse` is the only motion (dropped under reduced-motion / mobile).
- **Small new work on state 5:** add a **recommendation chip** (same pattern as
  state 4's evidence chip) carrying the triage line; de-emphasize/hide the
  literal "Tier 1/2/3" labels in this HOME crop (PRODUCT's state-5 explainer can
  still show the tier beat). This is a config/chip addition, not a new component.

### Every question → ask (state 6) · short loop
- **Frames:** the lit **query path** through the scoped slice (V → Partners → PR2 → OP1 → AC1) with the **query** and **answer** chips.
- **Crop:** `{x:270, y:30, w:680, h:560}`.
- **Motion:** short loop of the path lighting. Still under reduced-motion / mobile.

---

## Reuse confirmation
All four crops + the hero are the **existing `ChannelGraph`** with
`activeSection` + `crop` (+ `ambient`/`still`). Same component on HOME and
PRODUCT. No new visual components, no new nodes/edges, no new tokens.

## Open question — PRODUCT's current visual
You described PRODUCT as "one pinned graph, scroll-linked through 6 states… stays
as-is." Heads-up: PRODUCT today actually uses **static per-section graph stills**
(four `ChannelGraph` instances), and the **pinned scroll-linked** version is the
`GraphStory` component currently on **HOME**. Since HOME is moving to hero+crops,
`GraphStory` frees up. Two options:
- **(A)** Move the pinned scroll-linked graph (`GraphStory`) to PRODUCT as the
  true explainer — matches your description, reuses the component.
- **(B)** Leave PRODUCT on its current per-section stills.
I recommend **(A)**.

## Build order (after approval)
1. Recreate a throwaway `graph-lab` to preview the hero (assemble+drift) and the
   4 crops in isolation; tune crop boxes.
2. Wire into `app/page.tsx` (4 outcome sections + hero).
3. Resolve PRODUCT per the open question.

**STOP for approval before building in graph-lab.**
