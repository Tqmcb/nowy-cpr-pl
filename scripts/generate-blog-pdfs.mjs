/**
 * generate-blog-pdfs.mjs — Post-build PDF generator dla wszystkich postów
 *
 * Dla każdego content/blog/*.md generuje dist/blog/<slug>/article.pdf
 * w premium formacie "editorial reprint" brandu Multicert / NowyCPR.pl:
 * masthead z logo + brand red hairline, Wittgenstein (display) + Schibsted
 * Grotesk (body), navy + czerwone akcenty, numerowane sekcje, navy nagłówki
 * tabel, czerwone boxy cytatów z norm, sekcja Źródła, stopka z paginacją.
 *
 * Flow: MD → marked → branded HTML template → Chromium headless → Skia/PDF
 *
 * Uruchamiany automatycznie z "postbuild" w package.json po prerender.mjs.
 */

import { chromium } from 'playwright';
import { marked } from 'marked';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const blogContentDir = join(rootDir, 'content', 'blog');
const sigilDir = join(rootDir, 'public', 'images', 'authors');

// Mapowanie nazwy autora (pierwszy segment bylines) → slug sygnetu
const AUTHOR_SLUGS = {
  'Robert Dynarowski': 'robert-dynarowski',
  'Mikołaj Junosza-Szaniawski': 'mikolaj-junosza-szaniawski',
  'Sławomir Słowik': 'slawomir-slowik',
  'Violetta Gładysz-Oczalska': 'violetta-gladysz-oczalska',
  'Izabela Sztamberek-Sochan': 'izabela-sztamberek-sochan',
  'Tomasz Barto': 'tomasz-barto',
  'Grzegorz Suwara': 'grzegorz-suwara',
};

