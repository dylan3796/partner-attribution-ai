/**
 * Stripe Billing Webhook Handler
 *
 * Handles Stripe subscription lifecycle events:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_failed
 *
 * Required env vars:
 * - STRIPE_SECRET_KEY
 * - STRIPE_BILLING_WEBHOOK_SECRET (separate from Connect webhook secret)
 * - NEXT_PUBLIC_CONVEX_URL
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Map a Stripe price ID to our plan + interval */
function resolvePlan(priceId: string): {
  plan: "starter" | "growth";
  interval: "month" | "year";
} {
  const starterMonthly = process.env.STRIPE_PRICE_STARTER_MONTHLY;
  const starterAnnual = process.env.STRIPE_PRICE_STARTER_ANNUAL;
  const growthMonthly = process.env.STRIPE_PRICE_GROWTH_MONTHLY;
  const growthAnnual = process.env.STRIPE_PRICE_GROWTH_ANNUAL;

  if (priceId === starterMonthly) return { plan: "starter", interval: "month" };
  if (priceId === starterAnnual) return { plan: "starter", interval: "year" };
  if (priceId === growthMonthly) return { plan: "growth", interval: "month" };
  if (priceId === growthAnnual) return { plan: "growth", interval: "year" };

  // Default fallback
  return { plan: "starter", interval: "month" };
}

function toStatus(
  stripeStatus: Stripe.Subscription.Status
): "active" | "trialing" | "past_due" | "canceled" | "incomplete" {
  switch (stripeStatus) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "incomplete";
  }
}

async function handleSubscription(subscription: Stripe.Subscription) {
  const userId =
    (subscription.metadata?.clerkUserId as string | undefined) ?? "";
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price.id ?? "";
  const { plan, interval } = resolvePlan(priceId);
  // In Stripe API 2026-02-25.clover, current_period_end moved to SubscriptionItem
  const currentPeriodEnd = firstItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  await convex.mutation(api.subscriptions.upsertSubscription, {
    userId,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    plan,
    interval,
    status: toStatus(subscription.status),
    currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_BILLING_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Billing webhook signature failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  console.log(`Stripe billing webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Subscription ID is available; full subscription event will fire too
        // but we can also grab the userId from session metadata here
        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          // Ensure userId is set from session if not on subscription yet
          if (!sub.metadata?.clerkUserId && session.client_reference_id) {
            await stripe.subscriptions.update(subscriptionId, {
              metadata: { clerkUserId: session.client_reference_id },
            });
          }
          await handleSubscription(sub);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscription(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscription({ ...subscription, status: "canceled" } as Stripe.Subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe API 2026-02-25.clover, subscription is under parent.subscription_details
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subscriptionId =
          typeof subRef === "string" ? subRef : subRef?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await handleSubscription({
            ...subscription,
            status: "past_due",
          } as Stripe.Subscription);
        }
        break;
      }

      default:
        console.log(`Unhandled billing event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Billing webhook error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
