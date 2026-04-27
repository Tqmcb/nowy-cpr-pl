#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DEFAULT_SITE_URL = 'https://www.nowycpr.pl/';
const DEFAULT_SITEMAP_URL = 'https://www.nowycpr.pl/sitemap.xml';
const DEFAULT_LANGUAGE = 'pl-PL';
const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_FILE = join(process.cwd(), '.gsc-token.json');

const PRIORITY_URLS = [
  'https://www.nowycpr.pl/',
  'https://www.nowycpr.pl/blog/',
  'https://www.nowycpr.pl/wyszukiwarka/',
  'https://www.nowycpr.pl/wyroby/',
  'https://www.nowycpr.pl/wyrob/okna-drzwi-bramy/',
  'https://www.nowycpr.pl/wyrob/prefabrykaty-betonowe/',
  'https://www.nowycpr.pl/wyrob/kable/',
  'https://www.nowycpr.pl/wyrob/membrany/',
  'https://www.nowycpr.pl/documents/',
  'https://www.nowycpr.pl/services/',
];

function usage() {
  console.log(`Search Console helper

Auth options:
  npm run gsc -- auth --client-id "179285900611-...apps.googleusercontent.com"
  GSC_ACCESS_TOKEN="ya29..." npm run gsc -- submit-sitemap

Optional:
  GSC_CLIENT_ID      OAuth client ID for auth command
  GSC_SITE_URL       default: ${DEFAULT_SITE_URL}
  GSC_SITEMAP_URL    default: ${DEFAULT_SITEMAP_URL}
  GSC_LANGUAGE_CODE  default: ${DEFAULT_LANGUAGE}

Commands:
  npm run gsc -- auth --client-id "..."
  npm run gsc -- submit-sitemap
  npm run gsc -- get-sitemap
  npm run gsc -- inspect https://www.nowycpr.pl/wyrob/membrany/
  npm run gsc -- inspect-priority
  npm run gsc -- list-sites

Notes:
  auth uses Google's device flow and writes tokens to .gsc-token.json.
  .gsc-token.json must stay local and must not be committed.
`);
}

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function config() {
  return {
    token: process.env.GSC_ACCESS_TOKEN,
    clientId: getArgValue('--client-id', process.env.GSC_CLIENT_ID || ''),
    siteUrl: getArgValue('--site', process.env.GSC_SITE_URL || DEFAULT_SITE_URL),
    sitemapUrl: getArgValue('--sitemap', process.env.GSC_SITEMAP_URL || DEFAULT_SITEMAP_URL),
    languageCode: getArgValue('--language', process.env.GSC_LANGUAGE_CODE || DEFAULT_LANGUAGE),
  };
}

function encodePathValue(value) {
  return encodeURIComponent(value);
}

function readTokenFile() {
  if (!existsSync(TOKEN_FILE)) return null;
  return JSON.parse(readFileSync(TOKEN_FILE, 'utf-8'));
}

function writeTokenFile(tokens) {
  writeFileSync(TOKEN_FILE, `${JSON.stringify(tokens, null, 2)}\n`, { mode: 0o600 });
}

function formBody(params) {
  return new URLSearchParams(params).toString();
}

