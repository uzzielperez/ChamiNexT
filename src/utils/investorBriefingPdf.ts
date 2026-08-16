import { jsPDF } from 'jspdf';
import {
  BRIEFING_META,
  THINKING_PROCESS,
  MOAT,
  HIREE_LOOP,
  HIRER_LOOP,
  PRICING_NOTES,
  COMPETITIVE_ONE_LINERS,
} from '../data/investorBriefing';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE = 5.2;
const FOOTER_Y = 286;
const BODY_BOTTOM = FOOTER_Y - 10;

/** ChamiNexT design tokens (tailwind.config.js) */
const C = {
  bgDark: [10, 11, 13] as const,
  bgCard: [21, 23, 27] as const,
  accent: [59, 130, 246] as const,
  accentBright: [96, 165, 250] as const,
  textPrimary: [244, 245, 247] as const,
  textSecondary: [154, 161, 172] as const,
  paper: [255, 255, 255] as const,
  paperMuted: [245, 246, 248] as const,
  ink: [28, 31, 36] as const,
  inkMuted: [107, 114, 128] as const,
  border: [226, 232, 240] as const,
};

type PdfState = { doc: jsPDF; y: number; page: number };

function rgb(doc: jsPDF, color: readonly [number, number, number]): void {
  doc.setTextColor(color[0], color[1], color[2]);
}

function fill(doc: jsPDF, color: readonly [number, number, number]): void {
  doc.setFillColor(color[0], color[1], color[2]);
}

