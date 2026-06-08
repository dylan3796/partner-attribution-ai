# apps/web — Covant marketing site

The live marketing site at **covant.ai**. This is the public storefront, not the
product (that's `apps/dashboard`).

## Stack

- Next.js 16 (App Router), React 19.
- Tailwind v4 + custom CSS. Marketing styles are scoped under the `.site`
  wrapper in `globals.css` — restrained, editorial: borders over shadows, one
  accent (deep pine `--m-accent`), one radius. Fonts: Inter (body) + Space
  Grotesk (display).
- Shared UI/components come from `@/components` (packages/ui) and `@/lib`
  (packages/lib). Marketing-only pieces live in `components/marketing/*` and
  `lib/marketing.ts`.
- The only backend call is demo-request lead capture (`RequestDemo` →
  `api.leads.captureLead`); that's why a `ConvexProvider` is in the layout. Do
  not add product/auth features here.

## Voice

Confident, declarative, operator-grounded — written by people who have run
partner programs, not by a marketing template. Lead with the problem and the
judgment, not the feature list. ("Your partners are telling you everything.
None of your tools are listening." / "Partners are signal, not overhead.")
Avoid vendor-speak and hype.

## HARD RULE — no fabricated social proof

Never invent or place customer logos, customer counts, testimonials, named
customers, case studies, star ratings, or specific metrics/percentages —
**ever**. There is none on the site today; it stays that way until it is real
and approved. Illustrative numbers must be unmistakably labeled as examples
(see `AttributionSplitVisual`). When in doubt, leave it out.
