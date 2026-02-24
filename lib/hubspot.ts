/**
 * HubSpot Integration Service
 * OAuth 2.0 + CRM API v3
 */

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID || '';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET || '';
const HUBSPOT_REDIRECT_URI =
  process.env.HUBSPOT_REDIRECT_URI ||
  'https://covant.ai/api/integrations/hubspot/callback';

// Scopes needed: read deals + contacts
const HUBSPOT_SCOPES = [
  'crm.objects.deals.read',
  'crm.objects.contacts.read',
  'oauth',
].join(' ');

// ── Types ──────────────────────────────────────────────────────────────────

export interface HubSpotTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string | null;
    amount: string | null;
    closedate: string | null;
    dealstage: string | null;
    hubspot_owner_id: string | null;
  };
  associations?: {
    contacts?: { results: { id: string }[] };
  };
}

export interface HubSpotContact {
  id: string;
  properties: {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
  };
}

export interface HubSpotTokenInfo {
  portalId: number;
  userId: number;
  hubId: number;
}

// ── Auth URL ───────────────────────────────────────────────────────────────

export function getHubSpotAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: HUBSPOT_CLIENT_ID,
    redirect_uri: HUBSPOT_REDIRECT_URI,
    scope: HUBSPOT_SCOPES,
  });
  if (state) params.set('state', state);
  return `https://app.hubspot.com/oauth/authorize?${params.toString()}`;
}

// ── Token Exchange ─────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(code: string): Promise<HubSpotTokens> {
  const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
      redirect_uri: HUBSPOT_REDIRECT_URI,
      code,
    }).toString(),
  });

  if (!res.ok) throw new Error(`HubSpot token exchange failed: ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

// ── Token Refresh ──────────────────────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string): Promise<HubSpotTokens> {
  const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!res.ok) throw new Error(`HubSpot token refresh failed: ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresIn: data.expires_in,
  };
}

// ── Portal Info ────────────────────────────────────────────────────────────

export async function getPortalInfo(accessToken: string): Promise<HubSpotTokenInfo> {
  const res = await fetch(
    `https://api.hubapi.com/oauth/v1/access-tokens/${accessToken}`
  );
  if (!res.ok) throw new Error(`HubSpot portal info failed: ${await res.text()}`);
  return await res.json();
}

// ── Closed Won Deals ───────────────────────────────────────────────────────

export async function getClosedWonDeals(
  accessToken: string,
  lastSyncedAt?: number
): Promise<HubSpotDeal[]> {
  const deals: HubSpotDeal[] = [];
  let after: string | undefined;

  // Build filter: dealstage = closedwon, optionally updated since lastSyncedAt
  const filters: object[] = [
    { propertyName: 'dealstage', operator: 'EQ', value: 'closedwon' },
  ];
  if (lastSyncedAt) {
    filters.push({
      propertyName: 'hs_lastmodifieddate',
      operator: 'GTE',
      value: String(lastSyncedAt),
    });
  }

  do {
    const body: Record<string, unknown> = {
      filterGroups: [{ filters }],
      properties: ['dealname', 'amount', 'closedate', 'dealstage', 'hubspot_owner_id'],
      associations: ['contacts'],
      limit: 100,
    };
    if (after) body.after = after;

    const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HubSpot deals fetch failed: ${await res.text()}`);
    const data = await res.json();
    deals.push(...(data.results ?? []));
    after = data.paging?.next?.after;
  } while (after);

  return deals;
}

// ── Contact Lookup ─────────────────────────────────────────────────────────

export async function getContact(
  accessToken: string,
  contactId: string
): Promise<HubSpotContact | null> {
  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return await res.json();
}
