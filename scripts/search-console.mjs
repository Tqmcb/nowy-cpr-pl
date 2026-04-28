#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { join } from 'path';
import { randomBytes } from 'crypto';

const DEFAULT_SITE_URL = 'https://www.nowycpr.pl/';
const DEFAULT_SITEMAP_URL = 'https://www.nowycpr.pl/sitemap.xml';
const DEFAULT_LANGUAGE = 'pl-PL';
const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_FILE = join(process.cwd(), '.gsc-token.json');
const DEFAULT_ANALYTICS_DAYS = 28;

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
  npm run gsc -- auth-local --client-id "..." --client-secret "..."
  GSC_ACCESS_TOKEN="ya29..." npm run gsc -- submit-sitemap

Optional:
  GSC_CLIENT_ID      OAuth client ID for auth command
  GSC_CLIENT_SECRET  OAuth client secret for auth-local command
  GSC_OAUTH_PORT     default: 53682
  GSC_SITE_URL       default: ${DEFAULT_SITE_URL}
  GSC_SITEMAP_URL    default: ${DEFAULT_SITEMAP_URL}
  GSC_LANGUAGE_CODE  default: ${DEFAULT_LANGUAGE}
  GSC_START_DATE     default: 28 days before GSC_END_DATE
  GSC_END_DATE       default: yesterday
  GSC_ROW_LIMIT      default: 25

Commands:
  npm run gsc -- auth-local --client-id "..." --client-secret "..."
  npm run gsc -- auth-device --client-id "..."
  npm run gsc -- submit-sitemap
  npm run gsc -- get-sitemap
  npm run gsc -- queries-report
  npm run gsc -- pages-report
  npm run gsc -- opportunities-report
  npm run gsc -- seo-actions-report
  npm run gsc -- inspect https://www.nowycpr.pl/wyrob/membrany/
  npm run gsc -- inspect-priority
  npm run gsc -- list-sites

Notes:
  auth-local uses a localhost OAuth redirect and writes tokens to .gsc-token.json.
  auth-device is available for scopes that Google permits in device flow, but Search Console's webmasters scope is not currently accepted there.
  .gsc-token.json must stay local and must not be committed.
