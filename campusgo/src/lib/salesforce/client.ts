/**
 * Salesforce API Client & Server-Side Token Manager
 *
 * Secure server-only module. Never imports or runs in client bundles.
 */

import { execSync } from 'child_process';
import type {
  SalesforceAuthResult,
  SalesforceCreateResult,
  SalesforceQueryResult,
} from './types';

interface CachedAuth {
  accessToken: string;
  instanceUrl: string;
  expiresAt: number;
  source: 'oauth' | 'cli-bridge';
}

let cachedAuth: CachedAuth | null = null;

const API_VERSION = process.env.SALESFORCE_API_VERSION || 'v61.0';

/**
 * Retrieves a valid Salesforce access token and instance URL.
 * Attempts server environment variables first (Connected App OAuth 2.0 flow).
 * If unconfigured in local development, falls back securely to the local SF CLI session.
 */
export async function getSalesforceAuth(): Promise<SalesforceAuthResult> {
  const now = Date.now();
  if (cachedAuth && cachedAuth.expiresAt > now + 60000) {
    return {
      accessToken: cachedAuth.accessToken,
      instanceUrl: cachedAuth.instanceUrl,
      source: cachedAuth.source,
    };
  }

  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

  // 1. Check for standard OAuth 2.0 Username-Password or Client Credentials flow
  if (clientId && clientSecret && username && password) {
    try {
      const tokenUrl = `${loginUrl.replace(/\/+$/, '')}/services/oauth2/token`;
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        cachedAuth = {
          accessToken: data.access_token,
          instanceUrl: data.instance_url,
          expiresAt: now + (data.expires_in ? data.expires_in * 1000 : 3600000),
          source: 'oauth',
        };
        return {
          accessToken: cachedAuth.accessToken,
          instanceUrl: cachedAuth.instanceUrl,
          source: 'oauth',
        };
      }
    } catch (err) {
      console.error('[Salesforce OAuth] Server OAuth exchange failed, checking dev bridge:', (err as Error).message);
    }
  }

  // 2. Local development bridge via SF CLI (faqorg2)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const raw = execSync('sf org display --target-org faqorg2 --json', {
        encoding: 'utf-8',
        timeout: 10000,
        windowsHide: true,
      });
      const parsed = JSON.parse(raw);
      if (parsed.result && parsed.result.instanceUrl) {
        const tokenRaw = execSync('sf org auth show-access-token --target-org faqorg2 --json', {
          encoding: 'utf-8',
          timeout: 10000,
          windowsHide: true,
        });
        const tokenParsed = JSON.parse(tokenRaw);
        if (tokenParsed.result && tokenParsed.result.accessToken) {
          cachedAuth = {
            accessToken: tokenParsed.result.accessToken,
            instanceUrl: parsed.result.instanceUrl,
            expiresAt: now + 1800000, // 30 mins
            source: 'cli-bridge',
          };
          return {
            accessToken: cachedAuth.accessToken,
            instanceUrl: cachedAuth.instanceUrl,
            source: 'cli-bridge',
          };
        }
      }
    } catch {
      // CLI bridge not available
    }
  }

  if (cachedAuth) {
    return {
      accessToken: cachedAuth.accessToken,
      instanceUrl: cachedAuth.instanceUrl,
      source: cachedAuth.source,
    };
  }

  throw new Error(
    'Salesforce authentication is not configured. Please supply SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_USERNAME, and SALESFORCE_PASSWORD in .env.local or authorize the local SF CLI.'
  );
}

/**
 * Executes a SOQL query against the Salesforce REST API.
 */
export async function executeSoql<T = Record<string, unknown>>(
  soql: string
): Promise<SalesforceQueryResult<T>> {
  const auth = await getSalesforceAuth();
  const encodedQuery = encodeURIComponent(soql);
  const url = `${auth.instanceUrl.replace(/\/+$/, '')}/services/data/${API_VERSION}/query/?q=${encodedQuery}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedAuth = null; // Invalidate cache on unauthorized
    }
    const errText = await response.text();
    throw new Error(`Salesforce SOQL query failed (${response.status}): ${errText}`);
  }

  return response.json();
}

/**
 * Creates a record in a Salesforce standard or custom object.
 */
export async function createRecord(
  sobjectName: string,
  fields: Record<string, unknown>
): Promise<SalesforceCreateResult> {
  const auth = await getSalesforceAuth();
  const url = `${auth.instanceUrl.replace(/\/+$/, '')}/services/data/${API_VERSION}/sobjects/${sobjectName}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(fields),
    signal: AbortSignal.timeout(12000),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    if (response.status === 401) {
      cachedAuth = null;
    }
    const errorMsg = Array.isArray(data)
      ? data.map((e) => e.message).join(', ')
      : data.message || JSON.stringify(data);
    throw new Error(`Failed to create ${sobjectName} record: ${errorMsg}`);
  }

  return data as SalesforceCreateResult;
}

/**
 * Updates a record in a Salesforce standard or custom object.
 */
export async function updateRecord(
  sobjectName: string,
  id: string,
  fields: Record<string, unknown>
): Promise<void> {
  const auth = await getSalesforceAuth();
  const url = `${auth.instanceUrl.replace(/\/+$/, '')}/services/data/${API_VERSION}/sobjects/${sobjectName}/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(fields),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedAuth = null;
    }
    const errText = await response.text();
    throw new Error(`Failed to update ${sobjectName}/${id}: ${errText}`);
  }
}
