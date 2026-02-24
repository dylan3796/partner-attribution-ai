import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrg } from "./lib/getOrg";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return [];
    const requests = await ctx.db.query("mdfRequests")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .order("desc")
      .collect();
    // Enrich with partner names
    const partners = await ctx.db.query("partners")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
    const partnerMap = new Map(partners.map((p: any) => [p._id, p]));
    
    return requests.map((r: any) => {
      const partner = partnerMap.get(r.partnerId);
      return { ...r, partnerName: partner?.name ?? "Unknown" };
    });
  },
});

export const create = mutation({
  args: {
    partnerId: v.id("partners"),
    title: v.string(),
    description: v.string(),
    amount: v.number(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("No organization found");
    return await ctx.db.insert("mdfRequests", {
      organizationId: org._id,
      ...args,
      status: "pending",
      submittedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("mdfRequests"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("completed")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, reviewedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("mdfRequests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { totalRequested: 0, pending: 0, approved: 0, rejected: 0, completed: 0 };
    
    const requests = await ctx.db.query("mdfRequests")
      .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
      .collect();
    
    const pending = requests.filter((r: any) => r.status === "pending");
    const approved = requests.filter((r: any) => r.status === "approved");
    const rejected = requests.filter((r: any) => r.status === "rejected");
    const completed = requests.filter((r: any) => r.status === "completed");
    
    return {
      totalRequested: requests.reduce((s: number, r: any) => s + r.amount, 0),
      pendingAmount: pending.reduce((s: number, r: any) => s + r.amount, 0),
      approvedAmount: approved.reduce((s: number, r: any) => s + r.amount, 0) + completed.reduce((s: number, r: any) => s + r.amount, 0),
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      completedCount: completed.length,
      totalCount: requests.length,
    };
  },
});
