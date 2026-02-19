import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import crypto from 'crypto';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

type EventMappingConfig = {
  partnerId?: string; // JSON path to partner identifier
  amount?: string; // JSON path to amount
  dealName?: string; // JSON path to deal name
  customerId?: string; // JSON path to customer ID
  eventType?: string; // JSON path to event type
  referralCode?: string; // JSON path to referral/promo code
  email?: string; // JSON path to email for partner matching
};

type MappedFields = {
  partnerId?: string;
  amount?: number;
  dealName?: string;
  customerId?: string;
  referralCode?: string;
  email?: string;
};

/**
 * Extract a value from a nested object using dot notation path
 * e.g., "data.object.customer.email" from Stripe webhook
 */
function extractField(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Verify webhook signature using HMAC SHA-256
 */
function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  // Support different signature formats
  // Stripe: "t=timestamp,v1=signature"
  // Shopify: "sha256=signature"
  // Generic: just the signature

  let sigToVerify = signature;

  // Stripe format
  if (signature.includes('v1=')) {
    const match = signature.match(/v1=([a-f0-9]+)/);
    if (match) {
      sigToVerify = match[1];
      // For Stripe, we'd need to include timestamp in HMAC, simplified here
    }
  }

  // Shopify format
  if (signature.startsWith('sha256=')) {
    sigToVerify = signature.replace('sha256=', '');
  }

  const computed = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(sigToVerify.toLowerCase()),
      Buffer.from(computed.toLowerCase())
    );
  } catch {
    return false;
  }
}

/**
 * Determine event type from payload based on source type
 */
function extractEventType(
  payload: Record<string, unknown>,
  sourceType: string,
  mapping?: EventMappingConfig
): string {
  // Custom mapping takes precedence
  if (mapping?.eventType) {
    const extracted = extractField(payload, mapping.eventType);
    if (extracted && typeof extracted === 'string') return extracted;
  }

  // Source-specific defaults
  switch (sourceType) {
    case 'stripe':
      return (payload.type as string) || 'unknown';
    case 'shopify':
      // Shopify sends topic in headers, fallback to payload
      return (payload.topic as string) || 'webhook';
    default:
      return (payload.event as string) || (payload.type as string) || 'webhook';
  }
}

