# SEO: Favicon, Meta tagi, Sitemap, Schema.org — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Naprawić niewidoczny favicon w Google SERP + dodać dynamiczne meta tagi dla każdej podstrony + rozbudować sitemap o 36 stron wyrobów + dodać BreadcrumbList i TechArticle schema.

**Architecture:** Trzy niezależne bloki: (1) favicon PNG + site.webmanifest, (2) `<Helmet>` w brakujących stronach TSX, (3) rozbudowanie sitemap.xml + schema w Wyroby.tsx i WyrobDetail.tsx. `react-helmet-async` już zainstalowany. WyrobDetail korzysta z query param `?slug=X` (nie path param). Wyrob ma pola: `slug`, `title`, `excerpt`, `category`, `avs_system`, `normy`, `family_number`.

**Tech Stack:** React + TypeScript + Vite + react-helmet-async, GitHub Pages (SPA), sharp (devDep, tylko do generowania ikon)

---

## BLOK 1: Favicon + site.webmanifest

### Task 1: Zainstaluj sharp i wygeneruj PNG favicon

**Files:**
- Create: `scripts/generate-icons.js`
- Create: `public/favicon-192x192.png` (wygenerowany)
- Create: `public/favicon-512x512.png` (wygenerowany)

**Step 1: Zainstaluj sharp jako devDependency**

```bash
cd /Users/admin/Downloads/nowy-cpr-pl
npm install --save-dev sharp
```

Expected: sharp zainstalowany, pojawia się w `package.json` devDependencies.

**Step 2: Stwórz skrypt generujący PNG**

Utwórz plik `scripts/generate-icons.js`:

```js
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('public/favicon.svg');

await sharp(svg).resize(192, 192).png().toFile('public/favicon-192x192.png');
console.log('✓ favicon-192x192.png');

await sharp(svg).resize(512, 512).png().toFile('public/favicon-512x512.png');
console.log('✓ favicon-512x512.png');
```

**Step 3: Uruchom skrypt**

```bash
node scripts/generate-icons.js
```

Expected output:
```
✓ favicon-192x192.png
✓ favicon-512x512.png
```

Weryfikacja:
```bash
file public/favicon-192x192.png public/favicon-512x512.png
```

Expected: oba pliki PNG image data, odpowiednie rozmiary.

**Step 4: Commit**

```bash
git add scripts/generate-icons.js public/favicon-192x192.png public/favicon-512x512.png
git commit -m "feat: generuj favicon 192px i 512px z favicon.svg"
```

---

### Task 2: Stwórz site.webmanifest i zaktualizuj index.html

**Files:**
- Create: `public/site.webmanifest`
- Modify: `index.html`

**Step 1: Stwórz `public/site.webmanifest`**

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
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

**Step 2: Dodaj manifest i theme-color do `index.html`**

W `index.html`, po linii z `<link rel="apple-touch-icon"...>` (około linia 7), dodaj:

```html
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0f172a">
```

**Step 3: Zbuduj i sprawdź**

```bash
npm run build 2>&1 | tail -5
```

Expected: build zakończony bez błędów.

**Step 4: Commit**

```bash
git add public/site.webmanifest index.html
git commit -m "feat: dodaj site.webmanifest i theme-color — napraw favicon w Google SERP"
```

---

## BLOK 2: Dynamiczne meta tagi per strona

### Task 3: Helmet w WyrobDetail.tsx (priorytet — 36 unikalnych stron)

**Files:**
- Modify: `src/pages/WyrobDetail.tsx`

Wyrob (`ProductFamily`) ma pola: `slug`, `title`, `excerpt`, `category`, `avs_system`, `family_number`.
URL strony wyrobu to: `https://www.nowycpr.pl/wyroby?slug={slug}`

**Step 1: Dodaj import Helmet**

Na górze pliku, dodaj import:

```tsx
import { Helmet } from "react-helmet-async";
```

**Step 2: Zbuduj schematy JSON-LD**

W ciele komponentu `WyrobDetail`, po odczytaniu `wyrob` ze stanu, tuż przed `return`, dodaj:

