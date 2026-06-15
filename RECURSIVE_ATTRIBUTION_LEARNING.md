# Recursive Attribution Learning — Design Spec

**Status:** Proposed · **Branch:** `claude/attribution-recursive-learning-rcpkmj`
**Owner:** Dylan · **Last updated:** 2026-06-15

---

## 1. The idea in one sentence

Every time a human judge approves, overrides, or rejects an attribution
recommendation **and tells us why**, that decision becomes a labeled signal the
recommender consults next time — so the *first* recommendation gets steadily
better at calling **whatever the customer measures** without a human in the
loop, while the guardrails never come off.

The goal is not a black box that drifts toward "99% accuracy." It's a
**deterministic, explainable feedback loop**: every recommendation can still
point to *exactly why* it was made, and now one of those reasons can be _"the
last 14 times your team saw this pattern on an SI deal, they ruled it
influenced, not sourced."_

### The category being judged is the customer's, not ours

A critical framing correction: **sourced vs. influenced is just the most common
example, not the contract.** Different programs measure credit on different
axes — `sourced / influenced`, `primary / secondary / assist`,
`registered / co-sell / services-led`, or some bespoke bucket a RevOps team
invented. The loop must learn against **the customer's own taxonomy**, never a
vocabulary we impose.

Keep two things separate:

- **The credit math stays bounded and defensible.** The 5 canonical models
  produce the actual percentage split. We do *not* let customers invent payout
  math — that's the whole "bounded set of correct models" philosophy, and it's
  what keeps a dollar figure defensible in a dispute.
- **The taxonomy — the labels credit is bucketed into, and the thing judges
  actually rule on — is customer-configured.** This is what the loop learns and
  what every recommendation is reported in. `sourcer`/`influencer` (our internal
  role enum) becomes *one possible mapping*, the default, not the schema.

This was an explicit fork in the road (see §7). We are deliberately **not**
training an opaque ML model, because attribution drives payouts and disputes —
a credit decision a partner manager can't defend in front of a partner is worse
than no automation at all.

---

## 2. Where this plugs into what already exists

The raw materials are already in the codebase. This feature is mostly *wiring
them together*, not new infrastructure.

| Piece | Lives in | Role in the loop |
|---|---|---|
| Bounded model recommender | `convex/lib/attribution/recommender.ts` | Today: static keyword rules pick 1 of 5 models. Becomes: rules **+ learned precedent**. |
| Default category derivation | `convex/lib/attribution/roles.ts` (`DEFAULT_ROLE_MAP`) | `deal_registration / referral / introduction → sourcer`; `co_sell / demo / content_share → influencer`. This is the *default* taxonomy + map the loop learns to adjust **per org** — an org can rename or re-bucket it. |
| Default role taxonomy | `convex/lib/attribution/types.ts` (`AttributionRole`) | The built-in 4-category scheme. `sourcer` ≈ "partner source", `influencer` ≈ "partner influenced" — the default a customer inherits until they define their own. |
| Attribution ledger | `attributions` table (`schema.ts:173`), each row has a `reason` | The thing being judged. |
| Judge-with-reason pattern | `convex/tierReviews.ts` + `audit_log` | The exact approve/reject/defer + `notes` + audit pattern we copy — it's just pointed at tier changes today, not attribution calls. |
| Per-program config | `programs.modelConfig` (`schema.ts:584`) | Where learned `roleMap` overrides eventually land. |

**The gap that makes it "recursive":** today a judge's reasoning dies in a
free-text `notes` field. Nothing reads it back. This spec wires that reasoning
into the next recommendation.

---

## 3. The loop

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                   │
  │   1. Recommender proposes credit + confidence + cited precedent   │
  │                              │                                     │
  │                              ▼                                     │
  │   2. Guardrail gate: confidence ≥ threshold AND no hard rule?     │
  │            │ yes → auto-approve        │ no → route to a judge     │
  │            ▼                           ▼                           │
  │   (logged, reversible)        3. Judge approves / overrides        │
  │            │                     + picks a REASON CODE + note      │
  │            │                           │                           │
  │            └───────────┬───────────────┘                          │
  │                        ▼                                           │
  │   4. Decision captured as a labeled signal (attributionDecisions) │
  │                        │                                           │
  │                        ▼                                           │
  │   5. Signals aggregated into per-org precedent patterns           │
  │                        │                                           │
  │                        └──────────────► feeds step 1 next time     │
  │                                                                    │
  └─────────────────────────────────────────────────────────────────┘