async function tokenRequest(params) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody(params),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${data.error_description || data.error || 'Token request failed'}`);
  }
  return data;
}

async function refreshAccessToken(tokens) {
  if (!tokens?.refresh_token || !tokens?.client_id) {
    throw new Error('Missing refresh_token/client_id in .gsc-token.json. Run auth again.');
  }

  const refreshed = await tokenRequest({
    client_id: tokens.client_id,
    refresh_token: tokens.refresh_token,
    grant_type: 'refresh_token',
  });

  const updated = {
    ...tokens,
    ...refreshed,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000,
  };
  writeTokenFile(updated);
  return updated.access_token;
}

async function getAccessToken() {
  const { token } = config();
  if (token) return token;

  const saved = readTokenFile();
  if (!saved?.access_token) {
    usage();
    throw new Error('Missing GSC_ACCESS_TOKEN or .gsc-token.json. Run npm run gsc -- auth --client-id "...".');
  }

  if (saved.expires_at && Date.now() < saved.expires_at - 60_000) {
    return saved.access_token;
  }

  return refreshAccessToken(saved);
}

async function googleRequest(url, options = {}) {
  const token = await getAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === 'object' && data?.error?.message
      ? data.error.message
      : text || response.statusText;
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return data;
}

async function authDeviceFlow() {
  const { clientId } = config();
  if (!clientId) {
    usage();
    throw new Error('Missing --client-id or GSC_CLIENT_ID.');
  }

  const deviceResponse = await fetch('https://oauth2.googleapis.com/device/code', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody({
      client_id: clientId,
      scope: DEFAULT_SCOPE,
    }),
  });
  const device = await deviceResponse.json().catch(() => ({}));
  if (!deviceResponse.ok) {
    throw new Error(`${deviceResponse.status} ${deviceResponse.statusText}: ${device.error_description || device.error || 'Device auth failed'}`);
  }

  console.log('\nOpen this URL and enter the code:');
  console.log(device.verification_url || 'https://www.google.com/device');
  console.log(`\nCode: ${device.user_code}\n`);
  console.log('Waiting for Google authorization...');

  const intervalMs = Math.max(Number(device.interval || 5), 5) * 1000;
  const deadline = Date.now() + Number(device.expires_in || 1800) * 1000;

  while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody({
        client_id: clientId,
        device_code: device.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    });
    const tokenData = await response.json().catch(() => ({}));

    if (response.ok) {
      writeTokenFile({
        ...tokenData,
        client_id: clientId,
        scope: tokenData.scope || DEFAULT_SCOPE,
        expires_at: Date.now() + (tokenData.expires_in || 3600) * 1000,
      });
      console.log(`Authorized. Tokens saved locally to ${TOKEN_FILE}`);
      return;
    }

    if (tokenData.error === 'authorization_pending') continue;
    if (tokenData.error === 'slow_down') {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      continue;
    }
    throw new Error(tokenData.error_description || tokenData.error || 'Authorization failed');
  }

  throw new Error('Authorization timed out. Run auth again.');
}

async function submitSitemap() {
  const { siteUrl, sitemapUrl } = config();
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodePathValue(siteUrl)}/sitemaps/${encodePathValue(sitemapUrl)}`;
  await googleRequest(url, { method: 'PUT' });
  console.log(`Submitted sitemap: ${sitemapUrl}`);
}

async function getSitemap() {
  const { siteUrl, sitemapUrl } = config();
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodePathValue(siteUrl)}/sitemaps/${encodePathValue(sitemapUrl)}`;
  const data = await googleRequest(url);
  console.log(JSON.stringify(data, null, 2));
}

async function listSites() {
  const data = await googleRequest('https://www.googleapis.com/webmasters/v3/sites');
  console.log(JSON.stringify(data, null, 2));
}

async function inspectUrl(inspectionUrl) {
  const { siteUrl, languageCode } = config();
  const data = await googleRequest('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode,
    }),
  });

  const result = data?.inspectionResult?.indexStatusResult;
  if (!result) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(JSON.stringify({
    url: inspectionUrl,
    verdict: result.verdict,
    coverageState: result.coverageState,
    indexingState: result.indexingState,
    robotsTxtState: result.robotsTxtState,
    pageFetchState: result.pageFetchState,
    googleCanonical: result.googleCanonical,
    userCanonical: result.userCanonical,
    lastCrawlTime: result.lastCrawlTime,
  }, null, 2));
}

async function inspectPriority() {
  for (const url of PRIORITY_URLS) {
    console.log(`\n--- ${url}`);
    try {
      await inspectUrl(url);
    } catch (error) {
      console.error(error.message);
    }
  }
}

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'auth':
        await authDeviceFlow();
        break;
      case 'submit-sitemap':
        await submitSitemap();
        break;
      case 'get-sitemap':
        await getSitemap();
        break;
      case 'inspect':
        if (!process.argv[3]) throw new Error('Missing URL to inspect.');
        await inspectUrl(process.argv[3]);
        break;
      case 'inspect-priority':
        await inspectPriority();
        break;
      case 'list-sites':
        await listSites();
        break;
      case 'help':
      case '--help':
      case undefined:
        usage();
        break;
      default:
        usage();
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
