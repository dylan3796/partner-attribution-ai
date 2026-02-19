"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
import type { Deal, Touchpoint, Attribution } from "./types";

const SESSION_KEY = "covant_portal_session";

type PortalSession = {
  partnerId: string;
  partnerName: string;
  email: string;
};

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
  session: PortalSession | null;
  setPartner: (p: PortalPartnerProfile | null) => void;
  setPartnerId: (id: string) => void;
  logout: () => void;
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
  const [session, setSession] = useState<PortalSession | null>(null);
  const [partner, setPartner] = useState<PortalPartnerProfile | null>(null);
  const [dealRegistrations, setDealRegistrations] = useState<DealRegistration[]>(demoDealRegistrations);
  const [disputes, setDisputes] = useState<Dispute[]>(demoDisputes);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PortalSession;
        setSession(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setSessionLoaded(true);
  }, []);

  // Fetch partner data from Convex when session exists
  const convexPartner = useQuery(
    api.partners.get,
    session?.partnerId ? { id: session.partnerId as Id<"partners"> } : "skip"
  );

  // Map Convex partner to PortalPartnerProfile when available
  useEffect(() => {
    if (convexPartner && session) {
      // Create a PortalPartnerProfile from Convex data
      const profile: PortalPartnerProfile = {
        id: convexPartner._id,
        companyName: convexPartner.name,
        contactName: convexPartner.contactName || "Partner",
        contactEmail: convexPartner.email,
        phone: "",
        type: convexPartner.type as "reseller" | "referral" | "affiliate" | "integration",
        tier: (convexPartner.tier || "bronze") as "bronze" | "silver" | "gold" | "platinum",
        status: convexPartner.status as "active" | "inactive" | "pending",
        commissionRate: convexPartner.commissionRate * 100, // Convert to percentage
        joinedAt: convexPartner.createdAt,
        partnerManager: {
          name: "Partner Team",
          email: "partners@covant.ai",
          phone: "",
        },
        address: "",
        website: "",
        linkedPartnerIds: [convexPartner._id],
        stripeAccountId: convexPartner.stripeAccountId,
        stripeOnboarded: convexPartner.stripeOnboarded,
        stripeOnboardingUrl: convexPartner.stripeOnboardingUrl,
      };
      setPartner(profile);
    } else if (!session && sessionLoaded) {
      // Fallback to demo data when no session (for backwards compatibility)
      setPartner(portalPartners[0]);
    }
  }, [convexPartner, session, sessionLoaded]);

  const setPartnerId = (id: string) => {
    const found = portalPartners.find((p) => p.id === id);
    if (found) setPartner(found);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setPartner(null);
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
        session,
        setPartner,
        setPartnerId,
        logout,
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