`);
}

function getArgValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function config() {
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() - 1);
  const defaultStartDate = new Date(defaultEndDate);
  defaultStartDate.setDate(defaultStartDate.getDate() - DEFAULT_ANALYTICS_DAYS);

  return {
    token: process.env.GSC_ACCESS_TOKEN,
    clientId: getArgValue('--client-id', process.env.GSC_CLIENT_ID || ''),
    clientSecret: getArgValue('--client-secret', process.env.GSC_CLIENT_SECRET || ''),
    oauthPort: Number(getArgValue('--port', process.env.GSC_OAUTH_PORT || '53682')),
    siteUrl: getArgValue('--site', process.env.GSC_SITE_URL || DEFAULT_SITE_URL),
    sitemapUrl: getArgValue('--sitemap', process.env.GSC_SITEMAP_URL || DEFAULT_SITEMAP_URL),
    languageCode: getArgValue('--language', process.env.GSC_LANGUAGE_CODE || DEFAULT_LANGUAGE),
    startDate: getArgValue('--start-date', process.env.GSC_START_DATE || formatDate(defaultStartDate)),
    endDate: getArgValue('--end-date', process.env.GSC_END_DATE || formatDate(defaultEndDate)),
    rowLimit: Number(getArgValue('--limit', process.env.GSC_ROW_LIMIT || '25')),
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

  const params = {
    client_id: tokens.client_id,
    refresh_token: tokens.refresh_token,
    grant_type: 'refresh_token',
  };
  if (tokens.client_secret) params.client_secret = tokens.client_secret;

  const refreshed = await tokenRequest(params);

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

async function authLocalFlow() {
  const { clientId, clientSecret, oauthPort } = config();
  if (!clientId || !clientSecret) {
    usage();
    throw new Error('Missing --client-id/--client-secret or GSC_CLIENT_ID/GSC_CLIENT_SECRET.');
  }

  const redirectUri = `http://127.0.0.1:${oauthPort}/oauth2callback`;
  const state = randomBytes(16).toString('hex');
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', DEFAULT_SCOPE);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', state);

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const requestUrl = new URL(req.url || '/', redirectUri);
        if (requestUrl.pathname !== '/oauth2callback') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }

        const receivedState = requestUrl.searchParams.get('state');
        const receivedCode = requestUrl.searchParams.get('code');
        const error = requestUrl.searchParams.get('error');

        if (error) throw new Error(`Google OAuth error: ${error}`);
        if (receivedState !== state) throw new Error('OAuth state mismatch.');
        if (!receivedCode) throw new Error('Missing OAuth code.');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>Authorization complete. You can close this tab and return to the terminal.</p>', () => {
          server.close(() => resolve(receivedCode));
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(error.message, () => {
          server.close(() => reject(error));
        });
      }
    });

    server.once('error', reject);
    server.listen(oauthPort, '127.0.0.1', () => {
      console.log('\nOpen this URL in your browser and approve access:\n');
      console.log(authUrl.toString());
      console.log(`\nWaiting on ${redirectUri} ...\n`);
    });
  });

  const tokenData = await tokenRequest({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  writeTokenFile({
    ...tokenData,
    client_id: clientId,
    client_secret: clientSecret,
    scope: tokenData.scope || DEFAULT_SCOPE,
    expires_at: Date.now() + (tokenData.expires_in || 3600) * 1000,
  });
  console.log(`Authorized. Tokens saved locally to ${TOKEN_FILE}`);
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

async function fetchSearchAnalytics(dimensions) {
  const { siteUrl, startDate, endDate, rowLimit } = config();
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodePathValue(siteUrl)}/searchAnalytics/query`;
  const data = await googleRequest(url, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions,
      rowLimit,
      searchType: 'web',
      dataState: 'all',
    }),
  });

  const rows = (data.rows || []).map(row => {
    const item = {
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Number(((row.ctr || 0) * 100).toFixed(2)),
      position: Number((row.position || 0).toFixed(2)),
    };
    dimensions.forEach((dimension, index) => {
      item[dimension] = row.keys?.[index] || '';
    });
    return item;
  });

  return {
    siteUrl,
    startDate,
    endDate,
    dimensions,
    rows,
  };
}

async function searchAnalytics(dimensions) {
  console.log(JSON.stringify(await fetchSearchAnalytics(dimensions), null, 2));
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const meta = {};
  for (const line of match[1].split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    meta[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
  return meta;
}

function canonicalizePageUrl(page) {
  try {
    const url = new URL(page);
    url.hash = '';

    if (url.pathname === '/wyrob' || url.pathname === '/wyrob/') {
      const slug = url.searchParams.get('slug');
      if (slug) {
        url.pathname = `/wyrob/${slug}/`;
        url.search = '';
      }
    } else {
      url.search = '';
    }

    if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }

    return url.toString();
  } catch {
    return page;
  }
}

function loadPageIndex() {
  const index = new Map();
  const blogDir = join(process.cwd(), 'content', 'blog');
  const wyrobyDir = join(process.cwd(), 'content', 'wyroby');

  if (existsSync(blogDir)) {
    for (const file of readdirSync(blogDir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const meta = parseFrontmatter(readFileSync(join(blogDir, file), 'utf-8'));
      index.set(`https://www.nowycpr.pl/blog/${slug}/`, {
        type: 'blog',
        file: `content/blog/${file}`,
        title: meta.title || slug,
      });
    }
  }

  if (existsSync(wyrobyDir)) {
    for (const file of readdirSync(wyrobyDir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const meta = parseFrontmatter(readFileSync(join(wyrobyDir, file), 'utf-8'));
      index.set(`https://www.nowycpr.pl/wyrob/${slug}/`, {
        type: 'wyrob',
        file: `content/wyroby/${file}`,
        title: meta.title || slug,
      });
    }
  }

  index.set('https://www.nowycpr.pl/', {
    type: 'page',
    file: 'src/pages/App.tsx',
    title: 'Strona główna',
  });
  index.set('https://www.nowycpr.pl/blog/', {
    type: 'page',
    file: 'src/pages/Blog.tsx',
    title: 'Blog',
  });
  index.set('https://www.nowycpr.pl/wyszukiwarka/', {
    type: 'page',
    file: 'src/components/ProductSearchTool.tsx',
    title: 'Wyszukiwarka wyrobów',
  });

  return index;
}

function aggregateRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const page = canonicalizePageUrl(row.page);
    const key = `${row.query}\n${page}`;
    const current = grouped.get(key) || {
      query: row.query,
      page,
      clicks: 0,
      impressions: 0,
      positionWeight: 0,
    };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.positionWeight += row.position * row.impressions;
    grouped.set(key, current);
  }

  return [...grouped.values()].map(row => ({
    query: row.query,
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.impressions ? Number(((row.clicks / row.impressions) * 100).toFixed(2)) : 0,
    position: row.impressions ? Number((row.positionWeight / row.impressions).toFixed(2)) : 0,
  }));
}