```tsx
const canonicalUrl = `https://www.nowycpr.pl/wyroby?slug=${wyrob?.slug ?? slug}`;
const pageTitle = wyrob
  ? `${wyrob.title} — Wymagania CPR 2024/3110 | NowyCPR.pl`
  : "Wyrób budowlany — CPR 2024/3110 | NowyCPR.pl";
const pageDesc = wyrob?.excerpt
  ? `${wyrob.excerpt} Sprawdź normy, system ${wyrob.avs_system}, certyfikację i wymagania DoP&C.`
  : "Szczegółowe wymagania CPR 2024/3110 dla wyrobów budowlanych.";

const breadcrumbSchema = wyrob ? {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://www.nowycpr.pl/" },
    { "@type": "ListItem", "position": 2, "name": "Katalog wyrobów", "item": "https://www.nowycpr.pl/wyroby" },
    { "@type": "ListItem", "position": 3, "name": wyrob.title }
  ]
} : null;

const techArticleSchema = wyrob ? {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": `${wyrob.title} — Wymagania CPR 2024/3110`,
  "description": pageDesc,
  "url": canonicalUrl,
  "inLanguage": "pl-PL",
  "publisher": { "@id": "https://www.nowycpr.pl/#organization" },
  "about": { "@type": "Thing", "name": "CPR 2024/3110" },
  "keywords": `CPR 2024, ${wyrob.category}, ${wyrob.avs_system}, wyroby budowlane`
} : null;
```

**Step 3: Wstaw `<Helmet>` do JSX**

Na początku głównego `return`, przed aktualną zawartością, wstaw:

```tsx
<>
  <Helmet>
    <title>{pageTitle}</title>
    <meta name="description" content={pageDesc} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDesc} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:type" content="article" />
    <link rel="canonical" href={canonicalUrl} />
    {breadcrumbSchema && (
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    )}
    {techArticleSchema && (
      <script type="application/ld+json">
        {JSON.stringify(techArticleSchema)}
      </script>
    )}
  </Helmet>
  {/* reszta JSX bez zmian */}
</>
```

Uwaga: jeśli główny `return` zwraca pojedynczy `<div>`, opakuj go w fragment `<>...</>`.

**Step 4: Sprawdź TypeScript**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: brak nowych błędów TypeScript (istniejące pre-existing błędy w BlogPost/WyrobDetail dotyczące `.ordered`/`.index` są znane i nie dotyczą naszych zmian).

**Step 5: Walidacja CPR**

```bash
bash .claude/scripts/validate-cpr.sh
```

Expected: `✓ Walidacja OK`

**Step 6: Commit**

```bash
git add src/pages/WyrobDetail.tsx
git commit -m "feat: dodaj dynamiczne meta tagi i schema (Breadcrumb, TechArticle) w WyrobDetail"
```

---

### Task 4: Helmet w Wyroby.tsx (strona katalogu)

**Files:**
- Modify: `src/pages/Wyroby.tsx`

**Step 1: Dodaj import Helmet**

```tsx
import { Helmet } from "react-helmet-async";
```

**Step 2: Wstaw Helmet do JSX**

Na początku `return` komponentu `Wyroby`, jako pierwsze dziecko wrappera:

```tsx
<Helmet>
  <title>Katalog Wyrobów Budowlanych — CPR 2024/3110 | NowyCPR.pl</title>
  <meta name="description" content="Przeszukaj katalog 36 kategorii wyrobów budowlanych objętych CPR 2024/3110. Sprawdź normy zharmonizowane, systemy AVS i wymagania certyfikacyjne dla swojego produktu." />
  <meta property="og:title" content="Katalog Wyrobów Budowlanych CPR 2024/3110 | NowyCPR.pl" />
  <meta property="og:description" content="36 kategorii wyrobów budowlanych — normy, systemy AVS, certyfikacja DoP&C." />
  <meta property="og:url" content="https://www.nowycpr.pl/wyroby" />
  <link rel="canonical" href="https://www.nowycpr.pl/wyroby" />
</Helmet>
```

**Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "^.*error" | grep -v "pre-existing" | head -10
```

**Step 4: Commit**

```bash
git add src/pages/Wyroby.tsx
git commit -m "feat: dodaj meta tagi Helmet w stronie katalogu Wyroby"
```

---

