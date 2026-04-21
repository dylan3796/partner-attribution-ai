import { NextResponse } from 'next/server';
import { getConvexClient } from '@/lib/convex-server';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getClosedWonDeals, getContactsBatch, refreshAccessToken, HubSpotDeal } from '@/lib/hubspot';

type Partner = {
  _id: Id<"partners">;
  name: string;
  email: string;
  organizationId: Id<"organizations">;
};

/**
 * Try to match a deal to a partner by name or email domain
 */
function matchPartner(
  deal: HubSpotDeal,
  contactEmail: string | undefined,
  partners: Partner[]
): { partner: Partner | null; method: 'name' | 'domain' | null } {
  // First try: match by partner_name property (custom HubSpot field)
  const partnerNameField = (deal.properties as Record<string, string | null>).partner_name;
  if (partnerNameField) {
    const nameMatch = partners.find(
      (p) => p.name.toLowerCase() === partnerNameField.toLowerCase()
    );
    if (nameMatch) {
      return { partner: nameMatch, method: 'name' };
    }
  }

  // Second try: match by contact email domain
  if (contactEmail && contactEmail.includes('@')) {
    const domain = contactEmail.split('@')[1].toLowerCase();
    const domainMatch = partners.find((p) => {
      if (!p.email || !p.email.includes('@')) return false;
      const partnerDomain = p.email.split('@')[1].toLowerCase();
      return partnerDomain === domain;
    });
    if (domainMatch) {
      return { partner: domainMatch, method: 'domain' };
    }
  }

  return { partner: null, method: null };
}

export async function POST(request: Request) {
  const { organizationId } = await request.json();
  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  const convex = getConvexClient();
  const connection = await convex.query(api.integrations.getHubSpotConnection, {
    organizationId: organizationId as Id<'organizations'>,
  });
  if (!connection) {
    return NextResponse.json({ error: 'HubSpot not connected' }, { status: 400 });
  }

  let { accessToken } = connection;

  // Fetch deals (retry once with refreshed token on 401)
  let deals: HubSpotDeal[];
  try {
    deals = await getClosedWonDeals(accessToken, connection.lastSyncedAt ?? undefined);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('401') || msg.includes('INVALID_SESSION')) {
      const refreshed = await refreshAccessToken(connection.refreshToken);
      accessToken = refreshed.accessToken;
      await convex.mutation(api.integrations.updateHubSpotTokens, {
        connectionId: connection._id,
        accessToken,
      });
      deals = await getClosedWonDeals(accessToken, connection.lastSyncedAt ?? undefined);
    } else {
      throw err;
    }
  }

  // Fetch partners for matching
  const partners = await convex.query(api.integrations.listPartnersForOrg, {
    organizationId: organizationId as Id<"organizations">,
  }) as Partner[];

  let created = 0;
  let updated = 0;
  const errors: string[] = [];
  const matched = { count: 0, byName: 0, byDomain: 0 };

  // Batch-fetch all associated contacts upfront (instead of N+1 per deal)
  const allContactIds = deals
    .map((d) => d.associations?.contacts?.results?.[0]?.id)
    .filter((id): id is string => !!id);
  const uniqueContactIds = [...new Set(allContactIds)];
  const contactMap = await getContactsBatch(accessToken, uniqueContactIds);

  for (const deal of deals) {
    try {
      const props = deal.properties;
      const name = props.dealname ?? 'Unnamed Deal';
      const amount = parseFloat(props.amount ?? '0') || 0;
      const closedAt = props.closedate ? new Date(props.closedate).getTime() : Date.now();

      // Resolve contact from pre-fetched batch
      let contactName: string | undefined;
      let contactEmail: string | undefined;
      const contactId = deal.associations?.contacts?.results?.[0]?.id;
      if (contactId) {
        const contact = contactMap.get(contactId);
        if (contact) {
          const fn = contact.properties.firstname ?? '';
          const ln = contact.properties.lastname ?? '';
          contactEmail = contact.properties.email ?? undefined;
          contactName = `${fn} ${ln}`.trim() || contactEmail;
        }
      }

      // Try to match a partner
      const { partner, method } = matchPartner(deal, contactEmail, partners);

      const result = await convex.mutation(api.integrations.upsertDealFromHubSpot, {
        organizationId: organizationId as Id<'organizations'>,
        hubspotId: deal.id,
        name,
        amount,
        closedAt,
        contactName,
        registeredBy: partner?._id,
      });

      result.created ? created++ : updated++;

      // Create touchpoint if partner matched
      if (partner) {
        matched.count++;
        if (method === 'name') matched.byName++;
        if (method === 'domain') matched.byDomain++;

        await convex.mutation(api.integrations.createCrmSyncTouchpoint, {
          organizationId: organizationId as Id<'organizations'>,
          dealId: result.dealId,
          partnerId: partner._id,
          notes: `Matched by ${method} during HubSpot sync`,
        });
      }
    } catch (e) {
      errors.push(`Deal ${deal.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await convex.mutation(api.integrations.updateHubSpotLastSynced, {
    connectionId: connection._id,
    timestamp: Date.now(),
  });

  return NextResponse.json({
    success: true,
    synced: { total: deals.length, created, updated },
    matched: {
      count: matched.count,
      method: matched.byName > 0 && matched.byDomain > 0
        ? 'name+domain'
        : matched.byName > 0
        ? 'name'
        : matched.byDomain > 0
        ? 'domain'
        : 'none',
    },
    ...(errors.length ? { errors } : {}),
  });
}
