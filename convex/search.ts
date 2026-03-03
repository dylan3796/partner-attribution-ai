import { query } from "./_generated/server";
import { v } from "convex/values";
import { getOrgId } from "./lib/getOrg";

/**
 * Global search across partners and deals for the command palette.
 * Client-side filtering — returns top 5 partners + top 5 deals matching the query.
 */
export const globalSearch = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return { partners: [], deals: [] };

    const q = args.query.toLowerCase().trim();
    if (!q) return { partners: [], deals: [] };

    // Fetch all partners and deals for this org
    const allPartners = await ctx.db
      .query("partners")
      .withIndex("by_organization", (qb) => qb.eq("organizationId", orgId))
      .collect();

    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (qb) => qb.eq("organizationId", orgId))
      .collect();

    // Filter partners by name, email, type, contact name
    const partners = allPartners
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.contactName?.toLowerCase().includes(q) ||
          p.territory?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        email: p.email,
        type: p.type,
        status: p.status,
        tier: p.tier ?? null,
      }));

    // Filter deals by name, contact, notes
    const deals = allDeals
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.contactName?.toLowerCase().includes(q) ||
          d.contactEmail?.toLowerCase().includes(q) ||
          d.notes?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((d) => ({
        _id: d._id,
        name: d.name,
        amount: d.amount,
        status: d.status,
      }));

    return { partners, deals };
  },
});
