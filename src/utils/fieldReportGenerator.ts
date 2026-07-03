import type {
  FieldSourcedProblem,
  InterviewReport,
  PracticeProblem,
} from '../types/interview';
import { inferDomain } from './fieldReportStorage';

const ESTIMATES: PracticeProblem['estimatedMinutes'][] = [10, 15, 20];

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// Turn one reported question into a runnable practice problem.
function localProblemFromQuestion(
  report: InterviewReport,
  question: string,
  index: number
): FieldSourcedProblem {
  const domain = inferDomain(question);
  const estimatedMinutes = ESTIMATES[Math.min(index, ESTIMATES.length - 1)];
  return {
    id: uid('field'),
    title: `${report.company}: ${question.slice(0, 60)}${question.length > 60 ? '…' : ''}`,
    domain,
    track: report.track,
    difficulty: report.difficulty,
    estimatedMinutes,
    prompt: `Asked in a real ${report.stage.replace('-', ' ')} at ${report.company} for a ${report.role} role.\n\n"${question}"\n\nWalk the interviewer through your approach out loud first, name your trade-offs, then implement or sketch the solution. AI assistance is allowed if you can explain every decision.`,
    hints: [
      'State your assumptions and clarifying questions before solving.',
      'Name the trade-off you are making and why.',
      report.whatStruggled
        ? `A past candidate struggled here with: ${report.whatStruggled}`
        : 'Explain how you would test or validate your answer.',
    ],
    starterCode: '',
    runLanguage: null,
    source: 'field-report',
    originReportId: report.id,
    originCompany: report.company,
    createdAt: new Date().toISOString(),
  };
}

function localGenerate(report: InterviewReport): FieldSourcedProblem[] {
  return report.questionsAsked
    .map((q) => q.trim())
    .filter(Boolean)
    .map((q, i) => localProblemFromQuestion(report, q, i));
}

// Generates practice problems from a real interview report. Tries the AI
// backend (Groq via Netlify); falls back to a deterministic local transform so
// the self-improving loop works even without an API key or functions runtime.
export async function generateProblemsFromReport(
  report: InterviewReport
): Promise<{ problems: FieldSourcedProblem[]; usedAI: boolean }> {
  try {
    const res = await fetch('/.netlify/functions/field-report-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { problems?: Partial<FieldSourcedProblem>[] };
    if (!data.problems || data.problems.length === 0) throw new Error('empty');

    const problems: FieldSourcedProblem[] = data.problems.map((p, i) => ({
      ...localProblemFromQuestion(report, p.title || report.questionsAsked[i] || 'Question', i),
      ...p,
      id: uid('field'),
      originReportId: report.id,
      originCompany: report.company,
      createdAt: new Date().toISOString(),
      source: 'field-report',
    })) as FieldSourcedProblem[];

    return { problems, usedAI: true };
  } catch {
    return { problems: localGenerate(report), usedAI: false };
  }
}
