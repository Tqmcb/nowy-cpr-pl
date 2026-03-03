# Design: SEO — Favicon, Meta tagi, Sitemap, Schema.org

**Data:** 2026-03-03
**Projekt:** nowycpr.pl
**Podejście:** B — grupowane równolegle (3 niezależne bloki)

---

## Problem

1. Favicon nie wyświetla się w wynikach Google — ikona ma 32×32 px, Google wymaga min. 48×48 px. Brakuje `site.webmanifest`.
2. Kluczowe strony (WyrobDetail, Wyroby, ProductSearchTool, Services, BlogPage) nie mają dynamicznych meta tagów — Google widzi ten sam title/description dla wszystkich podstron.
3. Sitemap zawiera tylko 6 statycznych URLi — brakuje 36 stron wyrobów.
4. Brakuje BreadcrumbList i TechArticle schema dla stron wyrobów.

---

## Blok 1: Favicon + site.webmanifest

### Cel
Sprawić, by Google wyświetlał favicon portalu w SERP.

### Zmiany

**Nowe pliki w `public/`:**
- `favicon-192x192.png` — wygenerowany z `favicon.svg` (dla manifest + Google)
- `favicon-512x512.png` — wygenerowany z `favicon.svg` (dla PWA splash)
- `site.webmanifest` — opisuje aplikację i wskazuje ikony

**`public/site.webmanifest`:**
```json
{
  "name": "NowyCPR.pl",
  "short_name": "NowyCPR",
  "description": "Portal informacyjny o CPR 2024/3110 dla producentów wyrobów budowlanych",
  "start_url": "/",
  "display": "browser",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "icons": [
    { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
```

**Zmiana w `index.html`** — dodać przed `</head>`:
```html
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0f172a">
```

**Generowanie PNG z SVG:**
```bash
# Wymaga: npx sharp-cli lub resvg-js lub Inkscape
# Alternatywnie: node script z sharp
npx sharp -i public/favicon.svg -o public/favicon-192x192.png resize 192 192
npx sharp -i public/favicon.svg -o public/favicon-512x512.png resize 512 512
```

---

## Blok 2: Dynamiczne meta tagi per strona

### Cel
Każda podstrona ma unikalny `<title>`, `<meta description>`, `<og:title>`, `<og:url>`, `<link rel="canonical">` — widoczne w SERP jako osobne wyniki.

`react-helmet-async` jest już zainstalowany i skonfigurowany w `main.tsx`.

### Strony do zaktualizowania

#### `src/pages/WyrobDetail.tsx` (priorytet 1 — 36 podstron)
```tsx
<Helmet>
  <title>{frontmatter.title} — Wymagania CPR 2024/3110 | NowyCPR.pl</title>
  <meta name="description" content={`Wymagania CPR 2024/3110 dla: ${frontmatter.title}. Normy, system AVS, certyfikacja, DoP&C — sprawdź co musisz zrobić jako producent.`} />
  <meta property="og:title" content={`${frontmatter.title} — CPR 2024/3110`} />
  <meta property="og:description" content={...} />
  <meta property="og:url" content={`https://www.nowycpr.pl/wyroby/${slug}`} />
  <meta property="og:type" content="article" />
  <link rel="canonical" href={`https://www.nowycpr.pl/wyroby/${slug}`} />
  <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">{JSON.stringify(techArticleSchema)}</script>
</Helmet>
```

**BreadcrumbList schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://www.nowycpr.pl/" },
    { "@type": "ListItem", "position": 2, "name": "Katalog wyrobów", "item": "https://www.nowycpr.pl/wyroby" },
    { "@type": "ListItem", "position": 3, "name": "[frontmatter.title]" }
  ]
}
```

**TechArticle schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "[frontmatter.title] — Wymagania CPR 2024/3110",
  "description": "...",
  "url": "https://www.nowycpr.pl/wyroby/[slug]",
  "inLanguage": "pl-PL",
  "publisher": { "@id": "https://www.nowycpr.pl/#organization" },
  "about": { "@type": "Thing", "name": "CPR 2024/3110" }
}
```

#### `src/pages/Wyroby.tsx`
```tsx
<Helmet>
  <title>Katalog Wyrobów Budowlanych — CPR 2024/3110 | NowyCPR.pl</title>
  <meta name="description" content="Przeszukaj katalog 36 kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy, systemy AVS i wymagania certyfikacyjne dla swojego produktu." />
  <meta property="og:title" content="Katalog Wyrobów Budowlanych CPR 2024/3110" />
  <meta property="og:url" content="https://www.nowycpr.pl/wyroby" />
  <link rel="canonical" href="https://www.nowycpr.pl/wyroby" />
