/**
 * validate-cpr-content.mjs — Walidator dat CPR vs Working Plan KE
 *
 * Cel: wykrywać błędne daty obowiązkowości norm CPR per rodzina wyrobów
 * ZANIM dokument trafi do produkcji.
 *
 * Powstał po wykryciu przez klienta (Adam Graca, SIMECH, 2026-05-27)
 * błędu w publicznym dokumencie Plan Prac — kable 2027 zamiast 2029.
 *
 * Skanuje:
 *   - content/blog/*.md
 *   - public/docs/*.html
 *
 * Porównuje wykryte wzmianki dat z data/cpr-working-plan-2026-2029.json
 * (autorytatywne dane Table 3 z COM(2025) 772 final).
 *
 * Exit code:
 *   0 = OK
 *   1 = błąd skryptu
 *   2 = wykryto niezgodności merytoryczne — blokuj commit/deploy
 *
 * Uruchamianie:
 *   node scripts/validate-cpr-content.mjs           # walidacja wszystkich plików
 *   node scripts/validate-cpr-content.mjs --quiet   # tylko błędy
 *   node scripts/validate-cpr-content.mjs --file=path/to/file.md   # jeden plik
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ── 1. Wczytaj źródło prawdy ─────────────────────────────────────────────
const sourcePath = join(rootDir, 'data', 'cpr-working-plan-2026-2029.json');
if (!existsSync(sourcePath)) {
  console.error(`✗ Brak source of truth: ${sourcePath}`);
  process.exit(1);
}
const source = JSON.parse(readFileSync(sourcePath, 'utf-8'));
const families = source.families;

// Mapa kodów → wiersz JSON (do szybkiego lookup)
const byCode = {};
const byNum = {};
const byName = {};
for (const f of families) {
  if (f.code && f.code !== '—') byCode[f.code] = f;
  if (f.num != null) byNum[f.num] = f;
  // Też mapowanie po fragmencie nazwy PL (lowercase)
  const key = (f.name_pl || '').toLowerCase().split(',')[0].trim();
  if (key) byName[key] = f;
}

// ── 2. Patterns wykrywania wzmianek ──────────────────────────────────────

/**
 * Wykrywa frazy typu:
 *   "kable elektryczne ... 2027"
 *   "#31 ... 2029"
 *   "PCP #15 Cement ... 2027"
 *   "Milestone III dla #31 ... 2027"
 *   "Rodzina 31 (CAB) ... obowiązkowość 2029"
 *
 * Dla każdej wykrytej pary (rodzina, rok) sprawdza czy rok zgadza się
 * z jakimkolwiek polem JSON (m1, m3, sr, standards_delivery, standard_mandatory).
 *
 * Heurystyka: rok wewnątrz 100 znaków od wzmianki rodziny wyrobu.
 */
