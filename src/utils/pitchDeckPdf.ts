/**
 * ChamiNexT pitch deck — landscape 16:9 slides, dark brand theme.
 * Copy is sourced from investorBriefing.ts / foundingOffer.ts for consistency.
 */
import { jsPDF } from 'jspdf';
import {
  BRIEFING_META,
  THINKING_PROCESS,
  MOAT,
  PRICING_NOTES,
  COMPETITIVE_ONE_LINERS,
} from '../data/investorBriefing';
import { FOUNDING } from '../data/foundingOffer';

const W = 297;
const H = 167; // 297 / 167 ≈ 16:9
const M = 20;
const CW = W - M * 2;

const C = {
  bg: [10, 11, 13] as const,
  card: [21, 23, 27] as const,
  cardEdge: [40, 44, 52] as const,
  accent: [59, 130, 246] as const,
  accentBright: [96, 165, 250] as const,
  text: [244, 245, 247] as const,
  muted: [154, 161, 172] as const,
  emerald: [52, 211, 153] as const,
  amber: [251, 191, 36] as const,
};

type RGB = readonly [number, number, number];

function tx(doc: jsPDF, c: RGB) {
  doc.setTextColor(c[0], c[1], c[2]);
}
function fl(doc: jsPDF, c: RGB) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function st(doc: jsPDF, c: RGB) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

let slideNo = 0;

function newSlide(doc: jsPDF, label: string): void {
  if (slideNo > 0) doc.addPage([W, H], 'landscape');
  slideNo += 1;

  fl(doc, C.bg);
  doc.rect(0, 0, W, H, 'F');

  // top accent sliver
  fl(doc, C.accent);
  doc.rect(0, 0, W, 2.2, 'F');

  // kicker label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  tx(doc, C.accentBright);
  doc.text(label.toUpperCase(), M, 18);

  // footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  tx(doc, C.muted);
  doc.text('ChamiNexT — the evaluation layer for engineering in the AI era', M, H - 8);
  doc.text(String(slideNo).padStart(2, '0'), W - M, H - 8, { align: 'right' });
}

function headline(doc: jsPDF, text: string, y = 34, size = 25): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  tx(doc, C.text);
  const lines = doc.splitTextToSize(text, CW);
  doc.text(lines, M, y);
  return y + lines.length * (size * 0.46) + 6;
}

function bullets(
  doc: jsPDF,
  items: string[],
  x: number,
  y: number,
  w: number,
  opts: { size?: number; gap?: number; dot?: RGB } = {}
): number {
  const size = opts.size ?? 11;
  const gap = opts.gap ?? 4.5;
  const line = size * 0.42;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  for (const item of items) {
    fl(doc, opts.dot ?? C.accent);
    doc.circle(x + 1.4, y - 1.3, 1.3, 'F');
    tx(doc, C.muted);
    const lines = doc.splitTextToSize(item, w - 8);
    doc.text(lines, x + 6.5, y);
    y += lines.length * line + gap;
  }
  return y;
}

function card(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  fl(doc, C.card);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');
  st(doc, C.cardEdge);
  doc.setLineWidth(0.35);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S');
}