```

The key property: **step 5 only ever produces explainable adjustments** — a
shifted `roleMap`, a confidence delta, a surfaced precedent string. It never
produces a weight no human can trace.

---

## 4. Data model (proposed new tables)

### 4.1 `attributionTaxonomies` — the customer's categories

Defines the buckets a given org/program measures credit in. Seeded from our
default 4-category scheme (`sourcer`/`influencer`/`implementer`/`closer`) so a
customer who never touches it behaves exactly like today — but fully
re-labelable and re-bucketable. Everything downstream references a
`categoryKey` from here, never a hardcoded role literal.

```ts
attributionTaxonomies: defineTable({
  organizationId: v.id("organizations"),
  programId: v.optional(v.id("programs")),  // null = org-wide default
  categories: v.array(v.object({
    key: v.string(),          // stable id, e.g. "sourced" | "influenced" | "assist"
    label: v.string(),        // display name the customer chose
    // optional mapping back to the engine's internal role, for credit math
    mapsToRole: v.optional(v.union(
      v.literal("sourcer"), v.literal("influencer"),
      v.literal("implementer"), v.literal("closer"),
    )),
  })),
  isDefault: v.boolean(),     // true = the built-in scheme, untouched
  updatedAt: v.number(),
})
  .index("by_organization", ["organizationId"])
  .index("by_org_and_program", ["organizationId", "programId"]),
```

The `mapsToRole` field is the bridge: the customer's vocabulary is what judges
and the loop work in, but the bounded models still need a role to compute the
percentage split. A category with no mapping is purely a measurement label.

### 4.2 `attributionDecisions` — the labeled signal store

One row per human judgment on a recommendation. This is the training corpus,
but it's queryable plain English, not tensors.

```ts
attributionDecisions: defineTable({
  organizationId: v.id("organizations"),
  dealId: v.id("deals"),
  partnerId: v.id("partners"),
  programId: v.optional(v.id("programs")),

  // What the engine proposed — categoryKey references attributionTaxonomies,
  // NOT a hardcoded role. For most orgs this resolves to "sourced"/"influenced",
  // but it's whatever that customer measures.
  recommendedCategoryKey: v.string(),
  recommendedPercentage: v.number(),
  recommendedReason: v.string(),        // the engine's explanation at decision time
  confidenceAtRecommendation: v.number(), // 0-1, what the engine believed

  // What the human decided
  action: v.union(
    v.literal("approved"),              // engine was right
    v.literal("overridden"),            // human changed the category/split
    v.literal("rejected"),              // no credit / wrong partner
  ),
  finalCategoryKey: v.optional(v.string()), // the bucket the judge landed on
  finalPercentage: v.optional(v.number()),

  // WHY — the part that makes learning possible
  reasonCode: v.union(                  // structured, pickable, aggregatable
    v.literal("late_stage_touch"),      // touched only after deal was sourced → influenced
    v.literal("no_material_influence"),
    v.literal("sourced_pre_pipeline"),  // first touch before opp existed → source
    v.literal("cosell_not_source"),     // co-sell ≠ origination
    v.literal("duplicate_partner"),
    v.literal("relationship_owner"),
    v.literal("other"),
  ),
  reasonNote: v.optional(v.string()),   // free text, for "other" + nuance

  // Signal context — the features a pattern can key on
  signalContext: v.string(),            // JSON: { archetype, touchpointTypes[], dealSizeBucket, partnerType, stageAtTouch }

  reviewedBy: v.optional(v.string()),   // Clerk userId
  reviewedAt: v.number(),
})
  .index("by_organization", ["organizationId"])
  .index("by_org_and_program", ["organizationId", "programId"])
  .index("by_deal", ["dealId"])
  .index("by_reason", ["organizationId", "reasonCode"]),
```

**Why a structured `reasonCode` and not just free text:** "intake reasons from
the judges" only becomes learnable if reasons are *aggregatable*. Free text
alone can't drive a deterministic rule. A small, curated enum of reason codes
(plus an optional note) is the difference between a dataset and a comment
thread. The enum starts tiny and grows as real override reasons cluster.

### 4.3 `attributionPrecedents` — the learned, materialized patterns

The aggregate the recommender actually reads at runtime. Recomputed
(incrementally or on a schedule) from `attributionDecisions`. This table is
**derived and disposable** — you can always rebuild it from the decision log,
which keeps the system auditable and lets us change the aggregation logic
without losing history.

```ts
attributionPrecedents: defineTable({
  organizationId: v.id("organizations"),
  programId: v.optional(v.id("programs")),

  // The pattern key (the "when")
  patternKey: v.string(),               // e.g. "archetype=si|touch=co_sell|stage=post_qualified"

  // What the org consistently decides for this pattern (the "then")
  dominantCategoryKey: v.string(),      // references attributionTaxonomies
  agreementRate: v.number(),            // 0-1: share of decisions agreeing with dominantCategoryKey
  sampleSize: v.number(),               // how many decisions back this
  topReasonCode: v.string(),            // most common reason → surfaced as the "because"

  lastUpdatedAt: v.number(),
})
  .index("by_org_and_program", ["organizationId", "programId"])
  .index("by_pattern", ["organizationId", "patternKey"]),
