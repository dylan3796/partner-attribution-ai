# Monorepo deploy — Vercel / DNS / env (manual)

After the monorepo split, the marketing site (`apps/web`) and the product app
(`apps/dashboard`) deploy as **two separate Vercel projects** from this one repo.
These steps require Vercel/DNS access and cannot be done from the codebase.

## 1. Two Vercel projects (same Git repo)

| Project | Root Directory | Domain |
|---|---|---|
| `covant-web` | `apps/web` | `covant.ai` (+ `www`) |
| `covant-dashboard` | `apps/dashboard` | `app.covant.ai` (recommended) |

- In each project: **Settings → General → Root Directory** = the path above, and
  enable **"Include files outside the root directory"** so the workspace
  packages (`packages/*`, `engine/`, `convex/`) and the root lockfile are
  available to the build.
- Install command runs at the repo root (`npm install`) so workspaces hoist.
- Build command: `npm run build` (within the app root) or `next build`.

## 2. DNS

- `covant.ai` / `www.covant.ai` → the `covant-web` project.
- Add `app.covant.ai` (CNAME → Vercel) → the `covant-dashboard` project.

## 3. Environment variables

| Variable | web | dashboard |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | yes (demo-request lead capture) | yes |
| Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, …) | no | yes |
| `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY` | no | yes |
| Salesforce / HubSpot OAuth creds | no | yes |
| `CONVEX_DEPLOY_KEY` | — | wherever `convex deploy` runs (backend deploys once; it is shared) |

The Convex backend (`convex/`) is shared by both apps and is **not** moved or
re-deployed by this split.

## 4. Cross-origin links

Marketing CTAs that point into the product (sign-up, dashboard, setup, apply)
are now cross-origin. Switch root-relative hrefs to absolute URLs driven by an
env var (e.g. `NEXT_PUBLIC_APP_URL=https://app.covant.ai`). Audit:

```
grep -rnE 'href="/(sign-up|sign-in|dashboard|setup|apply|portal)' apps/web
```

## 5. Cutover (reversible)

1. Deploy `covant-dashboard` to `app.covant.ai` and smoke-test (auth, Convex
   queries, an attribution calculation) while `covant.ai` still serves the old
   monolith.
2. Only once the dashboard is verified, point `covant.ai` at `covant-web`.
3. Keep the previous monolith deployment available as a one-cycle rollback.
