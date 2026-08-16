/**
 * Writes public/ChamiNexT-investor-briefing.pdf for static download.
 * Run: npm run briefing:pdf
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { buildBriefingPdf } from '../src/utils/investorBriefingPdf';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const outDir = join(ROOT, 'public');
const outPath = join(outDir, 'ChamiNexT-investor-briefing.pdf');

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.from(buildBriefingPdf().output('arraybuffer')));
console.log('Wrote', outPath);
