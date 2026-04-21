import { NextResponse } from 'next/server';
import { getConvexClient } from '@/lib/convex-server';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

/**
 * POST /api/integrations/salesforce/disconnect
 * Disconnects Salesforce integration for an organization
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
    
    // Delete the connection
    await convex.mutation(api.integrations.disconnectSalesforce, {
      organizationId: organizationId as Id<"organizations">,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Salesforce disconnected successfully',
    });
  } catch (error) {
    console.error('Salesforce disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Salesforce' },
      { status: 500 }
    );
  }
}
