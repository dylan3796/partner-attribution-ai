/**
 * Stripe Connect Account Creation API
 * 
 * POST /api/stripe/connect
 * Creates a Stripe Express account for a partner and returns onboarding URL.
 * 
 * Body: { partnerId: string, returnUrl?: string }
 * Returns: { accountId: string, onboardingUrl: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnectedAccount, createAccountLink, isStripeConfigured } from "@/lib/stripe";
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
    const { partnerId, returnUrl } = body;

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
    }

    // Get partner from Convex
    const partners = await convex.query(api.partners.list);
    const partner = partners.find((p: any) => p._id === partnerId);

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // If partner already has a Stripe account, just return new onboarding URL
    let accountId = partner.stripeAccountId;

    if (!accountId) {
      // Create new Stripe Express account
      const account = await createConnectedAccount(
        partner.name,
        partner.email,
        { partner_id: partnerId }
      );
      accountId = account.id;
    }

    // Generate onboarding URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const defaultReturnUrl = `${baseUrl}/portal?stripe_connected=true`;
    const refreshUrl = `${baseUrl}/api/stripe/connect/refresh?partnerId=${partnerId}`;

    const accountLink = await createAccountLink(
      accountId,
      returnUrl || defaultReturnUrl,
      refreshUrl
    );

    // Update partner in Convex with Stripe account info
    await convex.mutation(api.payouts.updatePartnerStripeAccount, {
      partnerId: partnerId as Id<"partners">,
      stripeAccountId: accountId,
      stripeOnboardingUrl: accountLink.url,
    });

    return NextResponse.json({
      accountId,
      onboardingUrl: accountLink.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe connect error: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