function classifyOpportunity(row) {
  if (row.impressions >= 2 && row.position <= 5 && row.ctr === 0) {
    return {
      priority: 1,
      label: 'wysoka pozycja, brak kliknięć',
      action: 'Popraw tytuł strony i opis w wynikach Google, bo strona już jest wysoko, ale użytkownicy nie klikają.',
    };
  }

  if (row.impressions >= 5 && row.position > 5 && row.position <= 12) {
    return {
      priority: 2,
      label: 'szybka wygrana',
      action: 'Dopisz krótki akapit odpowiadający dokładnie na zapytanie i dodaj linki wewnętrzne z powiązanych wpisów.',
    };
  }

  if (row.impressions >= 3 && row.position > 12 && row.position <= 30) {
    return {
      priority: 3,
      label: 'brakujące dopasowanie treści',
      action: 'Rozbuduj treść o osobną sekcję pod tę frazę albo przygotuj nowy wpis wspierający.',
    };
  }

  if (row.impressions >= 8 && row.clicks === 0) {
    return {
      priority: 4,
      label: 'dużo wyświetleń bez kliknięć',
      action: 'Sprawdź, czy intencja zapytania pasuje do strony; jeśli tak, popraw lead i nagłówki pod język użytkownika.',
    };
  }

  return null;
}

function findQueryConflicts(rows) {
  const byQuery = new Map();
  for (const row of rows) {
    if (row.impressions < 2) continue;
    const list = byQuery.get(row.query) || [];
    list.push(row);
    byQuery.set(row.query, list);
  }

  return [...byQuery.entries()]
    .map(([query, queryRows]) => ({
      query,
      pages: queryRows.sort((a, b) => b.impressions - a.impressions),
      totalImpressions: queryRows.reduce((sum, row) => sum + row.impressions, 0),
    }))
    .filter(item => item.pages.length > 1)
    .sort((a, b) => b.totalImpressions - a.totalImpressions)
    .slice(0, 10);
}

function formatSeoActionsReport(report, pageIndex) {
  const lines = [
    `# Raport działań SEO z Google Search Console`,
    ``,
    `Zakres danych: ${report.startDate} - ${report.endDate}`,
    ``,
    `CTR = współczynnik klikalności w wynikach Google.`,
    ``,
    `## Najważniejsze działania`,
    ``,
  ];

  if (!report.opportunities.length) {
    lines.push('Brak wystarczających danych do rekomendacji.');
  }

  for (const item of report.opportunities.slice(0, 20)) {
    const page = pageIndex.get(item.page);
    lines.push(`### ${item.label}: "${item.query}"`);
    lines.push(`- Strona: ${item.page}`);
    if (page) lines.push(`- Plik: ${page.file}`);
    if (page?.title) lines.push(`- Tytuł: ${page.title}`);
    lines.push(`- Dane: ${item.impressions} wyświetleń, ${item.clicks} kliknięć, CTR ${item.ctr}%, pozycja ${item.position}`);
    lines.push(`- Działanie: ${item.action}`);
    lines.push('');
  }

  lines.push(`## Możliwa kanibalizacja zapytań`);
  lines.push('');

  if (!report.queryConflicts.length) {
    lines.push('Brak istotnych konfliktów między stronami.');
  }

  for (const conflict of report.queryConflicts) {
    lines.push(`### "${conflict.query}"`);
    for (const row of conflict.pages.slice(0, 4)) {
      lines.push(`- ${row.page} — ${row.impressions} wyświetleń, pozycja ${row.position}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

async function seoActionsReport() {
  const analytics = await fetchSearchAnalytics(['query', 'page']);
  const rows = aggregateRows(analytics.rows);
  const pageIndex = loadPageIndex();

  const opportunities = rows
    .map(row => {
      const classification = classifyOpportunity(row);
      if (!classification) return null;
      return {
        ...classification,
        ...row,
        score: Number((classification.priority * 1000 - row.impressions - Math.max(0, 30 - row.position)).toFixed(2)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || b.impressions - a.impressions);

  const report = {
    siteUrl: analytics.siteUrl,
    startDate: analytics.startDate,
    endDate: analytics.endDate,
    opportunities,
    queryConflicts: findQueryConflicts(rows),
  };

  console.log(formatSeoActionsReport(report, pageIndex));
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
      case 'auth-local':
        await authLocalFlow();
        break;
      case 'auth-device':
        await authDeviceFlow();
        break;
      case 'submit-sitemap':
        await submitSitemap();
        break;
      case 'get-sitemap':
        await getSitemap();
        break;
      case 'queries-report':
        await searchAnalytics(['query']);
        break;
      case 'pages-report':
        await searchAnalytics(['page']);
        break;
      case 'opportunities-report':
        await searchAnalytics(['query', 'page']);
        break;
      case 'seo-actions-report':
        await seoActionsReport();
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
