import { NextResponse } from 'next/server';
import { getSalesforceAuthUrl } from '@/lib/salesforce';

/**
 * GET /api/integrations/salesforce/connect
 * Initiates Salesforce OAuth flow by redirecting to Salesforce authorization URL
 */
export async function GET(request: Request) {
  try {
    // Get organization ID from query params or session
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }
    
    // Create state parameter to pass org ID through OAuth flow
    const state = Buffer.from(JSON.stringify({ orgId })).toString('base64');
    
    // Generate Salesforce auth URL
    const authUrl = getSalesforceAuthUrl(state);
    
    // Check if required env vars are set
    if (!process.env.SALESFORCE_CLIENT_ID) {
      return NextResponse.json(
        { 
          error: 'Salesforce integration not configured',
          message: 'SALESFORCE_CLIENT_ID environment variable is not set' 
        },
        { status: 500 }
      );
    }
    
    // Redirect to Salesforce
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Salesforce connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Salesforce connection' },
      { status: 500 }
    );
  }
}
