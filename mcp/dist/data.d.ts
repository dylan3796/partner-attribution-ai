/**
 * Data layer for the MCP server.
 * In production, this would connect to Convex or another database.
 * For now, it uses the same demo data as the frontend.
 */
export type Partner = {
    id: string;
    name: string;
    email: string;
    type: "affiliate" | "referral" | "reseller" | "integration";
    tier: "bronze" | "silver" | "gold" | "platinum";
    commissionRate: number;
    status: "active" | "inactive" | "pending";
    contactName?: string;
    territory?: string;
    createdAt: number;
};
export type Deal = {
    id: string;
    name: string;
    amount: number;
    status: "open" | "won" | "lost";
    closedAt?: number;
    expectedCloseDate?: number;
    contactName?: string;
    registeredBy?: string;
    createdAt: number;
};
export type Attribution = {
    id: string;
    dealId: string;
    partnerId: string;
    model: string;
    percentage: number;
    amount: number;
    commissionAmount: number;
    calculatedAt: number;
};
export type Payout = {
    id: string;
    partnerId: string;
    amount: number;
    status: string;
    period?: string;
    paidAt?: number;
    createdAt: number;
};
export type AuditEntry = {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: string;
    createdAt: number;
};
export declare const partners: Partner[];
export declare const deals: Deal[];
export declare const attributions: Attribution[];
export declare const payouts: Payout[];
export declare const auditLog: AuditEntry[];
export declare function queryPartners(filters?: {
    status?: string;
    type?: string;
    tier?: string;
    search?: string;
}): Partner[];
export declare function queryDeals(filters?: {
    status?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
}): Deal[];
export declare function getAttributionsForDeal(dealId: string): Attribution[];
export declare function getAttributionsForPartner(partnerId: string): Attribution[];
export declare function queryPayouts(filters?: {
    status?: string;
    partnerId?: string;
}): Payout[];
export declare function getRevenueMetrics(): {
    totalRevenue: number;
    pipelineValue: number;
    wonDeals: number;
    openDeals: number;
    lostDeals: number;
    avgDealSize: number;
    winRate: number;
    totalCommissions: number;
    pendingPayouts: number;
    revenueByPartner: Record<string, number>;
};
export declare function getPartnerScore(partnerId: string): {
    partnerId: string;
    partnerName: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
    overallScore: number;
    revenueScore: number;
    dealScore: number;
    totalRevenue: number;
    totalCommission: number;
    dealCount: number;
} | null;
export declare function getTopPartners(limit?: number): {
    score: number;
    revenue: number;
    id: string;
    name: string;
    email: string;
    type: "affiliate" | "referral" | "reseller" | "integration";
    tier: "bronze" | "silver" | "gold" | "platinum";
    commissionRate: number;
    status: "active" | "inactive" | "pending";
    contactName?: string;
    territory?: string;
    createdAt: number;
}[];
export declare function getAtRiskDeals(): Deal[];
