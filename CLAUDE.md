# Covant — repo guide

One repository, one product (Covant), shipped as an npm-workspace monorepo:

- **`apps/web`** — the live marketing site (covant.ai). Next.js.
- **`apps/dashboard`** — the product app (dashboard + partner portal). Next.js.
- **`engine/`** — `@covant/engine`: the framework-agnostic, deterministic
  attribution engine. No Convex/Next/React.
- **`convex/`** — shared serverless backend (DB schema + functions). Imports the
  engine; the engine never imports it.
- **`packages/ui`, `packages/lib`** — shared React components and client libs,
  consumed by both apps via `@/components` / `@/lib`.

## Shared rules (apply everywhere)

- **Branch before committing.** Never commit straight to `main`.
- **Never commit secrets.** No API keys, tokens, or `.env*` contents.
- **Run the engine tests before any commit that touches `engine/`** (or
  `convex/lib/attribution`): `npm run test:run`.
- Tests live at the repo root (`tests/`) and run on `engine/`.

Folder-specific rules live in per-folder `CLAUDE.md` files (`apps/web/`,
`engine/`). Read the one nearest the code you're changing.