/**
 * POST /api/webhooks/[sourceId]
 * Generic webhook endpoint that accepts events from any configured source
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params;

  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      // Still return 200 (webhook best practice) but log the error
      console.error(`[webhook/${sourceId}] Invalid JSON payload`);
      return NextResponse.json({ received: true, error: 'invalid_json' });
    }

    // Look up the event source
    let source;
    try {
      source = await convex.query(api.eventSources.get, {
        id: sourceId as Id<"eventSources">,
      });
    } catch (err) {
      console.error(`[webhook/${sourceId}] Failed to fetch source:`, err);
      return NextResponse.json({ received: true, error: 'source_not_found' });
    }

    if (!source) {
      console.warn(`[webhook/${sourceId}] Event source not found`);
      return NextResponse.json({ received: true, error: 'source_not_found' });
    }

    // Check if source is active
    if (source.status !== 'active') {
      console.info(`[webhook/${sourceId}] Source is paused, ignoring event`);
      return NextResponse.json({ received: true, status: 'paused' });
    }

    // Verify signature if secret is configured
    if (source.webhookSecret) {
      const signature =
        request.headers.get('stripe-signature') ||
        request.headers.get('x-shopify-hmac-sha256') ||
        request.headers.get('x-webhook-signature') ||
        request.headers.get('x-signature');

      if (!verifySignature(rawBody, signature, source.webhookSecret)) {
        console.warn(`[webhook/${sourceId}] Invalid signature`);
        // Still return 200 but record as error
        await convex.mutation(api.eventSources.recordInboundEvent, {
          sourceId: sourceId as Id<"eventSources">,
          rawPayload: rawBody,
          eventType: 'signature_failed',
          mappedFields: '{}',
          status: 'error',
          errorMessage: 'Webhook signature verification failed',
        });
        return NextResponse.json({ received: true, error: 'invalid_signature' });
      }
    }

    // Parse event mapping configuration
    let mapping: EventMappingConfig = {};
    try {
      mapping = JSON.parse(source.eventMapping || '{}');
    } catch {
      console.warn(`[webhook/${sourceId}] Invalid eventMapping JSON`);
    }

    // Extract event type
    const eventType = extractEventType(payload, source.type, mapping);

    // Map fields from payload
    const mappedFields: MappedFields = {};

    if (mapping.partnerId) {
      const val = extractField(payload, mapping.partnerId);
      if (val) mappedFields.partnerId = String(val);
    }
    if (mapping.amount) {
      const val = extractField(payload, mapping.amount);
      if (val !== undefined) mappedFields.amount = Number(val);
    }
    if (mapping.dealName) {
      const val = extractField(payload, mapping.dealName);
      if (val) mappedFields.dealName = String(val);
    }
    if (mapping.customerId) {
      const val = extractField(payload, mapping.customerId);
      if (val) mappedFields.customerId = String(val);
    }
    if (mapping.referralCode) {
      const val = extractField(payload, mapping.referralCode);
      if (val) mappedFields.referralCode = String(val);
    }
    if (mapping.email) {
      const val = extractField(payload, mapping.email);
      if (val) mappedFields.email = String(val);
    }

    // Try to match to a partner
    let partnerMatch: Id<"partners"> | undefined;
    let dealCreated: Id<"deals"> | undefined;
    let eventStatus: 'pending' | 'matched' | 'ignored' | 'error' = 'pending';

    // Partner matching logic
    if (mappedFields.email || mappedFields.referralCode || mappedFields.partnerId) {
      try {
        const partners = await convex.query(api.partners.list, {});

        // Try to match by email
        if (mappedFields.email) {
          const matched = partners.find(
            (p) => p.email.toLowerCase() === mappedFields.email!.toLowerCase()
          );
          if (matched) partnerMatch = matched._id as Id<"partners">;
        }

        // Try to match by partner ID (could be their ID in external system)
        if (!partnerMatch && mappedFields.partnerId) {
          // Check if it looks like a Convex ID
          const matched = partners.find((p) => p._id === mappedFields.partnerId);
          if (matched) partnerMatch = matched._id as Id<"partners">;
        }

        // Try to match by referral code in notes (simplified matching)
        if (!partnerMatch && mappedFields.referralCode) {
          const matched = partners.find((p) =>
            p.notes?.toLowerCase().includes(mappedFields.referralCode!.toLowerCase())
          );
          if (matched) partnerMatch = matched._id as Id<"partners">;
        }
      } catch (err) {
        console.error(`[webhook/${sourceId}] Partner matching failed:`, err);
      }
    }

    // If we have amount and partner match, potentially create a deal
    if (partnerMatch && mappedFields.amount && mappedFields.amount > 0) {
      try {
        const dealName =
          mappedFields.dealName ||
          `${eventType} - ${mappedFields.customerId || 'Unknown'}`;

        dealCreated = await convex.mutation(api.dealsCrud.create, {
          name: dealName,
          amount: mappedFields.amount,
          status: 'won',
          registeredBy: partnerMatch,
          registrationStatus: 'approved',
          closedAt: Date.now(),
          notes: `Auto-created from ${source.name} webhook (${eventType})`,
          source: 'manual', // Using manual as the source type
        });

        eventStatus = 'matched';
      } catch (err) {
        console.error(`[webhook/${sourceId}] Deal creation failed:`, err);
        eventStatus = 'error';
      }
    } else if (partnerMatch) {
      eventStatus = 'matched';
    } else {
      // No match found - mark as pending for manual review
      eventStatus = 'pending';
    }

    // Record the inbound event
    await convex.mutation(api.eventSources.recordInboundEvent, {
      sourceId: sourceId as Id<"eventSources">,
      rawPayload: rawBody,
      eventType,
      mappedFields: JSON.stringify(mappedFields),
      status: eventStatus,
      partnerMatch,
      dealCreated,
    });

    return NextResponse.json({
      received: true,
      eventType,
      status: eventStatus,
      partnerMatched: !!partnerMatch,
      dealCreated: !!dealCreated,
    });
  } catch (error) {
    console.error(`[webhook/${sourceId}] Unexpected error:`, error);
    // Always return 200 for webhooks
    return NextResponse.json({ received: true, error: 'internal_error' });
  }
}

/**
 * GET /api/webhooks/[sourceId]
 * Health check / verification endpoint (some services like Slack require this)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const { sourceId } = await params;

  // Handle verification challenges (e.g., Slack)
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    status: 'ok',
    sourceId,
    message: 'Webhook endpoint is active. Send POST requests to ingest events.',
  });
}
