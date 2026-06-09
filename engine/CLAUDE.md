# engine — @covant/engine (attribution engine)

Framework-agnostic, deterministic partner attribution. **Zero Convex / Next /
React dependencies.** DB orchestration (`convex/lib/attribution/calculator.ts`)
and output adapters live in `convex/` and import *from* this package — never the
reverse. If you find yourself needing `ctx`, `Id`, `Doc`, or `_generated`, the
code belongs in `convex/`, not here.

## Domain model

The engine operates on plain inputs/outputs; persistence lives in `convex/schema.ts`:

| Concept | In code (`engine/src/types.ts`) | Persisted as (`convex/schema.ts`) |
|---|---|---|
| Attribution target (the won deal) | `AttributionTarget` | `deals` |
| Partner touchpoint | `TouchpointInput` | `touchpoints` |
| Attribution rule (model + config) | `ModelConfig` selected per program | `programs` / `programConfig` |
| Attribution ledger entry | `LedgerEntry` | `attributions` (per-program ledger) |

## Five bounded models — and only five

Defined in `models.ts`, wired in `registry.ts` (`ATTRIBUTION_MODELS`). A program
selects exactly one:

1. `first_touch_sourcer`
2. `split_equally`
3. `role_weighted`
4. `implementation_credit`
5. `marketplace_cosell_hybrid`

**Do not add, remove, or rename a model without explicit sign-off.** The set is
intentionally bounded and self-explaining; the marketing site and product copy
mirror it.

## Invariants

- **Determinism.** Same inputs → identical ledger, always. No `Date.now()`,
  `Math.random()`, locale, or iteration-order dependence inside model logic.
  Time-based models take timestamps as inputs.
- **Multi-program isolation.** A deal runs exactly ONE model (its program's),
  never summed across programs. Ledger rows are tagged with `programId`. In
  `convex/`, every query/mutation is org-scoped via `getOrg`/`getOrgId`
  (`convex/lib/getOrg.ts`) — never read across orgs or programs.
- **No double-counting.** Per program, credit sums to the deal value (within the
  model's rounding contract); a partner with multiple touches is reconciled, not
  counted twice. See `finalizeLedger`.
- **Adapters stay decoupled.** Headless outputs (Salesforce, Slack, CSV, API)
  consume `LedgerEntry` from the engine; keep adapter/transport code out of the
  model functions.

## Before committing engine changes

Run `npm run test:run` (covers all five models + the documented edge cases in
`tests/attribution*.test.ts`). Add/adjust tests for any behavior change.
