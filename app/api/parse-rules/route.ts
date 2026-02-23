import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { text, availableFields } = await req.json();
  if (!text?.trim()) return NextResponse.json({ rules: [] });

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

    const rules = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ rules: Array.isArray(rules) ? rules : [] });
  } catch (err) {
    console.error("[parse-rules] Error:", err);
    return NextResponse.json({ rules: [] });
  }
}
