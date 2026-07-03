import type {
  FieldReportInsights,
  FieldSourcedProblem,
  InterviewOutcome,
  InterviewReport,
  ProblemDomain,
} from '../types/interview';

const REPORTS_KEY = 'chaminext_interview_reports';
const FIELD_PROBLEMS_KEY = 'chaminext_field_problems';

export function loadReports(): InterviewReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? (JSON.parse(raw) as InterviewReport[]) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: InterviewReport): void {
  const reports = loadReports().filter((r) => r.id !== report.id);
  reports.unshift(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(0, 200)));
}

export function loadFieldProblems(): FieldSourcedProblem[] {
  try {
    const raw = localStorage.getItem(FIELD_PROBLEMS_KEY);
    return raw ? (JSON.parse(raw) as FieldSourcedProblem[]) : [];
  } catch {
    return [];
  }
}

export function addFieldProblems(problems: FieldSourcedProblem[]): void {
  const existing = loadFieldProblems();
  const merged = [...problems, ...existing];
  localStorage.setItem(FIELD_PROBLEMS_KEY, JSON.stringify(merged.slice(0, 300)));
}

// Lightweight keyword heuristic to tag a free-text question with a domain.
// Used by the local fallback generator so the loop works without an API key.
const DOMAIN_KEYWORDS: { domain: ProblemDomain; words: string[] }[] = [
  { domain: 'system-design', words: ['design', 'scale', 'architecture', 'throughput', 'distributed', 'load'] },
  { domain: 'ai-system-design', words: ['llm', 'inference', 'serving', 'gpu', 'latency', 'rag pipeline'] },
  { domain: 'rag', words: ['rag', 'retrieval', 'embedding', 'vector', 'chunk'] },
  { domain: 'agents', words: ['agent', 'tool use', 'orchestrat', 'planner'] },
  { domain: 'prompting', words: ['prompt', 'few-shot', 'system message'] },
  { domain: 'evals', words: ['eval', 'benchmark', 'ground truth', 'metric'] },
  { domain: 'safety', words: ['safety', 'alignment', 'jailbreak', 'guardrail'] },
  { domain: 'experimentation', words: ['a/b', 'experiment', 'incrementality', 'hypothesis'] },
  { domain: 'funnel-analytics', words: ['funnel', 'conversion', 'cohort', 'retention'] },
  { domain: 'attribution', words: ['attribution', 'multi-touch', 'mmm'] },
  { domain: 'trees', words: ['tree', 'binary', 'bst', 'graph', 'traversal'] },
  { domain: 'strings', words: ['string', 'substring', 'palindrome', 'anagram'] },
  { domain: 'arrays', words: ['array', 'subarray', 'two pointer', 'sliding window', 'sort'] },
  { domain: 'debugging', words: ['debug', 'bug', 'fix', 'why is this', 'broken'] },
];

export function inferDomain(question: string): ProblemDomain {
  const q = question.toLowerCase();
  for (const { domain, words } of DOMAIN_KEYWORDS) {
    if (words.some((w) => q.includes(w))) return domain;
  }
  return 'arrays';
}

export function buildSignalsExport(): {
  exportedAt: string;
  reports: InterviewReport[];
  fieldProblems: FieldSourcedProblem[];
  insights: FieldReportInsights;
} {
  return {
    exportedAt: new Date().toISOString(),
    reports: loadReports(),
    fieldProblems: loadFieldProblems(),
    insights: deriveInsights(),
  };
}

export function downloadSignalsExport(): void {
  const blob = new Blob([JSON.stringify(buildSignalsExport(), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function deriveInsights(): FieldReportInsights {
  const reports = loadReports();
  const problems = loadFieldProblems();

  const domainCounts: Record<string, number> = {};
  problems.forEach((p) => {
    domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
  });
  const domainFrequency = (Object.keys(domainCounts) as ProblemDomain[])
    .map((domain) => ({ domain, count: domainCounts[domain] }))
    .sort((a, b) => b.count - a.count);

  const outcomes: Record<InterviewOutcome, number> = {
    pending: 0,
    'passed-round': 0,
    rejected: 0,
    offer: 0,
    unknown: 0,
  };
  reports.forEach((r) => {
    outcomes[r.outcome] = (outcomes[r.outcome] || 0) + 1;
  });

  const weakAreas = reports
    .map((r) => r.whatStruggled?.trim())
    .filter((s): s is string => Boolean(s))
    .slice(0, 5);

  const companies = Array.from(new Set(reports.map((r) => r.company.trim()).filter(Boolean)));

  return {
    totalReports: reports.length,
    totalQuestions: reports.reduce((sum, r) => sum + r.questionsAsked.length, 0),
    problemsGenerated: problems.length,
    companies,
    domainFrequency,
    weakAreas,
    outcomes,
  };
}
