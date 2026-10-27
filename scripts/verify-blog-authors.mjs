import { readFileSync, readdirSync } from 'node:fs';
import { getArticleAuthors } from './load-authors.mjs';

const directory = new URL('../content/blog/', import.meta.url);
const files = readdirSync(directory).filter(file => file.endsWith('.md')).sort();
const failures = [];
for (const file of files) {
  try {
    const source = readFileSync(new URL(file, directory), 'utf8');
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    const rawAuthor = frontmatter?.[1].match(/^author:\s*(.*)$/m)?.[1].trim();
    const author = rawAuthor?.replace(/^["']|["']$/g, '');
    getArticleAuthors(author);
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}
if (failures.length) {
  console.error(`Nie można opublikować artykułów bez imiennego autora:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Autorzy: ${files.length} artykułów ma imiennego autora z profilem.`);
}
