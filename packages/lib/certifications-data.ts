/**
 * Demo data for certifications, badges, training completions, and skill endorsements.
 */
import type { Certification, Badge, TrainingCompletion, SkillEndorsement } from "./types";

const now = Date.now();
const day = 86400000;

export const demoCertifications: Certification[] = [
  // TechStar Solutions (p_001)
  { _id: "cert_001", partnerId: "p_001", name: "Certified Solutions Architect", issuer: "Covant Academy", dateEarned: now - 60 * day, expiryDate: now + 305 * day, level: "advanced", status: "active" },
  { _id: "cert_002", partnerId: "p_001", name: "Sales Engineering Specialist", issuer: "Covant Academy", dateEarned: now - 45 * day, expiryDate: now + 320 * day, level: "expert", status: "active" },
  { _id: "cert_003", partnerId: "p_001", name: "Partner Program Fundamentals", issuer: "Covant Academy", dateEarned: now - 80 * day, level: "beginner", status: "active" },

  // CloudBridge Partners (p_002)
  { _id: "cert_004", partnerId: "p_002", name: "Certified Solutions Architect", issuer: "Covant Academy", dateEarned: now - 70 * day, expiryDate: now + 295 * day, level: "intermediate", status: "active" },
  { _id: "cert_005", partnerId: "p_002", name: "Enterprise Sales Methodology", issuer: "Sales Institute", dateEarned: now - 30 * day, expiryDate: now + 335 * day, level: "advanced", status: "active" },

  // DataPipe Agency (p_003)
  { _id: "cert_006", partnerId: "p_003", name: "API Integration Expert", issuer: "Covant Academy", dateEarned: now - 50 * day, expiryDate: now + 315 * day, level: "expert", status: "active" },
  { _id: "cert_007", partnerId: "p_003", name: "Technical Implementation Specialist", issuer: "Cloud Alliance", dateEarned: now - 90 * day, expiryDate: now - 5 * day, level: "advanced", status: "expired" },

  // NexGen Resellers (p_004)
  { _id: "cert_008", partnerId: "p_004", name: "Certified Solutions Architect", issuer: "Covant Academy", dateEarned: now - 40 * day, expiryDate: now + 325 * day, level: "expert", status: "active" },
  { _id: "cert_009", partnerId: "p_004", name: "Enterprise Sales Methodology", issuer: "Sales Institute", dateEarned: now - 55 * day, expiryDate: now + 310 * day, level: "expert", status: "active" },
  { _id: "cert_010", partnerId: "p_004", name: "Channel Management Pro", issuer: "Channel Partners Alliance", dateEarned: now - 35 * day, level: "advanced", status: "active" },

  // GrowthLabs Co (p_005)
  { _id: "cert_011", partnerId: "p_005", name: "Partner Program Fundamentals", issuer: "Covant Academy", dateEarned: now - 40 * day, level: "beginner", status: "active" },
  { _id: "cert_012", partnerId: "p_005", name: "SMB Sales Specialist", issuer: "Sales Institute", dateEarned: now - 20 * day, expiryDate: now + 345 * day, level: "intermediate", status: "active" },
];

