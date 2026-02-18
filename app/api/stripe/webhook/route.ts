/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe Connect events for partner payouts:
 * - transfer.paid: Mark payout as completed
 * - account.updated: Update partner onboarding status
 * 
 * Required env vars:
 * - STRIPE_SECRET_KEY: Stripe API key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret
 * - NEXT_PUBLIC_CONVEX_URL: Convex deployment URL
 */

import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, getAccountStatus, type Stripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client for mutations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  console.log(`Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "transfer.paid": {
        // A transfer to a connected account was paid
        const transfer = event.data.object as Stripe.Transfer;
        console.log(`Transfer paid: ${transfer.id} to ${transfer.destination}`);

        // Find the payout by transfer ID
        const payout = await convex.query(api.payouts.getPayoutByStripeTransfer, {
          stripeTransferId: transfer.id,
        });

        if (payout && payout.status !== "paid") {
          // Update payout status to paid
          await convex.mutation(api.payouts.markPaidViaStripe, {
            id: payout._id,
            stripeTransferId: transfer.id,
          });
          console.log(`Payout ${payout._id} marked as paid`);
        }
        break;
      }

      case "transfer.failed": {
        // A transfer failed
        const transfer = event.data.object as Stripe.Transfer;
        console.log(`Transfer failed: ${transfer.id}`);

        const payout = await convex.query(api.payouts.getPayoutByStripeTransfer, {
          stripeTransferId: transfer.id,
        });

        if (payout) {
          await convex.mutation(api.payouts.markFailed, {
            id: payout._id,
            error: "Stripe transfer failed",
          });
          console.log(`Payout ${payout._id} marked as failed`);
        }
        break;
      }

      case "account.updated": {
        // A connected account was updated (onboarding status may have changed)
        const account = event.data.object as Stripe.Account;
        console.log(`Account updated: ${account.id}, payouts_enabled: ${account.payouts_enabled}`);

        // Find the partner by Stripe account ID
        const partner = await convex.query(api.payouts.getPartnerByStripeAccount, {
          stripeAccountId: account.id,
        });

        if (partner) {
          // Check if onboarding is complete
          const isOnboarded = account.payouts_enabled && account.details_submitted;
          
          if (isOnboarded !== partner.stripeOnboarded) {
            await convex.mutation(api.payouts.updatePartnerStripeOnboarded, {
              partnerId: partner._id,
              stripeOnboarded: isOnboarded,
            });
            console.log(`Partner ${partner._id} stripe onboarded status: ${isOnboarded}`);
          }
        }
        break;
      }

      case "account.application.deauthorized": {
        // Partner disconnected their Stripe account
        const account = event.data.object as Stripe.Account;
        console.log(`Account deauthorized: ${account.id}`);

        const partner = await convex.query(api.payouts.getPartnerByStripeAccount, {
          stripeAccountId: account.id,
        });

        if (partner) {
          await convex.mutation(api.payouts.updatePartnerStripeOnboarded, {
            partnerId: partner._id,
            stripeOnboarded: false,
          });
          console.log(`Partner ${partner._id} Stripe account disconnected`);
        }
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook handler error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Disable body parsing - we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
