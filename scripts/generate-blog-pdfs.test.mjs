import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { renderPostHtml } from './generate-blog-pdfs.mjs';

test('PDF preserves source links and exposes working links to services and contact', async () => {
  const slug = 'proba-odnosnikow';
  const title = 'Beton "A&B" — próba';
  const src = `---
title: '${title}'
sources:
  - Program EPD Polska|https://epd.org.pl/
---
[Usługi](/services/) i [kontakt względny](../../kontakt/).

[E-mail](mailto:biuro@multicert.pl) i [telefon](tel:+48730668341).
`;
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ offline: true });
    const page = await context.newPage();
    await page.setContent(renderPostHtml(src, slug), { waitUntil: 'networkidle' });
    const links = await page.locator('a').evaluateAll(nodes => nodes.map(a => a.href));
    const pdf = await page.pdf();
    // Chromium writes URI actions as literal PDF strings. Check the exported
    // annotations as well as the HTML, so an inert PDF cannot pass this test.
    const pdfLinks = [...pdf.toString('latin1').matchAll(/\/URI\s+\(([^)]+)\)/g)].map(m => m[1]);
    for (const url of links) assert.ok(pdfLinks.includes(url), `Missing PDF link: ${url}`);

    for (const url of [
      'https://www.nowycpr.pl/services/',
      'https://www.nowycpr.pl/kontakt/',
      'https://epd.org.pl/',
      'mailto:biuro@multicert.pl',
      'tel:+48730668341',
    ]) assert.ok(pdfLinks.includes(url), url);

    const campaignLinks = pdfLinks.filter(url => url.startsWith('https://www.nowycpr.pl/') && url.includes('utm_medium=pdf'));
    assert.equal(campaignLinks.length, 4);
    for (const link of campaignLinks) {
      assert.equal(new URL(link).searchParams.get('utm_content'), slug);
    }
    assert.ok(campaignLinks.some(url => new URL(url).hash === '#contact-section'));
    assert.ok(campaignLinks.some(url => new URL(url).pathname === `/blog/${slug}/`));
    const email = new URL(pdfLinks.find(url => url.startsWith('mailto:biuro@multicert.pl?')));
    assert.equal(email.searchParams.get('subject'), `Zapytanie z PDF: ${title}`);
    assert.equal(email.searchParams.get('body'), `Artykuł: https://www.nowycpr.pl/blog/${slug}/\n\n`);
  } finally {
    await browser.close();
  }
});
