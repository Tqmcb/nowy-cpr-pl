import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publicationDay, isPublishedDate, publishedBlogFiles } from './blog-publication.mjs';

test('publishes on the Warsaw date across summer and winter UTC boundaries', () => {
  for (const [before, after, date] of [
    ['2026-10-12T21:59:59Z', '2026-10-12T22:00:00Z', '2026-10-13'],
    ['2026-10-26T22:59:59Z', '2026-10-26T23:00:00Z', '2026-10-27'],
  ]) {
    assert.equal(isPublishedDate(date, new Date(before)), false);
    assert.equal(isPublishedDate(date, new Date(after)), true);
    assert.equal(publicationDay(new Date(after)), date);
  }
});

test('missing and invalid dates cannot expose a scheduled article', () => {
  const now = new Date('2026-10-09T10:00:00Z');
  for (const date of [undefined, '', '2026-02-30', '2026-13-01', '2026-10-13', '2026-10-09T00:00:00Z']) {
    assert.equal(isPublishedDate(date, now), false);
  }
  assert.equal(isPublishedDate('2026-10-09', now), true);
  assert.equal(isPublishedDate('2026-10-08', now), true);
});

test('frontmatter, rather than filename, controls the publication batch', () => {
  const directory = mkdtempSync(join(tmpdir(), 'nowycpr-publication-'));
  try {
    writeFileSync(join(directory, 'old-name.md'), '---\ndate: "2026-10-13"\n---\nScheduled');
    writeFileSync(join(directory, 'future-name.md'), "---\ndate: '2026-10-09'\n---\nPublished");
    writeFileSync(join(directory, 'undated.md'), '---\ntitle: Example\n---\ndate: 2026-10-09');
    assert.deepEqual(publishedBlogFiles(directory, new Date('2026-10-09T12:00:00Z')), ['future-name.md']);
    assert.deepEqual(publishedBlogFiles(directory, new Date('2026-10-13T12:00:00Z')), ['future-name.md', 'old-name.md']);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
