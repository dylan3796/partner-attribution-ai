/**
 * Seed Script for Partner Attribution Platform
 * 
 * Creates test data for development and testing:
 * - 1 organization
 * - 5 partners
 * - 10 deals (3 won, 2 lost, 5 open)
 * - Multiple touchpoints per deal
 * - Attributions for won deals
 * 
 * Run with: npx convex run scripts/seed
 * Or:       npx ts-node scripts/seed.ts (for testing locally)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Initialize client (for local development)
const client = new ConvexHttpClient(process.env.CONVEX_URL || "https://quick-lemur-850.convex.cloud");

// ============================================================================
// Test Data
// ============================================================================

const testOrganization = {
  name: "Clearpath Partners",
  email: "admin@acme-partners.com",
  plan: "growth" as const,
};

const testPartners = [
  {
    name: "TechReview Weekly",
    email: "partners@techreview.com",
    type: "affiliate" as const,
    commissionRate: 10,
  },
  {
    name: "Enterprise Solutions Ltd",
    email: "bizdev@enterprise-solutions.com",
    type: "reseller" as const,
    commissionRate: 20,
  },
  {
    name: "Jane Smith",
    email: "jane@referralpro.com",
    type: "referral" as const,
    commissionRate: 15,
  },
  {
    name: "Integration Hub",
    email: "connect@integrationhub.io",
    type: "integration" as const,
    commissionRate: 12,
  },
  {
    name: "Sales Accelerator",
    email: "team@salesaccelerator.com",
    type: "referral" as const,
    commissionRate: 18,
  },
];

const testDeals = [
  // Won deals (will have attributions)
  { name: "Clearpath Annual Contract", amount: 50000, status: "won" as const },
  { name: "TechStart Pilot Program", amount: 15000, status: "won" as const },
  { name: "GlobalBank Enterprise Deal", amount: 120000, status: "won" as const },
  
  // Lost deals
  { name: "MedTech Proposal", amount: 35000, status: "lost" as const },
  { name: "RetailCo Expansion", amount: 22000, status: "lost" as const },
  
  // Open deals (in progress)
  { name: "FinServ Q2 Opportunity", amount: 75000, status: "open" as const },
  { name: "EduTech Platform Deal", amount: 28000, status: "open" as const },
  { name: "ManufactureCo Integration", amount: 45000, status: "open" as const },
  { name: "LogisticsPro Upgrade", amount: 18000, status: "open" as const },
  { name: "HealthPlus Subscription", amount: 32000, status: "open" as const },
];

const touchpointTypes = [
  "referral",
  "demo",
  "content_share",
  "introduction",
  "proposal",
  "negotiation",
] as const;

// ============================================================================
// Seed Functions (for use with Convex mutations)
// ============================================================================

export async function seedData(apiKey: string) {
  console.log("🌱 Starting seed process...\n");
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Track created IDs
  const partnerIds: string[] = [];
  const dealIds: string[] = [];
  
  // 1. Create partners
  console.log("👥 Creating partners...");
  for (const partnerData of testPartners) {
    try {
      const partnerId = await client.mutation(api.partners.mutations.create, {
        apiKey,
        ...partnerData,
      });
      partnerIds.push(partnerId);
      console.log(`   ✓ Created partner: ${partnerData.name}`);
      
      // Activate the partner
      await client.mutation(api.partners.mutations.activate, {
        apiKey,
        partnerId,
      });
    } catch (error: any) {
      console.log(`   ⚠ Skipped partner: ${partnerData.name} (${error.message})`);
    }
  }
  console.log(`   Created ${partnerIds.length} partners\n`);
  
  // 2. Create deals
  console.log("💼 Creating deals...");
  for (const dealData of testDeals) {
    try {
      const dealId = await client.mutation(api.deals.mutations.create, {
        apiKey,
        name: dealData.name,
        amount: dealData.amount,
      });
      dealIds.push(dealId);
      console.log(`   ✓ Created deal: ${dealData.name}`);
      
      // 3. Add touchpoints to each deal (2-4 touchpoints per deal)
      const numTouchpoints = 2 + Math.floor(Math.random() * 3);
      console.log(`     Adding ${numTouchpoints} touchpoints...`);
      
      for (let i = 0; i < numTouchpoints; i++) {
        const partnerId = partnerIds[Math.floor(Math.random() * partnerIds.length)];
        const touchpointType = touchpointTypes[Math.floor(Math.random() * touchpointTypes.length)];
        const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
        
        try {
          await client.mutation(api.touchpoints.mutations.create, {
            apiKey,
            dealId,
            partnerId,
            type: touchpointType,
            notes: `Auto-generated touchpoint for testing`,
          });
        } catch (error: any) {
          console.log(`     ⚠ Skipped touchpoint: ${error.message}`);
        }
      }
      
      // 4. Close deals with appropriate status
      if (dealData.status !== "open") {
        try {
          await client.mutation(api.deals.mutations.close, {
            apiKey,
            dealId,
            status: dealData.status,
          });
          console.log(`     Closed as: ${dealData.status}`);
          
          // 5. Calculate attribution for won deals
          if (dealData.status === "won") {
            try {
              await client.mutation(api.attributions.mutations.calculate, {
                apiKey,
                dealId,
              });
              console.log(`     ✓ Attribution calculated`);
            } catch (error: any) {
              console.log(`     ⚠ Attribution failed: ${error.message}`);
            }
          }
        } catch (error: any) {
          console.log(`     ⚠ Failed to close deal: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.log(`   ⚠ Skipped deal: ${dealData.name} (${error.message})`);
    }
  }
  console.log(`   Created ${dealIds.length} deals\n`);
  
  // 6. Summary
  console.log("📊 Fetching summary...");
  try {
    const stats = await client.query(api.organizations.queries.getStats, { apiKey });
    console.log(`
   Summary:
   --------
   Partners: ${stats.partnersCount} (${stats.activePartnersCount} active)
   Deals: ${stats.dealsCount} (${stats.wonDealsCount} won, ${stats.openDealsCount} open)
   Total Revenue: $${stats.totalRevenue.toLocaleString()}
   Avg Deal Size: $${stats.avgDealSize.toLocaleString()}
   Touchpoints: ${stats.touchpointsCount}
   Attributions: ${stats.attributionsCount}
`);
  } catch (error: any) {
    console.log(`   ⚠ Could not fetch stats: ${error.message}`);
  }
  
  console.log("✅ Seed complete!\n");
}

// ============================================================================
// Convex Function Version (run with npx convex run scripts/seed)
// ============================================================================

/**
 * This is a Convex internal mutation that seeds data directly
 * Use this when running: npx convex run scripts/seed:seed
 */
export const seed = async () => {
  // Note: This is a stub. The actual Convex mutation would need to be in convex/ directory
  // For now, use the HTTP client version above
  console.log("Use the HTTP client version: npx ts-node scripts/seed.ts <API_KEY>");
};

// ============================================================================
// CLI Runner
// ============================================================================

async function main() {
  const apiKey = process.argv[2];
  
  if (!apiKey) {
    console.log(`
Usage: npx ts-node scripts/seed.ts <API_KEY>

First, create an organization:
  1. Run: npx convex run organizations/mutations:create --args '{"name":"Test Org","email":"test@example.com"}'
  2. Copy the returned API key
  3. Run: npx ts-node scripts/seed.ts <API_KEY>
`);
    process.exit(1);
  }
  
  await seedData(apiKey);
}

// Run if executed directly
main().catch(console.error);
