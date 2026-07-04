import type { PracticeTrack } from '../types/interview';
import { getSkillTree, type SkillTreeTrackId } from './loadSkillTree';
import { getAllIntelQuestions } from './loadInterviewIntel';

export type DrillVerdict = 'strong' | 'partial' | 'miss';

export interface DrillQuestion {
  id: string;
  text: string;
  source: 'fundamental' | 'intel';
  /** Skill-tree leaf this came from, for review pointers. */
  leafId?: string;
  leafLabel?: string;
  /** The raw fundamental bullet — doubles as the self-review checklist. */
  reference?: string;
}

export interface DrillItemResult {
  question: DrillQuestion;
  answer: string;
  verdict?: DrillVerdict;
  ideal?: string;
  note?: string;
}

export interface DrillRun {
  id: string;
  track: PracticeTrack;
  startedAt: string;
  durationSec: number;
  items: DrillItemResult[];
  score: number;
  graded: boolean;
  summary?: string;
}

export const DRILL_QUESTION_COUNT = 8;
export const DRILL_SECONDS = 5 * 60;

const VERDICT_POINTS: Record<DrillVerdict, number> = { strong: 100, partial: 50, miss: 0 };

export function drillScore(items: DrillItemResult[]): number {
  const scored = items.filter((it) => it.verdict);
  if (scored.length === 0) return 0;
  return Math.round(
    scored.reduce((sum, it) => sum + VERDICT_POINTS[it.verdict as DrillVerdict], 0) / scored.length
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Turn a skill-tree fundamental bullet into a screen-style question. */
function questionFromFundamental(bullet: string): string {
  const trimmed = bullet.trim();
  if (trimmed.endsWith('?')) return trimmed;
  return `In a sentence or two, explain: ${trimmed}`;
}

/**
 * Build a drill set: skill-tree fundamentals plus real domain-knowledge
 * questions from the intel scrape (max 3, so fundamentals stay the spine).
 */
export function buildDrillQuestions(
  track: SkillTreeTrackId,
  count = DRILL_QUESTION_COUNT
): DrillQuestion[] {
  const tree = getSkillTree(track);
  const fundamentals: DrillQuestion[] = tree.branches.flatMap((branch) =>
    branch.leaves.flatMap((leaf) =>
      leaf.fundamentals.map((bullet, i) => ({
        id: `fund-${leaf.id}-${i}`,
        text: questionFromFundamental(bullet),
        source: 'fundamental' as const,
        leafId: leaf.id,
        leafLabel: leaf.label,
        reference: bullet,
      }))
    )
  );

  const intel: DrillQuestion[] = getAllIntelQuestions({ track, kind: 'domain-knowledge' }).map(
    (q) => ({
      id: `intel-${q.id}`,
      text: q.text,
      source: 'intel' as const,
    })
  );

  const intelPick = shuffle(intel).slice(0, Math.min(3, count));
  const fundamentalsPick = shuffle(fundamentals).slice(0, count - intelPick.length);
  return shuffle([...fundamentalsPick, ...intelPick]);
}
