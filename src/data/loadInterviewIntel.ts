import type {
  CompanyIntel,
  IntelQuestion,
  IntelQuestionKind,
  InterviewIntelData,
  PracticeProblem,
  PracticeTrack,
} from '../types/interview';
import intelData from '../../content/interview-intel/intel.json';
import curatedIntel from '../../content/interview-intel/curated.json';
import { inferDomain } from '../utils/fieldReportStorage';

function mergeInterviewIntel(): InterviewIntelData {
  const scraped = intelData as InterviewIntelData;
  const curated = curatedIntel as Pick<InterviewIntelData, 'companies' | 'generalQuestions'>;
  return {
    ...scraped,
    companies: [...curated.companies, ...scraped.companies],
    generalQuestions: [...(curated.generalQuestions ?? []), ...scraped.generalQuestions],
  };
}

export const interviewIntel = mergeInterviewIntel();

export const intelQuestionKinds: IntelQuestionKind[] = [
  'coding',
  'system-design',
  'behavioral',
  'recruiter',
  'take-home',
  'domain-knowledge',
];

export const INTEL_KIND_LABELS: Record<IntelQuestionKind, string> = {
  coding: 'Coding',
  'system-design': 'System design',
  behavioral: 'Behavioral',
  recruiter: 'Recruiter screen',
  'take-home': 'Take-home',
  'domain-knowledge': 'Domain knowledge',
};

export const INTEL_STAGE_LABELS: Record<string, string> = {
  'recruiter-screen': 'Recruiter screen',
  'technical-screen': 'Technical screen',
  'take-home': 'Take-home',
  onsite: 'Onsite / final loop',
  'system-design': 'System design round',
  other: 'Other',
};

export function getIntelCompanies(): CompanyIntel[] {
  return interviewIntel.companies;
}

export interface IntelQuestionFilter {
  track?: PracticeTrack | 'all';
  kind?: IntelQuestionKind | 'all';
}

export function getAllIntelQuestions(filter: IntelQuestionFilter = {}): IntelQuestion[] {
  const all = [
    ...interviewIntel.companies.flatMap((c) => c.questions),
    ...interviewIntel.generalQuestions,
  ];
  return all.filter(
    (q) =>
      (!filter.track || filter.track === 'all' || q.track === filter.track) &&
      (!filter.kind || filter.kind === 'all' || q.kind === filter.kind)
  );
}

export function getIntelStats() {
  const questions = getAllIntelQuestions();
  const behavioral = questions.filter((q) => q.kind === 'behavioral' || q.kind === 'recruiter').length;
  return {
    companies: interviewIntel.companies.length,
    questions: questions.length,
    behavioral,
    sources: interviewIntel.totalSourceDocs,
    generatedAt: interviewIntel.generatedAt,
  };
}

function domainForQuestion(q: IntelQuestion): PracticeProblem['domain'] {
  if (q.kind === 'behavioral') return 'behavioral';
  if (q.kind === 'recruiter') return 'recruiter';
  if (q.kind === 'system-design') {
    return q.track === 'ai-engineer' ? 'ai-system-design' : 'system-design';
  }
  return inferDomain(q.text);
}

const KIND_GUIDANCE: Record<IntelQuestionKind, string> = {
  coding:
    'Talk through your approach out loud before writing code, name your trade-offs, then implement.',
  'system-design':
    'Clarify requirements and scale first, then walk through your architecture and its failure modes.',
  behavioral:
    'Answer with a real story: the situation, your specific actions, the outcome, and what you learned. The interviewer will probe for specifics.',
  recruiter:
    'Answer as you would on a real recruiter call: concise, honest, and aligned with the role. The interviewer will follow up like a recruiter would.',
  'take-home':
    'Outline how you would scope and structure this take-home: what you would build first, what you would cut, and how you would present it.',
  'domain-knowledge':
    'Explain from first principles. The interviewer will push past surface-level answers.',
};

/** Convert a scraped intel question into a runnable practice problem. */
export function intelProblemFromQuestion(
  q: IntelQuestion,
  company?: string
): PracticeProblem {
  const origin = company ? `Asked in a real interview at ${company}` : 'Asked in a real interview';
  const stageLabel = INTEL_STAGE_LABELS[q.stage] ?? q.stage;
  const soft = q.kind === 'behavioral' || q.kind === 'recruiter';
  return {
    id: `intel-${q.id}`,
    title: q.text.length > 70 ? `${q.text.slice(0, 70)}…` : q.text,
    domain: domainForQuestion(q),
    track: q.track,
    difficulty: soft ? 'medium' : 'medium',
    estimatedMinutes: soft ? 10 : 20,
    prompt: `${origin} (${stageLabel.toLowerCase()}; sourced from ${q.sourceType}).\n\n"${q.text}"\n\n${KIND_GUIDANCE[q.kind]}`,
    hints: soft
      ? [
          'Pick one concrete story, not a summary of your career.',
          'Structure: situation, task, action, result — then the reflection.',
          'Quantify the outcome if you can; specifics are the signal.',
        ]
      : [
          'State your assumptions and clarifying questions before solving.',
          'Name the trade-off you are making and why.',
          'Explain how you would test or validate your answer.',
        ],
    starterCode: '',
    runLanguage: null,
    source: `interview-intel:${q.sourceType}`,
  };
}
