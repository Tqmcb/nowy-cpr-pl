/**
 * generate-missing-images.mjs
 * Dogeneruje brakujące obrazki dla postów przez Pollinations.ai
 * Uruchom: node scripts/generate-missing-images.mjs
 */

import { writeFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir   = join(__dirname, '..');
const blogDir   = join(rootDir, 'content', 'blog');
const imgDir    = join(rootDir, 'public', 'images', 'blog');

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_AI_TOKEN   = process.env.CF_AI_TOKEN;

function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.+)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return data;
}

function buildImagePrompt(title) {
  const map = {
    'wyrob': 'construction product', 'wyroby': 'construction products',
    'budowlan': 'construction', 'certyfikacj': 'certification',
    'oznakowanie': 'CE marking', 'norma': 'technical standard',
    'deklaracja': 'declaration document', 'paszport': 'digital passport',
    'kary': 'regulation compliance', 'kontrola': 'quality control inspection',
    'producent': 'manufacturer factory', 'importer': 'import warehouse',
    'dystrybutor': 'distribution logistics', 'dokumentacja': 'technical documentation',
    'izolacj': 'insulation material', 'okna': 'window frame', 'beton': 'concrete',
    'epd': 'environmental product declaration', 'gwp': 'carbon footprint measurement',
    'cyfrowy': 'digital technology', 'zrownowazony': 'sustainable green building',
    'lca': 'life cycle assessment laboratory', 'cpcr': 'environmental certification',
    'en-15804': 'environmental product declaration EPD laboratory testing',
  };
  let eng = 'European construction industry building materials regulation';
  for (const [pl, en] of Object.entries(map)) {
    if (title.toLowerCase().includes(pl)) eng = `${en}, ${eng}`;
  }
  return `${eng}, professional photography, modern architecture, no text, no letters, no words, no captions, no watermark, photorealistic, high quality`;
}

async function fetchFromPollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&nologo=true&model=flux&seed=${Math.floor(Math.random()*9999)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchFromCloudflareAI(prompt) {
  if (!CF_ACCOUNT_ID || !CF_AI_TOKEN) throw new Error('Brak CF_ACCOUNT_ID / CF_AI_TOKEN');
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_AI_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, width: 1200, height: 672, num_steps: 4 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateImage(title, slug) {
  const imgPath = join(imgDir, `${slug}.jpg`);
  if (existsSync(imgPath)) {
    console.log(`⏭️  Pomijam (istnieje): ${slug}.jpg`);
    return;
  }
  const prompt = buildImagePrompt(title);
  console.log(`🎨 Generuję: ${slug}.jpg`);
  console.log(`   Prompt: ${prompt.slice(0, 80)}...`);
  mkdirSync(imgDir, { recursive: true });

  const providers = [
    { name: 'Pollinations.ai', fn: () => fetchFromPollinations(prompt) },
    { name: 'Cloudflare AI',   fn: () => fetchFromCloudflareAI(prompt) },
  ];
  for (const { name, fn } of providers) {
    try {
      console.log(`   🔄 ${name}...`);
      const buf = await fn();
      writeFileSync(imgPath, buf);
      console.log(`   ✅ Zapisano (${Math.round(buf.length/1024)}KB) via ${name}`);
      return;
    } catch (e) {
      console.log(`   ⚠️  ${name}: ${e.message}`);
    }
  }
  console.log(`   ❌ Żaden provider nie zadziałał`);
}

// Znajdź wszystkie posty z brakującymi obrazkami
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));
const missing = [];

for (const file of files) {
  const src = readFileSync(join(blogDir, file), 'utf-8');
  const meta = parseFrontmatter(src);
  if (!meta.image_url) continue;
  const imgFile = meta.image_url.split('/').pop();
  if (!existsSync(join(imgDir, imgFile))) {
    missing.push({ title: meta.title || file, slug: imgFile.replace('.jpg', '') });
  }
}

if (missing.length === 0) {
  console.log('✅ Wszystkie obrazki już istnieją.');
  process.exit(0);
}

console.log(`\n📷 Brakuje ${missing.length} obrazków — generuję...\n`);

for (const { title, slug } of missing) {
  await generateImage(title, slug);
  // Krótka przerwa żeby nie przeciążyć API
  await new Promise(r => setTimeout(r, 2000));
}

console.log('\n✅ Gotowe!');
