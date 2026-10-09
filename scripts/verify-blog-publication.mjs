import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicationDay, publishedBlogFiles } from './blog-publication.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = join(root, 'content/blog');
const dist = join(root, 'dist');
const published = new Set(publishedBlogFiles(content));
const future = readdirSync(content).filter(file => file.endsWith('.md') && !published.has(file));
const meta = JSON.parse(readFileSync(join(dist, 'posts/meta.json'), 'utf8'));
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const scripts = readdirSync(join(dist, 'assets')).filter(file => file.endsWith('.js'))
  .map(file => ({ file, source: readFileSync(join(dist, 'assets', file), 'utf8') }));
function outputFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(prefix, entry.name);
    return entry.isDirectory() ? outputFiles(join(directory, entry.name), path) : [path];
  });
}
const output = outputFiles(dist);
const textOutput = output.filter(file => /\.(html|json|xml|txt)$/.test(file))
  .map(file => ({ file, source: readFileSync(join(dist, file), 'utf8') }));
const leaks = [];

for (const file of future) {
  const basename = file.slice(0, -3);
  const slug = basename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  for (const path of [`blog/${slug}/index.html`, `blog/${slug}/article.pdf`, `posts/${slug}.json`]) {
    if (existsSync(join(dist, path))) leaks.push(path);
  }
  if (meta.some(post => post.slug === slug)) leaks.push(`meta.json: ${slug}`);
  if (sitemap.includes(`/blog/${slug}/`)) leaks.push(`sitemap.xml: ${slug}`);
  for (const artifact of textOutput) {
    if (artifact.source.includes(slug)) leaks.push(`${artifact.file}: ${slug}`);
  }
  for (const path of output.filter(file => file.endsWith('.pdf'))) {
    if (path.includes(slug)) leaks.push(path);
  }

  const markdown = readFileSync(join(content, file), 'utf8');
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*/, '').trim();
  const sentinel = body.split('\n\n')[0].slice(0, 160);
  for (const asset of scripts) {
    if (asset.file.startsWith(basename + '-') || (sentinel.length > 20 &&
      (asset.source.includes(sentinel) || asset.source.includes(JSON.stringify(sentinel).slice(1, -1))))) {
      leaks.push(`assets/${asset.file}: ${slug}`);
    }
  }
}

if (leaks.length) {
  console.error('Przedwczesna publikacja artykułów:\n' + leaks.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Harmonogram OK (${publicationDay()}): ${meta.length} widocznych, ${future.length} oczekujących; bez przedwczesnych HTML, JSON, PDF i tekstów w JavaScript.`);
}
