# design-system.md — Covant landing page

> **Step 2 deliverable. GATE (anti-generic): approve this before any page code.**
> This is an **AUDIT** of the existing `.m-*` system in `app/globals.css` plus the
> token mapping for the Channel Graph — **not** a from-scratch system. Verdicts:
> **PASS** (keep as-is), **REFINE** (small change), **REBUILD** (replace).
> No page code in this step.

---

## 0. Headline decisions to approve

1. **Type — editorial serif display + grotesk labels + Inter body.** Promote the
   editorial serif (Source Serif 4, already loaded) from hero-only to **all
   display headlines (H1 + H2)**; keep **Space Grotesk** for eyebrows, outcome
   tags, sub-feature titles, and numerals; **Inter** for body. This also resolves
   *Engine vs Graph*: **serif = the human, editorial voice** (the Partner-Manager
   / CPO promise), **grotesk = the technical "Engine"/data layer.**
2. **Light theme — confirmed. We are NOT going Monaco-dark.** We borrow Monaco's
   density and editorial type, not its palette. One **single dark beat** (the
   closing CTA) for rhythm; everything else light.
3. **Accent-as-state discipline.** At rest the page and the graph are
   monochrome ink-on-paper. The one pine accent marks **intent/action** —
   active nodes, data flow, primary CTA, links, eyebrows. Accent is a pointer,
   never a wash. (This is what keeps the signature graph calm and makes each
   highlight read.)
4. **Graph tokens** map node **types** by shape + tone and node **states** by
   accent + opacity + scale (full table in §6).

---

## 1. Banned-list audit (the anti-generic gate)

| Banned item | Verdict | Evidence / action |
|---|---|---|
| Inter / system-ui as **display** font | **PASS** | Display = Source Serif 4 (serif) + Space Grotesk (grotesk). Inter is **body only**. |
| indigo / violet / purple accent | **PASS** | Single accent = pine green `#1f5d4c`. |
| gradient-mesh / aurora / blob bg | **PASS** | None present; backgrounds are flat `--m-bg` / `--m-surface` / one `--m-ink`. |
| glassmorphism / frosted cards | **PASS** | Cards = solid bg + 1px border. Only blur is `.site-nav` — **ruled exempt** (shared chrome). |
| rounded-3xl heavy radius on everything | **PASS** | Base radius `8px`; product surfaces ≤14px; `99px` only on small tags/avatars. |
| drop shadows as decoration | **REFINE** | Content cards use border-only (good). Heavy shadows (`.m-app`, `.m-float`) live on the **legacy product-shot mockups** we're retiring; do not carry decorative shadows onto new content. Graph card: border, not shadow. |
| emoji in headers | **PASS** | None in page copy (messaging.md is emoji-free). |
| 3-col icon-feature grid as **primary** layout | **REFINE** | Primary layout = asymmetric pinned-graph + scrolling content. `.m-grid-3` is allowed **only** for the 3 sub-features *inside* a section, never as the page's spine. Enforce at Step 4. |
| pill gradient buttons | **PASS** | `.m-btn` = solid accent, 8px radius, no gradient, not a pill. |
| center-everything layout | **PASS** | Left-aligned; asymmetric hero `1.15fr / .85fr`. |
| "trusted by" / logo bar | **REFINE→CUT** | `.m-trust` strip is retired from the homepage (per messaging.md §4). Class may stay in CSS for other pages. |
| fabricated logo / name / metric / testimonial | **PASS** | None; stakes stats cut; graph uses fictional placeholder labels only. |

**Net:** the existing system passes the gate. No REBUILDs. Four REFINEs, all
about *what we stop using on the new page*, not broken tokens.

---

## 2. Type

**Three roles, three faces.** Faces already loaded in `app/layout.tsx`.

