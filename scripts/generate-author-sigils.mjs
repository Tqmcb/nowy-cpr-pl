/**
 * generate-author-sigils.mjs — sygnety autorów w stylu grawerunku (HBR-like, B&W)
 *
 * Dla każdego autora generuje public/images/authors/<slug>.svg:
 * papier + inkowe inicjały szeryfowe, cienkie obręcze, promieniste kreski
 * i delikatne poziome kreskowanie za literami. Bez twarzy, czysto B&W.
 *
 * Uruchom: node scripts/generate-author-sigils.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'images', 'authors');
mkdirSync(outDir, { recursive: true });

const INK = '#15140F', PAPER = '#FAF8F2';

function engrave(initials) {
  const hatch = [];
  for (let y = 96; y <= 146; y += 4) hatch.push(`<line x1="84" y1="${y}" x2="156" y2="${y}" stroke="${INK}" stroke-width="0.5" opacity="0.12"/>`);
  const ticks = [];
  const N = 120, R = 110;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 2 * Math.PI;
    const x1 = (120 + (R - 4) * Math.cos(a)).toFixed(1), y1 = (120 + (R - 4) * Math.sin(a)).toFixed(1);
    const x2 = (120 + R * Math.cos(a)).toFixed(1), y2 = (120 + R * Math.sin(a)).toFixed(1);
    ticks.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="0.7" opacity="0.55"/>`);
  }
  const fs = initials.length >= 3 ? 46 : 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <rect width="240" height="240" fill="${PAPER}"/>
  <circle cx="120" cy="120" r="110" fill="none" stroke="${INK}" stroke-width="1.6"/>
  <circle cx="120" cy="120" r="92" fill="none" stroke="${INK}" stroke-width="0.7"/>
  ${ticks.join('')}
  <clipPath id="cc"><circle cx="120" cy="120" r="92"/></clipPath>
  <g clip-path="url(#cc)">${hatch.join('')}</g>
  <text x="120" y="121" fill="${INK}" font-family="Georgia, 'Times New Roman', serif" font-size="${fs}" font-weight="600" letter-spacing="2" text-anchor="middle" dominant-baseline="central">${initials}</text>
</svg>`;
}

const AUTHORS = {
  'robert-dynarowski': 'RD',
  'mikolaj-junosza-szaniawski': 'MJ',
  'slawomir-slowik': 'SS',
  'violetta-gladysz-oczalska': 'VG',
  'izabela-sztamberek-sochan': 'IS',
  'tomasz-barto': 'TB',
  'grzegorz-suwara': 'GS',
  'dariusz-samsel': 'DS',
};

let n = 0;
for (const [slug, initials] of Object.entries(AUTHORS)) {
  writeFileSync(join(outDir, `${slug}.svg`), engrave(initials));
  n++;
  process.stdout.write(`  ✓ ${slug}.svg (${initials})\n`);
}
console.log(`\n✓ Wygenerowano ${n} sygnetów autorów → public/images/authors/`);
