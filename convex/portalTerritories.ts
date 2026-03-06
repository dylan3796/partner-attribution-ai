import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Get territories assigned to a specific partner
export const getByPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    // Verify partner exists
    const partner = await ctx.db.get(partnerId);
    if (!partner) return { territories: [], conflicts: [], partners: [] };

    const orgId = partner.organizationId;

    // Get territories for this partner
    const territories = await ctx.db
      .query("territories")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", orgId).eq("partnerId", partnerId)
      )
      .collect();

    // Get active conflicts involving this partner
    const allConflicts = await ctx.db
      .query("channelConflicts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const relevantConflicts = allConflicts.filter(
      (c) => c.partnerIds.includes(partnerId)
    );

    // Get all partner names for conflict display
    const partnerIdSet = new Set<string>();
    for (const c of relevantConflicts) {
      for (const pid of c.partnerIds) {
        if (pid !== partnerId) partnerIdSet.add(pid);
      }
    }

    const partnerNames: { id: string; name: string }[] = [];
    for (const pid of partnerIdSet) {
      const p = await ctx.db.get(pid as Id<"partners">);
      if (p) partnerNames.push({ id: p._id, name: p.name });
    }

    // Get deals for account status display
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const dealsByAccount = deals.reduce<Record<string, { status: string }>>((acc, d) => {
      // Match deal name against account names (first word match)
      const firstWord = d.name.split(" ")[0];
      for (const t of territories) {
        for (const acct of t.accounts) {
          if (acct.includes(firstWord) || d.name.includes(acct.split(" ")[0])) {
            acc[acct] = { status: d.status };
          }
        }
      }
      return acc;
    }, {});

    return {
      territories: territories.map((t) => ({
        _id: t._id,
        name: t.name,
        region: t.region,
        accounts: t.accounts,
        isExclusive: t.isExclusive,
        createdAt: t.createdAt,
      })),
      conflicts: relevantConflicts.map((c) => ({
        _id: c._id,
        accountName: c.accountName,
        partnerIds: c.partnerIds,
        status: c.status,
        resolution: c.resolution,
        resolutionNotes: c.resolutionNotes,
        reportedAt: c.reportedAt,
      })),
      partners: partnerNames,
      dealsByAccount,
    };
  },
});
