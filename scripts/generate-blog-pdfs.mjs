/**
 * generate-blog-pdfs.mjs — Post-build PDF generator dla wszystkich postów
 *
 * Dla każdego content/blog/*.md generuje dist/blog/<slug>/article.pdf
 * w identycznym formacie jak Dynarowski-PDF z marca 2026
 * (Inter sans-serif, czysta typografia, bez brandu).
 *
 * Flow: MD → marked → minimal HTML template → Chromium headless → Skia/PDF
 *
 * Uruchamiany automatycznie z "postbuild" w package.json po prerender.mjs.
 */

import { chromium } from 'playwright';
import { marked } from 'marked';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const blogContentDir = join(rootDir, 'content', 'blog');

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

function buildHtml(title, author, htmlBody) {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 18mm 18mm 20mm 18mm; }
  html, body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #1a1a1a;
    background: white;
    font-size: 11pt;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  body { margin: 0; padding: 0; max-width: 100%; }
  article { max-width: 100%; }
  h1 { font-size: 22pt; font-weight: 700; line-height: 1.25; margin: 0 0 16pt; color: #1a1a1a; }
  h2 { font-size: 14pt; font-weight: 700; line-height: 1.3; margin: 22pt 0 10pt; color: #1a1a1a; page-break-after: avoid; }
  h3 { font-size: 11.5pt; font-weight: 600; margin: 16pt 0 6pt; color: #1a1a1a; page-break-after: avoid; }
  p { margin: 0 0 10pt; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  a { color: #1a1a1a; text-decoration: underline; }
  ul, ol { margin: 0 0 12pt; padding-left: 22pt; }
  li { margin-bottom: 4pt; }
  blockquote { border-left: 3px solid #ccc; margin: 12pt 0; padding: 4pt 14pt; color: #444; font-style: italic; page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; margin: 14pt 0; font-size: 9.5pt; page-break-inside: avoid; }
  th { background: #f3f3f3; font-weight: 600; text-align: left; padding: 8pt 10pt; border: 1px solid #d9d9d9; }
  td { padding: 8pt 10pt; border: 1px solid #e5e5e5; vertical-align: top; }
  tr:nth-child(even) td { background: #fafafa; }
  code { font-family: 'SF Mono', Consolas, Monaco, monospace; background: #f4f4f4; padding: 1pt 4pt; border-radius: 3pt; font-size: 9.5pt; }
  hr { border: none; border-top: 1px solid #e5e5e5; margin: 18pt 0; }
  .article-meta { color: #666; font-size: 9.5pt; margin: 0 0 22pt; padding-bottom: 10pt; border-bottom: 1px solid #e5e5e5; }
  .footer-link { margin-top: 28pt; padding-top: 12pt; border-top: 1px solid #e5e5e5; color: #666; font-size: 9pt; }
  .footer-link a { color: #666; }
</style>
</head>
<body>
<article>
${author ? `<div class="article-meta">${escapeHtml(author)}</div>` : ''}
${htmlBody}
<div class="footer-link">
  Wersja online: <a href="https://www.nowycpr.pl/">www.nowycpr.pl</a> &middot; Multicert Sp. z o.o. &middot; biuro@multicert.pl
</div>
</article>
</body>
</html>`;
}

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
    const { meta, body } = parseFrontmatter(src);

    const title = meta.title || slug;
    const author = meta.author || '';

    // Strip pipe-style sources entries from body (they're frontmatter-only metadata in this repo)
    const htmlBody = marked.parse(body, { gfm: true, breaks: false });

    const fullHtml = buildHtml(title, author, htmlBody);

    const page = await context.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const outDir = join(distDir, 'blog', slug);
    mkdirSync(outDir, { recursive: true });
    await page.pdf({
      path: join(outDir, 'article.pdf'),
      format: 'A4',
      margin: { top: '18mm', right: '18mm', bottom: '20mm', left: '18mm' },
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
