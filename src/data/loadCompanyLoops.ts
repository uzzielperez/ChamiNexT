import catalog from '../../content/interview-loops/catalog.json';
import type { CompanyInterviewLoop } from '../types/companyLoop';

const loops = (catalog as { loops: CompanyInterviewLoop[] }).loops;

export function getCompanyLoops(): CompanyInterviewLoop[] {
  return loops;
}

export function getCompanyLoop(id: string): CompanyInterviewLoop | undefined {
  return loops.find((l) => l.id === id);
}

export function formatSalaryRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
