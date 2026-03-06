import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Portal Products queries — partner-scoped, real Convex data.
 * Replaces useStore demo data for the portal products page.
 */

export const getProducts = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, { partnerId }) => {
    const partner = await ctx.db.get(partnerId);
    if (!partner) return null;

    // Get all active products for this org
    const products = await ctx.db
      .query("products")
      .withIndex("by_org_and_status", (q) =>
        q.eq("organizationId", partner.organizationId).eq("status", "active")
      )
      .collect();

    // Get commission rules to determine partner-specific rates
    const rules = await ctx.db
      .query("commissionRules")
      .withIndex("by_org_priority", (q) =>
        q.eq("organizationId", partner.organizationId)
      )
      .collect();

    // Sort by priority (lower = higher priority)
    rules.sort((a, b) => a.priority - b.priority);

    // Get deals registered by or associated with this partner (for "sold" counts)
    const allDeals = await ctx.db
      .query("deals")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", partner.organizationId)
      )
      .collect();

    const touchpoints = await ctx.db
      .query("touchpoints")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect();

    const touchpointDealIds = new Set(touchpoints.map((tp) => tp.dealId));
    const partnerDeals = allDeals.filter(
      (d) => d.registeredBy === partnerId || touchpointDealIds.has(d._id)
    );

    // Count deals per product
    const dealsByProduct: Record<string, { total: number; won: number; revenue: number }> = {};
    for (const deal of partnerDeals) {
      const productName = deal.productName || "Untagged";
      if (!dealsByProduct[productName]) {
        dealsByProduct[productName] = { total: 0, won: 0, revenue: 0 };
      }
      dealsByProduct[productName].total++;
      if (deal.status === "won") {
        dealsByProduct[productName].won++;
        dealsByProduct[productName].revenue += deal.amount;
      }
    }

    // Find the best matching commission rate for this partner per product
    const partnerType = partner.type as string | undefined;
    const partnerTier = partner.tier as string | undefined;

    const productsWithContext = products.map((product) => {
      // Find the most specific matching commission rule for this product + partner
      let matchedRate: number | null = null;

      for (const rule of rules) {
        // Check partner type match
        if (rule.partnerType && rule.partnerType !== partnerType) continue;
        // Check partner tier match
        if (rule.partnerTier && rule.partnerTier !== partnerTier) continue;
        // Check product line match
        if (rule.productLine && rule.productLine !== product.name && rule.productLine !== product.category) continue;

        matchedRate = rule.rate;
        break; // First match wins (sorted by priority)
      }

      const dealStats = dealsByProduct[product.name] || { total: 0, won: 0, revenue: 0 };

      return {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        msrp: product.msrp,
        distributorPrice: product.distributorPrice,
        margin: product.margin,
        description: product.description,
        commissionRate: matchedRate,
        dealsTotal: dealStats.total,
        dealsWon: dealStats.won,
        revenue: dealStats.revenue,
      };
    });

    // Get unique categories
    const categories = [...new Set(products.map((p) => p.category))].sort();

    return {
      products: productsWithContext,
      categories,
      totalProducts: products.length,
      partnerTier: partnerTier || "bronze",
      partnerType: partnerType || "reseller",
      defaultCommissionRate: partner.commissionRate, // 0-1 scale
    };
  },
});
