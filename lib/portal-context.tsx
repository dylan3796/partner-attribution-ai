"use client";

import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import {
  portalPartners,
  type PortalPartnerProfile,
  type DealRegistration,
  type Dispute,
  demoDealRegistrations,
  demoDisputes,
  getPartnerDeals,
  getPartnerTouchpoints,
  getPartnerAttributions,
  getPartnerCommissions,
  getPartnerStats,
} from "./portal-demo-data";
import type { Deal, Touchpoint, Attribution, Payout } from "./types";

type PortalStats = {
  totalEarned: number;
  pending: number;
  paidThisMonth: number;
  paidThisQuarter: number;
  dealsInPipeline: number;
  activeDeals: number;
  totalDeals: number;
  wonDeals: number;
  totalRevenue: number;
};

type PortalPayout = {
  id: string;
  dealId: string;
  dealName: string;
  amount: number;
  commissionAmount: number;
  status: "pending" | "approved" | "paid";
  date: number;
  paidAt?: number;
};

type PortalContextType = {
  partner: PortalPartnerProfile | null;
  setPartner: (p: PortalPartnerProfile | null) => void;
  setPartnerId: (id: string) => void;
  allPartners: PortalPartnerProfile[];
  dealRegistrations: DealRegistration[];
  addDealRegistration: (reg: Omit<DealRegistration, "id" | "status" | "submittedAt">) => void;
  disputes: Dispute[];
  addDispute: (d: Omit<Dispute, "id" | "status" | "submittedAt">) => void;
  myDeals: Deal[];
  myTouchpoints: Touchpoint[];
  myAttributions: Attribution[];
  myPayouts: PortalPayout[];
  stats: PortalStats;
};

const PortalContext = createContext<PortalContextType | null>(null);

const emptyStats: PortalStats = {
  totalEarned: 0,
  pending: 0,
  paidThisMonth: 0,
  paidThisQuarter: 0,
  dealsInPipeline: 0,
  activeDeals: 0,
  totalDeals: 0,
  wonDeals: 0,
  totalRevenue: 0,
};

export function PortalProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<PortalPartnerProfile | null>(portalPartners[0]);
  const [dealRegistrations, setDealRegistrations] = useState<DealRegistration[]>(demoDealRegistrations);
  const [disputes, setDisputes] = useState<Dispute[]>(demoDisputes);

  const setPartnerId = (id: string) => {
    const found = portalPartners.find((p) => p.id === id);
    if (found) setPartner(found);
  };

  const addDealRegistration = (reg: Omit<DealRegistration, "id" | "status" | "submittedAt">) => {
    setDealRegistrations((prev) => [
      {
        ...reg,
        id: `reg_${Date.now()}`,
        status: "pending_approval",
        submittedAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const addDispute = (d: Omit<Dispute, "id" | "status" | "submittedAt">) => {
    setDisputes((prev) => [
      {
        ...d,
        id: `disp_${Date.now()}`,
        status: "open",
        submittedAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const myDeals = useMemo(() => (partner ? getPartnerDeals(partner) : []), [partner]);
  const myTouchpoints = useMemo(() => (partner ? getPartnerTouchpoints(partner) : []), [partner]);
  const myAttributions = useMemo(() => (partner ? getPartnerAttributions(partner) : []), [partner]);
  const myPayouts = useMemo(() => {
    if (!partner) return [];
    const commissions = getPartnerCommissions(partner);
    return commissions.map((c) => ({
      id: c.id,
      dealId: c.dealId,
      dealName: c.dealName,
      amount: c.dealAmount,
      commissionAmount: c.commissionAmount,
      status: c.status,
      date: c.date,
      paidAt: c.paidAt,
    }));
  }, [partner]);
  const stats = useMemo(() => (partner ? getPartnerStats(partner) : emptyStats), [partner]);

  return (
    <PortalContext.Provider
      value={{
        partner,
        setPartner,
        setPartnerId,
        allPartners: portalPartners,
        dealRegistrations,
        addDealRegistration,
        disputes,
        addDispute,
        myDeals,
        myTouchpoints,
        myAttributions,
        myPayouts,
        stats,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}
