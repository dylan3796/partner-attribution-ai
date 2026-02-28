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

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const subscription = await convex.query(api.subscriptions.getSubscriptionByUserId, {
    userId,
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Please subscribe first." },
      { status: 404 }
    );
  }

  const origin = req.headers.get("origin") ?? "https://covant.ai";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/dashboard/settings/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
