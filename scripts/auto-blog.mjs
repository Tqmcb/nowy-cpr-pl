/**
 * auto-blog.mjs — Automatyczny generator artykułów CPR 2024
 *
 * Uruchamiany co tydzień przez GitHub Actions (.github/workflows/auto-blog.yml).
 * Używa Gemini 2.0 Flash z Google Search grounding, żeby znaleźć nowy temat
 * z zakresu CPR 2024/3110 i wygenerować artykuł .md do content/blog/.
 *
 * Wymagane env: GEMINI_API_KEY
 * Opcjonalne env: CF_ACCOUNT_ID, CF_AI_TOKEN (fallback do Cloudflare Workers AI gdy Pollinations nie działa)
 *
 * ⚠️  PRZED COMMITEM wygenerowanego artykułu obowiązkowa weryfikacja:
 *   1. weryfikacja-faktow-cpr  → sprawdź daty, status norm, akty wykonawcze
 *   2. walidacja-cpr           → sprawdź numery artykułów CPR i słownictwo
 *
 * Typowe błędy AI: DPP jako "już obowiązkowe", EN 15804+A3 jako "opublikowane",
 * błędne daty wejścia w życie, nieistniejące akty wykonawcze KE.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir   = join(__dirname, '..');
const blogDir   = join(rootDir, 'content', 'blog');
const draftDir  = join(rootDir, 'content', 'drafts');

const GEMINI_API_KEY  = process.env.GEMINI_API_KEY;
const CF_ACCOUNT_ID   = process.env.CF_ACCOUNT_ID;
const CF_AI_TOKEN     = process.env.CF_AI_TOKEN;

if (!GEMINI_API_KEY) {
  console.error('❌ Brak GEMINI_API_KEY w environment');
  process.exit(1);
}

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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function getExistingTitles() {
  return readdirSync(blogDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const src = readFileSync(join(blogDir, f), 'utf-8');
      return parseFrontmatter(src).title || '';
    })
    .filter(Boolean);
}

// ── Google News RSS (darmowy, bez API key) ────────────────────────────────────

async function fetchNewsHeadlines() {
  const queries = [
    'CPR+2024+wyroby+budowlane',
    'rozporządzenie+budowlane+UE+2024',
    'Construction+Products+Regulation+2024+EU',
    'CPR+2024/3110+implementation',
    'Digital+Product+Passport+construction',
  ];

  const headlines = [];
  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${q}&hl=pl&gl=PL&ceid=PL:pl`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const xml = await res.text();
      // wyciągnij tytuły i opisy z RSS
      const items = [...xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<description><!\[CDATA\[(.*?)\]\]><\/description>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<\/item>/g)];
      for (const [, title, desc, date] of items.slice(0, 3)) {
        headlines.push(`[${date?.trim()}] ${title?.trim()} — ${desc?.trim()?.slice(0, 120)}`);
      }
    } catch { /* ignoruj błędy pojedynczych feedów */ }
  }
  return headlines.slice(0, 15); // max 15 nagłówków
}

// ── Gemini API ────────────────────────────────────────────────────────────────

async function callGemini(prompt) {
  // Modele dostępne dla tego klucza (v1 API)
  const models = [
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.65, maxOutputTokens: 4096 },
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        console.warn(`⚠️  ${model} — quota exceeded, próbuję następny model...`);
        continue;
      }
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API ${res.status}: ${err}`);
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini zwrócił pustą odpowiedź');
      console.log(`✓ Model: ${model}`);
      return text;
    } catch (err) {
      if (err.message.includes('quota exceeded') || err.message.includes('429')) {
        console.warn(`⚠️  ${model} — quota exceeded, próbuję następny...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Wszystkie modele Gemini wyczerpały quota. Sprawdź billing na aistudio.google.com.');
}

// ── Pollinations.ai — darmowe generowanie obrazków AI ────────────────────────

