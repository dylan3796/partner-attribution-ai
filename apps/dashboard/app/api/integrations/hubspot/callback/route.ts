import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { exchangeCodeForTokens, getPortalInfo } from '@/lib/hubspot';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${APP_URL}/dashboard/integrations?error=hubspot_${error}`);
  }
  if (!code) {
    return NextResponse.redirect(`${APP_URL}/dashboard/integrations?error=no_code`);
  }

  let orgId: string | null = null;
  if (state) {
    try {
      orgId = JSON.parse(Buffer.from(state, 'base64').toString()).orgId;
    } catch {
      /* invalid state */
    }
  }
  if (!orgId) {
    return NextResponse.redirect(`${APP_URL}/dashboard/integrations?error=invalid_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const portalInfo = await getPortalInfo(tokens.accessToken);

    await convex.mutation(api.integrations.storeHubSpotConnection, {
      organizationId: orgId as Id<'organizations'>,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      hubspotPortalId: String(portalInfo.portalId ?? portalInfo.hubId),
    });

    return NextResponse.redirect(`${APP_URL}/dashboard/integrations?connected=hubspot`);
  } catch (err) {
    console.error('HubSpot callback error:', err);
    return NextResponse.redirect(`${APP_URL}/dashboard/integrations?error=hubspot_connection_failed`);
  }
}