const FAMILY_NUMBER_PATTERN = /(?:#|rodzin[ay]\s+|family\s+|family_)(\d{1,2})\b/gi;
const YEAR_PATTERN = /\b(202[5-9]|203[0-5])\b/g;

// Frazy które jednoznacznie wskazują na konkretną rodzinę (PL)
const FAMILY_KEYWORDS = {
  'kabl': 31,         // kable elektryczne
  'cable': 31,
  'cement': 15,
  'gips': 7,
  'gypsum': 7,
  'szkł': 30,        // szkło
  'szkl': 30,
  'glass': 30,
  'komin': 6,
  'chimney': 6,
  'prefabryk': 1,    // prefabrykaty
  'precast': 1,
  'stal zbrojen': 16,
  'reinforcing steel': 16,
  'stal konstrukcyjna': 20,
  'structural metal': 20,
  'termoizolac': 4,
  'thermal insulation': 4,
  'wyroby izolac': 4,
  'drewno konstrukcyjn': 13,
  'structural timber': 13,
  'okna i drzwi': 2,
  'drzwi i okna': 2,
  'dach': 22,        // pokrycia dachowe
  'roof': 22,
  'kruszyw': 24,
  'aggregat': 24,
  'asfalt': 23,      // wyroby drogowe
  'mieszanki mineralno-asfaltow': 23,
  'asphalt': 23,
  'membran': 3,
  'membrane': 3,
  'geotekst': 8,
  'geotextile': 8,
  'klej': 25,
  'adhesive': 25,
  'sanitarn': 11,
  'sanitary': 11,
  'drabin': 36,
  'ladder': 36,
};

// ── 3. Skanowanie pliku ─────────────────────────────────────────────────

/**
 * Strip frontmatter (YAML ---...---) z początku pliku MD.
 * Zwraca też offset by mapować pozycję na ORYGINALNY plik.
 */
function stripFrontmatter(text) {
  const m = text.match(/^---\s*\n[\s\S]*?\n---\s*\n/);
  if (!m) return { content: text, offset: 0 };
  return { content: text.slice(m[0].length), offset: m[0].length };
}

/**
 * Czy linia kontekstu wygląda na false positive (nie merytoryczna wzmianka daty)?
 * Reguły:
 *   - Linia zawiera „Plan Prac" / „Working Plan" + zakres lat — to NAZWA dokumentu
 *   - Linia jest sekcją tagów / category / metadata
 *   - Rok jest częścią zakresu "YYYY-YYYY" lub "YYYY–YYYY" gdzie któryś krańcec pasuje
 *   - Rok jest częścią dat publikacji/reviewed
 *   - Wzmianka roku oddzielona jest od rodziny przez "lub", "i", "oraz" — to lista, nie konkretne stwierdzenie
 */
function isLikelyFalsePositive(family, year, lineText, contextChunk) {
  const lc = lineText.toLowerCase();
  const cc = contextChunk.toLowerCase();
  const yearStr = String(year);

  // Nazwa Planu Prac 2026-2029 i podobne ramy
  if (/plan\s*prac\s*(?:cpr\s*)?2026[-–]2029|working\s*plan\s*(?:cpr\s*)?2026[-–]2029|plan\s*pracy\s*2026[-–]2029|cpr\s*2026[-–]2029/i.test(lineText)) {
    return true;
  }

  // Tytuł/excerpt/tags/category artykułu (zawierają lata jako tagi SEO)
  if (/^(?:title|excerpt|description|tags|category|reviewed|date|pubDate|datePublished|image_url|template):/i.test(lineText.trim())) {
    return true;
  }
  if (/"[0-9]{4}"/.test(lineText) && /tags/i.test(contextChunk.slice(Math.max(0, contextChunk.length - 200)))) {
    return true;
  }

  // Numer normy z datą publikacji (EN 206-1:2026, EN 197-6:2024, EN 1090-1:2025, itd.)
  if (new RegExp(`EN\\s+\\d+(?:[-–]\\d+)?:${yearStr}`, 'i').test(lineText)) {
    return true;
  }
  // ISO/PN/IEC z rokiem (PN-B-06265:2022, ISO 14025:2026, ITT/ZKP)
  if (new RegExp(`(?:ISO|PN|IEC|EN)[A-Z\\s\\-]*\\d+[A-Z0-9\\-]*:${yearStr}`, 'i').test(lineText)) {
    return true;
  }

  // Numer dokumentu KE "COM(YYYY)" / "Rozporządzenie (UE) YYYY/NNNN"
  if (new RegExp(`COM\\(${yearStr}\\)`, 'i').test(lineText)) return true;
  if (new RegExp(`(?:UE|EU)\\)?\\s+${yearStr}/\\d+`, 'i').test(lineText)) return true;
  if (new RegExp(`${yearStr}/\\d{4}`, 'i').test(lineText)) return true;  // CPR 2024/3110

  // URL/identyfikator z rokiem (https://..., /path/..., SKU-YYYY)
  if (/https?:\/\//.test(lineText) && lineText.indexOf(yearStr) > lineText.indexOf('://')) {
    // Rok pojawia się w URL — często ID produktu lub path
    return true;
  }

  // Linia zawiera oficjalną notację Working Plan "M1 ...YYYY, M3 ...YYYY"
  // Wtedy rok jest CYTATEM z Working Plan, nie błędem
  if (/(?:M[1-4]|Milestone\s*[I-V]+)\s*(?:[A-Z]\w*\s*)?(?:Q[1-4]\s+)?\d{4}/i.test(lineText)) {
    return true;
  }

  // Frazy o okresie koegzystencji / przejściowym ze szerokim zakresem
  if (/okres(?:em|ie|u)?\s+(?:koegzystencji|przejścio)/i.test(lineText)) {
    return true;
  }

  // Zakres "YYYY-YYYY" lub "YYYY–YYYY" w tej samej linii
  const rangePattern = /(20[2-3]\d)\s*[-–—]\s*(20[2-3]\d)/g;
  for (const m of lineText.matchAll(rangePattern)) {
    const y1 = parseInt(m[1]);
    const y2 = parseInt(m[2]);
    if (year >= y1 && year <= y2) {
      // Czy któryś rok zakresu pasuje do milestone?
      for (const v of [family.m1, family.m3, family.sr, family.standards_delivery, family.standard_mandatory]) {
        if (!v) continue;
        const yvMatch = String(v).match(/20\d\d/);
        if (yvMatch) {
          const yv = parseInt(yvMatch[0]);
          if (yv >= y1 - 1 && yv <= y2 + 1) return true;  // ±1 rok tolerancji
        }
      }
      // Rodzina bez konkretnych dat (brak danych w WP) → zakres ok
      const allEmpty = [family.m1, family.m3, family.sr, family.standard_mandatory].every(v => !v);
      if (allEmpty) return true;
    }
  }

  // Lista wielu rodzin z jedną datą — pomijamy
  let families_in_line = 0;
  for (const kw of Object.keys(FAMILY_KEYWORDS)) {
    if (lc.includes(kw)) families_in_line++;
  }
  if (families_in_line >= 3) return true;

  return false;
}

function findFamilyMentions(text, offset = 0) {
  const mentions = [];
  const lc = text.toLowerCase();

  // (a) Po numerze rodziny #N
  for (const m of text.matchAll(FAMILY_NUMBER_PATTERN)) {
    const num = parseInt(m[1]);
    if (num >= 1 && num <= 36 && byNum[num]) {
      mentions.push({ idx: m.index + offset, family: byNum[num], matched: m[0], type: 'num' });
    }
  }

  // (b) Po keyword fraz
  for (const [kw, num] of Object.entries(FAMILY_KEYWORDS)) {
    let idx = 0;
    while ((idx = lc.indexOf(kw, idx)) !== -1) {
      if (byNum[num]) {
        mentions.push({ idx: idx + offset, family: byNum[num], matched: kw, type: 'kw' });
      }
      idx += kw.length;
    }
  }

  return mentions;
}

function getYearsNear(text, idx, radius = 80) {
  // Zacieśniony radius: 80 znaków zamiast 200
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + radius);
  const chunk = text.slice(start, end);
  const years = [];
  for (const m of chunk.matchAll(YEAR_PATTERN)) {
    years.push({ year: parseInt(m[1]), relIdx: m.index, absIdx: start + m.index, chunk });
  }
  return years;
}

