/**
 * Ask Covant — AI-powered API Route
 *
 * Accepts POST { question: string, context?: object }
 * Uses Groq (Llama 3.3 70B) — free, fast.
 * Returns { answer, model: "groq", aiPowered: true }
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  demoPartners,
  demoDeals,
  demoTouchpoints,
  demoAttributions,
  demoPayouts,
} from "@/lib/demo-data";

const SYSTEM_PROMPT = `You are the Covant AI assistant — a partner intelligence analyst.
You have access to the company's partner program data including partners, deals, attribution, commissions, and activity.

Answer questions about partner performance, attribution, revenue, commissions, deal pipeline, and program health.
Be specific — use actual numbers from the data. When making recommendations, explain your reasoning.

Keep responses concise and actionable. Use markdown formatting for readability.
When showing tables, use proper markdown table syntax. Use emoji sparingly for readability.
Do not make up data — only reference information provided in the context.`;

function buildContext(): string {
  // ── Partners summary ──
  const partnerSummary = demoPartners.map((p) => ({
    id: p._id,
    name: p.name,
    type: p.type,
    tier: p.tier,
    commissionRate: `${p.commissionRate}%`,
    status: p.status,
    territory: p.territory || "—",
    contact: p.contactName || "—",
    notes: p.notes || "",
  }));

  // ── Deals summary ──
  const dealSummary = demoDeals.map((d) => ({
    id: d._id,
    name: d.name,
    amount: d.amount,
    status: d.status,
    closedAt: d.closedAt ? new Date(d.closedAt).toISOString().split("T")[0] : null,
    expectedClose: d.expectedCloseDate
      ? new Date(d.expectedCloseDate).toISOString().split("T")[0]
      : null,
    registeredBy: d.registeredBy || null,
    registrationStatus: d.registrationStatus || null,
  }));

  // ── Attribution by partner (role_based model only — the default) ──
  const roleBasedAttrs = demoAttributions.filter((a) => a.model === "role_based");
  const attrByPartner: Record<string, { revenue: number; commissions: number; deals: string[] }> = {};
  for (const attr of roleBasedAttrs) {
    if (!attrByPartner[attr.partnerId]) {
      attrByPartner[attr.partnerId] = { revenue: 0, commissions: 0, deals: [] };
    }
    attrByPartner[attr.partnerId].revenue += attr.amount;
    attrByPartner[attr.partnerId].commissions += attr.commissionAmount;
    if (!attrByPartner[attr.partnerId].deals.includes(attr.dealId)) {
      attrByPartner[attr.partnerId].deals.push(attr.dealId);
    }
  }

  const attributionSummary = Object.entries(attrByPartner).map(([pid, data]) => {
    const partner = demoPartners.find((p) => p._id === pid);
    return {
      partner: partner?.name || pid,
      attributedRevenue: Math.round(data.revenue),
      commissionsEarned: Math.round(data.commissions),
      dealCount: data.deals.length,
    };
  }).sort((a, b) => b.attributedRevenue - a.attributedRevenue);

  // ── Payout summary ──
  const payoutSummary = demoPayouts.map((p) => {
    const partner = demoPartners.find((pr) => pr._id === p.partnerId);
    return {
      partner: partner?.name || p.partnerId,
      amount: p.amount,
      status: p.status,
      period: p.period || "—",
    };
  });

  // ── Stats ──
  const wonDeals = demoDeals.filter((d) => d.status === "won");
  const openDeals = demoDeals.filter((d) => d.status === "open");
  const lostDeals = demoDeals.filter((d) => d.status === "lost");
  const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
  const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
  const winRate = demoDeals.length > 0
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
    : 0;
  const totalCommissions = roleBasedAttrs.reduce((s, a) => s + a.commissionAmount, 0);
  const pendingPayouts = demoPayouts
    .filter((p) => p.status === "pending_approval")
    .reduce((s, p) => s + p.amount, 0);

  const stats = {
    totalRevenue,
    pipelineValue,
    totalDeals: demoDeals.length,
    wonDeals: wonDeals.length,
    openDeals: openDeals.length,
    lostDeals: lostDeals.length,
    winRate: `${winRate}%`,
    avgDealSize: wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0,
    totalCommissions: Math.round(totalCommissions),
    pendingPayouts,
    activePartners: demoPartners.filter((p) => p.status === "active").length,
    totalPartners: demoPartners.length,
  };

  // ── Touchpoints summary (last 10 by deal) ──
  const touchpointSummary = demoTouchpoints.map((tp) => {
    const partner = demoPartners.find((p) => p._id === tp.partnerId);
    const deal = demoDeals.find((d) => d._id === tp.dealId);
    return {
      partner: partner?.name || tp.partnerId,
      deal: deal?.name || tp.dealId,
      type: tp.type,
      date: new Date(tp.createdAt).toISOString().split("T")[0],
    };
  });

  return JSON.stringify({
    stats,
    partners: partnerSummary,
    deals: dealSummary,
    attributionByPartner: attributionSummary,
    payouts: payoutSummary,
    recentTouchpoints: touchpointSummary,
  }, null, 2);
}

export async function POST(req: NextRequest) {
  try {
    const { question, context: clientContext } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // Use client-provided context (real Convex data) if available, otherwise fall back to demo data
    const context = (typeof clientContext === "string" && clientContext.length > 10) ? clientContext : buildContext();
    const userContent = `Here is the current partner program data:\n\n<data>\n${context}\n</data>\n\nQuestion: ${question}`;

    // ── 1. Groq (Llama 3.3 70B — free, fast) ────────────────────────────────
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groq = new OpenAI({
          apiKey: groqKey,
          baseURL: "https://api.groq.com/openai/v1",
        });
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        });
        const answer = response.choices[0]?.message?.content;
        if (answer) {
          return NextResponse.json({ answer, model: "groq", aiPowered: true });
        }
      } catch (groqErr) {
        console.warn("[ask/route] Groq failed, falling back to Claude:", groqErr);
      }
    }

    // ── 2. Fallback: Claude Haiku ─────────────────────────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { error: "No AI provider configured (GROQ_API_KEY or ANTHROPIC_API_KEY required)", fallback: true },
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey: anthropicKey });
    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    return NextResponse.json({ answer: content.text, model: "claude", aiPowered: true });
  } catch (err: unknown) {
    console.error("[ask/route] Error:", err);

    const status =
      err instanceof Anthropic.APIError ? err.status ?? 500 : 500;
    const errMessage =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      { error: errMessage, fallback: true },
      { status }
    );
  }
}
