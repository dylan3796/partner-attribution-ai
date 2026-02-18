/**
 * Stripe Connect Service Module
 * 
 * Handles partner payouts via Stripe Connect (Express accounts).
 * Requires STRIPE_SECRET_KEY environment variable.
 */

import Stripe from "stripe";

// Lazy-initialized Stripe client
let stripeClient: Stripe | null = null;

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Configure it in your environment variables to enable Stripe payouts."
    );
  }
  return key;
}

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeKey(), {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return stripeClient;
}

/**
 * Check if Stripe is configured (has a secret key set)
 */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Create a Stripe Express Connect account for a partner.
 * Express accounts have the simplest onboarding flow.
 */
export async function createConnectedAccount(
  partnerName: string,
  email: string,
  metadata?: Record<string, string>
): Promise<Stripe.Account> {
  const stripe = getStripe();

  const account = await stripe.accounts.create({
    type: "express",
    email,
    business_profile: {
      name: partnerName,
    },
    capabilities: {
      transfers: { requested: true },
    },
    metadata: {
      partner_name: partnerName,
      ...metadata,
    },
  });

  return account;
}

/**
 * Generate an account link for Stripe Express onboarding.
 * Partner clicks this URL to complete their Stripe setup.
 */
export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<Stripe.AccountLink> {
  const stripe = getStripe();

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: "account_onboarding",
  });

  return accountLink;
}

/**
 * Get the current status of a connected account.
 * Used to check if partner has completed onboarding.
 */
export async function getAccountStatus(accountId: string): Promise<{
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: Stripe.Account.Requirements | null;
}> {
  const stripe = getStripe();

  const account = await stripe.accounts.retrieve(accountId);

  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
    requirements: account.requirements ?? null,
  };
}

/**
 * Check if a connected account has completed onboarding and can receive payouts.
 */
export async function isAccountReady(accountId: string): Promise<boolean> {
  const status = await getAccountStatus(accountId);
  return status.payoutsEnabled && status.detailsSubmitted;
}

/**
 * Create a transfer to a connected account (payout to partner).
 * 
 * @param connectedAccountId - Stripe account ID (acct_xxx)
 * @param amount - Amount in dollars (will be converted to cents)
 * @param currency - Currency code (default: usd)
 * @param description - Description for the transfer
 * @param metadata - Optional metadata (e.g., payoutId, partnerId)
 */
export async function createPayout(
  connectedAccountId: string,
  amount: number,
  currency: string = "usd",
  description: string,
  metadata?: Record<string, string>
): Promise<Stripe.Transfer> {
  const stripe = getStripe();

  // Convert dollars to cents
  const amountCents = Math.round(amount * 100);

  if (amountCents <= 0) {
    throw new Error("Payout amount must be greater than zero");
  }

  // First verify the account can receive payouts
  const isReady = await isAccountReady(connectedAccountId);
  if (!isReady) {
    throw new Error(
      "Partner has not completed Stripe onboarding. They must connect their bank account first."
    );
  }

  const transfer = await stripe.transfers.create({
    amount: amountCents,
    currency,
    destination: connectedAccountId,
    description,
    metadata: {
      source: "covant",
      ...metadata,
    },
  });

  return transfer;
}

/**
 * Retrieve a transfer by ID
 */
export async function getTransfer(transferId: string): Promise<Stripe.Transfer> {
  const stripe = getStripe();
  return await stripe.transfers.retrieve(transferId);
}

/**
 * List recent transfers to a connected account
 */
export async function listTransfers(
  connectedAccountId: string,
  limit: number = 10
): Promise<Stripe.Transfer[]> {
  const stripe = getStripe();

  const transfers = await stripe.transfers.list({
    destination: connectedAccountId,
    limit,
  });

  return transfers.data;
}

/**
 * Create a login link for a connected account to access their Stripe dashboard
 */
export async function createLoginLink(accountId: string): Promise<Stripe.LoginLink> {
  const stripe = getStripe();
  return await stripe.accounts.createLoginLink(accountId);
}

/**
 * Verify a Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// Re-export Stripe types for convenience
export type { Stripe };
