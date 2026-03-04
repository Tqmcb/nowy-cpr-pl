/**
 * auto-blog.mjs — Automatyczny generator artykułów CPR 2024
 *
 * Uruchamiany co tydzień przez GitHub Actions (.github/workflows/auto-blog.yml).
 * Używa Gemini 2.0 Flash z Google Search grounding, żeby znaleźć nowy temat
 * z zakresu CPR 2024/3110 i wygenerować artykuł .md do content/blog/.
 *
 * Wymagane env: GEMINI_API_KEY, PEXELS_API_KEY (opcjonalny)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir   = join(__dirname, '..');
const blogDir   = join(rootDir, 'content', 'blog');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

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
  // Próbuj kolejno modele — gemini-1.5-flash ma darmowy tier (1500 req/dzień)
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash'];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
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

// ── Pexels API ────────────────────────────────────────────────────────────────

async function getPexelsImageUrl(query) {
  if (!PEXELS_API_KEY) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || null;
  } catch {
    return null;
  }
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

// Opcjonalnie: pobierz URL zdjęcia z Pexels (tylko logujemy — obraz nie jest embedowany)
if (PEXELS_API_KEY) {
  const imgUrl = await getPexelsImageUrl(`construction building certification ${imgSlug}`);
  if (imgUrl) console.log(`🖼️  Pexels foto: ${imgUrl}`);
}

writeFileSync(filepath, articleContent, 'utf-8');

console.log(`\n✅ Nowy artykuł: content/blog/${filename}`);
console.log(`📰 Tytuł: ${title}`);
console.log(`📅 Data: ${dateStr}`);
console.log(`\n👉 Artykuł pojawi się na stronie po buildzie (deployment w toku).`);
