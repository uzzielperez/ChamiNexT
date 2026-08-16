/**
 * Writes public/ChamiNexT-investor-briefing.pdf for static download.
 * Run: node scripts/generate-investor-briefing-pdf.mjs
 */
import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const FOUNDING = { code: 'FOUNDING40', percentOff: 40, maxRedemptions: 30 };
const LIST = {
  'interview-season': 14900,
  builder: 4900,
  'biz-small': 25000,
  'biz-growth': 90000,
};
const fmt = (cents) => (cents % 100 === 0 ? `€${cents / 100}` : `€${(cents / 100).toFixed(2)}`);
const disc = (cents) => Math.round(cents * (1 - FOUNDING.percentOff / 100));

const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE = 5.5;
const FOOTER_Y = 287;

function build() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const ensure = (need) => {
    if (y + need > FOOTER_Y - 8) {
      doc.addPage();
      y = MARGIN + 4;
    }
  };
  const h = (text, size = 13) => {
    ensure(LINE * 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(doc.splitTextToSize(text, CONTENT_W), MARGIN, y);
    y += size * 0.55 + 4;
  };
  const p = (text) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    for (const line of doc.splitTextToSize(text, CONTENT_W)) {
      ensure(LINE);
      doc.text(line, MARGIN, y);
      y += LINE;
    }
    y += 2;
  };
  const ul = (items) => {
    for (const item of items) {
      for (const line of doc.splitTextToSize(`• ${item}`, CONTENT_W - 4)) {
        ensure(LINE);
        doc.text(line.startsWith('•') ? line : `  ${line}`, MARGIN + 4, y);
        y += LINE;
      }
    }
    y += 2;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ChamiNexT', MARGIN, y);
  y += 8;
  p('Investor & partner briefing — thinking-process evaluation for technical hiring');
  p('v1.1 · August 2026 · hello@chaminext.com · chaminext.com');

  h('1. Thinking process (the signal)');
  p('We grade thinking process — not just final answers.');
  p('Their prompts give away their thinking process: constraints first, edge cases, verification vs blind paste, iteration discipline.');
  ul([
    'Live reasoning transcript + adversarial follow-up',
    'Mandatory walkthrough / defense',
    'AI-assisted work with disclosure — scored on how they wielded the tool',
  ]);

  h('2. Moat');
  p('Graded thinking-process trail on both sides — practice and Interview Studio on the same rubric.');
  p('Flywheel: prompt trace → defense → ship artifact → profile → employer rank → hire outcome → rubric recalibration');
  p('Prep tools never see hire outcomes. Screening tools never see daily practice at scale. Owning both on one eval stack is the moat.');

  h('3. Hiring loop — candidates');
  ul([
    'CV pre-screen → /journey, /coach, talent profile',
    'Recruiter screen → /loop, recruiter-domain mocks',
    'Technical screen → /practice, /drill, /skills',
    'Ship test / Work Ticket → PR submit, AI disclosure',
    'Soft skills (5 phases) → behavioral rubrics + coaching',
    'Pairing / final → project walkthrough, full-loop simulation',
  ]);
  p('Tracks: Software · AI Engineer · Quant · Cybersecurity · Market Eng · AI for Science');

  h('4. Hiring loop — employers (Interview Studio)');
  ul([
    'Configure roles: Ship Test + soft-skills pack per opening',
    'Rank on thinking, shipping, communication — same dimensions candidates practice',
    'Small €250/mo · Growth €900/mo · Enterprise custom · 60-day pilot',
  ]);

  h('5. Pricing (founding 40% off — FOUNDING40, first 30 payers)');
  p(`Daily €0 · Sprint ${fmt(disc(LIST['interview-season']))} (list ${fmt(LIST['interview-season'])}) one-time / 90 days · Season ${fmt(disc(LIST.builder))}/mo (list ${fmt(LIST.builder)}/mo)`);
  p(`Small Business ${fmt(disc(LIST['biz-small']))}/mo · Growth ${fmt(disc(LIST['biz-growth']))}/mo · Enterprise custom`);
  p('30-day Builder trial · B2B annual = 2 months free · mission pricing for nonprofits');

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('chaminext.com · v1.1', MARGIN, FOOTER_Y);
    doc.text(String(i), PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
  }

  return doc.output('arraybuffer');
}

const outDir = join(ROOT, 'public');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'ChamiNexT-investor-briefing.pdf');
writeFileSync(outPath, Buffer.from(build()));
console.log('Wrote', outPath);
