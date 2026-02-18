/**
 * Stripe Payout API
 * 
 * POST /api/stripe/payout
 * Initiates a Stripe transfer to a partner's connected account.
 * 
 * Body: { payoutId: string }
 * Returns: { success: boolean, transferId?: string, error?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createPayout, isStripeConfigured, isAccountReady } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Set STRIPE_SECRET_KEY environment variable." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { payoutId } = body;

    if (!payoutId) {
      return NextResponse.json({ error: "payoutId is required" }, { status: 400 });
    }

    // Get payout from Convex
    const payouts = await convex.query(api.payouts.list);
    const payout = payouts.find((p: any) => p._id === payoutId);

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    if (payout.status !== "approved") {
      return NextResponse.json(
        { error: `Payout must be approved before processing. Current status: ${payout.status}` },
        { status: 400 }
      );
    }

    // Get partner
    const partners = await convex.query(api.partners.list);
    const partner = partners.find((p: any) => p._id === payout.partnerId);

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    if (!partner.stripeAccountId) {
      return NextResponse.json(
        { error: "Partner has not connected their Stripe account" },
        { status: 400 }
      );
    }

    if (!partner.stripeOnboarded) {
      // Double-check with Stripe API
      const ready = await isAccountReady(partner.stripeAccountId);
      if (!ready) {
        return NextResponse.json(
          { error: "Partner has not completed Stripe onboarding" },
          { status: 400 }
        );
      }
      // Update the cached status
      await convex.mutation(api.payouts.updatePartnerStripeOnboarded, {
        partnerId: payout.partnerId as Id<"partners">,
        stripeOnboarded: true,
      });
    }

    // Mark payout as processing
    await convex.mutation(api.payouts.markProcessing, {
      id: payoutId as Id<"payouts">,
    });

    try {
      // Create the Stripe transfer
      const transfer = await createPayout(
        partner.stripeAccountId,
        payout.amount,
        "usd",
        `PartnerBase payout - ${payout.period || "Commission"}`,
        {
          payout_id: payoutId,
          partner_id: payout.partnerId,
          period: payout.period || "",
        }
      );

      // Mark payout as paid with transfer ID
      await convex.mutation(api.payouts.markPaidViaStripe, {
        id: payoutId as Id<"payouts">,
        stripeTransferId: transfer.id,
      });

      return NextResponse.json({
        success: true,
        transferId: transfer.id,
      });
    } catch (stripeError) {
      // If Stripe transfer fails, mark payout as failed
      const errorMessage = stripeError instanceof Error ? stripeError.message : "Stripe transfer failed";
      
      await convex.mutation(api.payouts.markFailed, {
        id: payoutId as Id<"payouts">,
        error: errorMessage,
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe payout error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