function stroke(doc: jsPDF, color: readonly [number, number, number]): void {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function ensureSpace(state: PdfState, need: number): void {
  if (state.y + need <= BODY_BOTTOM) return;
  addContentPage(state);
}

function addContentPage(state: PdfState): void {
  state.doc.addPage();
  state.page += 1;
  paintContentPageChrome(state);
  state.y = 34;
}

function paintContentPageChrome(state: PdfState): void {
  const doc = state.doc;
  fill(doc, C.paper);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  fill(doc, C.paperMuted);
  doc.rect(0, 0, PAGE_W, 22, 'F');
  stroke(doc, C.border);
  doc.setLineWidth(0.3);
  doc.line(0, 22, PAGE_W, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  rgb(doc, C.ink);
  doc.text('ChamiNexT', MARGIN, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  rgb(doc, C.inkMuted);
  doc.text('Investor & partner briefing', MARGIN + 28, 14);

  fill(doc, C.accent);
  doc.circle(PAGE_W - MARGIN, 11, 1.2, 'F');
}

function paintCover(state: PdfState): void {
  const doc = state.doc;
  fill(doc, C.bgDark);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  fill(doc, C.accent);
  doc.rect(0, 0, PAGE_W, 10, 'F');

  fill(doc, C.bgCard);
  doc.rect(MARGIN, 28, CONTENT_W, 52, 'F');
  stroke(doc, [40, 44, 52]);
  doc.setLineWidth(0.4);
  doc.rect(MARGIN, 28, CONTENT_W, 52, 'S');

  fill(doc, C.accent);
  doc.rect(MARGIN, 28, 4, 52, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  rgb(doc, C.textPrimary);
  doc.text('ChamiNexT', MARGIN + 10, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  rgb(doc, C.textSecondary);
  const subLines = doc.splitTextToSize(BRIEFING_META.subtitle, CONTENT_W - 20);
  doc.text(subLines, MARGIN + 10, 58);

  fill(doc, C.accent);
  doc.roundedRect(MARGIN + 10, 68, 52, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  rgb(doc, C.textPrimary);
  doc.text(BRIEFING_META.version, MARGIN + 14, 73);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  rgb(doc, C.accentBright);
  doc.text('Investor & partner briefing', MARGIN, 96);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  rgb(doc, C.textSecondary);
  const thesisLines = doc.splitTextToSize(THINKING_PROCESS.thesis, CONTENT_W);
  doc.text(thesisLines, MARGIN, 108);

  const highlights = [
    'Thinking process graded — not just final answers',
    'Two-sided eval: practice builds the trail · Interview Studio ranks on it',
    'Configurable hiring loops for candidates and employers',
  ];
  let hy = 128;
  for (const item of highlights) {
    fill(doc, C.accent);
    doc.circle(MARGIN + 1.5, hy - 1.2, 1.2, 'F');
    const lines = doc.splitTextToSize(item, CONTENT_W - 8);
    doc.text(lines, MARGIN + 6, hy);
    hy += lines.length * LINE + 3;
  }

  stroke(doc, [40, 44, 52]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 36, PAGE_W - MARGIN, PAGE_H - 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  rgb(doc, C.textSecondary);
  doc.text(BRIEFING_META.contact, MARGIN, PAGE_H - 26);
  doc.text(BRIEFING_META.site, MARGIN, PAGE_H - 20);

  doc.setFont('helvetica', 'bold');
  rgb(doc, C.accentBright);
  doc.text('CONFIDENTIAL — FOR INVESTORS & DESIGN PARTNERS', MARGIN, PAGE_H - 12);
}

function sectionHeader(state: PdfState, num: number, title: string): void {
  ensureSpace(state, 18);
  const doc = state.doc;

  fill(doc, C.accent);
  doc.roundedRect(MARGIN, state.y - 4, CONTENT_W, 10, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  rgb(doc, C.textPrimary);
  doc.text(`${num}. ${title}`, MARGIN + 4, state.y + 2.5);

  state.y += 14;
}

function subheading(state: PdfState, text: string): void {
  ensureSpace(state, LINE * 2);
  const doc = state.doc;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  rgb(doc, C.ink);
  const lines = doc.splitTextToSize(text, CONTENT_W);
  doc.text(lines, MARGIN, state.y);
  state.y += lines.length * LINE + 1;
}

function body(state: PdfState, text: string, indent = 0): void {
  const doc = state.doc;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  rgb(doc, C.inkMuted);
  const lines = doc.splitTextToSize(text, CONTENT_W - indent);
  for (const line of lines) {
    ensureSpace(state, LINE);
    doc.text(line, MARGIN + indent, state.y);
    state.y += LINE;
  }
  state.y += 2;
}

function callout(state: PdfState, text: string): void {
  const doc = state.doc;
  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  const lines = doc.splitTextToSize(text, CONTENT_W - 12);
  const boxH = lines.length * 4.8 + 8;
  ensureSpace(state, boxH + 4);

  fill(doc, C.paperMuted);
  stroke(doc, C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, state.y - 2, CONTENT_W, boxH, 2, 2, 'FD');

  rgb(doc, C.ink);
  let cy = state.y + 4;
  for (const line of lines) {
    doc.text(line, MARGIN + 6, cy);
    cy += 4.8;
  }
  state.y += boxH + 4;
}

function bullets(state: PdfState, items: readonly string[], indent = 0): void {
  const doc = state.doc;
  for (const item of items) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    rgb(doc, C.inkMuted);
    const lines = doc.splitTextToSize(item, CONTENT_W - indent - 8);
    for (let i = 0; i < lines.length; i++) {
      ensureSpace(state, LINE);
      if (i === 0) {
        fill(doc, C.accent);
        doc.circle(MARGIN + indent + 1.5, state.y - 1.2, 1.1, 'F');
      }
      doc.text(lines[i], MARGIN + indent + 6, state.y);
      state.y += LINE;
    }
  }
  state.y += 2;
}

function twoColTable(
  state: PdfState,
  rows: readonly { left: string; right: string }[],
  leftWidth = 42
): void {
  const doc = state.doc;
  const rightW = CONTENT_W - leftWidth - 4;

  for (const row of rows) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    rgb(doc, C.ink);
    const leftLines = doc.splitTextToSize(row.left, leftWidth);
    doc.setFont('helvetica', 'normal');
    rgb(doc, C.inkMuted);
    const rightLines = doc.splitTextToSize(row.right, rightW);
    const rowH = Math.max(leftLines.length, rightLines.length) * LINE + 4;

    ensureSpace(state, rowH + 2);
    fill(doc, C.paperMuted);
    doc.rect(MARGIN, state.y - 3, CONTENT_W, rowH, 'F');
    stroke(doc, C.border);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, state.y - 3 + rowH, MARGIN + CONTENT_W, state.y - 3 + rowH);

    doc.setFont('helvetica', 'bold');
    rgb(doc, C.ink);
    let ly = state.y;
    for (const line of leftLines) {
      doc.text(line, MARGIN + 3, ly);
      ly += LINE;
    }

    doc.setFont('helvetica', 'normal');
    rgb(doc, C.inkMuted);
    let ry = state.y;
    for (const line of rightLines) {
      doc.text(line, MARGIN + leftWidth + 4, ry);
      ry += LINE;
    }

    state.y += rowH + 1;
  }
  state.y += 3;
}

function pricingCard(
  state: PdfState,
  title: string,
  priceLine: string,
  includes: readonly string[]
): void {
  const doc = state.doc;
  const estLines = includes.length * 2 + 4;
  ensureSpace(state, estLines * LINE + 12);

  fill(doc, C.paper);
  stroke(doc, C.border);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN, state.y - 2, CONTENT_W, estLines * LINE + 10, 2.5, 2.5, 'FD');

  fill(doc, C.accent);
  doc.rect(MARGIN, state.y - 2, 3, estLines * LINE + 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  rgb(doc, C.ink);
  doc.text(title, MARGIN + 6, state.y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  rgb(doc, C.accent);
  doc.text(priceLine, MARGIN + 6, state.y + 10);

  state.y += 14;
  bullets(state, includes, 4);
  state.y += 4;
}

function footerAll(doc: jsPDF): void {
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    if (p === 1) continue;

    stroke(doc, C.border);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, FOOTER_Y - 5, PAGE_W - MARGIN, FOOTER_Y - 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    rgb(doc, C.inkMuted);
    doc.text(`${BRIEFING_META.site} · ${BRIEFING_META.version}`, MARGIN, FOOTER_Y);
    doc.text(String(p), PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
  }
}

export function buildBriefingPdf(): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const state: PdfState = { doc, y: MARGIN, page: 1 };

  paintCover(state);
  addContentPage(state);

  sectionHeader(state, 1, 'Thinking process (the signal)');
  body(state, THINKING_PROCESS.headline);
  body(state, THINKING_PROCESS.thesis);
  body(state, THINKING_PROCESS.insight);
  subheading(state, 'Every session combines');
  bullets(state, THINKING_PROCESS.sessionStack);
  subheading(state, 'Scored dimensions');
  bullets(state, THINKING_PROCESS.dimensions);

  sectionHeader(state, 2, 'Moat — what is hard to replicate');
  body(state, MOAT.layer);
  subheading(state, 'Flywheel');
  callout(state, MOAT.flywheel);
  subheading(state, 'Today');
  bullets(state, MOAT.today);
  subheading(state, 'Tomorrow');
  bullets(state, MOAT.tomorrow);
  body(state, MOAT.structural);

  sectionHeader(state, 3, 'Hiring loop — candidates');
  body(state, HIREE_LOOP.intro);
  subheading(state, 'Stages → practice surfaces');
  twoColTable(
    state,
    HIREE_LOOP.stages.map((s) => ({
      left: s.stage,
      right: `${s.practice} · ${s.route}`,
    }))
  );
  subheading(state, 'Tracks');
  body(state, HIREE_LOOP.tracks.join(' · '));
  subheading(state, 'Customization');
  bullets(state, HIREE_LOOP.customization);

  sectionHeader(state, 4, 'Hiring loop — employers');
  body(state, HIRER_LOOP.intro);
  twoColTable(
    state,
    HIRER_LOOP.stages.map((s) => ({
      left: `${s.stage} (${s.status})`,
      right: s.studio,
    }))
  );
  subheading(state, 'Interview Studio');
  bullets(state, HIRER_LOOP.studioFeatures);
  body(state, HIRER_LOOP.designPartnerAsk);

  sectionHeader(state, 5, 'Competitive landscape');
  twoColTable(state, [
    { left: 'LeetCode', right: COMPETITIVE_ONE_LINERS.leetcode },
    { left: 'HackerRank', right: COMPETITIVE_ONE_LINERS.hackerrank },
    { left: 'getcracked', right: COMPETITIVE_ONE_LINERS.getcracked },
    { left: 'AIcrowd', right: COMPETITIVE_ONE_LINERS.aicrowd },
    { left: 'ChamiNexT', right: COMPETITIVE_ONE_LINERS.chaminext },
  ]);

  sectionHeader(state, 6, 'Pricing');
  body(
    state,
    `${PRICING_NOTES.founding.label} — code ${PRICING_NOTES.founding.code} (${PRICING_NOTES.founding.percentOff}% off, first ${PRICING_NOTES.founding.maxRedemptions} payers).`
  );
  body(state, PRICING_NOTES.trial);

  subheading(state, 'Individuals (job seekers)');
  for (const tier of PRICING_NOTES.individuals) {
    const priceLine = tier.foundingPrice
      ? `${tier.foundingPrice} founding (list ${tier.price}) — ${tier.detail}`
      : `${tier.price} — ${tier.detail}`;
    pricingCard(state, tier.name, priceLine, tier.includes);
  }

  subheading(state, 'Companies (Interview Studio)');
  for (const tier of PRICING_NOTES.companies) {
    const priceLine = tier.foundingPrice
      ? `${tier.foundingPrice} founding / ${tier.price} list — ${tier.detail}`
      : `${tier.price} — ${tier.detail}`;
    pricingCard(state, `${tier.name} (${tier.size})`, priceLine, tier.includes);
  }

  subheading(state, 'Investor / partner notes');
  bullets(state, PRICING_NOTES.investorNotes);

  footerAll(doc);
  return doc;
}

export function downloadInvestorBriefingPdf(): void {
  buildBriefingPdf().save('ChamiNexT-investor-briefing.pdf');
}

export function getInvestorBriefingPdfBlob(): Blob {
  return buildBriefingPdf().output('blob');
}