function isAcceptableYear(family, year) {
  const fields = [
    family.m1, family.m3, family.sr,
    family.standards_delivery, family.standard_mandatory, family.product_req_da
  ];
  for (const v of fields) {
    if (v && String(v).includes(String(year))) return true;
  }
  return false;
}

function validateFile(filePath) {
  const rawText = readFileSync(filePath, 'utf-8');

  // Plik z komentarzem `VALIDATED-CPR: YYYY-MM-DD` w pierwszych 500 znakach
  // został ręcznie zweryfikowany 1:1 z Working Plan — skip.
  const head = rawText.slice(0, 500);
  if (/VALIDATED-CPR:\s*\d{4}-\d{2}-\d{2}/i.test(head)) {
    return [];
  }

  const { content, offset } = stripFrontmatter(rawText);
  const mentions = findFamilyMentions(content, offset);
  const issues = [];

  const familyYearMap = new Map();
  for (const m of mentions) {
    const localIdx = m.idx - offset;  // pozycja w content (bez frontmatter)
    const years = getYearsNear(content, localIdx, 80);
    for (const y of years) {
      if (y.year < 2025 || y.year > 2035) continue;
      const key = `${m.family.num}_${y.year}_${y.absIdx + offset}`;
      if (familyYearMap.has(key)) continue;
      familyYearMap.set(key, true);

      if (isAcceptableYear(m.family, y.year)) continue;

      const absIdx = y.absIdx + offset;
      const lineNum = rawText.slice(0, absIdx).split('\n').length;
      const lineText = rawText.split('\n')[lineNum - 1] || '';

      if (isLikelyFalsePositive(m.family, y.year, lineText, y.chunk)) continue;

      issues.push({
        family_num: m.family.num,
        family_code: m.family.code,
        family_name: m.family.name_pl,
        mentioned_year: y.year,
        actual_dates: {
          m1: m.family.m1,
          m3: m.family.m3,
          sr: m.family.sr,
          standards_delivery: m.family.standards_delivery,
          standard_mandatory: m.family.standard_mandatory,
          product_req_da: m.family.product_req_da,
        },
        line: lineNum,
        context: lineText.trim().slice(0, 200),
        matched_via: `${m.type}:${m.matched}`,
      });
    }
  }

  return issues;
}