export const demoBadges: Badge[] = [
  // TechStar Solutions (p_001)
  { _id: "badge_001", partnerId: "p_001", name: "Deal Closer", description: "Closed 5+ deals in a single quarter", icon: "🎯", category: "achievement", earnedAt: now - 10 * day },
  { _id: "badge_002", partnerId: "p_001", name: "Fast Learner", description: "Completed 3 certifications in 30 days", icon: "🚀", category: "training", earnedAt: now - 45 * day },
  { _id: "badge_003", partnerId: "p_001", name: "Gold Partner", description: "Achieved Gold partner tier", icon: "🥇", category: "milestone", earnedAt: now - 5 * day },

  // CloudBridge Partners (p_002)
  { _id: "badge_004", partnerId: "p_002", name: "Content Champion", description: "Shared 10+ pieces of content", icon: "📚", category: "community", earnedAt: now - 15 * day },
  { _id: "badge_005", partnerId: "p_002", name: "Enterprise Expert", description: "Closed an enterprise deal over $100k", icon: "💎", category: "achievement", earnedAt: now - 30 * day },

  // DataPipe Agency (p_003)
  { _id: "badge_006", partnerId: "p_003", name: "Integration Wizard", description: "Built 5+ custom integrations", icon: "🔧", category: "achievement", earnedAt: now - 20 * day },
  { _id: "badge_007", partnerId: "p_003", name: "Technical Mentor", description: "Endorsed by 3+ partners for technical skills", icon: "🎓", category: "community", earnedAt: now - 40 * day },

  // NexGen Resellers (p_004)
  { _id: "badge_008", partnerId: "p_004", name: "Volume Leader", description: "Highest deal volume in a quarter", icon: "📈", category: "milestone", earnedAt: now - 8 * day },
  { _id: "badge_009", partnerId: "p_004", name: "Platinum Pioneer", description: "First partner to reach Platinum tier", icon: "👑", category: "milestone", earnedAt: now - 55 * day },
  { _id: "badge_010", partnerId: "p_004", name: "All-Star Certified", description: "Earned certifications from 3+ issuers", icon: "⭐", category: "training", earnedAt: now - 25 * day },

  // GrowthLabs Co (p_005)
  { _id: "badge_011", partnerId: "p_005", name: "Rising Star", description: "Fastest ramp-up in first 60 days", icon: "🌟", category: "milestone", earnedAt: now - 30 * day },
];

export const demoTrainingCompletions: TrainingCompletion[] = [
  // TechStar Solutions
  { _id: "train_001", partnerId: "p_001", courseName: "Platform Onboarding 101", completedAt: now - 82 * day, score: 95 },
  { _id: "train_002", partnerId: "p_001", courseName: "Advanced API Usage", completedAt: now - 60 * day, score: 88 },
  { _id: "train_003", partnerId: "p_001", courseName: "Sales Playbook Mastery", completedAt: now - 45 * day, score: 92 },
  { _id: "train_004", partnerId: "p_001", courseName: "Enterprise Deal Strategy", completedAt: now - 20 * day, score: 97 },

  // CloudBridge Partners
  { _id: "train_005", partnerId: "p_002", courseName: "Platform Onboarding 101", completedAt: now - 75 * day, score: 90 },
  { _id: "train_006", partnerId: "p_002", courseName: "Content Marketing for Partners", completedAt: now - 40 * day, score: 85 },
  { _id: "train_007", partnerId: "p_002", courseName: "Enterprise Sales Workshop", completedAt: now - 25 * day, score: 91 },

  // DataPipe Agency
  { _id: "train_008", partnerId: "p_003", courseName: "Platform Onboarding 101", completedAt: now - 72 * day, score: 98 },
  { _id: "train_009", partnerId: "p_003", courseName: "Advanced API Usage", completedAt: now - 50 * day, score: 96 },
  { _id: "train_010", partnerId: "p_003", courseName: "Integration Architecture", completedAt: now - 30 * day, score: 99 },

  // NexGen Resellers
  { _id: "train_011", partnerId: "p_004", courseName: "Platform Onboarding 101", completedAt: now - 58 * day, score: 94 },
  { _id: "train_012", partnerId: "p_004", courseName: "Sales Playbook Mastery", completedAt: now - 40 * day, score: 96 },
  { _id: "train_013", partnerId: "p_004", courseName: "Enterprise Deal Strategy", completedAt: now - 30 * day, score: 93 },
  { _id: "train_014", partnerId: "p_004", courseName: "Channel Sales Optimization", completedAt: now - 15 * day, score: 98 },
  { _id: "train_015", partnerId: "p_004", courseName: "Advanced API Usage", completedAt: now - 10 * day, score: 91 },

  // GrowthLabs Co
  { _id: "train_016", partnerId: "p_005", courseName: "Platform Onboarding 101", completedAt: now - 48 * day, score: 87 },
  { _id: "train_017", partnerId: "p_005", courseName: "SMB Sales Techniques", completedAt: now - 20 * day, score: 82 },
];

