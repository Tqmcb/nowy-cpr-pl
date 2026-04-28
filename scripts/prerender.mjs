/**
 * prerender.mjs — Post-build static HTML generator
 *
 * 1. Creates dist/blog/<slug>/index.html for every content/blog/*.md file.
 * 2. Creates dist/<path>/index.html for every static page (/, /blog, /wyroby, …).
 * 3. Creates dist/wyrob/<slug>/index.html for every product family.
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
    if (kv) {
      const rawValue = kv[2].trim();
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        try {
          data[kv[1]] = JSON.parse(rawValue);
        } catch {
          data[kv[1]] = rawValue
            .slice(1, -1)
            .split(',')
            .map(item => item.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        }
      } else {
        data[kv[1]] = rawValue.replace(/^["']|["']$/g, '');
      }
    }
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

function productSeoTitle(title) {
  return /\bCPR\b|wymagania/i.test(title)
    ? title
    : `${title} — wymagania CPR 2024/3110`;
}

const siteSearchAction = {
  '@type': 'SearchAction',
  target: 'https://www.nowycpr.pl/wyszukiwarka/?q={search_term_string}',
  'query-input': 'required name=search_term_string',
};

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
    ? (meta.image_url.startsWith('http') ? meta.image_url : `https://www.nowycpr.pl${meta.image_url}`)
    : 'https://www.nowycpr.pl/og-image.jpg';
  const canonical  = `https://www.nowycpr.pl/blog/${slug}/`;
  const datePublished = meta.date || '';
  const dateModified = meta.updated || meta.reviewed || datePublished;
  const keywords = Array.isArray(meta.tags) ? meta.tags.join(', ') : (meta.tags || '');

  // Schema.org BlogPosting JSON-LD
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title || '',
    description: meta.excerpt || '',
    image: imageUrl,
    datePublished,
    dateModified,
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    articleSection: meta.category || 'CPR 2024',
    keywords,
    inLanguage: 'pl-PL',
    about: {
      '@type': 'Thing',
      name: 'Rozporządzenie (UE) 2024/3110',
      sameAs: 'https://eur-lex.europa.eu/eli/reg/2024/3110/oj'
    }
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
    // article timestamps
    .replace(
      '</head>',
      `<meta property="article:published_time" content="${escapeHtml(datePublished)}" />\n<meta property="article:modified_time" content="${escapeHtml(dateModified)}" />\n<meta property="article:section" content="${escapeHtml(meta.category || 'CPR 2024')}" />\n</head>`
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

const todayForSchema = new Date();
todayForSchema.setHours(23, 59, 59, 999);

const blogSchemaItems = files
  .map(file => {
    const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const src = readFileSync(join(blogContentDir, file), 'utf-8');
    const meta = parseFrontmatter(src);
    return {
      slug,
      title: String(meta.title || slug),
      excerpt: String(meta.excerpt || meta.title || ''),
      date: String(meta.date || ''),
      updated: String(meta.updated || meta.reviewed || meta.date || ''),
      category: String(meta.category || 'CPR 2024'),
    };
  })
  .filter(({ date }) => date && new Date(date) <= todayForSchema)
  .sort((a, b) => b.date.localeCompare(a.date));

const documentSchemaItems = [
  'Szablon Deklaracji Właściwości Użytkowych i Zgodności (DoP&C)',
  'Szablon karty technicznej wyrobu budowlanego',
  'Poradnik zakładowej kontroli produkcji (FPC/ZKP)',
  'Wzór oznakowania CE zgodny z CPR 2024/3110',
  'Lista kontrolna zgodności z CPR 2024/3110',
  'Szablon deklaracji środowiskowej produktu (EPD)',
  'Przewodnik po cyfrowym paszporcie produktu (DPP)',
  'Przewodnik po systemach AVS',
  'Szablon DoP&C dla importera',
  'Struktura dokumentacji technicznej',
  'Instrukcja dla profesjonalnych użytkowników',
  'Mandat upoważnionego przedstawiciela',
  'Plan Prac Komisji Europejskiej dla CPR 2024/3110',
];

const serviceSchemaItems = [
  'Audyt gotowości CPR 2024',
  'Przegląd systemu ZKP/FPC',
  'Dokumentacja techniczna CPR 2024',
  'Weryfikacja i walidacja oprogramowania obliczeniowego',
  'Analiza norm i harmonogram wdrożenia',
  'Szkolenia i warsztaty CPR 2024/3110',
];

const staticPages = [
  {
    path: '',
    title: 'Rozporządzenie CPR 2024/3110 dla wyrobów budowlanych — wymagania, DoP&C, CE | NowyCPR.pl',
    desc: 'Co oznacza rozporządzenie CPR 2024/3110 dla wyrobów budowlanych: DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, importerzy i dystrybutorzy.',
    keywords: 'rozporządzenie CPR, CPR 2024/3110, rozporządzenie 2024/3110, wyroby budowlane, DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, certyfikacja wyrobów budowlanych',
    canonical: 'https://www.nowycpr.pl/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'NowyCPR.pl',
      url: 'https://www.nowycpr.pl/',
      inLanguage: 'pl-PL',
      publisher: { '@type': 'Organization', name: 'Multicert Sp. z o.o.', url: 'https://www.multicert.pl' },
      description: 'Co oznacza rozporządzenie CPR 2024/3110 dla wyrobów budowlanych: DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, importerzy i dystrybutorzy.',
      keywords: 'rozporządzenie CPR, CPR 2024/3110, rozporządzenie 2024/3110, wyroby budowlane, DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, certyfikacja wyrobów budowlanych',
      potentialAction: siteSearchAction,
      about: [
        { '@type': 'Thing', name: 'Rozporządzenie (UE) 2024/3110' },
        { '@type': 'Thing', name: 'Deklaracja Właściwości Użytkowych i Zgodności' },
        { '@type': 'Thing', name: 'Oznakowanie CE wyrobów budowlanych' },
        { '@type': 'Thing', name: 'Systemy AVS' },
        { '@type': 'Thing', name: 'Cyfrowy Paszport Produktu' },
      ],
    },
  },
  {
    path: 'blog',
    title: 'CPR 2024/3110: DoP&C, AVS, GWP, DPP — artykuły | NowyCPR.pl',
    desc: 'Artykuły i analizy o CPR 2024/3110 dla producentów wyrobów budowlanych: DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, importerzy, dystrybutorzy i nadzór rynku.',
    keywords: 'CPR 2024/3110, DoP&C, AVS, GWP, EPD, DPP, FPC, oznakowanie CE, wyroby budowlane, importer, dystrybutor, GUNB',
    canonical: 'https://www.nowycpr.pl/blog/',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://www.nowycpr.pl/blog/#collection',
          name: 'CPR 2024/3110: DoP&C, AVS, GWP, DPP — artykuły',
          url: 'https://www.nowycpr.pl/blog/',
          description: 'Artykuły i analizy o CPR 2024/3110 dla producentów, importerów i dystrybutorów wyrobów budowlanych.',
          inLanguage: 'pl-PL',
          isPartOf: { '@id': 'https://www.nowycpr.pl/#website' },
          mainEntity: { '@id': 'https://www.nowycpr.pl/blog/#itemlist' },
          keywords: 'CPR 2024/3110, DoP&C, AVS, GWP, EPD, DPP, FPC, oznakowanie CE'
        },
        {
          '@type': 'Blog',
          '@id': 'https://www.nowycpr.pl/blog/#blog',
          name: 'Blog NowyCPR.pl',
          url: 'https://www.nowycpr.pl/blog/',
          inLanguage: 'pl-PL',
          blogPost: blogSchemaItems.slice(0, 20).map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.updated,
            articleSection: post.category,
            url: `https://www.nowycpr.pl/blog/${post.slug}/`
          }))
        },
        {
          '@type': 'ItemList',
          '@id': 'https://www.nowycpr.pl/blog/#itemlist',
          name: 'Najnowsze artykuły CPR 2024/3110',
          numberOfItems: blogSchemaItems.length,
          itemListElement: blogSchemaItems.slice(0, 20).map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: `https://www.nowycpr.pl/blog/${post.slug}/`
          }))
        }
      ]
    },
  },
  {
    path: 'wyroby',
    title: 'Wyroby budowlane CPR: normy hEN, AVS i certyfikacja | NowyCPR.pl',
    desc: 'Katalog kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane hEN, systemy AVS, badania, FPC/ZKP i wymagania certyfikacyjne.',
    keywords: 'wyroby budowlane CPR, katalog wyrobów budowlanych, normy zharmonizowane hEN, system AVS, certyfikacja wyrobów, FPC, ZKP, DoP&C',
    canonical: 'https://www.nowycpr.pl/wyroby/',
    schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Wyroby budowlane CPR: normy hEN, AVS i certyfikacja', url: 'https://www.nowycpr.pl/wyroby/', description: 'Katalog kategorii wyrobów budowlanych objętych CPR 2024/3110.', keywords: 'wyroby budowlane CPR, normy hEN, system AVS, certyfikacja wyrobów' },
  },
  {
    path: 'wyrob',
    title: 'Karta rodziny wyrobu — CPR 2024/3110 | NowyCPR.pl',
    desc: 'Szczegółowe wymagania CPR 2024/3110 dla wybranej rodziny wyrobów budowlanych: normy, systemy AVS, dokumentacja i kluczowe zmiany.',
    canonical: 'https://www.nowycpr.pl/wyrob/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Karta rodziny wyrobu CPR 2024/3110', url: 'https://www.nowycpr.pl/wyrob/' },
  },
  {
    path: 'product-search',
    title: 'Wymagania CPR dla wyrobu budowlanego — wyszukiwarka | NowyCPR.pl',
    desc: 'Sprawdź wymagania CPR 2024/3110 dla konkretnego wyrobu budowlanego: norma hEN, system AVS, badania, dokumentacja, DoP&C, FPC/ZKP i certyfikacja.',
    keywords: 'wymagania CPR dla wyrobu, wyroby budowlane CPR, system AVS, norma zharmonizowana hEN, DoP&C, FPC, certyfikacja wyrobu budowlanego',
    canonical: 'https://www.nowycpr.pl/wyszukiwarka/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Wymagania CPR dla wyrobu budowlanego — wyszukiwarka', url: 'https://www.nowycpr.pl/wyszukiwarka/', description: 'Interaktywna wyszukiwarka wymagań CPR dla kategorii wyrobów budowlanych.', potentialAction: siteSearchAction },
  },
  {
    path: 'documents',
    title: 'Wzory DoP&C, CE, FPC, EPD i DPP — dokumenty CPR 2024/3110 | NowyCPR.pl',
    desc: 'Bezpłatne wzory dokumentów CPR 2024/3110: DoP&C, oznakowanie CE, FPC/ZKP, karta techniczna, EPD, DPP, AVS, importer i lista kontrolna producenta.',
    keywords: 'wzór DoP&C, szablon DoP&C, deklaracja właściwości użytkowych i zgodności, oznakowanie CE wzór, FPC, ZKP, EPD, DPP, dokumenty CPR 2024/3110',
    canonical: 'https://www.nowycpr.pl/documents/',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://www.nowycpr.pl/documents/#collection',
          name: 'Wzory DoP&C, CE, FPC, EPD i DPP — dokumenty CPR 2024/3110',
          url: 'https://www.nowycpr.pl/documents/',
          description: 'Bezpłatne wzory dokumentów CPR 2024/3110 dla producentów wyrobów budowlanych.',
          inLanguage: 'pl-PL',
          mainEntity: { '@id': 'https://www.nowycpr.pl/documents/#itemlist' },
          keywords: 'wzór DoP&C, szablon DoP&C, oznakowanie CE wzór, FPC, ZKP, EPD, DPP'
        },
        {
          '@type': 'ItemList',
          '@id': 'https://www.nowycpr.pl/documents/#itemlist',
          name: 'Wzory dokumentów CPR 2024/3110',
          numberOfItems: documentSchemaItems.length,
          itemListElement: documentSchemaItems.map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'DigitalDocument',
              name,
              inLanguage: 'pl-PL',
              isAccessibleForFree: true,
              about: { '@type': 'Thing', name: 'Rozporządzenie (UE) 2024/3110' }
            }
          }))
        }
      ]
    },
  },
  {
    path: 'services',
    title: 'Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&C — Multicert | NowyCPR.pl',
    desc: 'Certyfikacja wyrobów budowlanych, audyt ZKP/FPC, weryfikacja DoP&C, oznakowanie CE i przegląd dokumentacji technicznej pod CPR 2024/3110.',
    keywords: 'certyfikacja wyrobów budowlanych, certyfikacja CPR, audyt ZKP, audyt FPC, weryfikacja DoP&C, oznakowanie CE, jednostka certyfikująca wyroby budowlane',
    canonical: 'https://www.nowycpr.pl/services/',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': 'https://www.nowycpr.pl/services/#service',
          name: 'Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&C — Multicert',
          provider: { '@type': 'Organization', name: 'Multicert Sp. z o.o.', url: 'https://www.multicert.pl' },
          url: 'https://www.nowycpr.pl/services/',
          areaServed: { '@type': 'Country', name: 'Polska' },
          serviceType: 'Certyfikacja i doradztwo CPR dla wyrobów budowlanych',
          description: 'Certyfikacja CPR, audyty ZKP/FPC, DoP&C, CE i dokumentacja techniczna dla producentów wyrobów budowlanych.',
          keywords: 'certyfikacja wyrobów budowlanych, certyfikacja CPR, audyt ZKP, audyt FPC, weryfikacja DoP&C',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Usługi CPR 2024/3110',
            itemListElement: serviceSchemaItems.map((name, index) => ({
              '@type': 'Offer',
              position: index + 1,
              itemOffered: {
                '@type': 'Service',
                name,
                areaServed: { '@type': 'Country', name: 'Polska' },
                provider: { '@type': 'Organization', name: 'Multicert Sp. z o.o.' }
              }
            }))
          }
        }
      ]
    },
  },
  {
    path: 'o-portalu',
    title: 'O portalu NowyCPR.pl — Rozporządzenie CPR 2024/3110',
    desc: 'Dowiedz się więcej o portalu NowyCPR.pl — kompleksowym źródle wiedzy o rozporządzeniu CPR (EU) 2024/3110 dla producentów wyrobów budowlanych.',
    canonical: 'https://www.nowycpr.pl/o-portalu/',
    schema: { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'O portalu NowyCPR.pl', url: 'https://www.nowycpr.pl/o-portalu/' },
  },
  {
    path: 'kontakt',
    title: 'Kontakt — NowyCPR.pl',
    desc: 'Skontaktuj się z zespołem NowyCPR.pl. Multicert Sp. z o.o., ul. Mydlarska 47, 04-690 Warszawa.',
    canonical: 'https://www.nowycpr.pl/kontakt/',
    schema: { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Kontakt — NowyCPR.pl', url: 'https://www.nowycpr.pl/kontakt/' },
  },
  {
    path: 'dostepnosc',
    title: 'Deklaracja dostępności — NowyCPR.pl',
    desc: 'Deklaracja dostępności cyfrowej portalu NowyCPR.pl zgodnie z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.',
    canonical: 'https://www.nowycpr.pl/dostepnosc/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Deklaracja dostępności NowyCPR.pl', url: 'https://www.nowycpr.pl/dostepnosc/' },
  },
  {
    path: 'wyszukiwarka',
    title: 'Wymagania CPR dla wyrobu budowlanego — wyszukiwarka | NowyCPR.pl',
    desc: 'Sprawdź wymagania CPR 2024/3110 dla konkretnego wyrobu budowlanego: norma hEN, system AVS, badania, dokumentacja, DoP&C, FPC/ZKP i certyfikacja.',
    keywords: 'wymagania CPR dla wyrobu, wyroby budowlane CPR, system AVS, norma zharmonizowana hEN, DoP&C, FPC, certyfikacja wyrobu budowlanego',
    canonical: 'https://www.nowycpr.pl/wyszukiwarka/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Wymagania CPR dla wyrobu budowlanego — wyszukiwarka', url: 'https://www.nowycpr.pl/wyszukiwarka/', description: 'Interaktywna wyszukiwarka wymagań CPR dla kategorii wyrobów budowlanych.', keywords: 'wymagania CPR dla wyrobu, system AVS, norma hEN, DoP&C, FPC', potentialAction: siteSearchAction },
  },
  {
    path: 'harmonogram',
    title: 'Terminy CPR 2024/3110: DoP&C, GWP, DPP i sankcje | NowyCPR.pl',
    desc: 'Harmonogram CPR 2024/3110: daty stosowania, okresy przejściowe, terminy DoP&C, GWP, EPD, DPP, nowe hTS, sankcje i obowiązki producentów.',
    keywords: 'harmonogram CPR 2024/3110, terminy CPR, DoP&C 2026, GWP CPR, DPP CPR, okres przejściowy CPR, sankcje CPR, hTS',
    canonical: 'https://www.nowycpr.pl/harmonogram/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Terminy CPR 2024/3110: DoP&C, GWP, DPP i sankcje', url: 'https://www.nowycpr.pl/harmonogram/', description: 'Harmonogram CPR 2024/3110: daty stosowania, okresy przejściowe, DoP&C, GWP, EPD, DPP, hTS i sankcje.', keywords: 'harmonogram CPR 2024/3110, terminy CPR, DoP&C, GWP, DPP, sankcje CPR' },
  },
  {
    path: 'faq',
    title: 'FAQ — Najczęstsze pytania o CPR 2024/3110 | NowyCPR.pl',
    desc: 'Odpowiedzi na najczęstsze pytania o rozporządzeniu CPR 2024/3110: DoP&C, systemy AVS, oznakowanie CE, DPP i obowiązki producenta.',
    canonical: 'https://www.nowycpr.pl/faq/',
    schema: { '@context': 'https://schema.org', '@type': 'FAQPage', name: 'FAQ CPR 2024/3110', url: 'https://www.nowycpr.pl/faq/' },
  },
  {
    path: 'sciezka-ce',
    title: 'Ścieżka do oznakowania CE — Kreator checklisty | NowyCPR.pl',
    desc: 'Interaktywny kreator checklisty do oznakowania CE wyrobów budowlanych zgodnie z CPR 2024/3110. Sprawdź krok po kroku co musisz zrobić.',
    canonical: 'https://www.nowycpr.pl/sciezka-ce/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Ścieżka do CE', url: 'https://www.nowycpr.pl/sciezka-ce/' },
  },
  {
    path: 'generator-ce',
    title: 'Generator etykiety CE - CPR 2024/3110 | NowyCPR.pl',
    desc: 'Wygeneruj etykietę oznakowania CE zgodną z Art. 8 CPR 2024/3110. Wypełnij formularz i pobierz gotową etykietę do wydruku.',
    canonical: 'https://www.nowycpr.pl/generator-ce/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Generator etykiety CE', url: 'https://www.nowycpr.pl/generator-ce/' },
  },
  {
    path: 'polca',
    title: 'poLCA — Polski wskaźnik emisyjności energii elektrycznej | NowyCPR.pl',
    desc: 'poLCA to polski wskaźnik emisyjności energii elektrycznej dla potrzeb LCA/EPD. Katalog danych, technologie, normy.',
    canonical: 'https://www.nowycpr.pl/polca/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'poLCA', url: 'https://www.nowycpr.pl/polca/' },
  },
  {
    path: 'polityka-prywatnosci',
    title: 'Polityka prywatności — NowyCPR.pl',
    desc: 'Polityka prywatności portalu NowyCPR.pl.',
    canonical: 'https://www.nowycpr.pl/polityka-prywatnosci/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Polityka prywatności', url: 'https://www.nowycpr.pl/polityka-prywatnosci/' },
  },
  {
    path: 'regulamin',
    title: 'Regulamin — NowyCPR.pl',
    desc: 'Regulamin korzystania z portalu NowyCPR.pl.',
    canonical: 'https://www.nowycpr.pl/regulamin/',
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Regulamin', url: 'https://www.nowycpr.pl/regulamin/' },
  },
];

// ── Body content data for static pages ───────────────────────────────────
// Read wyroby MD files to build the product catalog list
const wyrobyContentDir = join(rootDir, 'content', 'wyroby');
const wyrobyItems = readdirSync(wyrobyContentDir)
  .filter(f => f.endsWith('.md'))
  .sort()
  .map(f => {
    const slug = f.replace('.md', '');
    const src = readFileSync(join(wyrobyContentDir, f), 'utf-8');
    const meta = parseFrontmatter(src);
    return {
      slug,
      title: String(meta.title || slug),
      excerpt: String(meta.excerpt || `Wymagania CPR 2024/3110 dla rodziny wyrobów: ${meta.title || slug}.`),
      category: String(meta.category || 'Wyroby budowlane'),
      avs: String(meta.avs_system || ''),
      date: String(meta.date || '2026-04-25'),
    };
  });

// Published blog posts (reuse files already read above)
const todayForBody = new Date();
todayForBody.setHours(23, 59, 59, 999);
const publishedPosts = files
  .map(file => {
    const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const src = readFileSync(join(blogContentDir, file), 'utf-8');
    const meta = parseFrontmatter(src);
    return { slug, title: String(meta.title || slug), date: String(meta.date || '') };
  })
  .filter(({ date }) => date && new Date(date) <= todayForBody)
  .sort((a, b) => b.date.localeCompare(a.date));

// Body HTML per path — injected hidden inside <body> for crawlers
const bodyContentMap = {
  '': `
<h1>Rozporządzenie CPR 2024/3110 dla wyrobów budowlanych — wymagania, DoP&amp;C, CE</h1>
<p>NowyCPR.pl wyjaśnia, co oznacza rozporządzenie CPR 2024/3110 dla producentów, importerów i dystrybutorów wyrobów budowlanych.</p>
<p>Główne tematy: DoP&amp;C, oznakowanie CE, systemy AVS, FPC/ZKP, GWP, EPD, cyfrowy paszport produktu DPP, dokumentacja techniczna i terminy wdrożenia CPR.</p>
<ul>
  <li><a href="/wyszukiwarka">Wyszukiwarka wymagań CPR dla wyrobu budowlanego</a></li>
  <li><a href="/documents">Wzory DoP&amp;C, CE, FPC, EPD i DPP</a></li>
  <li><a href="/services">Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&amp;C</a></li>
  <li><a href="/blog">Artykuły o CPR 2024/3110, AVS, GWP, EPD i DPP</a></li>
  <li><a href="/harmonogram">Terminy CPR 2024/3110: DoP&amp;C, GWP, DPP i sankcje</a></li>
</ul>`,

  blog: `
<h1>CPR 2024/3110: DoP&amp;C, AVS, GWP, DPP — artykuły</h1>
<p>Artykuły i analizy o CPR 2024/3110 dla producentów wyrobów budowlanych: DoP&amp;C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP, importerzy, dystrybutorzy i nadzór rynku.</p>
<ul>
${publishedPosts.map(p => `  <li><a href="/blog/${p.slug}/">${escapeHtml(p.title)}</a></li>`).join('\n')}
</ul>`,

  wyroby: `
<h1>Wyroby budowlane CPR: normy hEN, AVS i certyfikacja</h1>
<p>Katalog kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane hEN, systemy AVS, badania, FPC/ZKP i wymagania certyfikacyjne.</p>
<ul>
${wyrobyItems.map(w => `  <li><a href="/wyrob/${w.slug}/">${escapeHtml(w.title)}</a>${w.avs ? ` — System AVS: ${escapeHtml(w.avs)}` : ''}</li>`).join('\n')}
</ul>`,

  wyrob: `
<h1>Karta rodziny wyrobu — CPR 2024/3110</h1>
<p>Ta strona obsługuje szczegółowe karty rodzin wyrobów budowlanych w formacie <code>/wyrob/nazwa-rodziny/</code>. Znajdziesz tu wymagania, normy zharmonizowane, systemy AVS oraz checklisty działań dla wybranej rodziny.</p>
<ul>
${wyrobyItems.map(w => `  <li><a href="/wyrob/${w.slug}/">${escapeHtml(w.title)}</a>${w.avs ? ` — System AVS: ${escapeHtml(w.avs)}` : ''}</li>`).join('\n')}
</ul>`,

  'product-search': `
<h1>Wymagania CPR dla wyrobu budowlanego — wyszukiwarka</h1>
<p>Sprawdź wymagania CPR 2024/3110 dla konkretnego wyrobu budowlanego: norma hEN, system AVS, badania, dokumentacja, DoP&amp;C, FPC/ZKP i certyfikacja.</p>
<p>Dla każdej kategorii znajdziesz obowiązkowe badania i normy zharmonizowane, wymagany system AVS, dokumentację oraz kluczowe zmiany względem CPR 305/2011.</p>`,

  wyszukiwarka: `
<h1>Wymagania CPR dla wyrobu budowlanego — wyszukiwarka</h1>
<p>Sprawdź wymagania CPR 2024/3110 dla konkretnego wyrobu budowlanego: norma hEN, system AVS, badania, dokumentacja, DoP&amp;C, FPC/ZKP i certyfikacja.</p>
<p>Dla każdej kategorii znajdziesz obowiązkowe badania i normy zharmonizowane, wymagany system AVS, dokumentację oraz kluczowe zmiany względem CPR 305/2011.</p>`,

  documents: `
<h1>Wzory DoP&amp;C, CE, FPC, EPD i DPP — dokumenty CPR 2024/3110</h1>
<p>Bezpłatne wzory dokumentów CPR 2024/3110: DoP&amp;C, oznakowanie CE, FPC/ZKP, karta techniczna, EPD, DPP, AVS, importer i lista kontrolna producenta.</p>
<ul>
  <li>Szablon Deklaracji Właściwości Użytkowych i Zgodności (DoP&amp;C) — Załącznik V CPR 2024/3110</li>
  <li>Szablon karty technicznej wyrobu budowlanego</li>
  <li>Poradnik zakładowej kontroli produkcji (FPC/ZKP) — Art. 20 CPR 2024/3110</li>
  <li>Wzór oznakowania CE zgodny z CPR 2024/3110 — Art. 18–19</li>
  <li>Lista kontrolna zgodności z CPR 2024/3110 (7 obszarów)</li>
  <li>Szablon deklaracji środowiskowej produktu (EPD) — EN 15804+A2, system AVS 3+</li>
  <li>Przewodnik po cyfrowym paszporcie produktu (DPP) — Art. 75–80 CPR 2024/3110</li>
  <li>Przewodnik po systemach AVS (6 systemów: 1+, 1, 2+, 3, 3+, 4)</li>
  <li>Szablon DoP&amp;C dla importera — Art. 17 CPR 2024/3110</li>
  <li>Struktura dokumentacji technicznej — Art. 21 CPR 2024/3110</li>
  <li>Instrukcja dla profesjonalnych użytkowników — Art. 9 CPR 2024/3110</li>
  <li>Mandat upoważnionego przedstawiciela — Art. 23 CPR 2024/3110</li>
  <li>Plan Prac Komisji Europejskiej — Harmonogram norm CPR 2024/3110 na lata 2026–2029</li>
</ul>`,

  services: `
<h1>Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&amp;C — Multicert</h1>
<p>Certyfikacja wyrobów budowlanych, audyt ZKP/FPC, weryfikacja DoP&amp;C, oznakowanie CE i przegląd dokumentacji technicznej pod CPR 2024/3110.</p>
<ul>
  <li><strong>Audyt gotowości CPR 2024</strong> — identyfikacja systemu AVS, ocena ZKP/FPC, analiza dokumentacji DoP&amp;C, mapa ryzyk</li>
  <li><strong>Przegląd systemu ZKP (Art. 20 CPR 2024)</strong> — ocena dla wszystkich systemów AVS (1+, 1, 2+, 3, 3+, 4), uproszczenie dla mikroprzedsiębiorstw (Art. 60)</li>
  <li><strong>Dokumentacja techniczna CPR 2024</strong> — DoP&amp;C (Art. 15), plik techniczny (Art. 22), instrukcje (Art. 9), mandat przedstawiciela (Art. 23)</li>
  <li><strong>Weryfikacja oprogramowania obliczeniowego</strong> — raport walidacyjny do pliku technicznego Art. 21</li>
  <li><strong>Analiza norm i harmonogram wdrożenia</strong> — normy zharmonizowane, Plan Prac KE (Milestones 0–IV, 2026–2029)</li>
  <li><strong>Szkolenia CPR 2024/3110</strong> — warsztaty dla producentów i dystrybutorów wyrobów budowlanych</li>
</ul>`,

  harmonogram: `
<h1>Terminy CPR 2024/3110: DoP&amp;C, GWP, DPP i sankcje</h1>
<p>Harmonogram CPR 2024/3110 obejmuje daty stosowania, okresy przejściowe, terminy DoP&amp;C, GWP, EPD, DPP, nowe hTS, sankcje i obowiązki producentów.</p>
<ul>
  <li>7 stycznia 2025 — wejście w życie CPR 2024/3110.</li>
  <li>8 stycznia 2026 — rozpoczęcie stosowania przepisów ramowych.</li>
  <li>2027+ — akty delegowane, nowe hTS, GWP, EPD i DPP dla kolejnych grup wyrobów.</li>
  <li>2027+ — krajowe sankcje i intensyfikacja nadzoru rynku.</li>
</ul>`,

  'o-portalu': `
<h1>O portalu NowyCPR.pl — Rozporządzenie CPR 2024/3110</h1>
<p>NowyCPR.pl to kompleksowe źródło wiedzy o Rozporządzeniu (UE) 2024/3110 w sprawie wyrobów budowlanych (CPR) dla producentów, importerów i dystrybutorów działających na rynku polskim i europejskim.</p>
<p>Portal prowadzony jest przez Multicert Sp. z o.o. — akredytowaną jednostkę certyfikującą wyroby budowlane z siedzibą w Warszawie (ul. Mydlarska 47, 04-690 Warszawa).</p>
<p>Co oferujemy: artykuły prawne i techniczne o CPR 2024/3110, katalog 36 rodzin wyrobów budowlanych (Załącznik VII), 13 bezpłatnych szablonów dokumentów (DoP&amp;C, ZKP/FPC, EPD, DPP), wyszukiwarka wymagań dla kategorii wyrobów.</p>`,

  kontakt: `
<h1>Kontakt — NowyCPR.pl</h1>
<address>
  <p><strong>Multicert Sp. z o.o.</strong></p>
  <p>ul. Mydlarska 47, 04-690 Warszawa</p>
  <p>Email: <a href="mailto:biuro@multicert.pl">biuro@multicert.pl</a></p>
</address>`,

  dostepnosc: `
<h1>Deklaracja dostępności cyfrowej — NowyCPR.pl</h1>
<p>Portal NowyCPR.pl zobowiązuje się zapewnić dostępność swojej strony internetowej zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.</p>`,
};

function renderStaticPage(page) {
  const title     = escapeHtml(page.title);
  const desc      = escapeHtml(page.desc);
  const keywords  = escapeHtml(page.keywords || 'CPR 2024/3110, wyroby budowlane, DoP&C, oznakowanie CE, AVS, FPC, GWP, EPD, DPP');
  const canonical = page.canonical;
  const jsonLd    = JSON.stringify(page.schema);
  const body      = bodyContentMap[page.path] || '';

  let html = templateHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(
      /<meta name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${desc}" />`
    )
    .replace(
      /\s*<meta name="keywords"[\s\S]*?\/>/,
      `\n  <meta name="keywords" content="${keywords}" />`
    )
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`)
    .replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n</head>`);

  // Inject static body content directly into #root.
  // Crawlers (Google, AI bots) see the full HTML text.
  // React mounts fresh into #root on load, replacing this content within ~1s.
  // Minimal flash for users — acceptable trade-off for full crawlability.
  if (body) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><main>${body}\n</main></div>`
    );
  }

  return html;
}

let staticCount = 0;
for (const page of staticPages) {
  const outDir = join(distDir, page.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), renderStaticPage(page), 'utf-8');
  staticCount++;
  console.log(`  ✓ /${page.path}`);
}
console.log(`\n✓ Pre-rendered ${staticCount} static pages into dist/*/index.html`);

let productCount = 0;
for (const item of wyrobyItems) {
  const path = `wyrob/${item.slug}`;
  const canonical = `https://www.nowycpr.pl/${path}/`;
  const desc = item.excerpt;
  const seoTitle = productSeoTitle(item.title);
  bodyContentMap[path] = `
<h1>${escapeHtml(seoTitle)}</h1>
<p>${escapeHtml(desc)}</p>
<ul>
  <li>Kategoria: ${escapeHtml(item.category)}</li>
  ${item.avs ? `<li>System AVS: ${escapeHtml(item.avs)}</li>` : ''}
  <li><a href="/wyroby/">Powrót do katalogu wyrobów budowlanych CPR</a></li>
  <li><a href="/services/">Certyfikacja wyrobów budowlanych CPR, ZKP i DoP&amp;C</a></li>
</ul>`;

  const outDir = join(distDir, 'wyrob', item.slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), renderStaticPage({
    path,
    title: `${seoTitle} | NowyCPR.pl`,
    desc,
    keywords: `${item.title}, CPR 2024/3110, wyroby budowlane, system AVS, DoP&C, FPC, ZKP`,
    canonical,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: seoTitle,
      description: desc,
      url: canonical,
      inLanguage: 'pl-PL',
      dateModified: item.date,
      articleSection: item.category,
      publisher: { '@type': 'Organization', name: 'NowyCPR.pl — Multicert Sp. z o.o.' },
      about: { '@type': 'Thing', name: 'Rozporządzenie (UE) 2024/3110' },
      keywords: `${item.title}, CPR 2024/3110, system AVS, DoP&C, FPC`
    },
  }), 'utf-8');
  productCount++;
  console.log(`  ✓ /${path}/`);
}
console.log(`\n✓ Pre-rendered ${productCount} product pages into dist/wyrob/*/index.html`);

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
    const lastmod = meta.updated || meta.reviewed || date;
    return { slug, date, lastmod };
  })
  .filter(({ date }) => date && new Date(date) <= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

const blogXml = blogEntries.map(({ slug, lastmod }) => `  <url>
    <loc>https://www.nowycpr.pl/blog/${slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

const productXml = wyrobyItems.map(item => `  <url>
    <loc>https://www.nowycpr.pl/wyrob/${item.slug}/</loc>
    <lastmod>${item.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

// Replace generated sections in the source sitemap.
let updatedSitemap = sourceSitemap.replace(
  /<!-- Blog posts[\s\S]*?(?=<!-- Katalog)/,
  `<!-- Blog posts — auto-generated by prerender.mjs, tylko opublikowane -->\n${blogXml}\n\n  `
);
updatedSitemap = updatedSitemap.replace(
  /<!-- Katalog wyrobów[\s\S]*?(?=<\/urlset>)/,
  `<!-- Katalog wyrobów — auto-generated by prerender.mjs -->\n${productXml}\n`
);

writeFileSync(join(distDir, 'sitemap.xml'), updatedSitemap, 'utf-8');
console.log(`✓ Sitemap updated: ${blogEntries.length} blog posts, ${wyrobyItems.length} product pages (opublikowane do ${today.toISOString().slice(0, 10)})`);

// ── Generate per-post JSON files for fast SPA loading ─────────────────────────
// Creates:
//   dist/posts/meta.json      — all posts metadata (no content) for blog listing
//   dist/posts/<slug>.json    — full post including content, one file per post
//
// blogLoader.ts uses these in PROD mode via fetch() instead of import.meta.glob(),
// reducing data loaded from ~564 KB (all 55 posts) to ~10–15 KB (one post).

function parseFrontmatterFull(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { data: {}, content: src };
  const yamlStr = m[1];
  const content = m[2];
  const data = {};
  const lines = yamlStr.split('\n');
  let currentKey = null;
  let currentArray = null;
  for (const line of lines) {
    const arrayItemMatch = line.match(/^  - (.+)$/);
    const keyValueMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (arrayItemMatch && currentKey && currentArray !== null) {
      currentArray.push(arrayItemMatch[1].trim().replace(/^['"]|['"]$/g, ''));
    } else if (keyValueMatch) {
      if (currentKey && currentArray !== null) data[currentKey] = currentArray;
      currentKey = keyValueMatch[1];
      const value = keyValueMatch[2].trim();
      if (value === '') {
        currentArray = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        try { data[currentKey] = JSON.parse(value); }
        catch { data[currentKey] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean); }
        currentArray = null;
      } else {
        data[currentKey] = value.replace(/^['"]|['"]$/g, '');
        currentArray = null;
      }
    }
  }
  if (currentKey && currentArray !== null) data[currentKey] = currentArray;
  return { data, content };
}

const postsDataDir = join(distDir, 'posts');
mkdirSync(postsDataDir, { recursive: true });

const allMeta = [];

for (const file of files) {
  const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const src = readFileSync(join(blogContentDir, file), 'utf-8');
  const { data: meta, content } = parseFrontmatterFull(src);

  const postJson = {
    id: slug,
    slug,
    title: String(meta.title || ''),
    excerpt: String(meta.excerpt || ''),
    content,
    author: String(meta.author || ''),
    published_at: String(meta.date || ''),
    reviewed: meta.reviewed ? String(meta.reviewed) : undefined,
    updated_at: meta.updated ? String(meta.updated) : undefined,
    is_published: true,
    category: String(meta.category || ''),
    image_url: String(meta.image_url || ''),
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    template: meta.template ? String(meta.template) : undefined,
    sources: Array.isArray(meta.sources) ? meta.sources : undefined,
  };

  writeFileSync(join(postsDataDir, `${slug}.json`), JSON.stringify(postJson), 'utf-8');

  // Meta only (no content) for the listing page
  const { content: _c, ...metaOnly } = postJson;
  allMeta.push(metaOnly);
}

writeFileSync(join(postsDataDir, 'meta.json'), JSON.stringify(allMeta), 'utf-8');
console.log(`✓ Generated JSON data files: dist/posts/meta.json + ${allMeta.length} individual post files`);