### Task 5: Helmet w ProductSearchTool.tsx, Services.tsx, BlogPage.tsx

**Files:**
- Modify: `src/components/ProductSearchTool.tsx`
- Modify: `src/pages/Services.tsx`
- Modify: `src/components/BlogPage.tsx`

Wszystkie trzy zmiany są identyczne w strukturze — dodaj import + `<Helmet>` na początku return.

**Step 1: ProductSearchTool.tsx**

Dodaj po istniejących importach:
```tsx
import { Helmet } from "react-helmet-async";
```

Wstaw jako pierwsze dziecko wrappera div w return:
```tsx
<Helmet>
  <title>Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl</title>
  <meta name="description" content="Sprawdź wymagania CPR 2024/3110 dla swojego wyrobu budowlanego. Wybierz kategorię i poznaj obowiązkowe badania, dokumentację i zmiany względem CPR 305/2011." />
  <meta property="og:title" content="Wyszukiwarka Wymagań CPR 2024/3110 | NowyCPR.pl" />
  <meta property="og:description" content="Interaktywna wyszukiwarka wymagań dla 36 kategorii wyrobów budowlanych objętych CPR 2024/3110." />
  <meta property="og:url" content="https://www.nowycpr.pl/product-search" />
  <link rel="canonical" href="https://www.nowycpr.pl/product-search" />
</Helmet>
```

**Step 2: Services.tsx**

```tsx
import { Helmet } from "react-helmet-async";
```

```tsx
<Helmet>
  <title>Usługi Certyfikacyjne CPR 2024/3110 — Multicert | NowyCPR.pl</title>
  <meta name="description" content="Certyfikacja ZKP, weryfikacja DoP&C, przegląd dokumentacji technicznej i audyty zgodności z CPR 2024/3110. Multicert — akredytowana jednostka certyfikująca wyroby budowlane." />
  <meta property="og:title" content="Usługi Certyfikacyjne CPR 2024/3110 — Multicert" />
  <meta property="og:description" content="Certyfikacja ZKP, DoP&C, audyty CPR 2024/3110 — Multicert, akredytowana NB w Polsce." />
  <meta property="og:url" content="https://www.nowycpr.pl/services" />
  <link rel="canonical" href="https://www.nowycpr.pl/services" />
</Helmet>
```

**Step 3: BlogPage.tsx**

```tsx
import { Helmet } from "react-helmet-async";
```

```tsx
<Helmet>
  <title>Aktualności CPR 2024/3110 — Artykuły i Analizy | NowyCPR.pl</title>
  <meta name="description" content="Artykuły, analizy prawne i przewodniki techniczne o CPR 2024/3110 dla producentów wyrobów budowlanych. Śledź zmiany w rozporządzeniu UE o wyrobach budowlanych." />
  <meta property="og:title" content="Aktualności CPR 2024/3110 | NowyCPR.pl" />
  <meta property="og:description" content="Artykuły i analizy o nowym rozporządzeniu CPR 2024/3110 dla producentów wyrobów budowlanych." />
  <meta property="og:url" content="https://www.nowycpr.pl/blog" />
  <link rel="canonical" href="https://www.nowycpr.pl/blog" />
</Helmet>
```

**Step 4: Build + walidacja**

```bash
npm run build 2>&1 | grep -c "error" && bash .claude/scripts/validate-cpr.sh
```

Expected: `0` błędów TypeScript (nowych) + `✓ Walidacja OK`

**Step 5: Commit**

```bash
git add src/components/ProductSearchTool.tsx src/pages/Services.tsx src/components/BlogPage.tsx
git commit -m "feat: dodaj meta tagi Helmet w ProductSearchTool, Services, BlogPage"
```

---

## BLOK 3: Sitemap + ItemList schema

### Task 6: Rozbuduj sitemap.xml o 36 stron wyrobów

**Files:**
- Modify: `public/sitemap.xml`

**Step 1: Odczytaj aktualną zawartość sitemap**

```bash
cat public/sitemap.xml
```

**Step 2: Dodaj 36 wpisów wyrobów**

Przed zamykającym `</urlset>` dodaj (URL z query param, bo tak działa router):

