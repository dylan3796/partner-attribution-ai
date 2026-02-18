export type OnboardingStage = "signed" | "kickoff" | "training" | "first_deal" | "ramping" | "producing";

export type OnboardingMilestone = {
  stage: OnboardingStage;
  label: string;
  completedAt?: number;
  dueBy?: number;
  notes?: string;
};

export type PartnerOnboarding = {
  _id: string;
  partnerId: string;
  partnerName: string;
  partnerType: string;
  tier: string;
  currentStage: OnboardingStage;
  startedAt: number;
  milestones: OnboardingMilestone[];
  assignedTo: string; // channel manager
  daysToFirstDeal: number | null;
  rampScore: number; // 0-100
  blockers: string[];
};

const DAY = 86400000;
const now = Date.now();

export const ONBOARDING_STAGES: { key: OnboardingStage; label: string; description: string }[] = [
  { key: "signed", label: "Agreement Signed", description: "Partner agreement executed" },
  { key: "kickoff", label: "Kickoff Complete", description: "Intro call, portal access, team intros" },
  { key: "training", label: "Training Done", description: "Core product & sales training completed" },
  { key: "first_deal", label: "First Deal", description: "First deal registered or referred" },
  { key: "ramping", label: "Ramping", description: "Active pipeline building, 2+ deals" },
  { key: "producing", label: "Producing", description: "Consistent revenue contribution" },
];

export const STAGE_INDEX: Record<OnboardingStage, number> = {
  signed: 0, kickoff: 1, training: 2, first_deal: 3, ramping: 4, producing: 5,
};

export const demoOnboardingData: PartnerOnboarding[] = [
  {
    _id: "onb_1",
    partnerId: "p1",
    partnerName: "CloudFirst Solutions",
    partnerType: "reseller",
    tier: "gold",
    currentStage: "producing",
    startedAt: now - 180 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 180 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", completedAt: now - 175 * DAY },
      { stage: "training", label: "Training Done", completedAt: now - 160 * DAY },
      { stage: "first_deal", label: "First Deal", completedAt: now - 140 * DAY },
      { stage: "ramping", label: "Ramping", completedAt: now - 100 * DAY },
      { stage: "producing", label: "Producing", completedAt: now - 60 * DAY },
    ],
    assignedTo: "Sarah Chen",
    daysToFirstDeal: 40,
    rampScore: 95,
    blockers: [],
  },
  {
    _id: "onb_2",
    partnerId: "p2",
    partnerName: "DataBridge Partners",
    partnerType: "referral",
    tier: "silver",
    currentStage: "ramping",
    startedAt: now - 90 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 90 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", completedAt: now - 85 * DAY },
      { stage: "training", label: "Training Done", completedAt: now - 70 * DAY },
      { stage: "first_deal", label: "First Deal", completedAt: now - 55 * DAY },
      { stage: "ramping", label: "Ramping", completedAt: now - 30 * DAY },
      { stage: "producing", label: "Producing", dueBy: now + 30 * DAY },
    ],
    assignedTo: "Mike Torres",
    daysToFirstDeal: 35,
    rampScore: 72,
    blockers: ["Needs advanced API training"],
  },
  {
    _id: "onb_3",
    partnerId: "p3",
    partnerName: "TechReach Inc",
    partnerType: "reseller",
    tier: "platinum",
    currentStage: "producing",
    startedAt: now - 240 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 240 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", completedAt: now - 238 * DAY },
      { stage: "training", label: "Training Done", completedAt: now - 225 * DAY },
      { stage: "first_deal", label: "First Deal", completedAt: now - 215 * DAY },
      { stage: "ramping", label: "Ramping", completedAt: now - 180 * DAY },
      { stage: "producing", label: "Producing", completedAt: now - 150 * DAY },
    ],
    assignedTo: "Sarah Chen",
    daysToFirstDeal: 25,
    rampScore: 98,
    blockers: [],
  },
  {
    _id: "onb_4",
    partnerId: "p4",
    partnerName: "Nexus Digital",
    partnerType: "integration",
    tier: "gold",
    currentStage: "training",
    startedAt: now - 25 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 25 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", completedAt: now - 20 * DAY },
      { stage: "training", label: "Training Done", dueBy: now + 5 * DAY },
      { stage: "first_deal", label: "First Deal", dueBy: now + 30 * DAY },
      { stage: "ramping", label: "Ramping" },
      { stage: "producing", label: "Producing" },
    ],
    assignedTo: "Lisa Park",
    daysToFirstDeal: null,
    rampScore: 35,
    blockers: ["Integration SDK docs incomplete", "Waiting on sandbox environment"],
  },
  {
    _id: "onb_5",
    partnerId: "p5",
    partnerName: "Summit Growth Co",
    partnerType: "affiliate",
    tier: "bronze",
    currentStage: "kickoff",
    startedAt: now - 8 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 8 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", dueBy: now + 2 * DAY },
      { stage: "training", label: "Training Done", dueBy: now + 20 * DAY },
      { stage: "first_deal", label: "First Deal" },
      { stage: "ramping", label: "Ramping" },
      { stage: "producing", label: "Producing" },
    ],
    assignedTo: "Mike Torres",
    daysToFirstDeal: null,
    rampScore: 12,
    blockers: [],
  },
  {
    _id: "onb_6",
    partnerId: "p6",
    partnerName: "Velocity Partners",
    partnerType: "reseller",
    tier: "silver",
    currentStage: "first_deal",
    startedAt: now - 50 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 50 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", completedAt: now - 47 * DAY },
      { stage: "training", label: "Training Done", completedAt: now - 35 * DAY },
      { stage: "first_deal", label: "First Deal", completedAt: now - 10 * DAY },
      { stage: "ramping", label: "Ramping", dueBy: now + 20 * DAY },
      { stage: "producing", label: "Producing" },
    ],
    assignedTo: "Lisa Park",
    daysToFirstDeal: 40,
    rampScore: 55,
    blockers: ["Needs co-sell support for enterprise accounts"],
  },
  {
    _id: "onb_7",
    partnerId: "p7",
    partnerName: "Horizon Tech Group",
    partnerType: "referral",
    tier: "bronze",
    currentStage: "signed",
    startedAt: now - 2 * DAY,
    milestones: [
      { stage: "signed", label: "Agreement Signed", completedAt: now - 2 * DAY },
      { stage: "kickoff", label: "Kickoff Complete", dueBy: now + 5 * DAY },
      { stage: "training", label: "Training Done" },
      { stage: "first_deal", label: "First Deal" },
      { stage: "ramping", label: "Ramping" },
      { stage: "producing", label: "Producing" },
    ],
    assignedTo: "Sarah Chen",
    daysToFirstDeal: null,
    rampScore: 5,
    blockers: [],
  },
];
