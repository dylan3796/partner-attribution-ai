import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Map plan + interval to Stripe price ID from env vars */
function getPriceId(plan: string, interval: string): string | null {
  const map: Record<string, string | undefined> = {
    "starter-month": process.env.STRIPE_PRICE_STARTER_MONTHLY,
    "starter-year": process.env.STRIPE_PRICE_STARTER_ANNUAL,
    "growth-month": process.env.STRIPE_PRICE_GROWTH_MONTHLY,
    "growth-year": process.env.STRIPE_PRICE_GROWTH_ANNUAL,
  };
  return map[`${plan}-${interval}`] ?? null;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let body: { plan?: string; interval?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { plan, interval } = body;

  if (!plan || !interval) {
    return NextResponse.json({ error: "Missing plan or interval" }, { status: 400 });
  }

  if (!["starter", "growth"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!["month", "year"].includes(interval)) {
    return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }

  const priceId = getPriceId(plan, interval);

  if (!priceId) {
    // Stripe price IDs not yet configured — return a placeholder URL for testing
    const origin = req.headers.get("origin") ?? "https://covant.ai";
    return NextResponse.json({
      url: `${origin}/pricing?error=stripe-not-configured`,
      message: "Stripe price IDs not yet configured in env vars",
    });
  }

  // Look up existing Stripe customer for this user
  const existingSubscription = await convex.query(api.subscriptions.getSubscriptionByUserId, {
    userId,
  });

  let customerId: string;

  if (existingSubscription?.stripeCustomerId) {
    customerId = existingSubscription.stripeCustomerId;
  } else {
    // Create new Stripe customer
    const customer = await stripe.customers.create({
      metadata: { clerkUserId: userId },
    });
    customerId = customer.id;
  }

  const origin = req.headers.get("origin") ?? "https://covant.ai";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?upgrade=success`,
    cancel_url: `${origin}/pricing`,
    subscription_data: {
      metadata: { clerkUserId: userId },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return NextResponse.json({ url: session.url });
}
