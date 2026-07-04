import type {
  IntelQuestion,
  InterviewScores,
  PracticeProblem,
  PracticeTrack,
} from '../types/interview';
import { getProblemsByTrack } from './loadQuestionBank';
import { getAllIntelQuestions, intelProblemFromQuestion } from './loadInterviewIntel';
import { loadSessions } from '../utils/interviewStorage';

export type LoopStageId = 'recruiter-screen' | 'technical-screen' | 'behavioral';

export interface LoopStageDef {
  id: LoopStageId;
  label: string;
  description: string;
  minutes: number;
}

export const LOOP_STAGES: LoopStageDef[] = [
  {
    id: 'recruiter-screen',
    label: 'Recruiter screen',
    description: 'Fit, motivation, and logistics with a recruiter persona.',
    minutes: 10,
  },
  {
    id: 'technical-screen',
    label: 'Technical screen',
    description: 'One problem from your track, reasoning out loud.',
    minutes: 20,
  },
  {
    id: 'behavioral',
    label: 'Behavioral round',
    description: 'Real stories under STAR-style probing from a hiring manager.',
    minutes: 10,
  },
];

export interface LoopStageResult {
  stageId: LoopStageId;
  label: string;
  problemId: string;
  problemTitle: string;
  scores?: InterviewScores;
  scoreNotes?: string;
}

export interface LoopRun {
  id: string;
  track: PracticeTrack;
  startedAt: string;
  completedAt?: string;
  stages: LoopStageResult[];
  readiness?: number;
}

// Canned pools for when intel has no matching question. The recruiter and
// behavioral sets are drawn from the most common questions in the field data.
const RECRUITER_POOL = [
  'Walk me through your background and what you are looking for next.',
  'Why do you want to join this company, specifically?',
  'Why are you leaving your current role?',
  'What are your compensation expectations for this role?',
  'When could you start, and are there any constraints I should know about?',
  'What kind of team and working style brings out your best work?',
];

const BEHAVIORAL_POOL = [
  'Tell me about a time you disagreed with a technical decision. What did you do?',
  'Describe a project that failed or slipped badly. What was your part in it?',
  'Tell me about a time you had to deliver under a tight deadline. What did you cut?',
  'Describe a conflict you had with a teammate and how it was resolved.',
  'Tell me about the piece of work you are proudest of. Why that one?',
  'Tell me about a time you received hard feedback. What changed afterward?',
  'Describe a time you had to make a call with incomplete information.',
];

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function softProblem(
  kind: 'recruiter' | 'behavioral',
  text: string,
  track: PracticeTrack
): PracticeProblem {
  const recruiter = kind === 'recruiter';
  return {
    id: `loop-${kind}-${uid()}`,
    title: text.length > 70 ? `${text.slice(0, 70)}…` : text,
    domain: kind,
    track,
    difficulty: 'medium',
    estimatedMinutes: 10,
    prompt: recruiter
      ? `You are on a recruiter screening call.\n\n"${text}"\n\nAnswer as you would on the real call: concise, honest, and aligned with the role. The recruiter will follow up.`
      : `You are in a behavioral interview.\n\n"${text}"\n\nAnswer with a real story: the situation, your specific actions, the outcome, and what you learned. The interviewer will probe for specifics.`,
    hints: recruiter
      ? [
          'Keep the background walk-through under two minutes; lead with relevance to this role.',
          'Give a researched, honest answer on motivation, not flattery.',
          'For compensation: give a range you can defend, then stop talking.',
        ]
      : [
          'Pick one concrete story, not a summary of your career.',
          'Structure: situation, task, action, result — then the reflection.',
          'Quantify the outcome if you can; specifics are the signal.',
        ],
    starterCode: '',
    runLanguage: null,
    source: 'interview-loop',
  };
}

/** Pick the problem for a loop stage, preferring scraped intel and unpracticed bank problems. */
export function problemForStage(stageId: LoopStageId, track: PracticeTrack): PracticeProblem {
  if (stageId === 'technical-screen') {
    const bank = getProblemsByTrack(track);
    const practiced = new Set(
      loadSessions()
        .filter((s) => s.scores)
        .map((s) => s.problemId)
    );
    const preferred = bank.filter((p) => !practiced.has(p.id) && p.difficulty === 'medium');
    const fallback = bank.filter((p) => !practiced.has(p.id));
    const pool = preferred.length ? preferred : fallback.length ? fallback : bank;
    return pick(pool);
  }

  const kind = stageId === 'recruiter-screen' ? 'recruiter' : 'behavioral';
  // Recruiter and behavioral intel questions apply across tracks.
  const intel = getAllIntelQuestions({ kind });
  if (intel.length > 0 && Math.random() < 0.5) {
    // Mix field-sourced and canned so repeat runs stay fresh.
    const q: IntelQuestion = pick(intel);
    const p = intelProblemFromQuestion(q);
    return { ...p, id: `loop-${kind}-${uid()}`, track };
  }
  return softProblem(kind, pick(kind === 'recruiter' ? RECRUITER_POOL : BEHAVIORAL_POOL), track);
}

export function computeReadiness(stages: LoopStageResult[]): number {
  const scored = stages.filter((s) => s.scores);
  if (scored.length === 0) return 0;
  return Math.round(
    scored.reduce((sum, s) => sum + (s.scores?.overall ?? 0), 0) / scored.length
  );
}

export function weakestStage(stages: LoopStageResult[]): LoopStageResult | undefined {
  const scored = stages.filter((s) => s.scores);
  if (scored.length === 0) return undefined;
  return scored.reduce((min, s) =>
    (s.scores?.overall ?? 100) < (min.scores?.overall ?? 100) ? s : min
  );
}
