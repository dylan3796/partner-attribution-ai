import { NextResponse } from 'next/server';
import { getConvexClient } from '@/lib/convex-server';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getOpportunities, refreshAccessToken } from '@/lib/salesforce';

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
  opp: { Partner_Name__c?: string; Contact_Email__c?: string; Account?: { Name?: string } },
  partners: Partner[]
): { partner: Partner | null; method: 'name' | 'domain' | null } {
  // First try: match by Partner_Name field (custom Salesforce field)
  const partnerNameField = opp.Partner_Name__c || opp.Account?.Name;
  if (partnerNameField) {
    const nameMatch = partners.find(
      (p) => p.name.toLowerCase() === partnerNameField.toLowerCase()
    );
    if (nameMatch) {
      return { partner: nameMatch, method: 'name' };
    }
  }

  // Second try: match by contact email domain
  const contactEmail = opp.Contact_Email__c;
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

/**
 * POST /api/integrations/salesforce/sync
 * Syncs closed-won opportunities from Salesforce to Covant deals
 */
export async function POST(request: Request) {
  try {
    const convex = getConvexClient();
    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Get Salesforce connection
    const connection = await convex.query(api.integrations.getSalesforceConnection, {
      organizationId: organizationId as Id<"organizations">,
    });

    if (!connection) {
      return NextResponse.json(
        { error: 'Salesforce not connected' },
        { status: 400 }
      );
    }

    let accessToken = connection.accessToken;
    const instanceUrl = connection.instanceUrl;

    // Try to fetch opportunities, refresh token if needed
    let opportunities;
    try {
      opportunities = await getOpportunities(
        accessToken,
        instanceUrl,
        connection.lastSyncedAt
      );
    } catch (error: unknown) {
      // Check if it's an auth error, try to refresh
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('INVALID_SESSION_ID') || errorMessage.includes('401')) {
        try {
          const refreshed = await refreshAccessToken(connection.refreshToken);
          accessToken = refreshed.accessToken;

          // Update tokens in database
          await convex.mutation(api.integrations.updateSalesforceTokens, {
            connectionId: connection._id,
            accessToken: refreshed.accessToken,
            instanceUrl: refreshed.instanceUrl,
          });

          // Retry fetch
          opportunities = await getOpportunities(
            accessToken,
            instanceUrl,
            connection.lastSyncedAt
          );
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return NextResponse.json(
            { error: 'Session expired. Please reconnect Salesforce.' },
            { status: 401 }
          );
        }
      } else {
        throw error;
      }
    }

    // Fetch partners for matching
    const partners = await convex.query(api.integrations.listPartnersForOrg, {
      organizationId: organizationId as Id<"organizations">,
    }) as Partner[];

    // Process opportunities with partner matching
    let created = 0;
    let updated = 0;
    const errors: string[] = [];
    const matched = { count: 0, byName: 0, byDomain: 0 };

    for (const opp of opportunities) {
      try {
        // Try to match a partner
        const { partner, method } = matchPartner(opp, partners);

        const result = await convex.mutation(api.integrations.upsertDealFromSalesforce, {
          organizationId: organizationId as Id<"organizations">,
          salesforceId: opp.Id,
          name: opp.Name,
          amount: opp.Amount || 0,
          closedAt: new Date(opp.CloseDate).getTime(),
          contactName: opp.Account?.Name,
          ownerName: opp.Owner?.Name,
          registeredBy: partner?._id,
        });

        if (result.created) {
          created++;
        } else {
          updated++;
        }

        // Create touchpoint if partner matched
        if (partner) {
          matched.count++;
          if (method === 'name') matched.byName++;
          if (method === 'domain') matched.byDomain++;

          await convex.mutation(api.integrations.createCrmSyncTouchpoint, {
            organizationId: organizationId as Id<"organizations">,
            dealId: result.dealId,
            partnerId: partner._id,
            notes: `Matched by ${method} during Salesforce sync`,
          });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        errors.push(`Failed to sync ${opp.Name}: ${errorMsg}`);
      }
    }

    // Update last synced timestamp
    await convex.mutation(api.integrations.updateLastSynced, {
      connectionId: connection._id,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      synced: {
        total: opportunities.length,
        created,
        updated,
      },
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
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Salesforce sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Salesforce' },
      { status: 500 }
    );
  }
}
