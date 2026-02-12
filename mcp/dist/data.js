/**
 * Data layer for the MCP server.
 * In production, this would connect to Convex or another database.
 * For now, it uses the same demo data as the frontend.
 */
const now = Date.now();
const day = 86400000;
// ── Demo Data ──
export const partners = [
    { id: "p_001", name: "TechStar Solutions", email: "partnerships@techstar.io", type: "reseller", tier: "gold", commissionRate: 18, status: "active", contactName: "Sarah Anderson", territory: "West Coast", createdAt: now - 85 * day },
    { id: "p_002", name: "CloudBridge Partners", email: "deals@cloudbridge.co", type: "referral", tier: "silver", commissionRate: 15, status: "active", contactName: "Marcus Johnson", territory: "East Coast", createdAt: now - 80 * day },
    { id: "p_003", name: "DataPipe Agency", email: "partner@datapipe.dev", type: "integration", tier: "gold", commissionRate: 12, status: "active", contactName: "Elena Rodriguez", territory: "National", createdAt: now - 75 * day },
    { id: "p_004", name: "NexGen Resellers", email: "channel@nexgen.com", type: "reseller", tier: "platinum", commissionRate: 20, status: "active", contactName: "James Chen", territory: "APAC", createdAt: now - 60 * day },
    { id: "p_005", name: "GrowthLabs Co", email: "referrals@growthlabs.co", type: "referral", tier: "silver", commissionRate: 14, status: "active", contactName: "Priya Patel", territory: "Mid-Market", createdAt: now - 50 * day },
    { id: "p_006", name: "ChannelForce Inc", email: "ops@channelforce.io", type: "reseller", tier: "bronze", commissionRate: 16, status: "pending", contactName: "David Kim", territory: "Central", createdAt: now - 10 * day },
    { id: "p_007", name: "IntegrateHub", email: "team@integratehub.com", type: "affiliate", tier: "bronze", commissionRate: 8, status: "inactive", contactName: "Lisa Wang", createdAt: now - 120 * day },
];
export const deals = [
    { id: "d_001", name: "Enterprise CRM Suite — Globex Corp", amount: 120000, status: "won", closedAt: now - 5 * day, contactName: "John Smith", createdAt: now - 45 * day },
    { id: "d_002", name: "Analytics Platform — Initech", amount: 85000, status: "won", closedAt: now - 12 * day, contactName: "Bill Lumbergh", createdAt: now - 60 * day },
    { id: "d_003", name: "API Integration — Soylent Corp", amount: 45000, status: "won", closedAt: now - 20 * day, createdAt: now - 55 * day },
    { id: "d_004", name: "Data Pipeline — Umbrella Inc", amount: 200000, status: "open", expectedCloseDate: now + 30 * day, contactName: "Alice Wesker", registeredBy: "p_001", createdAt: now - 15 * day },
    { id: "d_005", name: "Monitoring Solution — Wayne Enterprises", amount: 150000, status: "open", expectedCloseDate: now + 45 * day, registeredBy: "p_005", createdAt: now - 8 * day },
    { id: "d_006", name: "Security Audit Tool — Stark Industries", amount: 95000, status: "open", expectedCloseDate: now + 15 * day, registeredBy: "p_004", createdAt: now - 3 * day },
    { id: "d_007", name: "Legacy Migration — Cyberdyne Systems", amount: 60000, status: "lost", closedAt: now - 25 * day, createdAt: now - 70 * day },
    { id: "d_008", name: "Cloud Hosting — Oscorp", amount: 35000, status: "lost", closedAt: now - 30 * day, createdAt: now - 65 * day },
    { id: "d_009", name: "DevOps Suite — Massive Dynamic", amount: 175000, status: "won", closedAt: now - 2 * day, contactName: "Walter Bishop", createdAt: now - 30 * day },
    { id: "d_010", name: "Compliance Platform — Dunder Mifflin", amount: 55000, status: "won", closedAt: now - 35 * day, createdAt: now - 80 * day },
];
export const attributions = [
    // Simplified role_based attributions for won deals
    { id: "attr_001", dealId: "d_001", partnerId: "p_001", model: "role_based", percentage: 38, amount: 45600, commissionAmount: 8208, calculatedAt: now - 5 * day },
    { id: "attr_002", dealId: "d_001", partnerId: "p_003", model: "role_based", percentage: 23, amount: 27600, commissionAmount: 3312, calculatedAt: now - 5 * day },
    { id: "attr_003", dealId: "d_001", partnerId: "p_002", model: "role_based", percentage: 9, amount: 10800, commissionAmount: 1620, calculatedAt: now - 5 * day },
    { id: "attr_004", dealId: "d_001", partnerId: "p_004", model: "role_based", percentage: 30, amount: 36000, commissionAmount: 7200, calculatedAt: now - 5 * day },
    { id: "attr_005", dealId: "d_002", partnerId: "p_005", model: "role_based", percentage: 52, amount: 44200, commissionAmount: 6188, calculatedAt: now - 12 * day },
    { id: "attr_006", dealId: "d_002", partnerId: "p_003", model: "role_based", percentage: 23, amount: 19550, commissionAmount: 2346, calculatedAt: now - 12 * day },
    { id: "attr_007", dealId: "d_002", partnerId: "p_005", model: "role_based", percentage: 25, amount: 21250, commissionAmount: 2975, calculatedAt: now - 12 * day },
    { id: "attr_008", dealId: "d_003", partnerId: "p_003", model: "role_based", percentage: 78, amount: 35100, commissionAmount: 4212, calculatedAt: now - 20 * day },
    { id: "attr_009", dealId: "d_003", partnerId: "p_002", model: "role_based", percentage: 22, amount: 9900, commissionAmount: 1485, calculatedAt: now - 20 * day },
    { id: "attr_010", dealId: "d_009", partnerId: "p_001", model: "role_based", percentage: 30, amount: 52500, commissionAmount: 9450, calculatedAt: now - 2 * day },
    { id: "attr_011", dealId: "d_009", partnerId: "p_003", model: "role_based", percentage: 25, amount: 43750, commissionAmount: 5250, calculatedAt: now - 2 * day },
    { id: "attr_012", dealId: "d_009", partnerId: "p_004", model: "role_based", percentage: 25, amount: 43750, commissionAmount: 8750, calculatedAt: now - 2 * day },
    { id: "attr_013", dealId: "d_009", partnerId: "p_005", model: "role_based", percentage: 20, amount: 35000, commissionAmount: 4900, calculatedAt: now - 2 * day },
    { id: "attr_014", dealId: "d_010", partnerId: "p_002", model: "role_based", percentage: 33, amount: 18150, commissionAmount: 2722, calculatedAt: now - 35 * day },
    { id: "attr_015", dealId: "d_010", partnerId: "p_005", model: "role_based", percentage: 34, amount: 18700, commissionAmount: 2618, calculatedAt: now - 35 * day },
    { id: "attr_016", dealId: "d_010", partnerId: "p_001", model: "role_based", percentage: 33, amount: 18150, commissionAmount: 3267, calculatedAt: now - 35 * day },
];
export const payouts = [
    { id: "pay_001", partnerId: "p_001", amount: 12450, status: "paid", period: "2026-01", paidAt: now - 3 * day, createdAt: now - 10 * day },
    { id: "pay_002", partnerId: "p_002", amount: 8920, status: "paid", period: "2026-01", paidAt: now - 3 * day, createdAt: now - 10 * day },
    { id: "pay_003", partnerId: "p_003", amount: 5630, status: "approved", period: "2026-01", createdAt: now - 5 * day },
    { id: "pay_004", partnerId: "p_004", amount: 15200, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
    { id: "pay_005", partnerId: "p_005", amount: 6800, status: "pending_approval", period: "2026-02", createdAt: now - 1 * day },
];
export const auditLog = [
    { id: "al_001", action: "deal.closed", entityType: "deal", entityId: "d_009", metadata: '{"status":"open→won"}', createdAt: now - 2 * day },
    { id: "al_002", action: "attribution.calculated", entityType: "attribution", entityId: "d_009", metadata: '{"model":"role_based","partners":"4"}', createdAt: now - 2 * day },
    { id: "al_003", action: "payout.created", entityType: "payout", entityId: "pay_004", metadata: '{"partner":"NexGen Resellers","amount":"$15,200"}', createdAt: now - 1 * day },
    { id: "al_004", action: "partner.updated", entityType: "partner", entityId: "p_001", metadata: '{"tier":"silver→gold"}', createdAt: now - 5 * day },
    { id: "al_005", action: "deal.registered", entityType: "deal", entityId: "d_006", metadata: '{"registeredBy":"NexGen Resellers"}', createdAt: now - 3 * day },
];
// ── Query Functions ──
export function queryPartners(filters) {
    let result = [...partners];
    if (filters?.status)
        result = result.filter(p => p.status === filters.status);
    if (filters?.type)
        result = result.filter(p => p.type === filters.type);
    if (filters?.tier)
        result = result.filter(p => p.tier === filters.tier);
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
    }
    return result;
}
export function queryDeals(filters) {
    let result = [...deals];
    if (filters?.status)
        result = result.filter(d => d.status === filters.status);
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(d => d.name.toLowerCase().includes(q));
    }
    if (filters?.minAmount != null)
        result = result.filter(d => d.amount >= filters.minAmount);
    if (filters?.maxAmount != null)
        result = result.filter(d => d.amount <= filters.maxAmount);
    return result;
}
export function getAttributionsForDeal(dealId) {
    return attributions.filter(a => a.dealId === dealId);
}
export function getAttributionsForPartner(partnerId) {
    return attributions.filter(a => a.partnerId === partnerId);
}
export function queryPayouts(filters) {
    let result = [...payouts];
    if (filters?.status)
        result = result.filter(p => p.status === filters.status);
    if (filters?.partnerId)
        result = result.filter(p => p.partnerId === filters.partnerId);
    return result;
}
export function getRevenueMetrics() {
    const wonDeals = deals.filter(d => d.status === "won");
    const openDeals = deals.filter(d => d.status === "open");
    const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
    const avgDealSize = wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0;
    const winRate = deals.filter(d => d.status !== "open").length > 0
        ? Math.round((wonDeals.length / deals.filter(d => d.status !== "open").length) * 100)
        : 0;
    // Revenue by partner
    const revenueByPartner = {};
    for (const a of attributions) {
        const partner = partners.find(p => p.id === a.partnerId);
        if (partner) {
            revenueByPartner[partner.name] = (revenueByPartner[partner.name] || 0) + a.amount;
        }
    }
    return {
        totalRevenue,
        pipelineValue,
        wonDeals: wonDeals.length,
        openDeals: openDeals.length,
        lostDeals: deals.filter(d => d.status === "lost").length,
        avgDealSize,
        winRate,
        totalCommissions: attributions.reduce((s, a) => s + a.commissionAmount, 0),
        pendingPayouts: payouts.filter(p => p.status === "pending_approval").reduce((s, p) => s + p.amount, 0),
        revenueByPartner,
    };
}
export function getPartnerScore(partnerId) {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner)
        return null;
    const partnerAttrs = attributions.filter(a => a.partnerId === partnerId);
    const totalRevenue = partnerAttrs.reduce((s, a) => s + a.amount, 0);
    const totalCommission = partnerAttrs.reduce((s, a) => s + a.commissionAmount, 0);
    const dealCount = new Set(partnerAttrs.map(a => a.dealId)).size;
    // Simple scoring
    const revenueScore = Math.min(100, Math.round((totalRevenue / 120000) * 100));
    const dealScore = Math.min(100, dealCount * 25);
    const overallScore = Math.round(revenueScore * 0.6 + dealScore * 0.4);
    return {
        partnerId,
        partnerName: partner.name,
        tier: partner.tier,
        overallScore,
        revenueScore,
        dealScore,
        totalRevenue,
        totalCommission,
        dealCount,
    };
}
export function getTopPartners(limit = 5) {
    return partners
        .filter(p => p.status === "active")
        .map(p => {
        const score = getPartnerScore(p.id);
        return { ...p, score: score?.overallScore || 0, revenue: score?.totalRevenue || 0 };
    })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}
export function getAtRiskDeals() {
    return deals.filter(d => {
        if (d.status !== "open")
            return false;
        if (d.expectedCloseDate && d.expectedCloseDate < now + 14 * day)
            return true;
        return false;
    });
}
//# sourceMappingURL=data.js.map