/**
 * Writes public/ChamiNexT-pitch-deck.pdf for static download.
 * Run: npm run deck:pdf
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { buildPitchDeckPdf } from '../src/utils/pitchDeckPdf';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const outDir = join(ROOT, 'public');
const outPath = join(outDir, 'ChamiNexT-pitch-deck.pdf');

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.from(buildPitchDeckPdf().output('arraybuffer')));
console.log('Wrote', outPath);
