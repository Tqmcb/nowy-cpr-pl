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

// ── Gemini API ────────────────────────────────────────────────────────────────

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 4096,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API ${res.status}: ${err}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini zwrócił pustą odpowiedź');
  return text;
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

═══ ZADANIE ═══
1. Użyj wyszukiwania Google, żeby znaleźć NOWY temat z ostatnich 4 tygodni związany z:
   - CPR 2024/3110 (Rozporządzenie o wyrobach budowlanych)
   - normami zharmonizowanymi EN dla wyrobów budowlanych
   - Cyfrowym Paszportem Produktu (DPP) w budownictwie
   - systemem AVCP lub jednostkami notyfikowanymi
   - rynkiem budowlanym UE i wymaganiami certyfikacyjnymi

2. Napisz profesjonalny artykuł po POLSKU (minimum 700 słów) w formacie:

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

[TREŚĆ W MARKDOWN — min. 700 słów, nagłówki H2/H3, praktyczne informacje]

═══ WAŻNE ═══
Odpowiedz WYŁĄCZNIE samym artykułem zaczynającym się od ---. Żadnych wstępów, komentarzy ani wyjaśnień przed ani po.
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
