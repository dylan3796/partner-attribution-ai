/**
 * Ask Covant — AI-powered API Route
 *
 * Accepts POST { question, context?, history? }
 * 1. Groq (Llama 3.3 70B) — fast, free
 * 2. Claude (Haiku) — reliable fallback
 * 3. Returns 503 if neither is configured
 *
 * Context: real org data passed from the client (Convex queries).
 * History: prior messages for multi-turn conversation.
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the Covant AI assistant — a partner intelligence analyst embedded in a partner management platform.

You have access to the company's REAL partner program data provided in each message. This data includes partners, deals, attribution, commissions, payouts, and activity.

Instructions:
- Answer questions about partner performance, attribution, revenue, commissions, deal pipeline, and program health.
- Be specific — use actual names, numbers, and dates from the data provided.
- When making recommendations, explain your reasoning based on the data.
- Keep responses concise and actionable (2-4 paragraphs or a table, not walls of text).
- Use markdown formatting: tables for comparisons, bold for key numbers, bullet points for lists.
- Do NOT make up data — only reference information provided in the context.
- If the data doesn't contain enough information to answer, say so clearly.
- When asked about trends, compare recent periods to historical data if available.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { question, context, history } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // Build the user message with context
    const contextBlock = typeof context === "string" && context.length > 10
      ? context
      : null;

    if (!contextBlock) {
      return NextResponse.json({
        error: "No data context provided. Please ensure your data has loaded.",
        fallback: true,
      }, { status: 400 });
    }

    const userContent = `Here is the current partner program data:\n\n<data>\n${contextBlock}\n</data>\n\nQuestion: ${question}`;

    // Build conversation history for multi-turn support
    const priorMessages: ChatMessage[] = Array.isArray(history)
      ? history
        .filter((m: any) => m.role && m.content)
        .slice(-10) // Keep last 10 messages to stay within token limits
        .map((m: any) => ({ role: m.role, content: m.content }))
      : [];

    // ── 1. Groq (Llama 3.3 70B — fast, free) ──────────────────────────────
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groq = new OpenAI({
          apiKey: groqKey,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...priorMessages,
          { role: "user", content: userContent },
        ];

        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          max_tokens: 1500,
          temperature: 0.3, // Low temperature for data accuracy
        });

        const answer = response.choices[0]?.message?.content;
        if (answer) {
          return NextResponse.json({ answer, model: "groq", aiPowered: true });
        }
      } catch (groqErr) {
        console.warn("[ask/route] Groq failed, trying Claude:", groqErr);
      }
    }

    // ── 2. Claude (Haiku — reliable fallback) ──────────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const claude = new Anthropic({ apiKey: anthropicKey });

        const claudeMessages: { role: "user" | "assistant"; content: string }[] = [
          ...priorMessages,
          { role: "user", content: userContent },
        ];

        const response = await claude.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: claudeMessages,
        });

        const content = response.content[0];
        if (content.type === "text" && content.text) {
          return NextResponse.json({ answer: content.text, model: "claude", aiPowered: true });
        }
      } catch (claudeErr) {
        console.warn("[ask/route] Claude failed:", claudeErr);
      }
    }

    // ── 3. No AI provider configured ───────────────────────────────────────
    return NextResponse.json(
      { error: "No AI provider configured (set GROQ_API_KEY or ANTHROPIC_API_KEY)", fallback: true },
      { status: 503 }
    );
  } catch (err: unknown) {
    console.error("[ask/route] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error", fallback: true },
      { status: 500 }
    );
  }
}