```

---

## 5. How the recommender uses precedent

`recommendModel()` / role derivation stays a pure function. We extend it to
optionally accept precedent and return confidence:

```ts
interface ModelRecommendation {
  model: AttributionModel;
  archetype: ProgramArchetype;
  rationale: string;
  confidence: number;        // NEW: 0-1
  precedentCited?: {         // NEW: the learned "because", when one applied
    patternKey: string;
    agreementRate: number;
    sampleSize: number;
    reasonCode: string;
  };
}
```

Decision order (first match wins, most-specific to least):

1. **Hard guardrail rules** — non-negotiable, never learnable. (e.g. a partner
   with a registered deal_registration before pipeline creation is *always*
   eligible as sourcer; crm_sync is *never* qualifying.) These cap what the
   loop is allowed to conclude.
2. **Org precedent** — if a matching `attributionPrecedents` row exists with
   `sampleSize ≥ N` and `agreementRate ≥ A`, use its `dominantCategoryKey`
   (resolved through the org's taxonomy), set confidence from agreement rate,
   and cite the precedent in the rationale.
3. **Default category map / keyword rules** — today's behavior, used when
   there's no precedent yet. Confidence is a fixed baseline.

A fresh org with zero decisions behaves **exactly like today** — the loop is
purely additive. Accuracy improves as the decision log fills, org by org. No
global model, no cross-tenant leakage of one customer's calls into another's.

---

## 6. Guardrails (these never come off)

The user's words: *"we'll always have the guardrails."* Concretely:

- **Confidence threshold for auto-approval is a setting, default conservative.**
  Below it → always routed to a human. Auto-approve starts *off* per org; a
  customer opts in once they trust it.
- **Hard rules outrank precedent.** The loop can re-weight ambiguous calls; it
  cannot override a compliance/eligibility rule. Step 1 above always wins.
- **Every auto-approval is logged to `audit_log` and is reversible.** Same
  pattern as `tierReviews`. Nothing the loop does is silent or final.
- **Precedent needs a minimum sample size** before it influences anything —
  no learning from a single override.
- **A human can always override, and that override is itself a new signal** —
  if the engine "learned" something wrong, the next correction reverses it.
- **`attributionPrecedents` is fully rebuildable from `attributionDecisions`** —
  if aggregation logic is ever wrong, we recompute; we never lose ground truth.

---

## 7. The decision we made, and the one we rejected

**Chosen: explainable feedback loop.** Deterministic, auditable, every call
traceable to either a rule or a cited precedent. Trends toward high first-pass
accuracy without becoming a black box. Fits the existing "bounded, explainable"
philosophy in `recommender.ts` and `types.ts`.

**Rejected: statistical/ML scoring.** Higher theoretical accuracy ceiling, but
(a) hard to defend in a payout dispute — "the model said so" is not an answer a
partner manager can give a partner; (b) needs training/drift/monitoring infra;
(c) risks silent drift in a system that moves money. We can revisit a *hybrid*
(rules as guardrail, learned confidence for routing) later — the data model
here already produces the labeled corpus a hybrid would need, so this is not a
dead end.

---

## 8. Build sequence (each step ships independently)

1. **Capture.** Add `attributionTaxonomies` (seeded with the default scheme) +
   `attributionDecisions`; build the judge UI on the attribution review screen —
   approve/override into the org's own categories + **reason code picker** + note.
   *Value even with zero learning:* a structured, auditable record of every
   credit decision and the reasoning behind it. (This is the natural next PR.)
2. **Aggregate.** Build the `attributionDecisions → attributionPrecedents`
   rollup (scheduled or incremental). Read-only; surfaces "your team's
   patterns" in the UI before it touches recommendations.
3. **Consume.** Extend the recommender to read precedent, return `confidence` +
   `precedentCited`. Recommendations now show *"because your team ruled this way
   N times."* Still 100% human-approved.
4. **Auto-approve gate.** Add the confidence threshold setting + guardrail gate.
   Opt-in per org. Auto-approvals logged and reversible. This is where the
   "right recommendation forward first, without extra intervention" lands.

---

## 9. Open questions for the team

- **Category taxonomy UX:** §4.1 makes the buckets customer-defined. Open
  question is how much we let them customize at launch — pick from a few preset
  schemes (sourced/influenced, primary/secondary/assist, …) vs. fully freeform.
  Freeform is more flexible but every custom category needs a `mapsToRole` to
  drive the credit math. Likely start with presets + rename.
- **Reason-code taxonomy:** §4.2 lists a starter set. The real list should come
  from looking at how your design partners actually phrase overrides. Worth a
  short discovery pass before locking the enum.
- **Precedent scope:** per-program (proposed) vs. per-org. Per-program is
  cleaner (an SI program and a reseller program shouldn't share precedent) but
  needs more decisions to reach significance. Could start per-org and split.
- **Thresholds:** what `sampleSize` (N) and `agreementRate` (A) make a
  precedent "trusted"? Needs real data; start conservative (e.g. N≥10, A≥0.8).
- **Cold start across orgs:** strictly no cross-tenant learning at launch. Could
  later offer opt-in anonymized *defaults* — but that's a separate trust/privacy
  decision, not assumed here.
