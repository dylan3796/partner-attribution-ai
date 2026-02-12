#!/usr/bin/env node
/**
 * PartnerAI MCP Server
 * 
 * Implements the Model Context Protocol (MCP) to expose PartnerAI data
 * for querying by LLM clients. Supports tools, resources, and prompts.
 * 
 * Usage:
 *   node dist/index.js              # stdio transport (default)
 *   PARTNERAI_API_KEY=pk_xxx node dist/index.js
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  queryPartners,
  queryDeals,
  getAttributionsForDeal,
  getAttributionsForPartner,
  queryPayouts,
  getRevenueMetrics,
  getPartnerScore,
  getTopPartners,
  getAtRiskDeals,
  partners,
  deals,
  attributions,
  payouts,
  auditLog,
} from "./data.js";

// ── Server Setup ──

const server = new Server(
  {
    name: "partnerai",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// ── Tools ──

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "query_partners",
      description: "Search and filter partners. Returns partner data including name, type, tier, status, commission rate, and territory.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: { type: "string", enum: ["active", "inactive", "pending"], description: "Filter by partner status" },
          type: { type: "string", enum: ["affiliate", "referral", "reseller", "integration"], description: "Filter by partner type" },
          tier: { type: "string", enum: ["bronze", "silver", "gold", "platinum"], description: "Filter by partner tier" },
          search: { type: "string", description: "Search by name or email" },
        },
      },
    },
    {
      name: "query_deals",
      description: "Search and filter deals in the pipeline. Returns deal name, amount, status, and dates.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: { type: "string", enum: ["open", "won", "lost"], description: "Filter by deal status" },
          search: { type: "string", description: "Search by deal name" },
          minAmount: { type: "number", description: "Minimum deal amount" },
          maxAmount: { type: "number", description: "Maximum deal amount" },
        },
      },
    },
    {
      name: "get_attribution",
      description: "Get attribution data for a specific deal or partner. Shows how revenue credit is split between partners.",
      inputSchema: {
        type: "object" as const,
        properties: {
          dealId: { type: "string", description: "Deal ID to get attributions for" },
          partnerId: { type: "string", description: "Partner ID to get attributions for" },
        },
      },
    },
    {
      name: "query_payouts",
      description: "View payout status and history. Filter by status or partner.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: { type: "string", enum: ["pending_approval", "approved", "paid", "rejected"], description: "Filter by payout status" },
          partnerId: { type: "string", description: "Filter by partner ID" },
        },
      },
    },
    {
      name: "get_partner_score",
      description: "Get the composite score for a partner, including revenue impact, deal count, and overall score.",
      inputSchema: {
        type: "object" as const,
        properties: {
          partnerId: { type: "string", description: "Partner ID to score" },
        },
        required: ["partnerId"],
      },
    },
    {
      name: "query_revenue",
      description: "Get revenue analytics and metrics including total revenue, pipeline value, win rate, and revenue breakdown by partner.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "get_top_partners",
      description: "Get the top performing partners ranked by score.",
      inputSchema: {
        type: "object" as const,
        properties: {
          limit: { type: "number", description: "Number of top partners to return (default: 5)" },
        },
      },
    },
    {
      name: "get_at_risk_deals",
      description: "Get deals that are at risk of missing their expected close date (closing within 14 days).",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "query_partners": {
        const result = queryPartners(args as any);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "query_deals": {
        const result = queryDeals(args as any);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "get_attribution": {
        const a = args as { dealId?: string; partnerId?: string };
        let result;
        if (a.dealId) {
          result = getAttributionsForDeal(a.dealId);
        } else if (a.partnerId) {
          result = getAttributionsForPartner(a.partnerId);
        } else {
          result = attributions;
        }
        // Enrich with partner/deal names
        const enriched = result.map(attr => ({
          ...attr,
          partnerName: partners.find(p => p.id === attr.partnerId)?.name,
          dealName: deals.find(d => d.id === attr.dealId)?.name,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
        };
      }
      case "query_payouts": {
        const result = queryPayouts(args as any);
        const enriched = result.map(p => ({
          ...p,
          partnerName: partners.find(pt => pt.id === p.partnerId)?.name,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
        };
      }
      case "get_partner_score": {
        const a = args as { partnerId: string };
        const result = getPartnerScore(a.partnerId);
        if (!result) {
          return {
            content: [{ type: "text", text: `Partner not found: ${a.partnerId}` }],
            isError: true,
          };
        }
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "query_revenue": {
        const result = getRevenueMetrics();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "get_top_partners": {
        const a = args as { limit?: number };
        const result = getTopPartners(a.limit);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "get_at_risk_deals": {
        const result = getAtRiskDeals();
        const enriched = result.map(d => ({
          ...d,
          daysUntilClose: d.expectedCloseDate ? Math.round((d.expectedCloseDate - Date.now()) / 86400000) : null,
          registeredByName: d.registeredBy ? partners.find(p => p.id === d.registeredBy)?.name : null,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
        };
      }
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
});

// ── Resources ──

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "partnerai://partners",
      name: "Partner Data",
      description: "All partner records including type, tier, status, and contact information",
      mimeType: "application/json",
    },
    {
      uri: "partnerai://deals",
      name: "Deal Pipeline",
      description: "All deals with status, amounts, and dates",
      mimeType: "application/json",
    },
    {
      uri: "partnerai://revenue",
      name: "Revenue Metrics",
      description: "Revenue analytics, pipeline value, win rate, and partner breakdown",
      mimeType: "application/json",
    },
    {
      uri: "partnerai://audit-log",
      name: "Audit Log",
      description: "Recent activity and change log",
      mimeType: "application/json",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "partnerai://partners":
      return {
        contents: [{ uri, mimeType: "application/json", text: JSON.stringify(partners, null, 2) }],
      };
    case "partnerai://deals":
      return {
        contents: [{ uri, mimeType: "application/json", text: JSON.stringify(deals, null, 2) }],
      };
    case "partnerai://revenue":
      return {
        contents: [{ uri, mimeType: "application/json", text: JSON.stringify(getRevenueMetrics(), null, 2) }],
      };
    case "partnerai://audit-log":
      return {
        contents: [{ uri, mimeType: "application/json", text: JSON.stringify(auditLog, null, 2) }],
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ── Prompts ──

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "top_partners",
      description: "Get a summary of top performing partners with their scores, revenue, and recommendations",
    },
    {
      name: "revenue_breakdown",
      description: "Get a detailed revenue breakdown by partner, deal status, and pipeline analysis",
    },
    {
      name: "at_risk_deals",
      description: "Identify at-risk deals approaching their close date and suggest actions",
    },
    {
      name: "partner_review",
      description: "Generate a comprehensive review of a specific partner's performance",
      arguments: [
        {
          name: "partnerId",
          description: "The partner ID to review (e.g., p_001)",
          required: true,
        },
      ],
    },
    {
      name: "pipeline_forecast",
      description: "Analyze the current deal pipeline and provide a revenue forecast",
    },
    {
      name: "payout_summary",
      description: "Summarize pending and recent payouts across all partners",
    },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "top_partners": {
      const top = getTopPartners(5);
      const metrics = getRevenueMetrics();
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Analyze the top performing partners for our partner program. Here's the data:

Top Partners (by score):
${JSON.stringify(top, null, 2)}

Overall Revenue Metrics:
${JSON.stringify(metrics, null, 2)}

Please provide:
1. A summary of the top 5 partners and their strengths
2. Revenue contribution analysis
3. Recommendations for growing the program
4. Any partners that might need attention or re-engagement`,
            },
          },
        ],
      };
    }

    case "revenue_breakdown": {
      const metrics = getRevenueMetrics();
      const wonDeals = queryDeals({ status: "won" });
      const openDeals = queryDeals({ status: "open" });
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Provide a detailed revenue breakdown for our partner channel. Here's the data:

Revenue Metrics:
${JSON.stringify(metrics, null, 2)}

Won Deals:
${JSON.stringify(wonDeals, null, 2)}

Open Pipeline:
${JSON.stringify(openDeals, null, 2)}

Please analyze:
1. Total revenue and growth trends
2. Revenue breakdown by partner
3. Pipeline health and forecast
4. Win rate analysis
5. Recommended actions to improve revenue`,
            },
          },
        ],
      };
    }

    case "at_risk_deals": {
      const atRisk = getAtRiskDeals();
      const allOpen = queryDeals({ status: "open" });
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Identify and analyze at-risk deals in our pipeline. Here's the data:

At-Risk Deals (closing within 14 days):
${JSON.stringify(atRisk, null, 2)}

All Open Deals:
${JSON.stringify(allOpen, null, 2)}

Please provide:
1. Risk assessment for each at-risk deal
2. Recommended actions to accelerate close
3. Pipeline risk summary
4. Suggested partner engagement strategies`,
            },
          },
        ],
      };
    }

    case "partner_review": {
      const partnerId = args?.partnerId;
      if (!partnerId) {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: "Please provide a partnerId argument to review a specific partner.",
              },
            },
          ],
        };
      }
      const partner = partners.find(p => p.id === partnerId);
      const score = getPartnerScore(partnerId);
      const partnerAttrs = getAttributionsForPartner(partnerId);
      const partnerPayouts = queryPayouts({ partnerId });
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate a comprehensive performance review for this partner:

Partner:
${JSON.stringify(partner, null, 2)}

Score:
${JSON.stringify(score, null, 2)}

Attributions:
${JSON.stringify(partnerAttrs.map(a => ({
  ...a,
  dealName: deals.find(d => d.id === a.dealId)?.name,
})), null, 2)}

Payouts:
${JSON.stringify(partnerPayouts, null, 2)}

Please provide:
1. Overall performance assessment
2. Revenue contribution summary
3. Tier appropriateness (current: ${partner?.tier})
4. Strengths and areas for improvement
5. Recommended next steps`,
            },
          },
        ],
      };
    }

    case "pipeline_forecast": {
      const metrics = getRevenueMetrics();
      const openDeals = queryDeals({ status: "open" });
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Analyze the deal pipeline and provide a revenue forecast:

Revenue Metrics:
${JSON.stringify(metrics, null, 2)}

Open Deals:
${JSON.stringify(openDeals, null, 2)}

Historical Win Rate: ${metrics.winRate}%
Average Deal Size: $${metrics.avgDealSize.toLocaleString()}

Please provide:
1. Pipeline value analysis
2. Expected revenue (pipeline × win rate)
3. Deal-by-deal likelihood assessment
4. Monthly/quarterly forecast
5. Risks and opportunities`,
            },
          },
        ],
      };
    }

    case "payout_summary": {
      const allPayouts = payouts;
      const metrics = getRevenueMetrics();
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Summarize the current payout status:

All Payouts:
${JSON.stringify(allPayouts.map(p => ({
  ...p,
  partnerName: partners.find(pt => pt.id === p.partnerId)?.name,
})), null, 2)}

Key Metrics:
- Total Commissions Earned: $${metrics.totalCommissions.toLocaleString()}
- Pending Payouts: $${metrics.pendingPayouts.toLocaleString()}

Please provide:
1. Payout status summary
2. Per-partner breakdown
3. Pending approvals that need attention
4. Payment timeline recommendations`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// ── Start Server ──

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PartnerAI MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