| Role | Face | Size (clamp) | Wt | Line-height | Tracking | Used for |
|---|---|---|---|---|---|---|
| Display XL (H1) | **Source Serif 4** | `clamp(2.5rem, 4.6vw, 3.6rem)` | 560 | 1.07 | −.01em | Hero headline |
| Display L (H2) | **Source Serif 4** | `clamp(1.9rem, 3vw, 2.6rem)` | 560 | 1.12 | −.01em | Section headlines *(REFINE: was Space Grotesk)* |
| Title (H3) | **Space Grotesk** | `1.05rem` | 600 | 1.25 | −.005em | Sub-feature + card titles |
| Eyebrow / Tag | **Space Grotesk** | `.75rem` | 600 | 1 | .14em, UPPER | Section eyebrow + outcome tag |
| Lead | Inter | `1.125rem` | 400 | 1.55 | — | Hero subhead |
| Body | Inter | `1rem` | 400 | 1.6 | — | Paragraphs, sub-feature descriptions |
| Small / Meta | Inter | `.875rem` | 400/600 | 1.5 | — | Captions, footnotes, links |
| Numeral / Stat | Space Grotesk | contextual | 600 | — | tabular-nums | Counters, graph data labels |

**Rule:** serif states the idea (headlines); grotesk labels and counts the system
(eyebrows, tags, numbers); Inter explains (body). Never set body in the serif;
never set a headline in Inter.

**REFINE to apply (Step 2 only writes the doc; change lands at build):**
- `.m-h2` / `.m-h3` headline family → `var(--font-serif-display)` for H2 (H1
  already serif via `.site--story`). Define `--font-serif-display` at the `.site`
  scope (currently only under `.site--story`).

---

## 3. Color

Near-monochrome, warm, **exactly one accent.** All values exist today — keep.

| Token | Value | Role |
|---|---|---|
| `--m-bg` | `#ffffff` | Page base |
| `--m-surface` | `#f7f7f5` | Alternating section / inset |
| `--m-ink` | `#16150f` | Primary text; node fills |
| `--m-ink-2` | `#57544b` | Secondary text; bold edges |
| `--m-muted` | `#8a8678` | Tertiary / labels / ghost stroke |
| `--m-border` | `#e3e1da` | Hairlines; baseline edges |
| `--m-accent` | `#1f5d4c` | **The one accent** — action/state only |
| `--m-accent-ink` | `#164034` | Accent hover / text-on-light |
| `--m-accent-fg` | `#ffffff` | Text on accent |
| `--m-accent-soft` | `#e9f0ec` | Accent wash for chips/badges |
| Dark beat | `--m-ink` bg / `#fbfaf6` text | Single CTA section only |

**Accent budget (discipline):** primary CTA, text links, section eyebrows,
recommendation/evidence chips, and **graph active/flow/pulse states**. Everything
else is ink-on-paper. If accent appears in more than ~10% of a viewport, it's
overused.

**Contrast (AA, verify at Step 5):** ink `#16150f` on bg = ~16:1 ✓; ink-2 on bg
~7:1 ✓; muted `#8a8678` on bg ~3.4:1 — **body-min fails**, so `--m-muted` is for
**large/secondary labels only**, never body copy. Accent `#1f5d4c` on white ~6.7:1
✓ (text ok); white on accent ✓.

---

## 4. Spacing, layout, radius

**Spacing scale (rem):** `0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 2.5 · 3.5 · 5 · 7`.
Section vertical rhythm `5rem` (`3.5rem` mobile). Container max `1120px`, pad
`1.5rem`.

**Grid — asymmetric, generous whitespace:**
- Hero: `1.15fr / .85fr` (text / graph-assembly).
- **Signature section grid (NEW for the pinned layout):** scrolling content
  column + sticky graph column, asymmetric — recommend `0.9fr / 1.1fr`
  (text / graph) on desktop; graph sticks with top offset clearing the fixed nav
  (~90px, matches `scroll-margin-top`). Single column on mobile (graph collapses
  to one static shot — Step 5).
- Sub-features: `.m-grid-3` **inside** a section only.

**Radius:** `--m-radius: 8px` (buttons, inputs, cards). Product surfaces (graph
container, chips) ≤ `12–14px`. `99px` reserved for tags/avatars/breathing rings.
No heavy radius on content blocks.

---

## 5. Motion

Calm, intentional, and **only** `opacity` / `transform` / `stroke*` move (no
layout animation → no thrash). Formalize the scale already implied in the CSS:

| Token | Duration | Use |
|---|---|---|
| `--m-dur-fast` | 150ms | Buttons, links, hovers |
| `--m-dur-base` | **400ms** | **Graph state transitions**, section cross-fades |
| `--m-dur-slow` | 500ms | Scroll reveals (`.m-reveal`) |
| `--m-dur-draw` | 900ms | Stroke draw-in, bar fills, hero assembly |
| `--m-ease` | `cubic-bezier(.25,.7,.25,1)` | Entrances / draws |
| `ease` | — | Simple state/hover |