export const demoSkillEndorsements: SkillEndorsement[] = [
  // TechStar Solutions
  { _id: "endorse_001", partnerId: "p_001", skill: "Solution Architecture", endorsedBy: "Admin User", endorsedAt: now - 30 * day, level: "expert" },
  { _id: "endorse_002", partnerId: "p_001", skill: "Enterprise Sales", endorsedBy: "Admin User", endorsedAt: now - 25 * day, level: "proficient" },
  { _id: "endorse_003", partnerId: "p_001", skill: "Technical Demos", endorsedBy: "Admin User", endorsedAt: now - 20 * day, level: "expert" },

  // CloudBridge Partners
  { _id: "endorse_004", partnerId: "p_002", skill: "Content Marketing", endorsedBy: "Admin User", endorsedAt: now - 20 * day, level: "expert" },
  { _id: "endorse_005", partnerId: "p_002", skill: "Enterprise Sales", endorsedBy: "Admin User", endorsedAt: now - 15 * day, level: "proficient" },

  // DataPipe Agency
  { _id: "endorse_006", partnerId: "p_003", skill: "API Integration", endorsedBy: "Admin User", endorsedAt: now - 40 * day, level: "expert" },
  { _id: "endorse_007", partnerId: "p_003", skill: "Technical Architecture", endorsedBy: "Admin User", endorsedAt: now - 35 * day, level: "expert" },
  { _id: "endorse_008", partnerId: "p_003", skill: "Developer Relations", endorsedBy: "Admin User", endorsedAt: now - 20 * day, level: "proficient" },

  // NexGen Resellers
  { _id: "endorse_009", partnerId: "p_004", skill: "Channel Sales", endorsedBy: "Admin User", endorsedAt: now - 30 * day, level: "expert" },
  { _id: "endorse_010", partnerId: "p_004", skill: "Enterprise Sales", endorsedBy: "Admin User", endorsedAt: now - 25 * day, level: "expert" },
  { _id: "endorse_011", partnerId: "p_004", skill: "Solution Architecture", endorsedBy: "Admin User", endorsedAt: now - 15 * day, level: "proficient" },
  { _id: "endorse_012", partnerId: "p_004", skill: "Partner Enablement", endorsedBy: "Admin User", endorsedAt: now - 10 * day, level: "expert" },

  // GrowthLabs Co
  { _id: "endorse_013", partnerId: "p_005", skill: "SMB Sales", endorsedBy: "Admin User", endorsedAt: now - 15 * day, level: "proficient" },
  { _id: "endorse_014", partnerId: "p_005", skill: "Referral Marketing", endorsedBy: "Admin User", endorsedAt: now - 10 * day, level: "familiar" },
];

/**
 * Utility: count active certifications for a partner
 */
export function getActiveCertCount(partnerId: string): number {
  return demoCertifications.filter(c => c.partnerId === partnerId && c.status === "active").length;
}

/**
 * Utility: get badge count for a partner
 */
export function getBadgeCount(partnerId: string): number {
  return demoBadges.filter(b => b.partnerId === partnerId).length;
}

/**
 * Utility: get training completion count for a partner
 */
export function getTrainingCount(partnerId: string): number {
  return demoTrainingCompletions.filter(t => t.partnerId === partnerId).length;
}

/**
 * Calculate a certification score (0-100) for the scoring engine's engagement dimension
 */
export function calculateCertificationScore(partnerId: string): number {
  const certs = demoCertifications.filter(c => c.partnerId === partnerId && c.status === "active");
  const badges = demoBadges.filter(b => b.partnerId === partnerId);
  const trainings = demoTrainingCompletions.filter(t => t.partnerId === partnerId);
  const endorsements = demoSkillEndorsements.filter(e => e.partnerId === partnerId);

  // Weighted scoring: certs=30, badges=20, trainings=30, endorsements=20
  const certScore = Math.min(100, certs.length * 25);
  const badgeScore = Math.min(100, badges.length * 20);
  const trainingScore = Math.min(100, trainings.length * 20);
  const endorseScore = Math.min(100, endorsements.length * 25);

  return Math.round(certScore * 0.3 + badgeScore * 0.2 + trainingScore * 0.3 + endorseScore * 0.2);
}
