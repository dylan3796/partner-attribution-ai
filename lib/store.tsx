"use client";
import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Organization, Partner, Deal, Touchpoint, Attribution, Payout, AuditEntry, AttributionModel } from "./types";
import { demoOrg, demoPartners, demoDeals, demoTouchpoints, demoAttributions, demoPayouts, demoAuditLog, enrichTouchpoints, enrichAttributions } from "./demo-data";

type StoreContextType = {
  org: Organization;
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
  auditLog: AuditEntry[];
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
  const [partners, setPartners] = useState<Partner[]>(demoPartners);
  const [deals, setDeals] = useState<Deal[]>(demoDeals);
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>(demoTouchpoints);
  const [attributions] = useState<Attribution[]>(demoAttributions);
  const [payouts] = useState<Payout[]>(demoPayouts);
  const [auditLog] = useState<AuditEntry[]>(demoAuditLog);

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
    setDeals((prev) => prev.map((d) => (d._id === id ? { ...d, status, closedAt: Date.now() } : d)));
  }, []);

  const getTouchpointsByDeal = useCallback((dealId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.dealId === dealId)), [touchpoints]);
  const getTouchpointsByPartner = useCallback((partnerId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.partnerId === partnerId)), [touchpoints]);
  const addTouchpoint = useCallback((data: Omit<Touchpoint, "_id" | "organizationId" | "createdAt">) => {
    const tp: Touchpoint = { ...data, _id: `tp_${Date.now()}`, organizationId: demoOrg._id, createdAt: Date.now() };
    setTouchpoints((prev) => [...prev, tp]);
    return tp;
  }, []);

  const getAttributionsByDeal = useCallback((dealId: string) => enrichAttributions(attributions.filter((a) => a.dealId === dealId)), [attributions]);
  const getAttributionsByPartner = useCallback((partnerId: string) => enrichAttributions(attributions.filter((a) => a.partnerId === partnerId)), [attributions]);
  const getAttributionsByModel = useCallback((model: AttributionModel) => enrichAttributions(attributions.filter((a) => a.model === model)), [attributions]);

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
    <StoreContext.Provider value={{ org: demoOrg, partners, getPartner, addPartner, updatePartner, deals, getDeal, addDeal, updateDeal, closeDeal, touchpoints, getTouchpointsByDeal, getTouchpointsByPartner, addTouchpoint, attributions, getAttributionsByDeal, getAttributionsByPartner, getAttributionsByModel, payouts, auditLog, stats }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
