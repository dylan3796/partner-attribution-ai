/**
 * Stripe Status API
 * 
 * GET /api/stripe/status
 * Returns whether Stripe is configured and ready for use.
 */

import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/stripe";

export async function GET() {
  const configured = isStripeConfigured();
  const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;

  return NextResponse.json({
    configured,
    hasWebhookSecret,
    ready: configured,
  });
}
