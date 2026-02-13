/**
 * Ask PartnerBase — Natural Language Query Engine
 *
 * Parses user questions and resolves them against in-memory store data.
 * Returns markdown-formatted answers. No LLM needed — pattern matching + data logic.
 */

import type {
  Partner,
  Deal,
  Touchpoint,
  Attribution,
  Payout,
  AuditEntry,
  AttributionModel,
} from "./types";
import { calculatePartnerScores, type PartnerScore } from "./partner-scoring";

export type QueryContext = {
  partners: Partner[];
  deals: Deal[];
  touchpoints: Touchpoint[];
  attributions: Attribution[];
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

const DAY_MS = 86_400_000;

// ── Helpers ─────────────────────────────────────────

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function daysAgo(ts: number): number {
  return Math.round((Date.now() - ts) / DAY_MS);
}

function relTime(ts: number): string {
  const d = daysAgo(ts);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.round(d / 7)} weeks ago`;
  return `${Math.round(d / 30)} months ago`;
}

function extractNumber(q: string): number {
  const m = q.match(/\b(\d+)\b/);
  return m ? parseInt(m[1], 10) : 3;
}

function partnerRevenue(pid: string, attributions: Attribution[]): number {
  return attributions
    .filter((a) => a.partnerId === pid && a.model === "role_based")
    .reduce((s, a) => s + a.amount, 0);
}

function partnerCommissions(pid: string, attributions: Attribution[]): number {
  return attributions
    .filter((a) => a.partnerId === pid && a.model === "role_based")
    .reduce((s, a) => s + a.commissionAmount, 0);
}

// ── Query Matchers ──────────────────────────────────

type Matcher = {
  patterns: RegExp[];
  handler: (q: string, ctx: QueryContext) => string;
};

const matchers: Matcher[] = [
  // ── Top partners by revenue ──
  {
    patterns: [
      /top\s*(\d*)\s*partner.*(?:revenue|earner|performer)/i,
      /(?:best|highest|most).*partner.*(?:revenue|performing)/i,
      /partner.*(?:most|highest).*revenue/i,
      /who.*top.*partner/i,
      /top\s*partner/i,
      /best\s*partner/i,
      /highest.*revenue.*partner/i,
    ],
    handler: (q, ctx) => {
      const n = extractNumber(q) || 3;
      const partnerRevenues = ctx.partners
        .filter((p) => p.status === "active")
        .map((p) => ({
          partner: p,
          revenue: partnerRevenue(p._id, ctx.attributions),
          commissions: partnerCommissions(p._id, ctx.attributions),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, n);

      if (partnerRevenues.length === 0) {
        return "No active partners with attributed revenue found.";
      }

      let md = `## 🏆 Top ${n} Partners by Revenue\n\n`;
      md += "| Rank | Partner | Revenue | Commission | Tier |\n";
      md += "|------|---------|---------|------------|------|\n";
      partnerRevenues.forEach((pr, i) => {
        md += `| ${i + 1} | **${pr.partner.name}** | ${fmt(pr.revenue)} | ${fmt(pr.commissions)} | ${(pr.partner.tier || "bronze").charAt(0).toUpperCase() + (pr.partner.tier || "bronze").slice(1)} |\n`;
      });
      return md;
    },
  },

  // ── Deals at risk / churning ──
  {
    patterns: [
      /deals?\s*(?:at\s*)?risk/i,
      /churn(?:ing)?/i,
      /(?:stale|stuck|stalled)\s*deal/i,
      /deals?\s*(?:about\s*to|might)\s*(?:lose|churn|close.*lost)/i,
    ],
    handler: (_q, ctx) => {
      const now = Date.now();
      const openDeals = ctx.deals.filter((d) => d.status === "open");
      const atRisk = openDeals.filter((d) => {
        if (d.expectedCloseDate && d.expectedCloseDate < now + 15 * DAY_MS) return true;
        const tp = ctx.touchpoints.filter((t) => t.dealId === d._id);
        const lastActivity = tp.length > 0 ? Math.max(...tp.map((t) => t.createdAt)) : d.createdAt;
        return now - lastActivity > 14 * DAY_MS;
      });

      if (atRisk.length === 0) {
        return "✅ **No deals currently at risk.** All open deals have recent activity and reasonable timelines.";
      }

      let md = `## ⚠️ Deals at Risk (${atRisk.length})\n\n`;
      for (const deal of atRisk) {
        const tp = ctx.touchpoints.filter((t) => t.dealId === deal._id);
        const lastActivity = tp.length > 0 ? Math.max(...tp.map((t) => t.createdAt)) : deal.createdAt;
        const risks: string[] = [];
        if (deal.expectedCloseDate && deal.expectedCloseDate < now + 15 * DAY_MS) {
          const daysLeft = Math.round((deal.expectedCloseDate - now) / DAY_MS);
          risks.push(daysLeft < 0 ? `⏰ **Overdue by ${-daysLeft} days**` : `⏰ Closing in ${daysLeft} days`);
        }
        if (now - lastActivity > 14 * DAY_MS) {
          risks.push(`🔇 No activity for ${daysAgo(lastActivity)} days`);
        }
        md += `### ${deal.name}\n`;
        md += `- **Value:** ${fmt(deal.amount)}\n`;
        md += `- **Last activity:** ${relTime(lastActivity)}\n`;
        md += risks.map((r) => `- ${r}`).join("\n") + "\n\n";
      }
      return md;
    },
  },

  // ── Pipeline forecast ──
  {
    patterns: [
      /pipeline\s*(?:forecast|value|summary)/i,
      /(?:forecast|pipeline)\s*(?:for\s*)?(?:q[1-4]|this\s*quarter|next\s*quarter)/i,
      /what.*pipeline/i,
      /how\s*much.*pipeline/i,
      /open\s*deals?\s*(?:value|total|summary)/i,
    ],
    handler: (_q, ctx) => {
      const openDeals = ctx.deals.filter((d) => d.status === "open");
      const totalPipeline = openDeals.reduce((s, d) => s + d.amount, 0);

      let md = `## 📊 Pipeline Forecast\n\n`;
      md += `**Total Pipeline:** ${fmt(totalPipeline)} across **${openDeals.length}** open deals\n\n`;

      if (openDeals.length > 0) {
        md += "| Deal | Value | Expected Close | Status |\n";
        md += "|------|-------|----------------|--------|\n";
        for (const deal of openDeals.sort((a, b) => (b.amount) - (a.amount))) {
          const closeDate = deal.expectedCloseDate
            ? new Date(deal.expectedCloseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "TBD";
          const reg = deal.registrationStatus
            ? `🏷️ ${deal.registrationStatus}`
            : "Direct";
          md += `| **${deal.name}** | ${fmt(deal.amount)} | ${closeDate} | ${reg} |\n`;
        }
      }

      md += `\n**Win Rate:** ${ctx.stats.winRate}% · **Avg Deal Size:** ${fmt(ctx.stats.avgDealSize)}\n`;
      md += `\n_Weighted forecast (pipeline × win rate):_ **${fmt(Math.round(totalPipeline * ctx.stats.winRate / 100))}**`;
      return md;
    },
  },

  // ── Partners not engaged / inactive ──
  {
    patterns: [
      /partner.*(?:haven'?t|not|no)\s*(?:engaged|active|responded)/i,
      /inactive\s*partner/i,
      /partner.*(?:no\s*activity|disengaged|dormant|quiet|silent)/i,
      /(?:who|which)\s*partner.*(?:\d+)\s*days/i,
      /partner.*engagement/i,
      /disengaged\s*partner/i,
    ],
    handler: (q, ctx) => {
      const days = extractNumber(q) || 30;
      const now = Date.now();
      const threshold = now - days * DAY_MS;

      const partnerActivity = ctx.partners
        .filter((p) => p.status === "active")
        .map((p) => {
          const tp = ctx.touchpoints.filter((t) => t.partnerId === p._id);
          const lastActivity = tp.length > 0 ? Math.max(...tp.map((t) => t.createdAt)) : p.createdAt;
          return { partner: p, lastActivity, daysSince: daysAgo(lastActivity) };
        })
        .filter((pa) => pa.lastActivity < threshold)
        .sort((a, b) => a.lastActivity - b.lastActivity);

      if (partnerActivity.length === 0) {
        return `✅ **All active partners have engaged within the last ${days} days.** Your partner ecosystem is healthy!`;
      }

      let md = `## 🔇 Partners Without Activity (${days}+ days)\n\n`;
      md += "| Partner | Last Activity | Days Silent | Tier | Type |\n";
      md += "|---------|---------------|-------------|------|------|\n";
      for (const pa of partnerActivity) {
        md += `| **${pa.partner.name}** | ${relTime(pa.lastActivity)} | ${pa.daysSince} days | ${(pa.partner.tier || "bronze")} | ${pa.partner.type} |\n`;
      }
      md += `\n💡 *Consider a re-engagement campaign or direct outreach to these partners.*`;
      return md;
    },
  },

  // ── Payouts / commissions ──
  {
    patterns: [
      /(?:how\s*much|total).*(?:paid\s*out|payout|commissions?)/i,
      /payout.*(?:this\s*quarter|this\s*month|total|summary|status)/i,
      /commission.*(?:paid|owed|pending|summary|total)/i,
      /what.*(?:paid\s*out|payout|commissions?)/i,
    ],
    handler: (_q, ctx) => {
      const paid = ctx.payouts.filter((p) => p.status === "paid");
      const approved = ctx.payouts.filter((p) => p.status === "approved");
      const pending = ctx.payouts.filter((p) => p.status === "pending_approval");
      const totalPaid = paid.reduce((s, p) => s + p.amount, 0);
      const totalApproved = approved.reduce((s, p) => s + p.amount, 0);
      const totalPending = pending.reduce((s, p) => s + p.amount, 0);

      let md = `## 💰 Payout Summary\n\n`;
      md += `| Status | Count | Total |\n`;
      md += `|--------|-------|-------|\n`;
      md += `| ✅ Paid | ${paid.length} | ${fmt(totalPaid)} |\n`;
      md += `| 👍 Approved | ${approved.length} | ${fmt(totalApproved)} |\n`;
      md += `| ⏳ Pending Approval | ${pending.length} | ${fmt(totalPending)} |\n`;
      md += `| **Total** | **${ctx.payouts.length}** | **${fmt(totalPaid + totalApproved + totalPending)}** |\n`;

      if (pending.length > 0) {
        md += `\n### Pending Payouts\n\n`;
        for (const p of pending) {
          const partner = ctx.partners.find((pr) => pr._id === p.partnerId);
          md += `- **${partner?.name || "Unknown"}** — ${fmt(p.amount)} (${p.period || "N/A"})\n`;
        }
      }

      return md;
    },
  },

  // ── Partner scores / rankings ──
  {
    patterns: [
      /partner\s*scor/i,
      /partner\s*rank/i,
      /tier.*recommend/i,
      /who.*(?:upgrade|downgrade)/i,
      /scoring\s*(?:summary|overview)/i,
    ],
    handler: (_q, ctx) => {
      const scores = calculatePartnerScores(
        ctx.partners,
        ctx.deals,
        ctx.touchpoints,
        ctx.attributions
      );

      let md = `## 📈 Partner Scores & Rankings\n\n`;
      md += "| Rank | Partner | Score | Current Tier | Recommended | Trend |\n";
      md += "|------|---------|-------|-------------|-------------|-------|\n";
      for (const s of scores) {
        const trendIcon = s.trend === "up" ? "📈" : s.trend === "down" ? "📉" : "➡️";
        const change = s.tierChange === "upgrade" ? " 🔺" : s.tierChange === "downgrade" ? " 🔻" : "";
        md += `| ${s.rank} | **${s.partnerName}** | ${s.overallScore}/100 | ${s.currentTier} | ${s.recommendedTier}${change} | ${trendIcon} |\n`;
      }

      const upgrades = scores.filter((s) => s.tierChange === "upgrade");
      if (upgrades.length > 0) {
        md += `\n### 🔺 Upgrade Candidates\n`;
        for (const u of upgrades) {
          md += `- **${u.partnerName}** — ${u.currentTier} → ${u.recommendedTier} (score: ${u.overallScore})\n`;
        }
      }

      return md;
    },
  },

  // ── Deal summary / overview ──
  {
    patterns: [
      /deal\s*(?:summary|overview|stats)/i,
      /how\s*many\s*deals/i,
      /show.*all\s*deals/i,
      /deal\s*status/i,
    ],
    handler: (_q, ctx) => {
      let md = `## 📋 Deal Summary\n\n`;
      md += `| Metric | Value |\n`;
      md += `|--------|-------|\n`;
      md += `| Total Deals | ${ctx.stats.totalDeals} |\n`;
      md += `| Open | ${ctx.stats.openDeals} (${fmt(ctx.stats.pipelineValue)}) |\n`;
      md += `| Won | ${ctx.stats.wonDeals} (${fmt(ctx.stats.totalRevenue)}) |\n`;
      md += `| Lost | ${ctx.stats.lostDeals} |\n`;
      md += `| Win Rate | ${ctx.stats.winRate}% |\n`;
      md += `| Avg Deal Size | ${fmt(ctx.stats.avgDealSize)} |\n`;

      md += `\n### Recent Won Deals\n\n`;
      const recentWon = ctx.deals
        .filter((d) => d.status === "won")
        .sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0))
        .slice(0, 5);
      for (const d of recentWon) {
        md += `- **${d.name}** — ${fmt(d.amount)} (closed ${relTime(d.closedAt || d.createdAt)})\n`;
      }

      return md;
    },
  },

  // ── Revenue / total revenue ──
  {
    patterns: [
      /total\s*revenue/i,
      /how\s*much\s*revenue/i,
      /revenue\s*(?:summary|total|overview)/i,
    ],
    handler: (_q, ctx) => {
      const wonByPartner = ctx.partners
        .filter((p) => p.status === "active")
        .map((p) => ({
          name: p.name,
          revenue: partnerRevenue(p._id, ctx.attributions),
        }))
        .sort((a, b) => b.revenue - a.revenue);

      let md = `## 💵 Revenue Summary\n\n`;
      md += `**Total Won Revenue:** ${fmt(ctx.stats.totalRevenue)}\n`;
      md += `**Pipeline Value:** ${fmt(ctx.stats.pipelineValue)}\n\n`;
      md += `### Revenue by Partner (Role-Based Attribution)\n\n`;
      md += "| Partner | Attributed Revenue | Share |\n";
      md += "|---------|-------------------|-------|\n";
      for (const pr of wonByPartner) {
        if (pr.revenue === 0) continue;
        const share = ctx.stats.totalRevenue > 0 ? (pr.revenue / ctx.stats.totalRevenue) * 100 : 0;
        md += `| **${pr.name}** | ${fmt(pr.revenue)} | ${fmtPct(share)} |\n`;
      }
      return md;
    },
  },

  // ── Partner details ──
  {
    patterns: [
      /(?:tell|show|info|details?).*(?:about|on|for)\s+(?:partner\s+)?(.+)/i,
      /(?:who\s*is|what\s*about)\s+(.+)/i,
    ],
    handler: (q, ctx) => {
      // Try to find a partner by name
      const nameMatch = q.match(/(?:about|on|for|is)\s+(?:partner\s+)?(.+?)(?:\?|$)/i);
      const searchTerm = nameMatch ? nameMatch[1].trim().toLowerCase() : "";
      const partner = ctx.partners.find(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          (p.contactName && p.contactName.toLowerCase().includes(searchTerm))
      );

      if (!partner) {
        return `I couldn't find a partner matching "${searchTerm}". Try one of: ${ctx.partners.map((p) => p.name).join(", ")}`;
      }

      const revenue = partnerRevenue(partner._id, ctx.attributions);
      const commissions = partnerCommissions(partner._id, ctx.attributions);
      const tp = ctx.touchpoints.filter((t) => t.partnerId === partner._id);
      const deals = new Set(tp.map((t) => t.dealId));
      const partnerPayouts = ctx.payouts.filter((p) => p.partnerId === partner._id);

      let md = `## 👤 ${partner.name}\n\n`;
      md += `| Field | Value |\n`;
      md += `|-------|-------|\n`;
      md += `| Type | ${partner.type} |\n`;
      md += `| Tier | ${partner.tier || "bronze"} |\n`;
      md += `| Status | ${partner.status} |\n`;
      md += `| Commission Rate | ${partner.commissionRate}% |\n`;
      md += `| Contact | ${partner.contactName || "—"} |\n`;
      md += `| Territory | ${partner.territory || "—"} |\n`;
      md += `| Attributed Revenue | ${fmt(revenue)} |\n`;
      md += `| Commissions Earned | ${fmt(commissions)} |\n`;
      md += `| Deals Involved | ${deals.size} |\n`;
      md += `| Touchpoints | ${tp.length} |\n`;
      md += `| Total Payouts | ${fmt(partnerPayouts.reduce((s, p) => s + p.amount, 0))} |\n`;

      if (partner.notes) {
        md += `\n> 📝 ${partner.notes}\n`;
      }

      return md;
    },
  },

  // ── Recent activity ──
  {
    patterns: [
      /recent\s*activity/i,
      /what.*happened\s*(?:recently|today|this\s*week|lately)/i,
      /latest\s*(?:activity|events?|updates?)/i,
      /what'?s\s*new/i,
    ],
    handler: (_q, ctx) => {
      const recent = ctx.auditLog
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10);

      let md = `## 📋 Recent Activity\n\n`;
      for (const entry of recent) {
        const meta = entry.metadata ? JSON.parse(entry.metadata) : {};
        const changes = entry.changes ? entry.changes : "";
        const desc =
          meta.deal || meta.partner || changes || entry.entityId;
        md += `- **${entry.action}** — ${desc} (${relTime(entry.createdAt)})\n`;
      }
      return md;
    },
  },

  // ── Attribution model comparison ──
  {
    patterns: [
      /attribution\s*model/i,
      /compare.*model/i,
      /(?:which|what)\s*model/i,
      /model\s*comparison/i,
    ],
    handler: (_q, ctx) => {
      const models: AttributionModel[] = [
        "equal_split",
        "first_touch",
        "last_touch",
        "time_decay",
        "role_based",
      ];
      const modelLabels: Record<string, string> = {
        equal_split: "Equal Split",
        first_touch: "First Touch",
        last_touch: "Last Touch",
        time_decay: "Time Decay",
        role_based: "Role-Based",
      };

      let md = `## 🔀 Attribution Model Comparison\n\n`;
      md += "| Model | Total Attributed | Avg per Partner | Partners |\n";
      md += "|-------|-----------------|-----------------|----------|\n";

      for (const model of models) {
        const modelAttrs = ctx.attributions.filter((a) => a.model === model);
        const totalAttr = modelAttrs.reduce((s, a) => s + a.amount, 0);
        const partnerSet = new Set(modelAttrs.map((a) => a.partnerId));
        const avgPerPartner = partnerSet.size > 0 ? totalAttr / partnerSet.size : 0;
        md += `| **${modelLabels[model]}** | ${fmt(totalAttr)} | ${fmt(Math.round(avgPerPartner))} | ${partnerSet.size} |\n`;
      }

      md += `\n_Currently using **Role-Based** as the default model._`;
      return md;
    },
  },

  // ── Dashboard / overview stats ──
  {
    patterns: [
      /(?:dashboard|overview|summary|kpi|stats|metrics)\s*$/i,
      /give.*(?:overview|summary)/i,
      /show.*(?:dashboard|kpi|metrics)/i,
      /how.*(?:doing|performing)/i,
      /what.*numbers/i,
    ],
    handler: (_q, ctx) => {
      let md = `## 📊 Dashboard Overview\n\n`;
      md += "| Metric | Value |\n";
      md += "|--------|-------|\n";
      md += `| Total Revenue (Won) | ${fmt(ctx.stats.totalRevenue)} |\n`;
      md += `| Pipeline Value | ${fmt(ctx.stats.pipelineValue)} |\n`;
      md += `| Win Rate | ${ctx.stats.winRate}% |\n`;
      md += `| Avg Deal Size | ${fmt(ctx.stats.avgDealSize)} |\n`;
      md += `| Active Partners | ${ctx.stats.activePartners} / ${ctx.stats.totalPartners} |\n`;
      md += `| Open Deals | ${ctx.stats.openDeals} |\n`;
      md += `| Total Commissions | ${fmt(ctx.stats.totalCommissions)} |\n`;
      md += `| Pending Payouts | ${fmt(ctx.stats.pendingPayouts)} |\n`;
      return md;
    },
  },

  // ── Partner list ──
  {
    patterns: [
      /list.*partner/i,
      /all\s*partner/i,
      /show.*partner/i,
      /how\s*many\s*partner/i,
    ],
    handler: (_q, ctx) => {
      let md = `## 👥 All Partners (${ctx.partners.length})\n\n`;
      md += "| Partner | Type | Tier | Status | Commission Rate |\n";
      md += "|---------|------|------|--------|----------------|\n";
      for (const p of ctx.partners) {
        md += `| **${p.name}** | ${p.type} | ${p.tier || "bronze"} | ${p.status} | ${p.commissionRate}% |\n`;
      }
      return md;
    },
  },
];

// ── Main Entry ──────────────────────────────────────

export function processQuery(question: string, ctx: QueryContext): string {
  const q = question.trim();

  for (const matcher of matchers) {
    for (const pattern of matcher.patterns) {
      if (pattern.test(q)) {
        return matcher.handler(q, ctx);
      }
    }
  }

  // Fallback — try to be helpful
  return (
    `I'm not sure how to answer that. Here are some things you can ask me:\n\n` +
    `- **"Who are my top 3 partners by revenue?"**\n` +
    `- **"Show me deals at risk of churning"**\n` +
    `- **"What's my partner-influenced pipeline?"**\n` +
    `- **"Which partners haven't engaged in 30 days?"**\n` +
    `- **"How much have I paid out this quarter?"**\n` +
    `- **"Show me partner scores and rankings"**\n` +
    `- **"Tell me about TechStar Solutions"**\n` +
    `- **"What's the deal summary?"**\n` +
    `- **"Compare attribution models"**\n` +
    `- **"Give me a dashboard overview"**\n` +
    `- **"Show recent activity"**\n` +
    `- **"List all partners"**\n`
  );
}
