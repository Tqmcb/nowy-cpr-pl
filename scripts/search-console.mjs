#!/usr/bin/env node

const DEFAULT_SITE_URL = 'https://www.nowycpr.pl/';
const DEFAULT_SITEMAP_URL = 'https://www.nowycpr.pl/sitemap.xml';
const DEFAULT_LANGUAGE = 'pl-PL';

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

Requires:
  GSC_ACCESS_TOKEN with scope https://www.googleapis.com/auth/webmasters

Optional:
  GSC_SITE_URL       default: ${DEFAULT_SITE_URL}
  GSC_SITEMAP_URL    default: ${DEFAULT_SITEMAP_URL}
  GSC_LANGUAGE_CODE  default: ${DEFAULT_LANGUAGE}

Commands:
  npm run gsc -- submit-sitemap
  npm run gsc -- get-sitemap
  npm run gsc -- inspect https://www.nowycpr.pl/wyrob/membrany/
  npm run gsc -- inspect-priority
  npm run gsc -- list-sites

Token shortcut:
  GSC_ACCESS_TOKEN="ya29..." npm run gsc -- submit-sitemap
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
    siteUrl: getArgValue('--site', process.env.GSC_SITE_URL || DEFAULT_SITE_URL),
    sitemapUrl: getArgValue('--sitemap', process.env.GSC_SITEMAP_URL || DEFAULT_SITEMAP_URL),
    languageCode: getArgValue('--language', process.env.GSC_LANGUAGE_CODE || DEFAULT_LANGUAGE),
  };
}

function encodePathValue(value) {
  return encodeURIComponent(value);
}

async function googleRequest(url, options = {}) {
  const { token } = config();
  if (!token) {
    usage();
    throw new Error('Missing GSC_ACCESS_TOKEN.');
  }

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
