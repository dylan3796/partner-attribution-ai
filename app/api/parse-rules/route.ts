import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

type ParsedRule = {
  name: string;
  field: string;
  operator: string;
  value: string;
  actionValue: string;
  priority: number;
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { text, availableFields, organizationId, save } = body as {
    text?: string;
    availableFields?: string[];
    organizationId?: string;
    save?: boolean;
  };

  if (!text?.trim()) return NextResponse.json({ rules: [] });

  if (text.length > 5000) {
    return NextResponse.json({ error: "Text too long (max 5000 chars)" }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `You are parsing partner commission rules for a B2B SaaS platform.

Available data fields: ${availableFields?.join(", ") || "partner_tier, partner_type, deal_value, commission_rate"}

Parse this text into commission rules:
"${text}"

Return ONLY a valid JSON array. Each rule object must have these exact fields:
{
  "name": "descriptive rule name",
  "field": "the data field (e.g. partner_tier, deal_value, partner_type)",
  "operator": "is" | ">" | "<" | ">=" | "<=",
  "value": "the value to match (e.g. Gold, $100,000)",
  "actionValue": "commission percentage as string like 20%",
  "priority": number starting at 1
}

Rules:
- If text describes tiers (Gold/Silver/Bronze/Platinum), create one rule per tier with field="partner_tier"
- If text mentions deal size thresholds, use field="deal_value" with operator ">"
- If text mentions partner types, use field="partner_type"
- Assign lower priority numbers to more specific rules
- Return [] if you cannot parse any valid rules
- Return ONLY the JSON array, no explanation`
      }]
    });

    const content = message.content[0];
    if (content.type !== "text") return NextResponse.json({ rules: [] });

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json({ rules: [] });

    const rules: ParsedRule[] = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(rules)) return NextResponse.json({ rules: [] });

    // If save=true and organizationId provided, persist rules to Convex
    if (save && organizationId) {
      const savedRuleIds: string[] = [];

      for (const rule of rules) {
        // Parse actionValue percentage (e.g. "20%") to rate (0.20)
        const percentMatch = rule.actionValue?.match(/(\d+(?:\.\d+)?)/);
        const rate = percentMatch ? parseFloat(percentMatch[1]) / 100 : 0.15;

        // Map field-based conditions to Convex schema fields
        const createArgs: {
          name: string;
          rate: number;
          priority: number;
          partnerTier?: "bronze" | "silver" | "gold" | "platinum";
          partnerType?: "affiliate" | "referral" | "reseller" | "integration";
          minDealSize?: number;
        } = {
          name: rule.name,
          rate,
          priority: rule.priority,
        };

        // Set partnerTier if field="partner_tier"
        if (rule.field === "partner_tier") {
          const tierValue = rule.value.toLowerCase();
          if (["bronze", "silver", "gold", "platinum"].includes(tierValue)) {
            createArgs.partnerTier = tierValue as "bronze" | "silver" | "gold" | "platinum";
          }
        }

        // Set partnerType if field="partner_type"
        if (rule.field === "partner_type") {
          const typeValue = rule.value.toLowerCase();
          if (["affiliate", "referral", "reseller", "integration"].includes(typeValue)) {
            createArgs.partnerType = typeValue as "affiliate" | "referral" | "reseller" | "integration";
          }
        }

        // Set minDealSize if field="deal_value"
        if (rule.field === "deal_value") {
          const amountMatch = rule.value.replace(/[$,]/g, "").match(/(\d+(?:\.\d+)?)/);
          if (amountMatch) {
            createArgs.minDealSize = parseFloat(amountMatch[1]);
          }
        }

        try {
          const ruleId = await convex.mutation(api.commissionRules.create, createArgs);
          savedRuleIds.push(ruleId);
        } catch (err) {
          console.error("[parse-rules] Failed to save rule:", rule.name, err);
        }
      }

      return NextResponse.json({
        rules,
        saved: true,
        savedRuleIds,
      });
    }

    return NextResponse.json({ rules });
  } catch (err) {
    console.error("[parse-rules] Error:", err);
    return NextResponse.json({ rules: [] });
  }
}