```xml
  <!-- Katalog wyrobów — 36 stron -->
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=armatura-sanitarna</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=cement-spoiwa</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=drabiny</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=drewno-konstrukcyjne</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=fasady-strukturalne</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=geosyntetyki</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=izolacja-termiczna</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=kable</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=kanalizacja</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=kleje-budowlane</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=kominy</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=kruszywa</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=laczniki-kotwy</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=lozbyska-budowlane</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=membrany</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=ochrona-przeciwpozarowa</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=okna-drzwi-bramy</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=plyty-drewnopochodne</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=podlogi-posadzki</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=pokrycia-dachowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=prefabrykaty-betonowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=rury-zbiorniki</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=stal-zbrojeniowa</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=szklo-budowlane</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=tynki-okladziny</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=urzadzenia-gasnicze</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=urzadzenia-grzewcze</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=uszczelnienia</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyposazenie-drog</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-do-betonu</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-drogowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-gipsowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-metalowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-murowe</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=wyroby-woda-pitna</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.nowycpr.pl/wyroby?slug=zestawy-budowlane</loc>
    <lastmod>2026-03-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

**Step 3: Sprawdź liczbę URLi**

```bash
grep -c "<loc>" public/sitemap.xml
```

Expected: `42` (6 statycznych + 36 wyrobów)

**Step 4: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: rozbuduj sitemap.xml o 36 stron wyrobów (42 URLi łącznie)"
```

---

### Task 7: ItemList schema w Wyroby.tsx

**Files:**
- Modify: `src/pages/Wyroby.tsx`

**Step 1: Zbuduj ItemList schema**

W ciele komponentu `Wyroby`, po załadowaniu listy `wyroby` ze stanu (po `useEffect`), dodaj:

```tsx
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Katalog wyrobów budowlanych CPR 2024/3110",
  "description": "36 kategorii wyrobów budowlanych objętych Rozporządzeniem CPR (UE) 2024/3110",
  "url": "https://www.nowycpr.pl/wyroby",
  "numberOfItems": wyroby.length,
  "itemListElement": wyroby.map((w, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "name": w.title,
    "url": `https://www.nowycpr.pl/wyroby?slug=${w.slug}`
  }))
};
```

**Step 2: Dodaj do istniejącego `<Helmet>` (z Task 4)**

W `<Helmet>` dodanym w Task 4, dopisz:

```tsx
<script type="application/ld+json">
  {JSON.stringify(itemListSchema)}
</script>
```

**Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "^src.*error" | head -10
```

Expected: brak nowych błędów TypeScript.

**Step 4: Commit**

```bash
git add src/pages/Wyroby.tsx
git commit -m "feat: dodaj ItemList schema.org w katalogu Wyroby"
```

---

## Weryfikacja końcowa

**Step 1: Build produkcyjny**

```bash
npm run build
```

Expected: sukces bez błędów.

**Step 2: CPR walidacja**

```bash
bash .claude/scripts/validate-cpr.sh
```

Expected: `✓ Walidacja OK`

**Step 3: Sprawdź manifest w dist/**

```bash
cat dist/site.webmanifest
ls -la dist/favicon-192x192.png dist/favicon-512x512.png
```

Expected: pliki istnieją w katalogu dist.

**Step 4: Sprawdź liczbę `<link rel="canonical">` w build**

```bash
grep -r "canonical" dist/index.html
```

Expected: jedna linia canonical (strona główna — pozostałe są dynamiczne przez Helmet).

**Step 5: Commit weryfikacyjny**

```bash
git log --oneline -7
```

Expected: widoczne commity z Tasks 1–7.

---

## Po wdrożeniu (manualne)

1. **Google Search Console** → URL Inspection → wpisz `https://www.nowycpr.pl/` → sprawdź czy favicon jest widoczny w podglądzie
2. **Rich Results Test** → `https://search.google.com/test/rich-results` → wpisz URL wyrobu (np. `https://www.nowycpr.pl/wyroby?slug=cement-spoiwa`) → sprawdź BreadcrumbList i TechArticle
3. **Search Console → Sitemaps** → prześlij nową wersję `sitemap.xml`
4. **Poczekaj 1–2 tygodnie** — Google potrzebuje czasu na recrawl i odświeżenie favicon w SERP