</Helmet>
```

#### `src/components/ProductSearchTool.tsx`
```tsx
<Helmet>
  <title>Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl</title>
  <meta name="description" content="Sprawdź wymagania CPR 2024/3110 dla swojego wyrobu budowlanego. Wybierz kategorię i poznaj obowiązkowe badania, dokumentację i zmiany względem CPR 305/2011." />
  <meta property="og:url" content="https://www.nowycpr.pl/product-search" />
  <link rel="canonical" href="https://www.nowycpr.pl/product-search" />
</Helmet>
```

#### `src/pages/Services.tsx`
```tsx
<Helmet>
  <title>Usługi Certyfikacyjne CPR 2024/3110 — Multicert | NowyCPR.pl</title>
  <meta name="description" content="Certyfikacja ZKP, weryfikacja DoP&C, audyty zgodności CPR 2024/3110. Multicert — akredytowana jednostka certyfikująca wyroby budowlane w Polsce." />
  <meta property="og:url" content="https://www.nowycpr.pl/services" />
  <link rel="canonical" href="https://www.nowycpr.pl/services" />
</Helmet>
```

#### `src/components/BlogPage.tsx`
```tsx
<Helmet>
  <title>Aktualności CPR 2024/3110 — Artykuły i Analizy | NowyCPR.pl</title>
  <meta name="description" content="Artykuły, analizy i przewodniki o CPR 2024/3110 dla producentów wyrobów budowlanych. Śledź zmiany w prawie budowlanym UE." />
  <meta property="og:url" content="https://www.nowycpr.pl/blog" />
  <link rel="canonical" href="https://www.nowycpr.pl/blog" />
</Helmet>
```

---

## Blok 3: Sitemap + ItemList schema

### Cel
Google odkrywa i indeksuje wszystkie 36 stron wyrobów. `ItemList` schema może wygenerować listę linków bezpośrednio w SERP.

### Zmiany w `public/sitemap.xml`

Dodać po istniejących statycznych URLach sekcję z 36 stronami wyrobów:

```xml
<!-- Katalog wyrobów — 36 stron -->
<url>
  <loc>https://www.nowycpr.pl/wyroby/armatura-sanitarna</loc>
  <lastmod>2026-03-03</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<!-- ... (wszystkie 36 slugów) -->
```

Pełna lista slugów:
armatura-sanitarna, cement-spoiwa, drabiny, drewno-konstrukcyjne, fasady-strukturalne,
geosyntetyki, izolacja-termiczna, kable, kanalizacja, kleje-budowlane, kominy,
kruszywa, laczniki-kotwy, lozbyska-budowlane, membrany, ochrona-przeciwpozarowa,
okna-drzwi-bramy, plyty-drewnopochodne, podlogi-posadzki, pokrycia-dachowe,
prefabrykaty-betonowe, rury-zbiorniki, stal-zbrojeniowa, szklo-budowlane,
tynki-okladziny, urzadzenia-gasnicze, urzadzenia-grzewcze, uszczelnienia,
wyposazenie-drog, wyroby-do-betonu, wyroby-drogowe, wyroby-gipsowe,
wyroby-metalowe, wyroby-murowe, wyroby-woda-pitna, zestawy-budowlane

### ItemList schema w `src/pages/Wyroby.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Katalog wyrobów budowlanych CPR 2024/3110",
  "url": "https://www.nowycpr.pl/wyroby",
  "numberOfItems": 36,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Cement i spoiwa",
      "url": "https://www.nowycpr.pl/wyroby/cement-spoiwa"
    }
    // ... wszystkie 36
  ]
}
```

---

## Kolejność implementacji

1. **Blok 1** (favicon) — niezależny, tylko pliki w `public/` i `index.html`
2. **Blok 2 + 3** — równolegle (meta tagi w TSX, sitemap w XML)

---

## Kryteria sukcesu

- [ ] Google Search Console pokazuje favicon w podglądzie URL
- [ ] `site.webmanifest` dostępny pod `https://www.nowycpr.pl/site.webmanifest`
- [ ] Każda strona wyrobu ma unikalny `<title>` i `<meta description>`
- [ ] Sitemap zawiera 42 URLe (6 statycznych + 36 wyrobów)
- [ ] Rich Results Test Google nie zgłasza błędów dla BreadcrumbList i TechArticle
- [ ] Wszystkie 36 URLi wyrobów zindeksowane w Google Search Console
