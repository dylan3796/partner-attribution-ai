import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { exchangeCodeForTokens, getSalesforceIdentity, extractOrgIdFromIdentityUrl } from '@/lib/salesforce';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');

/**
 * GET /api/integrations/salesforce/callback
 * Handles Salesforce OAuth callback, exchanges code for tokens, stores connection
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Handle OAuth error
    if (error) {
      console.error('Salesforce OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings?error=salesforce_${error}`
      );
    }
    
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings?error=no_code`
      );
    }
    
    // Decode state to get organization ID
    let orgId: string | null = null;
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
        orgId = decoded.orgId;
      } catch {
        console.error('Failed to decode state parameter');
      }
    }
    
    if (!orgId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings?error=invalid_state`
      );
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Get Salesforce org info
    let salesforceOrgId = extractOrgIdFromIdentityUrl(tokens.id);
    let salesforceOrgName: string | undefined;
    
    try {
      const identity = await getSalesforceIdentity(tokens.accessToken, tokens.id);
      salesforceOrgId = identity.orgId;
      salesforceOrgName = identity.orgName;
    } catch (err) {
      console.warn('Could not fetch Salesforce identity, using extracted org ID:', err);
    }
    
    // Store connection in Convex
    await convex.mutation(api.integrations.storeSalesforceConnection, {
      organizationId: orgId as Id<"organizations">,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      instanceUrl: tokens.instanceUrl,
      salesforceOrgId,
      salesforceOrgName,
    });
    
    // Redirect back to settings with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings?connected=salesforce`
    );
  } catch (error) {
    console.error('Salesforce callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || ''}/dashboard/settings?error=salesforce_connection_failed`
    );
  }
}
