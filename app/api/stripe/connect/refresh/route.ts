/**
 * Stripe Connect Refresh URL Handler
 * 
 * GET /api/stripe/connect/refresh?partnerId=xxx
 * Generates a new onboarding URL and redirects to it.
 * Used when the original onboarding link expires.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAccountLink, isStripeConfigured } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  try {
    const partnerId = req.nextUrl.searchParams.get("partnerId");

    if (!partnerId) {
      return NextResponse.redirect(new URL("/portal?error=missing_partner", req.url));
    }

    if (!isStripeConfigured()) {
      return NextResponse.redirect(new URL("/portal?error=stripe_not_configured", req.url));
    }

    // Get partner from Convex
    const partners = await convex.query(api.partners.list);
    const partner = partners.find((p: any) => p._id === partnerId);

    if (!partner?.stripeAccountId) {
      return NextResponse.redirect(new URL("/portal?error=no_stripe_account", req.url));
    }

    // Generate new onboarding URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const returnUrl = `${baseUrl}/portal?stripe_connected=true`;
    const refreshUrl = `${baseUrl}/api/stripe/connect/refresh?partnerId=${partnerId}`;

    const accountLink = await createAccountLink(
      partner.stripeAccountId,
      returnUrl,
      refreshUrl
    );

    // Update the cached URL
    await convex.mutation(api.payouts.updatePartnerStripeAccount, {
      partnerId: partnerId as Id<"partners">,
      stripeAccountId: partner.stripeAccountId,
      stripeOnboardingUrl: accountLink.url,
    });

    // Redirect to the new onboarding URL
    return NextResponse.redirect(accountLink.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe refresh error: ${message}`);
    return NextResponse.redirect(new URL(`/portal?error=${encodeURIComponent(message)}`, req.url));
  }
}
