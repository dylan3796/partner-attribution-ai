import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an onboarding assistant for Covant, a partner intelligence platform. Your goal is to understand the user's partner program and extract a configuration. Ask open-ended questions, aim to get enough info in 1-2 exchanges. Once you have enough information, output a JSON configuration block like this:
\`\`\`json
{"programType": "...", "tracking": ["..."], "attribution": "...", "payouts": "..."}
\`\`\`
Only output the JSON block when you're confident you have enough info. The 'tracking' field should be an array of interaction types.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
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
