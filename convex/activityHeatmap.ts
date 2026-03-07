/**
 * Activity Heatmap — aggregates daily partner program activity
 * from touchpoints, deals, and audit log for the past ~12 months.
 */
import { query } from "./_generated/server";
import { getOrg } from "./lib/getOrg";

export const getActivity = query({
  args: {},
  handler: async (ctx) => {
    const org = await getOrg(ctx);
    if (!org) return { days: {}, totalEvents: 0 };

    // 365 days ago
    const cutoff = Date.now() - 365 * 24 * 60 * 60 * 1000;

    // Gather timestamps from multiple sources
    const [touchpoints, deals, auditLog] = await Promise.all([
      ctx.db
        .query("touchpoints")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("deals")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
      ctx.db
        .query("audit_log")
        .withIndex("by_organization", (q: any) => q.eq("organizationId", org._id))
        .collect(),
    ]);

    const days: Record<string, { count: number; types: Record<string, number> }> = {};

    function addEvent(timestamp: number, type: string) {
      if (timestamp < cutoff) return;
      const date = new Date(timestamp).toISOString().split("T")[0];
      if (!days[date]) days[date] = { count: 0, types: {} };
      days[date].count++;
      days[date].types[type] = (days[date].types[type] || 0) + 1;
    }

    // Touchpoints
    for (const tp of touchpoints) {
      const ts = tp.createdAt || tp._creationTime;
      if (ts) addEvent(ts, "touchpoint");
    }

    // Deals — creation and close events
    for (const deal of deals) {
      if (deal._creationTime) addEvent(deal._creationTime, "deal_created");
      if (deal.closedAt) addEvent(deal.closedAt, "deal_closed");
    }

    // Audit log
    for (const entry of auditLog) {
      const ts = entry.createdAt || entry._creationTime;
      if (ts) addEvent(ts, "audit");
    }

    let totalEvents = 0;
    for (const d of Object.values(days)) totalEvents += d.count;

    return { days, totalEvents };
  },
});
