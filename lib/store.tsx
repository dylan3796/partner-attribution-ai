"use client";
import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Organization, Partner, Deal, Touchpoint, Attribution, Payout, AuditEntry, AttributionModel, Certification, Badge, TrainingCompletion, SkillEndorsement } from "./types";
import { demoOrg, demoPartners, demoDeals, demoTouchpoints, demoAttributions, demoPayouts, demoAuditLog, enrichTouchpoints, enrichAttributions, generateAttributionsForDeal } from "./demo-data";
import { demoCertifications, demoBadges, demoTrainingCompletions, demoSkillEndorsements } from "./certifications-data";

type StoreContextType = {
  org: Organization;
  updateOrg: (updates: Partial<Organization>) => void;
  partners: Partner[];
  getPartner: (id: string) => Partner | undefined;
  addPartner: (p: Omit<Partner, "_id" | "organizationId" | "createdAt">) => Partner;
  updatePartner: (id: string, updates: Partial<Partner>) => void;
  deals: Deal[];
  getDeal: (id: string) => Deal | undefined;
  addDeal: (d: Omit<Deal, "_id" | "organizationId" | "createdAt">) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  closeDeal: (id: string, status: "won" | "lost") => void;
  touchpoints: Touchpoint[];
  getTouchpointsByDeal: (dealId: string) => Touchpoint[];
  getTouchpointsByPartner: (partnerId: string) => Touchpoint[];
  addTouchpoint: (tp: Omit<Touchpoint, "_id" | "organizationId" | "createdAt">) => Touchpoint;
  attributions: Attribution[];
  getAttributionsByDeal: (dealId: string) => Attribution[];
  getAttributionsByPartner: (partnerId: string) => Attribution[];
  getAttributionsByModel: (model: AttributionModel) => Attribution[];
  payouts: Payout[];
  approvePayout: (id: string) => void;
  rejectPayout: (id: string, notes?: string) => void;
  markPayoutPaid: (id: string) => void;
  createPayout: (data: { partnerId: string; amount: number; period: string; notes?: string }) => Payout;
  certifications: Certification[];
  getCertificationsByPartner: (partnerId: string) => Certification[];
  badges: Badge[];
  getBadgesByPartner: (partnerId: string) => Badge[];
  trainingCompletions: TrainingCompletion[];
  getTrainingByPartner: (partnerId: string) => TrainingCompletion[];
  skillEndorsements: SkillEndorsement[];
  getEndorsementsByPartner: (partnerId: string) => SkillEndorsement[];
  auditLog: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, "_id" | "organizationId" | "createdAt">) => void;
  stats: {
    totalRevenue: number;
    pipelineValue: number;
    totalDeals: number;
    openDeals: number;
    wonDeals: number;
    lostDeals: number;
    activePartners: number;
    totalPartners: number;
    winRate: number;
    avgDealSize: number;
    totalCommissions: number;
    pendingPayouts: number;
  };
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [org, setOrg] = useState<Organization>(demoOrg);
  const [partners, setPartners] = useState<Partner[]>(demoPartners);
  const [deals, setDeals] = useState<Deal[]>(demoDeals);
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>(demoTouchpoints);
  const [attributions, setAttributions] = useState<Attribution[]>(demoAttributions);
  const [payouts, setPayouts] = useState<Payout[]>(demoPayouts);
  const [certifications] = useState<Certification[]>(demoCertifications);
  const [badges] = useState<Badge[]>(demoBadges);
  const [trainingCompletions] = useState<TrainingCompletion[]>(demoTrainingCompletions);
  const [skillEndorsements] = useState<SkillEndorsement[]>(demoSkillEndorsements);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(demoAuditLog);

  const updateOrg = useCallback((updates: Partial<Organization>) => {
    setOrg((prev) => ({ ...prev, ...updates }));
  }, []);

  const getPartner = useCallback((id: string) => partners.find((p) => p._id === id), [partners]);
  const getDeal = useCallback((id: string) => deals.find((d) => d._id === id), [deals]);

  const addPartner = useCallback((data: Omit<Partner, "_id" | "organizationId" | "createdAt">) => {
    const partner: Partner = { ...data, _id: `p_${Date.now()}`, organizationId: demoOrg._id, createdAt: Date.now() };
    setPartners((prev) => [...prev, partner]);
    return partner;
  }, []);

  const updatePartner = useCallback((id: string, updates: Partial<Partner>) => {
    setPartners((prev) => prev.map((p) => (p._id === id ? { ...p, ...updates } : p)));
  }, []);

  const addDeal = useCallback((data: Omit<Deal, "_id" | "organizationId" | "createdAt">) => {
    const deal: Deal = { ...data, _id: `d_${Date.now()}`, organizationId: demoOrg._id, createdAt: Date.now() };
    setDeals((prev) => [...prev, deal]);
    return deal;
  }, []);

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setDeals((prev) => prev.map((d) => (d._id === id ? { ...d, ...updates } : d)));
  }, []);

  const closeDeal = useCallback((id: string, status: "won" | "lost") => {
    const closedAt = Date.now();
    setDeals((prev) => prev.map((d) => (d._id === id ? { ...d, status, closedAt } : d)));
    // Generate attributions for won deals
    if (status === "won") {
      const deal = deals.find((d) => d._id === id);
      if (deal) {
        const dealTouchpoints = touchpoints.filter((tp) => tp.dealId === id);
        const newAttrs = generateAttributionsForDeal({ ...deal, status: "won", closedAt }, dealTouchpoints, partners);
        setAttributions((prev) => [...prev, ...newAttrs]);
      }
    }
  }, [deals, touchpoints, partners]);

  const getTouchpointsByDeal = useCallback((dealId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.dealId === dealId)), [touchpoints]);
  const getTouchpointsByPartner = useCallback((partnerId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.partnerId === partnerId)), [touchpoints]);
  const addTouchpoint = useCallback((data: Omit<Touchpoint, "_id" | "organizationId" | "createdAt">) => {
    const tp: Touchpoint = { ...data, _id: `tp_${Date.now()}`, organizationId: demoOrg._id, createdAt: Date.now() };
    setTouchpoints((prev) => [...prev, tp]);
    return tp;
  }, []);

  const getCertificationsByPartner = useCallback((partnerId: string) => certifications.filter((c) => c.partnerId === partnerId), [certifications]);
  const getBadgesByPartner = useCallback((partnerId: string) => badges.filter((b) => b.partnerId === partnerId), [badges]);
  const getTrainingByPartner = useCallback((partnerId: string) => trainingCompletions.filter((t) => t.partnerId === partnerId), [trainingCompletions]);
  const getEndorsementsByPartner = useCallback((partnerId: string) => skillEndorsements.filter((e) => e.partnerId === partnerId), [skillEndorsements]);

  const getAttributionsByDeal = useCallback((dealId: string) => enrichAttributions(attributions.filter((a) => a.dealId === dealId)), [attributions]);
  const getAttributionsByPartner = useCallback((partnerId: string) => enrichAttributions(attributions.filter((a) => a.partnerId === partnerId)), [attributions]);
  const getAttributionsByModel = useCallback((model: AttributionModel) => enrichAttributions(attributions.filter((a) => a.model === model)), [attributions]);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, "_id" | "organizationId" | "createdAt">) => {
    const newEntry: AuditEntry = { ...entry, _id: `al_${Date.now()}`, organizationId: demoOrg._id, createdAt: Date.now() };
    setAuditLog((prev) => [newEntry, ...prev]);
  }, []);

  const approvePayout = useCallback((id: string) => {
    setPayouts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "approved" as const, approvedAt: Date.now() } : p)));
    const payout = payouts.find((p) => p._id === id);
    const partner = payout ? partners.find((pr) => pr._id === payout.partnerId) : undefined;
    addAuditEntry({ action: "payout.approved", entityType: "payout", entityId: id, metadata: JSON.stringify({ partner: partner?.name, amount: payout ? `$${payout.amount.toLocaleString()}` : "" }) });
  }, [payouts, partners, addAuditEntry]);

  const rejectPayout = useCallback((id: string, notes?: string) => {
    setPayouts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "rejected" as const, notes: notes || p.notes } : p)));
    const payout = payouts.find((p) => p._id === id);
    const partner = payout ? partners.find((pr) => pr._id === payout.partnerId) : undefined;
    addAuditEntry({ action: "payout.rejected", entityType: "payout", entityId: id, metadata: JSON.stringify({ partner: partner?.name, amount: payout ? `$${payout.amount.toLocaleString()}` : "", reason: notes }) });
  }, [payouts, partners, addAuditEntry]);

  const markPayoutPaid = useCallback((id: string) => {
    setPayouts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "paid" as const, paidAt: Date.now() } : p)));
    const payout = payouts.find((p) => p._id === id);
    const partner = payout ? partners.find((pr) => pr._id === payout.partnerId) : undefined;
    addAuditEntry({ action: "payout.paid", entityType: "payout", entityId: id, metadata: JSON.stringify({ partner: partner?.name, amount: payout ? `$${payout.amount.toLocaleString()}` : "", period: payout?.period }) });
  }, [payouts, partners, addAuditEntry]);

  const createPayout = useCallback((data: { partnerId: string; amount: number; period: string; notes?: string }) => {
    const payout: Payout = { ...data, _id: `pay_${Date.now()}`, organizationId: demoOrg._id, status: "pending_approval", createdAt: Date.now() };
    setPayouts((prev) => [...prev, payout]);
    const partner = partners.find((p) => p._id === data.partnerId);
    addAuditEntry({ action: "payout.created", entityType: "payout", entityId: payout._id, metadata: JSON.stringify({ partner: partner?.name, amount: `$${data.amount.toLocaleString()}`, period: data.period }) });
    return payout;
  }, [partners, addAuditEntry]);

  const wonDealsList = deals.filter((d) => d.status === "won");
  const totalRevenue = wonDealsList.reduce((s, d) => s + d.amount, 0);
  const pipelineValue = deals.filter((d) => d.status === "open").reduce((s, d) => s + d.amount, 0);
  const closedCount = wonDealsList.length + deals.filter((d) => d.status === "lost").length;

  const stats = {
    totalRevenue,
    pipelineValue,
    totalDeals: deals.length,
    openDeals: deals.filter((d) => d.status === "open").length,
    wonDeals: wonDealsList.length,
    lostDeals: deals.filter((d) => d.status === "lost").length,
    activePartners: partners.filter((p) => p.status === "active").length,
    totalPartners: partners.length,
    winRate: closedCount > 0 ? Math.round((wonDealsList.length / closedCount) * 100) : 0,
    avgDealSize: wonDealsList.length > 0 ? Math.round(totalRevenue / wonDealsList.length) : 0,
    totalCommissions: Math.round(attributions.filter((a) => a.model === "role_based").reduce((s, a) => s + a.commissionAmount, 0)),
    pendingPayouts: payouts.filter((p) => p.status === "pending_approval").reduce((s, p) => s + p.amount, 0),
  };

  return (
    <StoreContext.Provider value={{ org, updateOrg, partners, getPartner, addPartner, updatePartner, deals, getDeal, addDeal, updateDeal, closeDeal, touchpoints, getTouchpointsByDeal, getTouchpointsByPartner, addTouchpoint, attributions, getAttributionsByDeal, getAttributionsByPartner, getAttributionsByModel, certifications, getCertificationsByPartner, badges, getBadgesByPartner, trainingCompletions, getTrainingByPartner, skillEndorsements, getEndorsementsByPartner, payouts, approvePayout, rejectPayout, markPayoutPaid, createPayout, auditLog, addAuditEntry, stats }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
