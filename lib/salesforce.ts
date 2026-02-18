/**
 * Salesforce Integration Service
 * OAuth 2.0 Web Server Flow + SOQL API
 */

// Environment variables (set these in your .env.local)
const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || '';
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || '';
const SALESFORCE_REDIRECT_URI = process.env.SALESFORCE_REDIRECT_URI || 'https://www.partnerbase.app/api/integrations/salesforce/callback';
const SALESFORCE_LOGIN_URL = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

// Types
export interface SalesforceTokens {
  accessToken: string;
  refreshToken: string;
  instanceUrl: string;
  id: string; // User info URL containing org ID
}

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  Amount: number | null;
  CloseDate: string;
  StageName: string;
  AccountId: string | null;
  Account?: {
    Name: string;
  };
  OwnerId: string;
  Owner?: {
    Name: string;
  };
  PartnerAccountId?: string | null;
  PartnerAccount?: {
    Name: string;
  } | null;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface SalesforceQueryResponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
  nextRecordsUrl?: string;
}

/**
 * Generate Salesforce OAuth authorization URL
 * User will be redirected here to authorize the app
 */
export function getSalesforceAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SALESFORCE_CLIENT_ID,
    redirect_uri: SALESFORCE_REDIRECT_URI,
    scope: 'api refresh_token offline_access',
  });
  
  if (state) {
    params.append('state', state);
  }
  
  return `${SALESFORCE_LOGIN_URL}/services/oauth2/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<SalesforceTokens> {
  const tokenUrl = `${SALESFORCE_LOGIN_URL}/services/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: SALESFORCE_CLIENT_ID,
    client_secret: SALESFORCE_CLIENT_SECRET,
    redirect_uri: SALESFORCE_REDIRECT_URI,
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    instanceUrl: data.instance_url,
    id: data.id,
  };
}

/**
 * Refresh an expired access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<Omit<SalesforceTokens, 'refreshToken'>> {
  const tokenUrl = `${SALESFORCE_LOGIN_URL}/services/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SALESFORCE_CLIENT_ID,
    client_secret: SALESFORCE_CLIENT_SECRET,
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh access token: ${error}`);
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url,
    id: data.id,
  };
}

/**
 * Extract Salesforce Org ID from the identity URL
 */
export function extractOrgIdFromIdentityUrl(identityUrl: string): string {
  // Identity URL format: https://login.salesforce.com/id/00D.../005...
  const match = identityUrl.match(/\/id\/([^/]+)\//);
  return match ? match[1] : '';
}

/**
 * Fetch closed-won opportunities from Salesforce
 * @param accessToken - Valid access token
 * @param instanceUrl - Salesforce instance URL
 * @param lastSyncedAt - Optional timestamp to fetch only modified records since then
 */
export async function getOpportunities(
  accessToken: string,
  instanceUrl: string,
  lastSyncedAt?: number
): Promise<SalesforceOpportunity[]> {
  // Build SOQL query for Closed Won opportunities
  let query = `
    SELECT 
      Id, Name, Amount, CloseDate, StageName,
      AccountId, Account.Name,
      OwnerId, Owner.Name,
      CreatedDate, LastModifiedDate
    FROM Opportunity
    WHERE StageName = 'Closed Won'
  `;
  
  if (lastSyncedAt) {
    const isoDate = new Date(lastSyncedAt).toISOString();
    query += ` AND LastModifiedDate >= ${isoDate}`;
  } else {
    // On first sync, get last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    query += ` AND CloseDate >= ${ninetyDaysAgo.toISOString().split('T')[0]}`;
  }
  
  query += ' ORDER BY LastModifiedDate DESC LIMIT 200';
  
  const url = `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query.trim())}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch opportunities: ${error}`);
  }
  
  const data: SalesforceQueryResponse<SalesforceOpportunity> = await response.json();
  return data.records;
}

/**
 * Fetch a single opportunity by ID
 */
export async function getOpportunityById(
  accessToken: string,
  instanceUrl: string,
  opportunityId: string
): Promise<SalesforceOpportunity | null> {
  const query = `
    SELECT 
      Id, Name, Amount, CloseDate, StageName,
      AccountId, Account.Name,
      OwnerId, Owner.Name,
      CreatedDate, LastModifiedDate
    FROM Opportunity
    WHERE Id = '${opportunityId}'
  `;
  
  const url = `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query.trim())}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch opportunity: ${error}`);
  }
  
  const data: SalesforceQueryResponse<SalesforceOpportunity> = await response.json();
  return data.records[0] || null;
}

/**
 * Get Salesforce user/org info from identity endpoint
 */
export async function getSalesforceIdentity(accessToken: string, identityUrl: string): Promise<{
  orgId: string;
  orgName: string;
  userId: string;
  username: string;
}> {
  const response = await fetch(identityUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch Salesforce identity');
  }
  
  const data = await response.json();
  
  return {
    orgId: data.organization_id,
    orgName: data.organization_id, // Org name requires additional API call
    userId: data.user_id,
    username: data.username,
  };
}
