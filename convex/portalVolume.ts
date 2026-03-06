import { query } from "./_generated/server";
import { v } from "convex/values";

// Get volume program data for a specific partner
export const getByPartner = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    // Verify partner exists and get org
    const partner = await ctx.db.get(partnerId);
    if (!partner) {
      return { programs: [], volumes: [], leaderboard: [] };
    }

    const orgId = partner.organizationId;

    // Get all active volume programs for this org
    const programs = await ctx.db
      .query("volumePrograms")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", orgId).eq("status", "active")
      )
      .collect();

    if (programs.length === 0) {
      return { programs: [], volumes: [], leaderboard: [] };
    }

    // Get this partner's volume records
    const myVolumes = await ctx.db
      .query("partnerVolumes")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", orgId).eq("partnerId", partnerId)
      )
      .collect();

    // For leaderboard: get all volume records for the active quarterly program
    const quarterlyProgram = programs.find((p) => p.period === "quarterly");
    let leaderboard: {
      partnerId: string;
      partnerName: string;
      unitsTotal: number;
      isMe: boolean;
    }[] = [];

    if (quarterlyProgram) {
      const allVolumes = await ctx.db
        .query("partnerVolumes")
        .withIndex("by_program", (q) => q.eq("programId", quarterlyProgram._id))
        .collect();

      // Sort by units descending
      allVolumes.sort((a, b) => b.unitsTotal - a.unitsTotal);

      // Resolve partner names
      const partnerIds = [...new Set(allVolumes.map((v) => v.partnerId))];
      const partnerMap: Record<string, string> = {};
      for (const pid of partnerIds) {
        const p = await ctx.db.get(pid);
        if (p) partnerMap[pid] = p.name;
      }

      leaderboard = allVolumes.map((v) => ({
        partnerId: v.partnerId,
        partnerName: partnerMap[v.partnerId] || "Partner",
        unitsTotal: v.unitsTotal,
        isMe: v.partnerId === partnerId,
      }));
    }

    return {
      programs: programs.map((p) => ({
        _id: p._id,
        name: p.name,
        period: p.period,
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status,
        tiers: p.tiers,
      })),
      volumes: myVolumes.map((v) => ({
        _id: v._id,
        programId: v.programId,
        period: v.period,
        unitsTotal: v.unitsTotal,
        revenueTotal: v.revenueTotal,
        currentTierIndex: v.currentTierIndex,
        rebateAccrued: v.rebateAccrued,
        rebateProjected: v.rebateProjected,
        lastUpdated: v.lastUpdated,
      })),
      leaderboard,
    };
  },
});
