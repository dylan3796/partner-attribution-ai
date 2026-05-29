/**
 * Migrations for the bounded-attribution-models change.
 *
 * migrateAttributionModels brings legacy data onto the new canonical model set
 * and the 0-100 percentage convention. Run once per deployment AFTER deploying
 * the schema (whose model union still accepts the legacy literals):
 *
 *   npx convex run migrations:migrateAttributionModels
 */

import { internalMutation, mutation } from "./_generated/server";

// Old model literal -> new canonical model (last_touch / time_decay are dropped).
const MODEL_MAP: Record<string, string | null> = {
  role_based: "role_weighted",
  role_split: "role_weighted",
  first_touch: "first_touch_sourcer",
  source_wins: "first_touch_sourcer",
  deal_reg_protection: "first_touch_sourcer",
  equal_split: "split_equally",
  last_touch: null, // not in the bounded set -> delete
  time_decay: null, // not in the bounded set -> delete
};

const BOUNDED = new Set([
  "first_touch_sourcer",
  "split_equally",
  "role_weighted",
  "implementation_credit",
  "marketplace_cosell_hybrid",
]);

async function run(ctx: any) {
  // 1. Ensure every org has a default program (so the calculator can resolve one).
  const orgs = await ctx.db.query("organizations").collect();
  const defaultProgramByOrg = new Map<string, string>();
  for (const org of orgs) {
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
    let def = programs.find((p: any) => p.isDefault) ?? programs[0];
    if (!def) {
      const id = await ctx.db.insert("programs", {
        organizationId: org._id,
        name: "Default Program",
        archetype: "other",
        selectedModel: (org.defaultAttributionModel && BOUNDED.has(org.defaultAttributionModel)
          ? org.defaultAttributionModel
          : MODEL_MAP[org.defaultAttributionModel as string] ?? "role_weighted"),
        isDefault: true,
        createdAt: Date.now(),
      });
      def = await ctx.db.get(id);
    }
    if (def) defaultProgramByOrg.set(org._id, def._id);

    // Normalize org default model to a bounded value.
    if (org.defaultAttributionModel && !BOUNDED.has(org.defaultAttributionModel)) {
      const mapped = MODEL_MAP[org.defaultAttributionModel] ?? "role_weighted";
      await ctx.db.patch(org._id, { defaultAttributionModel: mapped });
    }
  }

  // 2. Backfill deal.programId for deals without one.
  let dealsTagged = 0;
  const deals = await ctx.db.query("deals").collect();
  for (const deal of deals) {
    if (!deal.programId) {
      const pid = defaultProgramByOrg.get(deal.organizationId);
      if (pid) {
        await ctx.db.patch(deal._id, { programId: pid });
        dealsTagged++;
      }
    }
  }

  // 3. Migrate attribution rows: model literal, percentage scale, programId.
  let migrated = 0;
  let deleted = 0;
  const attributions = await ctx.db.query("attributions").collect();
  for (const attr of attributions) {
    const mapped = BOUNDED.has(attr.model) ? attr.model : MODEL_MAP[attr.model];
    if (mapped === null || mapped === undefined) {
      await ctx.db.delete(attr._id);
      deleted++;
      continue;
    }
    const patch: Record<string, unknown> = {};
    if (mapped !== attr.model) patch.model = mapped;
    if (attr.percentage <= 1) patch.percentage = attr.percentage * 100; // decimal -> 0-100
    if (!attr.programId) {
      const pid = defaultProgramByOrg.get(attr.organizationId);
      if (pid) patch.programId = pid;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(attr._id, patch);
      migrated++;
    }
  }

  return { orgs: orgs.length, dealsTagged, attributionsMigrated: migrated, attributionsDeleted: deleted };
}

/** Public entrypoint: npx convex run migrations:migrateAttributionModels */
export const migrateAttributionModels = mutation({
  args: {},
  handler: async (ctx) => run(ctx),
});

/** Internal variant for scheduled/programmatic use. */
export const migrateAttributionModelsInternal = internalMutation({
  args: {},
  handler: async (ctx) => run(ctx),
});
