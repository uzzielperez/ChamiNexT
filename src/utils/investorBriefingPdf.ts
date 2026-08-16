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

const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LINE = 5.5;
const FOOTER_Y = 287;

type PdfState = { doc: jsPDF; y: number };

function ensureSpace(state: PdfState, need: number): void {
  if (state.y + need > FOOTER_Y - 8) {
    state.doc.addPage();
    state.y = MARGIN + 4;
  }
}

function footer(doc: jsPDF, pageNum: number): void {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`${BRIEFING_META.site} · ${BRIEFING_META.version}`, MARGIN, FOOTER_Y);
  doc.text(String(pageNum), PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
  doc.setTextColor(0, 0, 0);
}

function heading(state: PdfState, text: string, size = 13): void {
  ensureSpace(state, LINE * 2);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(size);
  const lines = state.doc.splitTextToSize(text, CONTENT_W);
  state.doc.text(lines, MARGIN, state.y);
  state.y += lines.length * (size * 0.45) + 3;
}

function subheading(state: PdfState, text: string): void {
  ensureSpace(state, LINE * 2);
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(10);
  const lines = state.doc.splitTextToSize(text, CONTENT_W);
  state.doc.text(lines, MARGIN, state.y);
  state.y += lines.length * LINE + 1;
}

function body(state: PdfState, text: string, indent = 0): void {
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(9.5);
  const lines = state.doc.splitTextToSize(text, CONTENT_W - indent);
  for (const line of lines) {
    ensureSpace(state, LINE);
    state.doc.text(line, MARGIN + indent, state.y);
    state.y += LINE;
  }
  state.y += 2;
}

function bullets(state: PdfState, items: readonly string[], indent = 4): void {
  for (const item of items) {
    state.doc.setFont('helvetica', 'normal');
    state.doc.setFontSize(9.5);
    const lines = state.doc.splitTextToSize(item, CONTENT_W - indent - 4);
    for (let i = 0; i < lines.length; i++) {
      ensureSpace(state, LINE);
      state.doc.text(`${i === 0 ? '• ' : '  '}${lines[i]}`, MARGIN + indent, state.y);
      state.y += LINE;
    }
  }
  state.y += 2;
}

function buildBriefingPdf(): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const state: PdfState = { doc, y: MARGIN };

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ChamiNexT', MARGIN, state.y);
  state.y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  body(state, BRIEFING_META.subtitle);
  body(state, `${BRIEFING_META.version} · ${BRIEFING_META.contact}`);

  heading(state, '1. Thinking process (the signal)');
  body(state, THINKING_PROCESS.headline);
  body(state, THINKING_PROCESS.thesis);
  body(state, THINKING_PROCESS.insight);
  subheading(state, 'Every session combines:');
  bullets(state, THINKING_PROCESS.sessionStack);
  subheading(state, 'Scored dimensions:');
  bullets(state, THINKING_PROCESS.dimensions);

  heading(state, '2. Moat — what is hard to replicate');
  body(state, MOAT.layer);
  body(state, MOAT.flywheel);
  subheading(state, 'Today:');
  bullets(state, MOAT.today);
  subheading(state, 'Tomorrow:');
  bullets(state, MOAT.tomorrow);
  body(state, MOAT.structural);

  heading(state, '3. Customizable hiring loop — candidates');
  body(state, HIREE_LOOP.intro);
  subheading(state, 'Stages → practice surfaces');
  for (const s of HIREE_LOOP.stages) {
    ensureSpace(state, LINE * 3);
    subheading(state, s.stage);
    body(state, s.practice, 2);
    body(state, s.route, 2);
  }
  subheading(state, 'Tracks');
  body(state, HIREE_LOOP.tracks.join(' · '));
  subheading(state, 'Customization');
  bullets(state, HIREE_LOOP.customization);

  heading(state, '4. Customizable hiring loop — employers');
  body(state, HIRER_LOOP.intro);
  for (const s of HIRER_LOOP.stages) {
    ensureSpace(state, LINE * 3);
    subheading(state, `${s.stage} (${s.status})`);
    body(state, s.studio, 2);
  }
  subheading(state, 'Interview Studio');
  bullets(state, HIRER_LOOP.studioFeatures);
  body(state, HIRER_LOOP.designPartnerAsk);

  heading(state, '5. Competitive landscape (one-liners)');
  bullets(state, [
    `LeetCode — ${COMPETITIVE_ONE_LINERS.leetcode}`,
    `HackerRank — ${COMPETITIVE_ONE_LINERS.hackerrank}`,
    `getcracked — ${COMPETITIVE_ONE_LINERS.getcracked}`,
    `AIcrowd — ${COMPETITIVE_ONE_LINERS.aicrowd}`,
    `ChamiNexT — ${COMPETITIVE_ONE_LINERS.chaminext}`,
  ]);

  heading(state, '6. Pricing');
  body(
    state,
    `${PRICING_NOTES.founding.label} — code ${PRICING_NOTES.founding.code} (${PRICING_NOTES.founding.percentOff}% off, first ${PRICING_NOTES.founding.maxRedemptions} payers).`
  );
  body(state, PRICING_NOTES.trial);

  subheading(state, 'Individuals (job seekers)');
  for (const tier of PRICING_NOTES.individuals) {
    ensureSpace(state, LINE * 4);
    const priceLine = tier.foundingPrice
      ? `${tier.name}: ${tier.foundingPrice} (list ${tier.price}) — ${tier.detail}`
      : `${tier.name}: ${tier.price} — ${tier.detail}`;
    body(state, priceLine);
    bullets(state, tier.includes, 6);
  }

  subheading(state, 'Companies (Interview Studio)');
  for (const tier of PRICING_NOTES.companies) {
    ensureSpace(state, LINE * 4);
    const priceLine = tier.foundingPrice
      ? `${tier.name} (${tier.size}): ${tier.foundingPrice} founding / ${tier.price} list — ${tier.detail}`
      : `${tier.name} (${tier.size}): ${tier.price} — ${tier.detail}`;
    body(state, priceLine);
    bullets(state, tier.includes, 6);
  }

  subheading(state, 'Investor / partner notes');
  bullets(state, PRICING_NOTES.investorNotes);

  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    footer(doc, p);
  }

  return doc;
}

export function downloadInvestorBriefingPdf(): void {
  buildBriefingPdf().save('ChamiNexT-investor-briefing.pdf');
}

export function getInvestorBriefingPdfBlob(): Blob {
  return buildBriefingPdf().output('blob');
}