function buildImagePrompt(title) {
  // Tłumacz kluczowe słowa na angielski i dodaj kontekst budowlany
  const map = {
    'wyrob': 'construction product', 'wyroby': 'construction products',
    'budowlan': 'construction', 'certyfikacj': 'certification',
    'oznakowanie': 'CE marking', 'norma': 'technical standard',
    'deklaracja': 'declaration document', 'paszport': 'digital passport',
    'kary': 'regulation compliance', 'kontrola': 'quality control inspection',
    'producent': 'manufacturer factory', 'importer': 'import warehouse',
    'dystrybutor': 'distribution logistics', 'dokumentacja': 'technical documentation',
    'izolacj': 'insulation material', 'okna': 'window frame', 'beton': 'concrete',
    'epd': 'environmental product declaration', 'gwp': 'carbon footprint measurement',
    'cyfrowy': 'digital technology', 'zrownowazony': 'sustainable green building',
  };
  let eng = 'European construction industry building materials regulation';
  for (const [pl, en] of Object.entries(map)) {
    if (title.toLowerCase().includes(pl)) eng = `${en}, ${eng}`;
  }
  return `${eng}, professional photography, modern architecture, no text, no letters, no words, no captions, no watermark, photorealistic, high quality`;
}

async function fetchFromPollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&model=flux&seed=${Math.floor(Math.random()*9999)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchFromCloudflareAI(prompt) {
  if (!CF_ACCOUNT_ID || !CF_AI_TOKEN) throw new Error('Brak CF_ACCOUNT_ID / CF_AI_TOKEN');
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_AI_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, width: 1200, height: 672, num_steps: 4 }),
  });
  if (!res.ok) throw new Error(`Cloudflare AI HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateAndSaveImage(title, slug) {
  const imgDir = join(rootDir, 'public', 'images', 'blog');
  const imgPath = join(imgDir, `${slug}.jpg`);
  if (existsSync(imgPath)) {
    console.log(`🖼️  Obraz już istnieje: ${slug}.jpg`);
    return true;
  }
  const prompt = buildImagePrompt(title);
  mkdirSync(imgDir, { recursive: true });

  // Próbuj Pollinations, potem Cloudflare AI jako fallback
  const providers = [
    { name: 'Pollinations.ai', fn: () => fetchFromPollinations(prompt) },
    { name: 'Cloudflare AI',   fn: () => fetchFromCloudflareAI(prompt) },
  ];
  for (const { name, fn } of providers) {
    try {
      console.log(`🎨 Generuję obraz przez ${name}...`);
      const buf = await fn();
      writeFileSync(imgPath, buf);
      console.log(`✅ Obraz zapisany: public/images/blog/${slug}.jpg (${Math.round(buf.length/1024)}KB)`);
      return true;
    } catch (e) {
      console.log(`⚠️  ${name}: ${e.message}`);
    }
  }
  console.log(`❌ Nie udało się wygenerować obrazu`);
  return false;
}

// ── main ──────────────────────────────────────────────────────────────────────

const today   = new Date();
const dateStr = today.toISOString().slice(0, 10);

const existingTitles = getExistingTitles();

console.log('📰 Pobieram aktualności z Google News RSS...');
const headlines = await fetchNewsHeadlines();
console.log(`   Znalazłem ${headlines.length} nagłówków`);

const newsContext = headlines.length > 0
  ? `═══ AKTUALNE WIADOMOŚCI Z GOOGLE NEWS (ostatnie tygodnie) ═══\n${headlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
  : '(brak aktualnych nagłówków — napisz artykuł oparty na wiedzy o CPR 2024/3110)';

const prompt = `
Jesteś redaktorem portalu NowyCPR.pl prowadzonego przez Multicert Sp. z o.o. —
akredytowaną jednostkę certyfikującą wyroby budowlane (NIE doradczą).

═══ BEZWZGLĘDNE ZASADY JĘZYKA ═══
NIGDY nie używaj słów: "doradztwo", "doradcze", "wdrożenie", "konsulting", "konsultacje".
Zamiast tego używaj: "certyfikacja", "ocena zgodności", "przegląd dokumentacji", "wsparcie techniczne".

═══ POPRAWNA MAPA ARTYKUŁÓW CPR 2024/3110 ═══
• Art. 9  → instrukcje dla użytkowników profesjonalnych
• Art. 18-19 → Deklaracja Właściwości Użytkowych i Zgodności (DoP&C)
• Art. 20 → plik techniczny (Technical File)
• Art. 20 ust. 5 → uproszczone ZKP dla mikroprzedsiębiorstw
• Art. 22 → mandat upoważnionego przedstawiciela
• Art. 25 → Cyfrowy Paszport Produktu (DPP)
• Systemy AVCP: 1+, 1, 2+, 3, 3+, 4  (3+ = zrównoważoność środowiskowa — NOWOŚĆ)

═══ ISTNIEJĄCE ARTYKUŁY (nie powtarzaj) ═══
${existingTitles.map(t => `• ${t}`).join('\n')}

${newsContext}

═══ ZADANIE ═══
1. Na podstawie powyższych aktualności wybierz JEDEN konkretny temat, który:
   - Jest nowy (nie pokrywa się z istniejącymi artykułami powyżej)
   - Dotyczy CPR 2024/3110, wyrobów budowlanych, norm EN, DPP, AVCP lub jednostek notyfikowanych
   - Może pochodzić z Komisji Europejskiej, EUR-Lex, LinkedIn, EOTA, CEN lub mediów branżowych

2. Jeśli nie ma nic nowego w nagłówkach — wybierz ważny temat CPR 2024/3110 jeszcze nieomówiony.

3. Wybierz JEDEN konkretny, aktualny temat (nie ma w istniejących artykułach powyżej).

3. Napisz profesjonalny artykuł po POLSKU (minimum 700 słów) w formacie:

---
title: "TYTUŁ ARTYKUŁU"
date: "${dateStr}"
author: "Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "KATEGORIA"
tags: ["tag1", "tag2", "tag3"]
excerpt: "Krótki opis artykułu (1-2 zdania)."
image_url: /images/blog/SLUG.jpg
template: "techniczny"
---

# TYTUŁ ARTYKUŁU

[TREŚĆ W MARKDOWN — min. 700 słów, nagłówki H2/H3]

Jeśli temat pochodzi z anglojęzycznego źródła (LinkedIn, KE, EUR-Lex) —
napisz artykuł po polsku, ale dodaj sekcję "Źródła" na końcu z linkami.

═══ WAŻNE ═══
Odpowiedz WYŁĄCZNIE samym artykułem zaczynającym się od ---. Żadnych wstępów ani komentarzy.
`.trim();

console.log('🔍 Szukam nowego tematu CPR 2024/3110...');

let raw;
try {
  raw = await callGemini(prompt);
} catch (err) {
  console.error('❌ Błąd Gemini API:', err.message);
  process.exit(1);
}

// Wyciągnij blok zaczynający się od ---
const startIdx = raw.indexOf('---');
if (startIdx === -1) {
  console.error('❌ Gemini nie zwrócił artykułu w formacie frontmatter');
  console.error('Odpowiedź:', raw.slice(0, 300));
  process.exit(1);
}
const articleContent = raw.slice(startIdx).trim();

// Parsuj frontmatter żeby wyciągnąć tytuł i slug
const fmMatch = articleContent.match(/^---\s*\n([\s\S]*?)\n---/);
if (!fmMatch) {
  console.error('❌ Błąd parsowania frontmatter');
  process.exit(1);
}

const meta    = parseFrontmatter(articleContent);
const title   = meta.title || 'artykul-cpr';
const slug    = slugify(title);
const imgSlug = meta.image_url?.split('/').pop()?.replace('.jpg', '') || slug;

// Unikaj duplikatów
const filename = `${dateStr}-${slug}.md`;
const filepath = join(blogDir, filename);

if (existsSync(filepath)) {
  console.log(`⚠️  Plik ${filename} już istnieje — pomijam`);
  process.exit(0);
}

// ── Recenzja faktów CPR przez Gemini ──────────────────────────────────────────

console.log('\n🔍 Recenzja faktów CPR...');

const reviewPrompt = `
Jesteś ekspertem od prawa budowlanego UE i rozporządzenia CPR (EU) 2024/3110.
Przejrzyj poniższy artykuł i zweryfikuj KAŻDE twierdzenie faktograficzne.

═══ KLUCZOWE ZASADY WERYFIKACJI ═══

1. CPR 2024/3110 stosuje się od 8 stycznia 2026 — to prawda.
2. Większość NOWYCH wymogów (GWP, DPP, EPD, AVS 3+) wymaga jeszcze:
   a) Nowych norm zharmonizowanych (hTS) opublikowanych w Dz.U. UE
   b) Zakończenia okresu koegzystencji (12–36 mies. po publikacji hTS)
   c) DPP wymaga DODATKOWO aktów wykonawczych KE
3. Na dzień ${dateStr} ŻADNA nowa hTS pod CPR 2024/3110 NIE została opublikowana.
4. Co JUŻ obowiązuje od 8.01.2026: DoP&C online (PDF), UPC, terminologia AVS/AVCP.
5. Co NIE obowiązuje jeszcze: GWP/carbon footprint, DPP, EPD, pełny XML, QR kody.

═══ CZĘSTE BŁĘDY DO WYŁAPANIA ═══
- "GWP obowiązkowe od 2026/2027" → BŁĄD (brak hTS)
- "DPP obowiązkowy od X" → BŁĄD (brak hTS + brak aktów wykonawczych)
- "Producenci muszą wdrożyć DPP do..." → BŁĄD (obowiązek warunkowy)
- "EN 15804+A3 opublikowana" → BŁĄD (w trakcie prac CEN)
- Mylenie UPC (obowiązkowy) z DPP (oczekuje na hTS)
- "po publikacji hTS" bez wzmianki o okresie koegzystencji → NIEKOMPLETNE

═══ ARTYKUŁ DO RECENZJI ═══
${articleContent}

═══ FORMAT ODPOWIEDZI ═══
Odpowiedz WYŁĄCZNIE w formacie:

OCENA: [OK / WYMAGA_POPRAWEK / ODRZUCONY]

PROBLEMY:
- [numer] "[cytat z artykułu]" → [co jest nie tak] → SUGEROWANA POPRAWKA: [poprawka]

PODSUMOWANIE: [1-2 zdania o ogólnej jakości]
`.trim();

let reviewResult = '';
try {
  reviewResult = await callGemini(reviewPrompt);
  console.log('\n📋 Wynik recenzji:');
  console.log(reviewResult);
} catch (err) {
  console.warn('⚠️  Recenzja nie powiodła się:', err.message);
  reviewResult = '⚠️ Recenzja automatyczna niedostępna (błąd API). Wymagana ręczna weryfikacja.';
}

// Zapisz wynik recenzji do pliku (workflow użyje go w opisie PR)
const reviewPath = join(rootDir, '.review-result.md');
writeFileSync(reviewPath, `# Recenzja: ${title}\n\n${reviewResult}\n`, 'utf-8');

// ── Generuj obrazek i zapisz artykuł ─────────────────────────────────────────

const reviewDecision = reviewResult.match(/^OCENA:\s*([A-Z_]+)/m)?.[1] || 'BRAK_OCENY';
const publishReady = reviewDecision === 'OK';

if (!publishReady) {
  mkdirSync(draftDir, { recursive: true });
}

const outputDir = publishReady ? blogDir : draftDir;
const outputPath = join(outputDir, filename);
const outputLabel = publishReady ? `content/blog/${filename}` : `content/drafts/${filename}`;

if (existsSync(outputPath)) {
  console.log(`⚠️  Plik ${outputLabel} już istnieje — pomijam`);
  process.exit(0);
}

if (publishReady) {
  await generateAndSaveImage(title, imgSlug);
} else {
  console.log(`⚠️  Recenzja faktów: ${reviewDecision}. Zapisuję jako szkic, bez publikacji na blogu.`);
}

writeFileSync(outputPath, articleContent, 'utf-8');

console.log(`\n✅ Nowa treść: ${outputLabel}`);
console.log(`📰 Tytuł: ${title}`);
console.log(`📅 Data: ${dateStr}`);
console.log(publishReady
  ? `\n👉 Artykuł trafi do Pull Request do ręcznej akceptacji.`
  : `\n👉 Szkic trafi do Pull Request, ale nie opublikuje się na portalu bez ręcznego przeniesienia do content/blog/.`);
