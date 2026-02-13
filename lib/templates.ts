export type ProgramTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  bestFor: string;
  
  // Configuration
  attributionModel: "equal_split" | "first_touch" | "last_touch" | "time_decay" | "role_based";
  defaultCommissionRate: number;
  payoutFrequency: "weekly" | "monthly" | "quarterly" | "annual";
  requireDealRegistration: boolean;
  enableMDF: boolean;
  
  // Partner tiers
  tiers: {
    name: string;
    commissionRate: number;
    benefits: string[];
  }[];
  
  // Sample partner types
  partnerTypes: Array<"affiliate" | "referral" | "reseller" | "integration">;
  
  // Recommended touchpoint types
  touchpointTypes: string[];
};

export const programTemplates: ProgramTemplate[] = [
  {
    id: "referral",
    name: "Referral Program",
    description: "Simple word-of-mouth referrals with first-touch attribution",
    icon: "👥",
    bestFor: "SaaS, marketplaces, consumer apps looking for viral growth",
    
    attributionModel: "first_touch",
    defaultCommissionRate: 10,
    payoutFrequency: "monthly",
    requireDealRegistration: false,
    enableMDF: false,
    
    tiers: [
      {
        name: "Standard",
        commissionRate: 10,
        benefits: ["10% commission on first year", "Monthly payouts", "Partner dashboard access"],
      },
      {
        name: "VIP",
        commissionRate: 15,
        benefits: ["15% commission on first year", "Priority support", "Early feature access"],
      },
    ],
    
    partnerTypes: ["referral", "affiliate"],
    touchpointTypes: ["referral", "demo", "introduction"],
  },
  
  {
    id: "reseller",
    name: "Reseller Program",
    description: "Channel partners who resell your product with shared attribution",
    icon: "🏢",
    bestFor: "B2B software, enterprise solutions, hardware vendors",
    
    attributionModel: "equal_split",
    defaultCommissionRate: 20,
    payoutFrequency: "quarterly",
    requireDealRegistration: true,
    enableMDF: true,
    
    tiers: [
      {
        name: "Bronze",
        commissionRate: 15,
        benefits: ["15% commission", "Quarterly payouts", "Basic training"],
      },
      {
        name: "Silver",
        commissionRate: 20,
        benefits: ["20% commission", "MDF budget", "Co-marketing support"],
      },
      {
        name: "Gold",
        commissionRate: 25,
        benefits: ["25% commission", "Dedicated CSM", "Priority leads", "NFR licenses"],
      },
    ],
    
    partnerTypes: ["reseller"],
    touchpointTypes: ["deal_registration", "demo", "proposal", "negotiation", "co_sell"],
  },
  
  {
    id: "integration",
    name: "Integration Partners",
    description: "Technical partners with product integrations, last-touch wins",
    icon: "🔌",
    bestFor: "API platforms, dev tools, SaaS ecosystems",
    
    attributionModel: "last_touch",
    defaultCommissionRate: 20,
    payoutFrequency: "monthly",
    requireDealRegistration: true,
    enableMDF: false,
    
    tiers: [
      {
        name: "Technology Partner",
        commissionRate: 20,
        benefits: ["20% commission", "API access", "Co-marketing opportunities"],
      },
      {
        name: "Strategic Partner",
        commissionRate: 25,
        benefits: ["25% commission", "Joint roadmap planning", "Co-sell motions", "Revenue share"],
      },
    ],
    
    partnerTypes: ["integration"],
    touchpointTypes: ["deal_registration", "technical_enablement", "demo", "introduction"],
  },
  
  {
    id: "comarketing",
    name: "Co-Marketing Program",
    description: "Content and campaign partners with role-based attribution",
    icon: "📢",
    bestFor: "Content platforms, influencers, media companies, agencies",
    
    attributionModel: "role_based",
    defaultCommissionRate: 12,
    payoutFrequency: "monthly",
    requireDealRegistration: false,
    enableMDF: true,
    
    tiers: [
      {
        name: "Content Partner",
        commissionRate: 10,
        benefits: ["10% commission", "MDF for campaigns", "Content co-creation"],
      },
      {
        name: "Strategic Marketing Partner",
        commissionRate: 15,
        benefits: ["15% commission", "Larger MDF budget", "Joint webinars", "Event sponsorships"],
      },
    ],
    
    partnerTypes: ["affiliate", "referral"],
    touchpointTypes: ["content_share", "referral", "demo", "introduction"],
  },
];

export function getTemplate(id: string): ProgramTemplate | undefined {
  return programTemplates.find((t) => t.id === id);
}

export function getDefaultConfig(templateId: string) {
  const template = getTemplate(templateId);
  if (!template) return null;
  
  return {
    attributionModel: template.attributionModel,
    defaultCommissionRate: template.defaultCommissionRate,
    payoutFrequency: template.payoutFrequency,
    requireDealRegistration: template.requireDealRegistration,
    enableMDF: template.enableMDF,
  };
}