**Allowed to move & why:** scroll reveals (arrival), the graph's state changes
(the product narrative), data-flow dashes (attribution/query "alive"), one pulse
ring (the recommendation). Nothing decorative loops.

**`prefers-reduced-motion`:** the global block at `globals.css:667` already
neutralizes reveals/vignettes — extend the same contract to the graph: appears
pre-assembled, no ambient drift, no flow dashes, section changes become instant
cross-fades. (Verified at Step 5.)

---

## 6. Channel Graph tokens  *(cross-ref `channel-graph-spec.md` §1–2)*

**Principle:** distinguish node **TYPE** by *shape + tone* (stay monochrome);
distinguish **STATE** by *accent + opacity + scale*. This is what lets the accent
mean "the system is pointing here."

### Node types — resting / `idle`
| Type | Shape | Fill | Stroke | Size | Notes |
|---|---|---|---|---|---|
| `vendor` | circle | `--m-ink` | `--m-accent` 2px ring | r≈26 (largest) | The one resting accent touch — the anchor "you" |
| `partner` | circle | `--m-ink` | none | r≈16 | Main population |
| `deal` | rounded square (rx4) | `#fff` | `--m-ink-2` 1.5px | 24×24 | Shape sets it apart from partners |
| `account` | circle | `--m-surface` | `--m-border` 1.5px | r≈13 | Lightest, peripheral |
| `ghost` | circle | none | `--m-muted` dashed (3 2) | r≈16, opacity .5 | Potential partner (Channel TAM) |

Node labels: Space Grotesk `.72rem`, `--m-muted`; `--m-ink` when active.

### Node states (overlay on type)
| State | Transform | Color / opacity | Ring |
|---|---|---|---|
| `forming` | scale .6→1 | opacity 0→1 | — |
| `idle` | scale 1 | opacity 1 | per type |
| `dimmed` | scale 1 | opacity .25, desaturated | — |
| `active` | scale 1.15 | opacity 1 | `--m-accent` 2px |
| `pulse` | scale 1.15 | opacity 1 | `--m-accent` breathing ring (animated r/opacity), **one at a time** |
| `ghost` | — | opacity .5 | dashed `--m-muted` |

### Edge types — resting / `idle`
| Type | Stroke | Width | Dash |
|---|---|---|---|
| `program` | `--m-border` | 1px | solid (baseline, low-contrast) |
| `sourced` | `--m-ink` | 2px | solid (bold) |
| `influenced` | `--m-ink-2` | 1.25px | dashed (4 3) |
| `deal-account` | `--m-border` | 1px | solid (neutral connector) |
| `cosell` | `--m-muted` | 1px | dashed (2 3) |

### Edge states
| State | Treatment |
|---|---|
| `forming` | `stroke-dashoffset` draw-in over `--m-dur-draw` |
| `idle` | per type |
| `dimmed` | opacity .1 |
| `active-flow` | stroke → `--m-accent`, +0.5 width, marching dash loop (the "alive" data flow) |

### Graph chips & badges (reuse existing classes)
- **Evidence chip** ("3 touchpoints — proposed"): white, 1px border, `12px`
  radius, minimal — `.m-float` minus the heavy shadow.
- **Signal badge** (M&A / new practice): `.m-pill` (accent-soft) or
  `.m-pill--line` (outline), Space Grotesk caps.
- **Query / answer chips** (Ask): `.m-chat-q` (accent) / `.m-chat-a` (surface).

### Graph timing
State changes use `--m-dur-base` (400ms) + `--m-ease`; assembly/draw use
`--m-dur-draw`; ambient drift is subtle and CSS-driven, disabled under
reduced-motion.

---

## 7. Reference, not clone

Monaco/product is the touchstone for **editorial confidence, whitespace,
type-forward hierarchy, and section sequencing** — and for the **information
density** the founder asked for (title + sentence sub-features). We take the
discipline and density, **not** the dark palette or any screenshot. Our
signature motif is the Channel Graph, not borrowed UI captures.

---

**GATE:** approve §0 decisions (type direction, light theme, accent-as-state,
graph token mapping) — or redline — before Step 3 (build the graph in isolation).