function statCard(doc: jsPDF, x: number, y: number, w: number, big: string, small: string): void {
  card(doc, x, y, w, 34);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  tx(doc, C.accentBright);
  doc.text(doc.splitTextToSize(big, w - 12), x + 6, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  tx(doc, C.muted);
  doc.text(doc.splitTextToSize(small, w - 12), x + 6, y + 21);
}

/** jsPDF built-in fonts lack U+2192; swap for a WinAnsi-safe chevron in shared copy. */
function clean(text: string): string {
  return text.replace(/→/g, '›');
}

/** jsPDF built-in fonts lack U+2192; draw the arrow instead. */
function drawArrow(doc: jsPDF, x: number, y: number, len = 6): void {
  st(doc, C.accent);
  doc.setLineWidth(0.9);
  doc.line(x, y, x + len, y);
  doc.line(x + len - 2.2, y - 1.8, x + len, y);
  doc.line(x + len - 2.2, y + 1.8, x + len, y);
}

function chip(doc: jsPDF, x: number, y: number, w: number, text: string, active = false): void {
  fl(doc, active ? C.accent : C.card);
  doc.roundedRect(x, y, w, 9, 4.5, 4.5, 'F');
  if (!active) {
    st(doc, C.cardEdge);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, y, w, 9, 4.5, 4.5, 'S');
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  tx(doc, active ? C.text : C.muted);
  doc.text(text, x + w / 2, y + 6, { align: 'center' });
}

export function buildPitchDeckPdf(): jsPDF {
  slideNo = 0;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] });

  /* ---------- 1 · Cover ---------- */
  fl(doc, C.bg);
  doc.rect(0, 0, W, H, 'F');
  slideNo = 1;
  fl(doc, C.accent);
  doc.rect(0, 0, W, 2.2, 'F');
  doc.rect(M, 52, 5, 34, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  tx(doc, C.text);
  doc.text('ChamiNexT', M + 12, 66);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(15);
  tx(doc, C.muted);
  doc.text('Stop memorizing. Start shipping.', M + 12, 78);

  doc.setFontSize(11);
  doc.text(
    doc.splitTextToSize(
      'The evaluation layer for engineering in the AI era — candidates ship real Work Tickets with AI; employers hire on the graded prompt trail.',
      170
    ),
    M + 12,
    90
  );

  fl(doc, C.card);
  doc.roundedRect(M + 12, 108, 92, 9, 4.5, 4.5, 'F');
  st(doc, C.cardEdge);
  doc.roundedRect(M + 12, 108, 92, 9, 4.5, 4.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  tx(doc, C.accentBright);
  doc.text(`${BRIEFING_META.version}  ·  chaminext.netlify.app`, M + 58, 114, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  tx(doc, C.muted);
  doc.text(`Pitch deck · ${BRIEFING_META.contact}`, M, H - 8);

  /* ---------- 2 · Problem ---------- */
  newSlide(doc, 'The problem');
  headline(doc, 'Technical hiring is testing the wrong thing.');
  bullets(
    doc,
    [
      'Algorithm loops reward memorization theater — the signal was weak before AI, and is dead after it.',
      'Take-homes are now unverifiable: you cannot tell what the candidate did versus what their model did.',
      'Senior engineers burn hours per loop and teams still mis-hire on real-world work.',
    ],
    M,
    58,
    150
  );
  statCard(doc, 185, 52, 92, '70%', 'of candidates fail on real-world tasks despite strong whiteboard scores (senior-engineer reports)');
  statCard(doc, 185, 92, 92, '$150k–300k+', 'typical cost of one bad senior hire — the problem employers already budget against');

  /* ---------- 3 · Why now ---------- */
  newSlide(doc, 'Why now');
  headline(doc, "Engineers ship with AI every day. Interviews pretend they don't.");
  bullets(
    doc,
    [
      'The question changed — not "can you code without AI" but "can you ship with it, verifiably".',
      'AI bans in assessments are unenforceable. Disclosure plus evaluation is the only stable equilibrium.',
      'A new artifact exists that older platforms never captured: the prompt trail — how a candidate decomposes, verifies, and iterates with an agent.',
    ],
    M,
    60,
    CW
  );
  const chips = ['Decomposition', 'Verification', 'Iteration', 'AI disclosure'];
  chips.forEach((c, i) => chip(doc, M + i * 52, 122, 48, c, i === 0));

  /* ---------- 4 · Insight ---------- */
  newSlide(doc, 'The insight');
  headline(doc, 'Their prompts give away their thinking process.');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12.5);
  tx(doc, C.muted);
  const insightBody = THINKING_PROCESS.insight.replace(
    /^Their prompts give away their thinking process\.\s*/,
    ''
  );
  doc.text(doc.splitTextToSize(insightBody, 160), M, 62);
  card(doc, 192, 50, 85, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  tx(doc, C.accentBright);
  doc.text('GRADED PER PROMPT', 198, 60);
  bullets(
    doc,
    ['Constraints before code?', 'Asked for edge cases?', 'Verified or pasted blindly?', 'Disclosed AI use?'],
    198,
    70,
    75,
    { size: 9.5, gap: 3.5 }
  );

  /* ---------- 5 · Product: candidate ---------- */
  newSlide(doc, 'Product · candidate side');
  headline(doc, 'Candidates run real company loops — not puzzles.');
  const stages = ['CV screen', 'Technical quiz', 'Work Ticket', 'Ethics & behavioral'];
  stages.forEach((s, i) => {
    chip(doc, M + i * 63, 56, 56, s, i === 2);
    if (i < 3) drawArrow(doc, M + i * 63 + 57, 60.5, 5);
  });
  bullets(
    doc,
    [
      'Six salary-banded company-style interview loops on the landing page (AI infra, quant, big tech, frontier labs).',
      'Work Tickets run in a browser Cursor-style studio: editor, terminal, tests, and a coding agent.',
      'AI is allowed — every prompt is logged and becomes part of the submission package.',
      'Plus AI mock interviews, ship tests (24h/72h/7d), and behavioral coaching on the same rubric.',
    ],
    M,
    80,
    CW
  );

  /* ---------- 6 · Product: employer ---------- */
  newSlide(doc, 'Product · employer side');
  headline(doc, 'Employers get a recommendation — not a scoreboard.');
  bullets(
    doc,
    [
      'Raw prompt trail, unedited — exactly what the candidate asked the agent, in order.',
      'Per-prompt rubric grades: decomposition, verification, iteration, AI disclosure.',
      'Composite scores are supporting detail; the deliverable is a clear verdict with strengths, gaps, and live-round probes.',
      'Per-loop dashboards: assigned stages, candidate pipeline, one-click full assessment.',
    ],
    M,
    58,
    150
  );
  card(doc, 185, 50, 92, 78);
  fl(doc, [16, 60, 40]);
  doc.roundedRect(191, 56, 40, 8, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  tx(doc, C.emerald);
  doc.text('STRONG ADVANCE', 211, 61.3, { align: 'center' });
  doc.setFontSize(10.5);
  tx(doc, C.text);
  doc.text(doc.splitTextToSize('Strong hire signal — advance to final round.', 80), 191, 72);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  tx(doc, C.emerald);
  doc.text(doc.splitTextToSize('+ Shipped passing code; prompts show verification', 80), 191, 84);
  tx(doc, C.amber);
  doc.text(doc.splitTextToSize('-  Probe live: how they verified AI-written tests', 80), 191, 95);
  tx(doc, C.muted);
  doc.text('Thinking 84 · Prompt trail 78 · Shipping 82', 191, 106);
  doc.text('Verdicts: Strong advance / Proceed /', 191, 115);
  doc.text('Borderline / Do not advance', 191, 120.5);

  /* ---------- 7 · How it works ---------- */
  newSlide(doc, 'How it works');
  headline(doc, 'One loop, both sides of the table.');
  const flow: Array<[string, string]> = [
    ['Assign ticket', 'Company picks a scoped 4h Work Ticket'],
    ['Ship with AI', 'Candidate codes in the browser studio'],
    ['Auto-package', 'Code + terminal log + every prompt'],
    ['Grade the trail', 'Per-prompt rubric + composite scores'],
    ['Hire call', 'Recommendation + live-round probes'],
  ];
  flow.forEach(([title, sub], i) => {
    const x = M + i * 52;
    card(doc, x, 60, 47, 44);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    tx(doc, C.accentBright);
    doc.text(String(i + 1).padStart(2, '0'), x + 5, 71);
    doc.setFontSize(10);
    tx(doc, C.text);
    doc.text(doc.splitTextToSize(title, 38), x + 5, 79);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    tx(doc, C.muted);
    doc.text(doc.splitTextToSize(sub, 38), x + 5, 87);
    if (i < flow.length - 1) drawArrow(doc, x + 47.5, 82, 4);
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  tx(doc, C.muted);
  doc.text(
    'Same rubric on both sides: candidates practice on it, Interview Studio ranks on it.',
    M,
    118
  );

  /* ---------- 8 · Business model ---------- */
  newSlide(doc, 'Business model');
  headline(doc, 'Two-sided: candidates subscribe, companies pay for signal.');
  const cols: Array<{ title: string; rows: string[] }> = [
    {
      title: 'Candidates',
      rows: [
        'Daily — €0 free front door',
        `Sprint — ${PRICING_NOTES.individuals[1].price} one-time · 90 days`,
        `Season — ${PRICING_NOTES.individuals[2].price} · cancel anytime`,
      ],
    },
    {
      title: 'Companies',
      rows: [
        `Small Business — ${PRICING_NOTES.companies[0].price}`,
        `Growth — ${PRICING_NOTES.companies[1].price}`,
        'Enterprise — custom · SSO · ATS/API',
        '60-day free pilot on all paid tiers',
      ],
    },
    {
      title: 'Founding cohort',
      rows: [
        `${FOUNDING.code}: ${FOUNDING.percentOff}% off`,
        `First ${FOUNDING.maxRedemptions} payers`,
        'Design partners shape rubrics',
      ],
    },
  ];
  cols.forEach((col, i) => {
    const x = M + i * 88;
    card(doc, x, 56, 82, 56);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    tx(doc, C.accentBright);
    doc.text(col.title, x + 6, 66);
    bullets(doc, col.rows, x + 6, 76, 74, { size: 8.5, gap: 3 });
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  tx(doc, C.muted);
  doc.text(clean(PRICING_NOTES.investorNotes[1]), M, 124);

  /* ---------- 9 · Competition ---------- */
  newSlide(doc, 'Competition');
  headline(doc, 'Everyone grades output. Nobody grades the trail.');
  const rows: Array<[string, string, boolean]> = [
    ['LeetCode', COMPETITIVE_ONE_LINERS.leetcode, false],
    ['HackerRank', COMPETITIVE_ONE_LINERS.hackerrank, false],
    ['getcracked', COMPETITIVE_ONE_LINERS.getcracked, false],
    ['ChamiNexT', COMPETITIVE_ONE_LINERS.chaminext, true],
  ];
  let ry = 58;
  for (const [name, line, hero] of rows) {
    card(doc, M, ry, CW, 15.5);
    if (hero) {
      fl(doc, C.accent);
      doc.rect(M, ry, 2.5, 15.5, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    tx(doc, hero ? C.accentBright : C.text);
    doc.text(name, M + 8, ry + 9.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    tx(doc, C.muted);
    doc.text(doc.splitTextToSize(line, CW - 60), M + 52, ry + 9.5);
    ry += 18.5;
  }

  /* ---------- 10 · Moat ---------- */
  newSlide(doc, 'Moat');
  headline(doc, MOAT.headline);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  tx(doc, C.muted);
  doc.text(doc.splitTextToSize(MOAT.structural, CW), M, 58);
  card(doc, M, 76, CW, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  tx(doc, C.accentBright);
  doc.text('DATA FLYWHEEL', M + 6, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  tx(doc, C.text);
  doc.text(doc.splitTextToSize(clean(MOAT.flywheel), CW - 12), M + 6, 93);
  doc.setFontSize(9.5);
  tx(doc, C.muted);
  doc.text(
    doc.splitTextToSize(
      'Prep tools never see hire outcomes; screening tools never see daily practice. Owning both sides on one rubric compounds.',
      CW
    ),
    M,
    118
  );

  /* ---------- 11 · Traction & roadmap ---------- */
  newSlide(doc, 'Traction & roadmap');
  headline(doc, 'Live product. Founding pilots open.');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  tx(doc, C.emerald);
  doc.text('LIVE TODAY — chaminext.netlify.app', M, 58);
  bullets(
    doc,
    [
      'Six company-style interview loops with salary bands and 4-stage runners',
      'Browser coding studio: Monaco editor, terminal, sandbox tests, coding agent',
      'Prompt-trail grading engine + employer hire recommendations',
      'Per-loop employer dashboards, Stripe-backed pilots, investor briefing',
    ],
    M,
    66,
    128,
    { size: 9.5, gap: 3.5, dot: C.emerald }
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  tx(doc, C.accentBright);
  doc.text('NEXT', 170, 58);
  bullets(
    doc,
    [
      'Design-partner pilots: calibrate rubrics on real "great hire" stories',
      'Server-backed workspaces and accounts',
      'Outcome-calibrated grading (which prompt signals predict good hires)',
      'ATS integrations and enterprise rubric packs',
    ],
    170,
    66,
    108,
    { size: 9.5, gap: 3.5 }
  );

  /* ---------- 12 · Ask ---------- */
  newSlide(doc, 'The ask');
  headline(doc, 'Join the founding cohort.', 44, 28);
  bullets(
    doc,
    [
      'Companies: founding design-partner pilots — 60-day free trial, rubrics calibrated to your bar.',
      PRICING_NOTES.investorNotes[2],
      'Warm intros to growth-stage engineering leaders hiring in the next two quarters.',
    ],
    M,
    68,
    CW
  );
  fl(doc, C.accent);
  doc.roundedRect(M, 112, 118, 12, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  tx(doc, C.text);
  doc.text(`${BRIEFING_META.contact}  ·  chaminext.netlify.app`, M + 59, 119.8, {
    align: 'center',
  });

  return doc;
}
