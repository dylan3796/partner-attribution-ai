import { NextResponse } from 'next/server';
import { getHubSpotAuthUrl } from '@/lib/hubspot';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  if (!process.env.HUBSPOT_CLIENT_ID) {
    return NextResponse.json(
      { error: 'HubSpot integration not configured', message: 'HUBSPOT_CLIENT_ID is not set' },
      { status: 500 }
    );
  }

  const state = Buffer.from(JSON.stringify({ orgId })).toString('base64');
  return NextResponse.redirect(getHubSpotAuthUrl(state));
}
