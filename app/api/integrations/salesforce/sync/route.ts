import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { getOpportunities, refreshAccessToken } from '@/lib/salesforce';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

/**
 * POST /api/integrations/salesforce/sync
 * Syncs closed-won opportunities from Salesforce to Covant deals
 */
export async function POST(request: Request) {
  try {
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
    
    // Process opportunities
    let created = 0;
    let updated = 0;
    const errors: string[] = [];
    
    for (const opp of opportunities) {
      try {
        const result = await convex.mutation(api.integrations.upsertDealFromSalesforce, {
          organizationId: organizationId as Id<"organizations">,
          salesforceId: opp.Id,
          name: opp.Name,
          amount: opp.Amount || 0,
          closedAt: new Date(opp.CloseDate).getTime(),
          contactName: opp.Account?.Name,
          ownerName: opp.Owner?.Name,
        });
        
        if (result.created) {
          created++;
        } else {
          updated++;
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
