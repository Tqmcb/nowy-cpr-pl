import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// The daily Pages build publishes dates according to the portal's Polish calendar.
export function publicationDay(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

export function isPublishedDate(date, now = new Date()) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
  return date <= publicationDay(now);
}

export function publishedBlogFiles(directory, now = new Date()) {
  return readdirSync(directory).filter(file => {
    if (!file.endsWith('.md')) return false;
    const source = readFileSync(join(directory, file), 'utf-8');
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    const rawDate = frontmatter?.[1].match(/^date:\s*(.+)$/m)?.[1].trim();
    const date = rawDate?.replace(/^["']|["']$/g, '');
    return isPublishedDate(date, now);
  }).sort();
}
