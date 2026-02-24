import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getClosedWonDeals, getContact, refreshAccessToken } from '@/lib/hubspot';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

export async function POST(request: Request) {
  const { organizationId } = await request.json();
  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  const connection = await convex.query(api.integrations.getHubSpotConnection, {
    organizationId: organizationId as Id<'organizations'>,
  });
  if (!connection) {
    return NextResponse.json({ error: 'HubSpot not connected' }, { status: 400 });
  }

  let { accessToken } = connection;

  // Fetch deals (retry once with refreshed token on 401)
  let deals;
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

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const deal of deals) {
    try {
      const props = deal.properties;
      const name = props.dealname ?? 'Unnamed Deal';
      const amount = parseFloat(props.amount ?? '0') || 0;
      const closedAt = props.closedate ? new Date(props.closedate).getTime() : Date.now();

      // Optionally resolve first associated contact name
      let contactName: string | undefined;
      const contactId = deal.associations?.contacts?.results?.[0]?.id;
      if (contactId) {
        const contact = await getContact(accessToken, contactId);
        if (contact) {
          const fn = contact.properties.firstname ?? '';
          const ln = contact.properties.lastname ?? '';
          contactName = `${fn} ${ln}`.trim() || contact.properties.email ?? undefined;
        }
      }

      const result = await convex.mutation(api.integrations.upsertDealFromHubSpot, {
        organizationId: organizationId as Id<'organizations'>,
        hubspotId: deal.id,
        name,
        amount,
        closedAt,
        contactName,
      });

      result.created ? created++ : updated++;
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
    ...(errors.length ? { errors } : {}),
  });
}