// Zwraca avatar autora: zdjęcie (jpg jako data URI) lub sygnet SVG, lub '' gdy brak
function authorSigilSvg(authorField) {
  const first = (authorField || '').split('|')[0].trim();
  let slug = null;
  for (const [name, s] of Object.entries(AUTHOR_SLUGS)) {
    if (first.includes(name)) { slug = s; break; }
  }
  if (!slug) return '';
  const jpg = join(sigilDir, `${slug}.jpg`);
  if (existsSync(jpg)) {
    const b64 = readFileSync(jpg).toString('base64');
    return `<img src="data:image/jpeg;base64,${b64}" alt="">`;
  }
  const svg = join(sigilDir, `${slug}.svg`);
  return existsSync(svg) ? readFileSync(svg, 'utf-8') : '';
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Parser frontmatter: skalary (key: value) + lista pipe-style pod "sources:"
function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  const sources = [];
  let inSources = false;
  for (const line of m[1].split('\n')) {
    if (/^sources:\s*$/.test(line)) { inSources = true; continue; }
    if (inSources) {
      const item = line.match(/^\s*-\s*(.+)$/);
      if (item) {
        const raw = item[1].trim().replace(/^["']|["']$/g, '');
        const pipe = raw.lastIndexOf('|');
        if (pipe > -1) sources.push({ label: raw.slice(0, pipe).trim(), url: raw.slice(pipe + 1).trim() });
        else sources.push({ label: raw, url: '' });
        continue;
      }
      if (/^\S/.test(line)) inSources = false; // koniec listy — nowy klucz
    }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  meta.sources = sources;
  return { meta, body: m[2] };
}

// "2026-05-22" → "22.05.2026"; inne formaty zwraca bez zmian
function formatDate(d) {
  const m = (d || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : (d || '');
}

function buildHtml({ title, author, category, date, sources, htmlBody, sigilSvg }) {
  const byline = (author || '').replace(/\s*\|\s*/g, '  ·  ');
  const dateFmt = formatDate(date);
  const metaBits = [byline, dateFmt].filter(Boolean).join('  ·  ');

  const sourcesHtml = (sources && sources.length)
    ? `<section class="sources">
         <h2 class="no-count">Źródła</h2>
         <ol>
           ${sources.map(s => `<li>${s.url
             ? `${escapeHtml(s.label)} — <a href="${escapeHtml(s.url)}">${escapeHtml(s.url)}</a>`
             : escapeHtml(s.label)}</li>`).join('\n           ')}
         </ol>
       </section>`
    : '';

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Wittgenstein:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #1E293B;
    --navy-deep: #0F172A;
    --red: #DC2626;
    --red-tint: #FEF2F2;
    --text: #1F2933;
    --muted: #64748B;
    --border: #E5E7EB;
    --border-mid: #CBD5E1;
    --bg-soft: #F8FAFC;
    --font-display: 'Wittgenstein', Georgia, 'Times New Roman', serif;
    --font-body: 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  }

  @page { size: A4; }

  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  html, body {
    font-family: var(--font-body);
    color: var(--text);
    background: white;
    font-size: 10.5pt;
    line-height: 1.58;
    -webkit-font-smoothing: antialiased;
    margin: 0; padding: 0;
  }

  article { counter-reset: h2; }

  /* ── Masthead ─────────────────────────────────────────── */
  .masthead { margin: 0 0 18pt; }
  .mast-top {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 7pt;
  }
  .brand {
    font-family: var(--font-display);
    font-size: 15pt; font-weight: 700; color: var(--navy);
    letter-spacing: -0.2pt; display: flex; align-items: center; gap: 6pt;
  }
  .brand-mark {
    width: 9pt; height: 9pt; background: var(--red);
    border-radius: 1.5pt; display: inline-block;
  }
  .brand .tld { color: var(--red); }
  .brand-right {
    font-size: 8.5pt; color: var(--muted); font-weight: 500;
    text-align: right; letter-spacing: 0.2pt;
  }
  .mast-rule { height: 2.2pt; background: var(--red); border-radius: 1pt; }

  .eyebrow {
    font-size: 8.5pt; font-weight: 700; color: var(--red);
    text-transform: uppercase; letter-spacing: 2.4pt;
    margin: 13pt 0 8pt;
  }
  h1 {
    font-family: var(--font-display);
    font-size: 27pt; font-weight: 700; line-height: 1.14;
    margin: 0 0 11pt; color: var(--navy-deep); letter-spacing: -0.3pt;
  }
  h1 em { font-style: italic; font-weight: 600; }
  .byline {
    font-size: 9pt; color: var(--muted); font-weight: 500;
    padding-bottom: 13pt; border-bottom: 0.75pt solid var(--border-mid);
    letter-spacing: 0.1pt;
    display: flex; align-items: center; gap: 8pt;
  }
  .byline-sigil { flex-shrink: 0; line-height: 0; }
  .byline-sigil svg, .byline-sigil img { width: 30pt; height: 30pt; display: block; border-radius: 50%; object-fit: cover; }

  /* ── Treść ────────────────────────────────────────────── */
  .content { margin-top: 16pt; }

  /* Lead — pierwszy akapit wyróżniony */
  .content > p:first-of-type {
    font-size: 12.5pt; line-height: 1.5; color: var(--navy);
    font-weight: 500; margin-bottom: 13pt;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 16pt; font-weight: 700; line-height: 1.22;
    margin: 24pt 0 9pt; color: var(--navy-deep);
    padding-top: 11pt; border-top: 1px solid var(--border);
    page-break-after: avoid;
  }
  h2::before {
    counter-increment: h2;
    content: counter(h2, decimal-leading-zero);
    color: var(--red); font-weight: 700; font-size: 12pt;
    margin-right: 9pt; vertical-align: 2pt;
    font-family: var(--font-body);
  }
  h2.no-count::before { content: none; }

  h3 {
    font-family: var(--font-display);
    font-size: 12.5pt; font-weight: 600; margin: 16pt 0 6pt;
    color: var(--navy); page-break-after: avoid;
  }

  p { margin: 0 0 10pt; widows: 2; orphans: 2; }
  strong { font-weight: 700; color: var(--navy-deep); }
  em { font-style: italic; }
  a { color: var(--navy); text-decoration: underline; text-decoration-color: var(--border-mid); }

  ul, ol { margin: 0 0 12pt; padding-left: 20pt; }
  li { margin-bottom: 4pt; widows: 2; orphans: 2; }
  ul li::marker { color: var(--red); }
  ol li::marker { color: var(--red); font-weight: 700; }
  ul, ol { page-break-inside: avoid; }

  /* Cytaty z norm — czerwony akcent + tint */
  blockquote {
    border-left: 3pt solid var(--red);
    background: var(--red-tint);
    margin: 13pt 0; padding: 9pt 14pt;
    color: var(--navy); font-style: italic;
    border-radius: 0 3pt 3pt 0;
    page-break-inside: avoid;
  }
  blockquote p:last-child { margin-bottom: 0; }

  /* Tabele — navy header, zebra */
  table {
    width: 100%; border-collapse: collapse; margin: 14pt 0;
    font-size: 9.5pt; page-break-inside: auto;
    border: 1px solid var(--border-mid);
  }
  thead { display: table-header-group; }
  th {
    background: var(--navy); color: #fff; font-weight: 600;
    text-align: left; padding: 8pt 10pt;
    border-right: 1px solid #33415A;
    font-family: var(--font-body);
  }
  th:last-child { border-right: none; }
  td { padding: 7pt 10pt; border: 1px solid var(--border); vertical-align: top; }
  tr { page-break-inside: avoid; }
  tbody tr:nth-child(even) td { background: var(--bg-soft); }
  td strong { color: var(--red); }

  code {
    font-family: 'SF Mono', Consolas, Monaco, monospace;
    background: var(--bg-soft); padding: 1pt 4pt;
    border-radius: 3pt; font-size: 9pt; color: var(--navy);
  }
  hr { border: none; border-top: 1px solid var(--border); margin: 18pt 0; }

  /* Źródła */
  .sources { margin-top: 26pt; }
  .sources ol { font-size: 9pt; color: var(--muted); padding-left: 18pt; }
  .sources a { color: var(--muted); word-break: break-all; }

  /* CTA — ostatni akapit po <hr> jako wyróżniony box */
  .content > hr:last-of-type + p {
    background: var(--navy); color: #E2E8F0;
    padding: 13pt 16pt; border-radius: 4pt; font-style: normal;
    font-size: 10pt; margin-top: 4pt;
    border-left: 3pt solid var(--red);
    page-break-inside: avoid;
  }
  .content > hr:last-of-type + p em { color: #fff; font-style: normal; }
  .content > hr:last-of-type + p a { color: #fff; }
</style>
</head>
<body>
<article>
  <header class="masthead">
    <div class="mast-top">
      <div class="brand"><span class="brand-mark"></span><span>NowyCPR<span class="tld">.pl</span></span></div>
      <div class="brand-right">Multicert Sp. z o.o.<br>Portal wiedzy o CPR 2024/3110</div>
    </div>
    <div class="mast-rule"></div>
    ${category ? `<div class="eyebrow">${escapeHtml(category)}</div>` : '<div style="height:13pt"></div>'}
    <h1>${escapeHtml(title)}</h1>
    ${metaBits ? `<div class="byline">${sigilSvg ? `<span class="byline-sigil">${sigilSvg}</span>` : ''}<span>${metaBits}</span></div>` : ''}
  </header>
  <div class="content">
${htmlBody}
  </div>
  ${sourcesHtml}
</article>
</body>
</html>`;
}

// Stopka (Chromium template — system fonts, kolory wymagają print-color-adjust)
const FOOTER_TEMPLATE = `
<div style="width:100%; font-family:Arial,Helvetica,sans-serif; font-size:7.5pt; color:#64748B; padding:3mm 16mm 0; box-sizing:border-box; -webkit-print-color-adjust:exact; display:flex; justify-content:space-between; align-items:center; border-top:0.5pt solid #CBD5E1;">
  <span style="color:#1E293B; font-weight:700;">NowyCPR.pl <span style="color:#DC2626;">·</span> <span style="font-weight:400; color:#64748B;">Multicert Sp. z o.o. · biuro@multicert.pl</span></span>
  <span>Strona <span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

// Buduje pełny HTML z pliku .md (frontmatter + treść)
export function renderPostHtml(src, slug) {
  const { meta, body } = parseFrontmatter(src);
  const title = meta.title || slug;
  // Usuń wiodący nagłówek H1 z treści — tytuł pokazuje masthead
  const bodyNoH1 = body.replace(/^\s*#\s+.+\n+/, '');
  const htmlBody = marked.parse(bodyNoH1, { gfm: true, breaks: false });
  return buildHtml({
    title,
    author: meta.author || '',
    category: meta.category || '',
    date: meta.date || meta.reviewed || '',
    sources: meta.sources || [],
    htmlBody,
    sigilSvg: authorSigilSvg(meta.author || ''),
  });
}

export { buildHtml, parseFrontmatter, formatDate, FOOTER_TEMPLATE };

async function main() {
  const files = readdirSync(blogContentDir).filter(f => f.endsWith('.md')).sort();
  console.log(`\nGenerating PDFs for ${files.length} blog posts...`);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  let count = 0;
  const startTime = Date.now();

  // Process in batches of 4 for parallelism
  const BATCH_SIZE = 4;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (file) => {
      const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const src = readFileSync(join(blogContentDir, file), 'utf-8');
      const fullHtml = renderPostHtml(src, slug);

      const page = await context.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const outDir = join(distDir, 'blog', slug);
      mkdirSync(outDir, { recursive: true });
      await page.pdf({
        path: join(outDir, 'article.pdf'),
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: FOOTER_TEMPLATE,
        margin: { top: '16mm', right: '16mm', bottom: '18mm', left: '16mm' },
        printBackground: true,
      });
      await page.close();
      count++;
      process.stdout.write(`  ✓ /blog/${slug}/article.pdf (${count}/${files.length})\n`);
    }));
  }

  await context.close();
  await browser.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✓ Generated ${count} PDFs in ${elapsed}s`);
}

// Uruchom main() tylko gdy plik wywołany bezpośrednio (nie przy imporcie w teście)
if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
