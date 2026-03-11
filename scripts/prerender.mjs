/**
 * prerender.mjs — Post-build static HTML generator
 *
 * 1. Creates dist/blog/<slug>/index.html for every content/blog/*.md file.
 * 2. Creates dist/<path>/index.html for every static page (/, /blog, /wyroby, …).
 *
 * Each file gets the correct <title>, <meta description>, og:* and
 * canonical tags so Google can index them WITHOUT executing JavaScript.
 *
 * Run automatically via "postbuild" in package.json.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const blogContentDir = join(rootDir, 'content', 'blog');

// ── helpers ───────────────────────────────────────────────────────────────────

function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.+)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return data;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── main ──────────────────────────────────────────────────────────────────────

const templateHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

const files = readdirSync(blogContentDir)
  .filter(f => f.endsWith('.md'))
  .sort();

let count = 0;

for (const file of files) {
  // Strip date prefix (YYYY-MM-DD-) to match the URL format used by the React app
  const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const src = readFileSync(join(blogContentDir, file), 'utf-8');
  const meta = parseFrontmatter(src);

  const title      = escapeHtml(meta.title ? `${meta.title} | NowyCPR.pl` : 'NowyCPR.pl — CPR 2024/3110');
  const desc       = escapeHtml(meta.excerpt || meta.title || 'Artykuł o CPR 2024/3110 na portalu NowyCPR.pl');
  const imageUrl   = meta.image_url
    ? `https://www.nowycpr.pl${meta.image_url}`
    : 'https://www.nowycpr.pl/og-image.jpg';
  const canonical  = `https://www.nowycpr.pl/blog/${slug}`;
  const datePublished = meta.date || '';

  // Schema.org BlogPosting JSON-LD
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title || '',
    description: meta.excerpt || '',
    image: imageUrl,
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'NowyCPR.pl — Multicert Sp. z o.o.',
      url: 'https://www.nowycpr.pl/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'NowyCPR.pl — Multicert Sp. z o.o.',
      logo: { '@type': 'ImageObject', url: 'https://www.nowycpr.pl/og-image.jpg' }
    },
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
  });

  let html = templateHtml
    // <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    // canonical
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    // meta description
    .replace(
      /<meta name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${desc}" />`
    )
    // og:title
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${title}" />`
    )
    // og:description
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${desc}" />`
    )
    // og:url
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    // og:image (the single self-closing tag)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${imageUrl}" />`
    )
    // og:type → article
    .replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="article" />`
    )
    // twitter:title
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    // twitter:description
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${desc}" />`
    )
    // twitter:image
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${imageUrl}" />`
    )
    // inject BlogPosting JSON-LD before </head>
    .replace(
      '</head>',
      `<script type="application/ld+json">${jsonLd}</script>\n</head>`
    );

  const outDir = join(distDir, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
  count++;
  console.log(`  ✓ /blog/${slug}`);
}

console.log(`\n✓ Pre-rendered ${count} blog posts into dist/blog/*/index.html`);

// ── Static pages pre-rendering ─────────────────────────────────────────────
// Creates dist/<path>/index.html for each main static page with correct meta.

const staticPages = [
  {
    path: '',  // root — overwrite dist/index.html in-place (already correct, skip)
    skip: true,
  },
  {
    path: 'blog',
    title: 'Aktualności CPR 2024/3110 — Artykuły i Analizy | NowyCPR.pl',
    desc: 'Artykuły, analizy prawne i przewodniki techniczne o CPR 2024/3110 dla producentów wyrobów budowlanych. Śledź zmiany w rozporządzeniu UE o wyrobach budowlanych.',
    canonical: 'https://www.nowycpr.pl/blog',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Aktualności CPR 2024/3110', url: 'https://www.nowycpr.pl/blog', description: 'Artykuły i analizy prawne o CPR 2024/3110 na NowyCPR.pl' },
  },
  {
    path: 'wyroby',
    title: 'Katalog Wyrobów Budowlanych — CPR 2024/3110 | NowyCPR.pl',
    desc: 'Przeszukaj katalog 36 kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane, systemy AVS i wymagania certyfikacyjne dla swojego produktu.',
    canonical: 'https://www.nowycpr.pl/wyroby',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Katalog Wyrobów Budowlanych CPR 2024/3110', url: 'https://www.nowycpr.pl/wyroby' },
  },
  {
    path: 'product-search',
    title: 'Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl',
    desc: 'Sprawdź wymagania CPR 2024/3110 dla swojego wyrobu budowlanego. Wybierz kategorię i poznaj obowiązkowe badania, dokumentację i zmiany względem CPR 305/2011.',
    canonical: 'https://www.nowycpr.pl/product-search',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Wyszukiwarka Wymagań CPR 2024/3110', url: 'https://www.nowycpr.pl/product-search' },
  },
  {
    path: 'documents',
    title: 'Szablony Dokumentów CPR 2024/3110 — bezpłatne wzory | NowyCPR.pl',
    desc: '13 bezpłatnych szablonów dokumentów CPR 2024/3110: DoP&C, karta techniczna, FPC, oznakowanie CE, EPD, DPP, paszport produktu. Zgodne z Rozporządzeniem (UE) 2024/3110.',
    canonical: 'https://www.nowycpr.pl/documents',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Szablony Dokumentów CPR 2024/3110', url: 'https://www.nowycpr.pl/documents' },
  },
  {
    path: 'services',
    title: 'Usługi Certyfikacyjne CPR 2024/3110 — Multicert | NowyCPR.pl',
    desc: 'Certyfikacja ZKP, weryfikacja DoP&C, przegląd dokumentacji technicznej i audyty zgodności z CPR 2024/3110. Multicert — akredytowana jednostka certyfikująca wyroby budowlane.',
    canonical: 'https://www.nowycpr.pl/services',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Usługi Certyfikacyjne CPR 2024/3110 — Multicert', url: 'https://www.nowycpr.pl/services' },
  },
  {
    path: 'o-portalu',
    title: 'O portalu NowyCPR.pl — Rozporządzenie CPR 2024/3110',
    desc: 'Dowiedz się więcej o portalu NowyCPR.pl — kompleksowym źródle wiedzy o rozporządzeniu CPR (EU) 2024/3110 dla producentów wyrobów budowlanych.',
    canonical: 'https://www.nowycpr.pl/o-portalu',
    schema: { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'O portalu NowyCPR.pl', url: 'https://www.nowycpr.pl/o-portalu' },
  },
  {
    path: 'kontakt',
    title: 'Kontakt — NowyCPR.pl',
    desc: 'Skontaktuj się z zespołem NowyCPR.pl. Multicert Sp. z o.o., ul. Mydlarska 47, 04-690 Warszawa.',
    canonical: 'https://www.nowycpr.pl/kontakt',
    schema: { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Kontakt — NowyCPR.pl', url: 'https://www.nowycpr.pl/kontakt' },
  },
  {
    path: 'dostepnosc',
    title: 'Deklaracja dostępności — NowyCPR.pl',
    desc: 'Deklaracja dostępności cyfrowej portalu NowyCPR.pl zgodnie z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.',
    canonical: 'https://www.nowycpr.pl/dostepnosc',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Deklaracja dostępności NowyCPR.pl', url: 'https://www.nowycpr.pl/dostepnosc' },
  },
];

function renderStaticPage(page) {
  const title     = escapeHtml(page.title);
  const desc      = escapeHtml(page.desc);
  const canonical = page.canonical;
  const jsonLd    = JSON.stringify(page.schema);

  let html = templateHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(
      /<meta name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${desc}" />`
    )
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n</head>`);

  return html;
}

let staticCount = 0;
for (const page of staticPages) {
  if (page.skip) continue;
  const outDir = join(distDir, page.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), renderStaticPage(page), 'utf-8');
  staticCount++;
  console.log(`  ✓ /${page.path}`);
}
console.log(`\n✓ Pre-rendered ${staticCount} static pages into dist/*/index.html`);

// ── GitHub Pages SPA fallback ─────────────────────────────────────────────
// Copy index.html → 404.html so GitHub Pages serves the React app for any
// unknown URL (e.g. /blog, /blog/:slug when navigating directly or refreshing).
writeFileSync(join(distDir, '404.html'), templateHtml, 'utf-8');
console.log('✓ Created dist/404.html (GitHub Pages SPA fallback)');

// ── Sitemap generation ─────────────────────────────────────────────────────
// Regenerates dist/sitemap.xml with:
//   - Correct slug format (no date prefix) for blog URLs
//   - Only articles published up to today (same rule as blogLoader.ts)
//   - Static pages and catalog sections preserved from public/sitemap.xml

const today = new Date();
today.setHours(23, 59, 59, 999);

// Read base sitemap from public/ (contains static pages + catalog)
const sourceSitemap = readFileSync(join(rootDir, 'public', 'sitemap.xml'), 'utf-8');

// Build blog posts section — only published articles, correct URL format
const blogEntries = files
  .map(file => {
    const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const src = readFileSync(join(blogContentDir, file), 'utf-8');
    const meta = parseFrontmatter(src);
    const date = meta.date || '';
    return { slug, date };
  })
  .filter(({ date }) => date && new Date(date) <= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const blogXml = blogEntries.map(({ slug, date }) => `  <url>
    <loc>https://www.nowycpr.pl/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

// Replace the entire blog section in the source sitemap
// (everything between <!-- Blog posts --> and <!-- Katalog)
const updatedSitemap = sourceSitemap.replace(
  /<!-- Blog posts -->[\s\S]*?(?=<!-- Katalog)/,
  `<!-- Blog posts — auto-generated by prerender.mjs, tylko opublikowane -->\n${blogXml}\n\n  `
);

writeFileSync(join(distDir, 'sitemap.xml'), updatedSitemap, 'utf-8');
console.log(`✓ Sitemap updated: ${blogEntries.length} blog posts (opublikowane do ${today.toISOString().slice(0, 10)})`);
