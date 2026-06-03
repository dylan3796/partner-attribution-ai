/**
 * Next-moves feed — Convex query layer.
 *
 * Thin wrapper over the pure engine in `convex/lib/nextMoves`: it loads the
 * org's rows and hands them to `generateNextMoves`. Supports both auth paths so
 * it can power the authed dashboard AND the no-auth demo (via the org apiKey),
 * which is also the shape a future MCP tool would call.
 */

import { query } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";
import { getOrgFromApiKey } from "./lib/helpers";
import { generateNextMoves } from "./lib/nextMoves";
import type {
  NMAttribution,
  NMDeal,
  NMPartner,
  NMPayout,
  NMTouchpoint,
} from "./lib/nextMoves/types";

const EMPTY = {
  moves: [],
  counts: { psm: 0, pam: 0, program: 0, ops: 0 },
  generatedAt: 0,
};

/** Well-known email of the standalone "Covant Demo" org (see seedDemo.ts). */
const DEMO_ORG_EMAIL = "demo@covant.ai";

/**
 * Resolve the org for the feed. Precedence:
 *   1. `demo` flag → the shared no-auth demo org (by its well-known email),
 *   2. `apiKey`   → programmatic / MCP access,
 *   3. Clerk session → the signed-in dashboard user.
 * Returns null when none resolve (caller returns an empty feed).
 */
async function resolveOrg(ctx: any, opts: { apiKey?: string; demo?: boolean }) {
  if (opts.demo) {
    return await ctx.db
      .query("organizations")
      .withIndex("by_email", (q: any) => q.eq("email", DEMO_ORG_EMAIL))
      .first();
  }
  if (opts.apiKey) {
    try {
      return await getOrgFromApiKey(ctx, opts.apiKey);
    } catch {
      return null;
    }
  }
  return await getOrg(ctx);
}

async function loadOrgRows(ctx: any, orgId: string) {
  const [partners, deals, touchpoints, attributions, payouts] = await Promise.all([
    ctx.db.query("partners").withIndex("by_organization", (q: any) => q.eq("organizationId", orgId)).collect(),
    ctx.db.query("deals").withIndex("by_organization", (q: any) => q.eq("organizationId", orgId)).collect(),
    ctx.db.query("touchpoints").withIndex("by_organization", (q: any) => q.eq("organizationId", orgId)).collect(),
    ctx.db.query("attributions").withIndex("by_organization", (q: any) => q.eq("organizationId", orgId)).collect(),
    ctx.db.query("payouts").withIndex("by_organization", (q: any) => q.eq("organizationId", orgId)).collect(),
  ]);

  // Project to the engine's plain input shapes (keeps Convex Doc/Id types out of
  // the inferred return type and guarantees a structural match).
  const nmPartners: NMPartner[] = partners.map((p: any) => ({
    _id: p._id, name: p.name, tier: p.tier ?? null, status: p.status ?? null, type: p.type ?? null, createdAt: p.createdAt,
  }));
  const nmDeals: NMDeal[] = deals.map((d: any) => ({
    _id: d._id, name: d.name, amount: d.amount, status: d.status, createdAt: d.createdAt,
    closedAt: d.closedAt ?? null, registeredBy: d.registeredBy ?? null, registrationStatus: d.registrationStatus ?? null,
  }));
  const nmTouchpoints: NMTouchpoint[] = touchpoints.map((t: any) => ({
    _id: t._id, dealId: t.dealId, partnerId: t.partnerId, type: t.type ?? null, createdAt: t.createdAt,
  }));
  const nmAttributions: NMAttribution[] = attributions.map((a: any) => ({
    partnerId: a.partnerId, model: a.model, amount: a.amount,
  }));
  const nmPayouts: NMPayout[] = payouts.map((p: any) => ({
    partnerId: p.partnerId, amount: p.amount, status: p.status, createdAt: p.createdAt,
  }));

  return { nmPartners, nmDeals, nmTouchpoints, nmAttributions, nmPayouts };
}

/**
 * The org-wide "Today's moves" feed.
 */
export const getNextMoves = query({
  args: {
    apiKey: v.optional(v.string()),
    demo: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const org = await resolveOrg(ctx, { apiKey: args.apiKey, demo: args.demo });
    if (!org) return EMPTY;

    const rows = await loadOrgRows(ctx, org._id);
    return generateNextMoves(
      {
        partners: rows.nmPartners,
        deals: rows.nmDeals,
        touchpoints: rows.nmTouchpoints,
        attributions: rows.nmAttributions,
        payouts: rows.nmPayouts,
      },
      {
        limit: args.limit,
        primaryModel: (org as any).defaultAttributionModel ?? "role_weighted",
      }
    );
  },
});

/**
 * The same engine scoped to a single partner — powers the portal "your next
 * move" card. Resolves the org from the partner record (matching the other
 * portal queries' email-session pattern), then returns the moves whose evidence
 * points at this partner.
 */
export const getNextMovesForPartner = query({
  args: {
    partnerId: v.id("partners"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) return EMPTY;

    const org = await ctx.db.get(partner.organizationId);
    const rows = await loadOrgRows(ctx, partner.organizationId);
    const full = generateNextMoves(
      {
        partners: rows.nmPartners,
        deals: rows.nmDeals,
        touchpoints: rows.nmTouchpoints,
        attributions: rows.nmAttributions,
        payouts: rows.nmPayouts,
      },
      { limit: 50, primaryModel: (org as any)?.defaultAttributionModel ?? "role_weighted" }
    );

    const moves = full.moves
      .filter((m) => m.evidence.partnerId === args.partnerId)
      .slice(0, args.limit ?? 5);
    const counts = { psm: 0, pam: 0, program: 0, ops: 0 } as Record<string, number>;
    for (const m of moves) counts[m.agent] += 1;

    return { moves, counts, generatedAt: full.generatedAt };
  },
});
