"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Organization, Partner, Deal, Touchpoint, Attribution, AttributionModel } from "./types";
import {
  demoOrg,
  demoPartners,
  demoDeals,
  demoTouchpoints,
  demoAttributions,
  enrichTouchpoints,
  enrichAttributions,
} from "./demo-data";

type StoreContextType = {
  // Auth
  org: Organization | null;
  isAuthenticated: boolean;
  login: (apiKey: string) => boolean;
  logout: () => void;

  // Partners
  partners: Partner[];
  getPartner: (id: string) => Partner | undefined;
  addPartner: (partner: Omit<Partner, "_id" | "organizationId" | "createdAt" | "status">) => Partner;
  updatePartner: (id: string, updates: Partial<Partner>) => void;

  // Deals
  deals: Deal[];
  getDeal: (id: string) => Deal | undefined;
  addDeal: (deal: Omit<Deal, "_id" | "organizationId" | "createdAt" | "status">) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;

  // Touchpoints
  touchpoints: Touchpoint[];
  getTouchpointsByDeal: (dealId: string) => Touchpoint[];
  getTouchpointsByPartner: (partnerId: string) => Touchpoint[];
  addTouchpoint: (tp: Omit<Touchpoint, "_id" | "organizationId" | "createdAt">) => Touchpoint;

  // Attributions
  attributions: Attribution[];
  getAttributionsByDeal: (dealId: string) => Attribution[];
  getAttributionsByPartner: (partnerId: string) => Attribution[];
  getAttributionsByModel: (model: AttributionModel) => Attribution[];

  // Computed
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
  };
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [org, setOrg] = useState<Organization | null>(demoOrg);
  const [partners, setPartners] = useState<Partner[]>(demoPartners);
  const [deals, setDeals] = useState<Deal[]>(demoDeals);
  const [touchpoints] = useState<Touchpoint[]>(demoTouchpoints);
  const [attributions] = useState<Attribution[]>(demoAttributions);

  const login = useCallback((apiKey: string) => {
    // For MVP, accept any key or the demo key
    if (apiKey === demoOrg.apiKey || apiKey.startsWith("pk_")) {
      setOrg(demoOrg);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setOrg(null);
  }, []);

  const getPartner = useCallback((id: string) => partners.find((p) => p._id === id), [partners]);
  const getDeal = useCallback((id: string) => deals.find((d) => d._id === id), [deals]);

  const addPartner = useCallback(
    (data: Omit<Partner, "_id" | "organizationId" | "createdAt" | "status">) => {
      const partner: Partner = {
        ...data,
        _id: `p_${Date.now()}`,
        organizationId: org?._id || "",
        status: "pending",
        createdAt: Date.now(),
      };
      setPartners((prev) => [...prev, partner]);
      return partner;
    },
    [org]
  );

  const updatePartner = useCallback((id: string, updates: Partial<Partner>) => {
    setPartners((prev) => prev.map((p) => (p._id === id ? { ...p, ...updates } : p)));
  }, []);

  const addDeal = useCallback(
    (data: Omit<Deal, "_id" | "organizationId" | "createdAt" | "status">) => {
      const deal: Deal = {
        ...data,
        _id: `d_${Date.now()}`,
        organizationId: org?._id || "",
        status: "open",
        createdAt: Date.now(),
      };
      setDeals((prev) => [...prev, deal]);
      return deal;
    },
    [org]
  );

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setDeals((prev) => prev.map((d) => (d._id === id ? { ...d, ...updates } : d)));
  }, []);

  const getTouchpointsByDeal = useCallback(
    (dealId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.dealId === dealId)),
    [touchpoints]
  );

  const getTouchpointsByPartner = useCallback(
    (partnerId: string) => enrichTouchpoints(touchpoints.filter((tp) => tp.partnerId === partnerId)),
    [touchpoints]
  );

  const addTouchpoint = useCallback(
    (data: Omit<Touchpoint, "_id" | "organizationId" | "createdAt">) => {
      const tp: Touchpoint = {
        ...data,
        _id: `tp_${Date.now()}`,
        organizationId: org?._id || "",
        createdAt: Date.now(),
      };
      return tp;
    },
    [org]
  );

  const getAttributionsByDeal = useCallback(
    (dealId: string) => enrichAttributions(attributions.filter((a) => a.dealId === dealId)),
    [attributions]
  );

  const getAttributionsByPartner = useCallback(
    (partnerId: string) => enrichAttributions(attributions.filter((a) => a.partnerId === partnerId)),
    [attributions]
  );

  const getAttributionsByModel = useCallback(
    (model: AttributionModel) => enrichAttributions(attributions.filter((a) => a.model === model)),
    [attributions]
  );

  // Compute stats
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
    totalCommissions: Math.round(attributions.filter((a) => a.model === "equal_split").reduce((s, a) => s + a.commissionAmount, 0)),
  };

  return (
    <StoreContext.Provider
      value={{
        org,
        isAuthenticated: !!org,
        login,
        logout,
        partners,
        getPartner,
        addPartner,
        updatePartner,
        deals,
        getDeal,
        addDeal,
        updateDeal,
        touchpoints,
        getTouchpointsByDeal,
        getTouchpointsByPartner,
        addTouchpoint,
        attributions,
        getAttributionsByDeal,
        getAttributionsByPartner,
        getAttributionsByModel,
        stats,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
