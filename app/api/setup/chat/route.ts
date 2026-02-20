import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a sharp, concise setup assistant for Covant — a partner intelligence platform that helps companies track which partners drive revenue and automate payouts.

Your job: have a short natural conversation to understand the user's partner program, then output a structured config.

Rules:
- Be conversational and brief. No fluff, no corporate speak.
- Ask follow-up questions only if you genuinely need more info. Most of the time, one good answer is enough.
- Don't ask more than 2 follow-up questions total.
- Once you have enough to configure the program, output ONLY a JSON block (no extra commentary after it):

\`\`\`json
{
  "programType": "short description, e.g. Reseller + Referral",
  "tracking": ["deal registration", "referral", "demo"],
  "attribution": "e.g. Last-touch, or Equal split, or First-touch",
  "payouts": "e.g. 15% of deal value, or Flat $500 per referral"
}
\`\`\`

When you output the JSON, precede it with a brief human summary like: "Got it. Here's how I've configured your program:" — then the JSON block.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Anthropic requires at least one message — if empty, return opening message as plain text
  if (!messages || messages.length === 0) {
    const opening = "Tell me about your partner program — what kind of partners do you work with, what activities matter, and how do you typically pay them?";
    return new Response(opening, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const stream = await client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
