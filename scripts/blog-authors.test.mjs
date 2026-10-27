import test from 'node:test';
import assert from 'node:assert/strict';
import { getArticleAuthors } from './load-authors.mjs';

test('an organization or a missing field cannot stand in for a named author', () => {
  for (const name of [undefined, null, 42, '', '  ', 'Redakcja NowyCPR.pl',
    'Redakcja NowyCPR.pl | Multicert Sp. z o.o.', 'Zespół NowyCPR.pl']) {
    assert.throws(() => getArticleAuthors(name));
  }
});

test('unknown and partial names are rejected even if another author is recognized', () => {
  for (const name of ['Robert', 'Grzegorz', 'Grzegorz Suwara junior',
    'Jan Kowalski', 'Grzegorz Suwara | Jan Kowalski']) {
    assert.throws(() => getArticleAuthors(name));
  }
});

test('recognized people retain their byline and profile without publisher segments', () => {
  assert.deepEqual(getArticleAuthors('Grzegorz Suwara | Redakcja NowyCPR.pl | Multicert Sp. z o.o.'), [
    { name: 'Grzegorz Suwara', slug: 'grzegorz-suwara' },
  ]);
  assert.deepEqual(getArticleAuthors('mgr inż. Sławomir Słowik'), [
    { name: 'mgr inż. Sławomir Słowik', slug: 'slawomir-slowik' },
  ]);
});

test('multiple people are preserved, while name variants cannot duplicate a person', () => {
  assert.deepEqual(getArticleAuthors('dr inż. Robert Dynarowski | Robert Dynarowski | Grzegorz Suwara'), [
    { name: 'dr inż. Robert Dynarowski', slug: 'robert-dynarowski' },
    { name: 'Grzegorz Suwara', slug: 'grzegorz-suwara' },
  ]);
});
