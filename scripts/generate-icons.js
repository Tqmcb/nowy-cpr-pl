import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const svg = readFileSync('public/favicon.svg');
const outputDir = 'public';
const targets = [
  { size: 32, file: 'favicon-32x32.png' },
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'favicon-192x192.png' },
  { size: 512, file: 'favicon-512x512.png' },
];

for (const { size, file } of targets) {
  await sharp(svg).resize(size, size).png().toFile(join(outputDir, file));
  console.log(`✓ ${file}`);
}

try {
  execFileSync('magick', [
    join(outputDir, 'favicon-32x32.png'),
    join(outputDir, 'favicon.ico'),
  ], { stdio: 'inherit' });
  console.log('✓ favicon.ico');
} catch (error) {
  console.warn('! favicon.ico was not regenerated (magick unavailable).');
  if (error instanceof Error) {
    console.warn(error.message);
  }
}
