import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are helping a partner program manager configure Covant, a partner intelligence platform. Your job is to ask exactly 4 questions, one at a time, to build a program configuration.

Ask these questions IN ORDER, one per response:
1. "What type of partner program do you run? (resellers, referrals, integration partners, or a mix)"
2. "What partner activities do you track? For example: deal registrations, referrals, demos, co-sell meetings, technical integrations."
3. "When multiple partners touch a deal, how do you give credit? (e.g. first partner who engaged, last partner before close, split equally, weighted by activity)"
4. "How do you pay partners — flat fee per deal, percentage of deal value, or tiered based on volume?"

After the user answers the 4th question, produce a structured config summary in EXACTLY this format:

Here's what I've got — does this look right?

**Program type:** [extracted type]
**Tracking:** [comma-separated list of interaction types]
**Attribution:** [model description]
**Payouts:** [structure description]

Do NOT ask any follow-up questions after producing the summary. Be conversational and brief. Do not number your questions.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return NextResponse.json({ role: "assistant", content: text });
}
