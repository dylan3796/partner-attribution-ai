/**
 * Enablement data helpers for the Partner Portal.
 * Provides partner-scoped views of certifications, badges, training, and endorsements.
 */

import type { Certification, Badge, TrainingCompletion, SkillEndorsement } from "./types";
import {
  demoCertifications,
  demoBadges,
  demoTrainingCompletions,
  demoSkillEndorsements,
} from "./certifications-data";
import type { PortalPartnerProfile } from "./portal-demo-data";

const now = Date.now();
const day = 86400000;

// ─── In-Progress / Recommended Courses ──────────────────────────

export type InProgressCourse = {
  id: string;
  partnerId: string;
  courseName: string;
  progress: number; // 0-100
  startedAt: number;
  estimatedMinutes: number;
  category: "sales" | "technical" | "product" | "leadership";
};

export type RecommendedCourse = {
  id: string;
  courseName: string;
  description: string;
  estimatedMinutes: number;
  category: "sales" | "technical" | "product" | "leadership";
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Which partner IDs this is recommended for (empty = all) */
  forPartnerIds: string[];
};

export const inProgressCourses: InProgressCourse[] = [
  // NexGen Resellers (p_004) — linked to portal_001 (TechStar)
  { id: "ip_001", partnerId: "p_004", courseName: "Advanced Solution Design", progress: 65, startedAt: now - 5 * day, estimatedMinutes: 120, category: "technical" },
  { id: "ip_002", partnerId: "p_004", courseName: "Competitive Positioning Workshop", progress: 30, startedAt: now - 2 * day, estimatedMinutes: 90, category: "sales" },

  // GrowthLabs Co (p_005) — linked to portal_002
  { id: "ip_003", partnerId: "p_005", courseName: "Content Marketing for Partners", progress: 45, startedAt: now - 8 * day, estimatedMinutes: 60, category: "sales" },
  { id: "ip_004", partnerId: "p_005", courseName: "Platform Intermediate Workshop", progress: 80, startedAt: now - 3 * day, estimatedMinutes: 45, category: "product" },

  // DataPipe Agency (p_003) — linked to portal_003 (ContentForce)
  { id: "ip_005", partnerId: "p_003", courseName: "Partner Leadership Summit Prep", progress: 20, startedAt: now - 1 * day, estimatedMinutes: 180, category: "leadership" },
];

export const recommendedCourses: RecommendedCourse[] = [
  {
    id: "rec_001",
    courseName: "Enterprise Account Strategy",
    description: "Learn how to identify, qualify, and close enterprise opportunities with a structured framework.",
    estimatedMinutes: 90,
    category: "sales",
    difficulty: "advanced",
    forPartnerIds: ["p_004", "p_001"],
  },
  {
    id: "rec_002",
    courseName: "API Deep Dive: Webhooks & Events",
    description: "Master webhook configuration, event payloads, and real-time integration patterns.",
    estimatedMinutes: 120,
    category: "technical",
    difficulty: "advanced",
    forPartnerIds: ["p_003", "p_004"],
  },
  {
    id: "rec_003",
    courseName: "Partner Success Metrics",
    description: "Understand the key metrics that drive partner performance and tier advancement.",
    estimatedMinutes: 45,
    category: "product",
    difficulty: "beginner",
    forPartnerIds: [], // all
  },
  {
    id: "rec_004",
    courseName: "Co-Selling with Direct Sales Teams",
    description: "Best practices for collaborating with vendor sales teams on joint opportunities.",
    estimatedMinutes: 75,
    category: "sales",
    difficulty: "intermediate",
    forPartnerIds: ["p_004", "p_005"],
  },
  {
    id: "rec_005",
    courseName: "Building Technical Demos That Win",
    description: "Create compelling technical demonstrations that highlight integration value.",
    estimatedMinutes: 60,
    category: "technical",
    difficulty: "intermediate",
    forPartnerIds: ["p_003", "p_004"],
  },
];

// ─── Portal Enablement Helpers ──────────────────────────────────

/** Get certifications for a portal partner (scoped by linkedPartnerIds) */
export function getPortalCertifications(profile: PortalPartnerProfile): Certification[] {
  return demoCertifications
    .filter((c) => profile.linkedPartnerIds.includes(c.partnerId))
    .sort((a, b) => b.dateEarned - a.dateEarned);
}

/** Get badges for a portal partner */
export function getPortalBadges(profile: PortalPartnerProfile): Badge[] {
  return demoBadges
    .filter((b) => profile.linkedPartnerIds.includes(b.partnerId))
    .sort((a, b) => b.earnedAt - a.earnedAt);
}

/** Get completed training for a portal partner */
export function getPortalTrainingCompleted(profile: PortalPartnerProfile): TrainingCompletion[] {
  return demoTrainingCompletions
    .filter((t) => profile.linkedPartnerIds.includes(t.partnerId))
    .sort((a, b) => b.completedAt - a.completedAt);
}

/** Get in-progress courses for a portal partner */
export function getPortalInProgressCourses(profile: PortalPartnerProfile): InProgressCourse[] {
  return inProgressCourses.filter((c) =>
    profile.linkedPartnerIds.includes(c.partnerId)
  );
}

/** Get recommended courses for a portal partner */
export function getPortalRecommendedCourses(profile: PortalPartnerProfile): RecommendedCourse[] {
  return recommendedCourses.filter(
    (c) =>
      c.forPartnerIds.length === 0 ||
      c.forPartnerIds.some((pid) => profile.linkedPartnerIds.includes(pid))
  );
}

/** Get skill endorsements for a portal partner */
export function getPortalEndorsements(profile: PortalPartnerProfile): SkillEndorsement[] {
  return demoSkillEndorsements
    .filter((e) => profile.linkedPartnerIds.includes(e.partnerId))
    .sort((a, b) => b.endorsedAt - a.endorsedAt);
}

/** Summary stats for the enablement page */
export function getPortalEnablementStats(profile: PortalPartnerProfile) {
  const certs = getPortalCertifications(profile);
  const badges = getPortalBadges(profile);
  const completed = getPortalTrainingCompleted(profile);
  const inProgress = getPortalInProgressCourses(profile);
  const endorsements = getPortalEndorsements(profile);

  const activeCerts = certs.filter((c) => c.status === "active").length;
  const expiredCerts = certs.filter((c) => c.status === "expired").length;
  const expiringCerts = certs.filter((c) => {
    if (!c.expiryDate || c.status !== "active") return false;
    return c.expiryDate - now < 60 * day; // expires within 60 days
  }).length;
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((s, t) => s + (t.score || 0), 0) / completed.length
        )
      : 0;

  return {
    totalCerts: certs.length,
    activeCerts,
    expiredCerts,
    expiringCerts,
    totalBadges: badges.length,
    completedCourses: completed.length,
    inProgressCourses: inProgress.length,
    avgScore,
    totalEndorsements: endorsements.length,
  };
}