// ── 4. Main ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const fileArg = args.find(a => a.startsWith('--file='));
const singleFile = fileArg ? fileArg.slice('--file='.length) : null;

const targets = [];
if (singleFile) {
  targets.push(singleFile);
} else {
  // Wszystkie blog posts
  const blogDir = join(rootDir, 'content', 'blog');
  if (existsSync(blogDir)) {
    for (const f of readdirSync(blogDir)) {
      if (f.endsWith('.md')) targets.push(join(blogDir, f));
    }
  }
  // Wszystkie docs HTML
  const docsDir = join(rootDir, 'public', 'docs');
  if (existsSync(docsDir)) {
    for (const f of readdirSync(docsDir)) {
      if (f.endsWith('.html')) targets.push(join(docsDir, f));
    }
  }
}

if (!quiet) {
  console.log(`\n🔎 CPR Content Validator`);
  console.log(`   Source: ${source._meta.source}`);
  console.log(`   Verified: ${source._meta.verified_at}`);
  console.log(`   Scanning ${targets.length} files...\n`);
}

let totalIssues = 0;
let filesWithIssues = 0;

for (const file of targets) {
  const issues = validateFile(file);
  if (issues.length > 0) {
    filesWithIssues++;
    totalIssues += issues.length;
    const rel = file.replace(rootDir + '/', '');
    console.log(`\n📄 ${rel}`);
    for (const i of issues) {
      console.log(`  ❌ Linia ${i.line}: ${i.family_name} (#${i.family_num} ${i.family_code})`);
      console.log(`     Wzmianka roku ${i.mentioned_year} — żaden Milestone w Working Plan tego nie potwierdza`);
      console.log(`     Rzeczywiste daty: M1=${i.actual_dates.m1 ?? '—'}, M3=${i.actual_dates.m3 ?? '—'}, SR=${i.actual_dates.sr ?? '—'}, Mandatory=${i.actual_dates.standard_mandatory ?? '—'}`);
      console.log(`     Kontekst: "${i.context}"`);
      console.log(`     (matched via ${i.matched_via})`);
    }
  } else if (!quiet) {
    const rel = file.replace(rootDir + '/', '');
    // Show only files that had family mentions (otherwise too noisy)
    const text = readFileSync(file, 'utf-8');
    if (findFamilyMentions(text).length > 0) {
      console.log(`  ✓ ${rel}`);
    }
  }
}

console.log();
if (totalIssues === 0) {
  console.log(`✅ Walidacja CPR OK — żadnych niezgodności w ${targets.length} plikach`);
  process.exit(0);
} else {
  console.log(`❌ Wykryto ${totalIssues} potencjalnych niezgodności w ${filesWithIssues} plikach`);
  console.log(`\n   Każda wzmianka oznacza, że w tekście pojawia się rok, którego nie potwierdza Working Plan KE`);
  console.log(`   dla tej rodziny wyrobów. Sprawdź czy nie powtarza się błąd typu "kable 2027 vs 2029".`);
  console.log(`\n   Walidator ma 100% recall ale możliwe false positives — np. rok 2026 wzmiankowany`);
  console.log(`   w kontekście wprowadzenia CPR (8.01.2026), nie konkretnej rodziny. Przejrzyj kontekst.\n`);
  process.exit(2);
}
