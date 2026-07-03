import type { PracticeProblem } from '../types/interview';
import skillTreeData from '../../content/fundamentals/skill-tree.json';
import { allPracticeProblems, getProblemsByTrack } from './loadQuestionBank';
import { loadFieldProblems } from '../utils/fieldReportStorage';
import { loadSessions } from '../utils/interviewStorage';

export type SkillTreeTrackId =
  | 'software'
  | 'ai-engineer'
  | 'quant'
  | 'cybersecurity'
  | 'market-engineering';

export interface LeafProgress {
  /** Problem ids on this leaf with at least one scored session. */
  practicedIds: Set<string>;
  practicedCount: number;
  totalCount: number;
  /** Best overall score across the leaf's practiced problems, if any. */
  bestScore?: number;
}

export interface SkillTreeLeaf {
  id: string;
  label: string;
  fundamentals: string[];
  domains: string[];
  problems: PracticeProblem[];
  fieldProblems: PracticeProblem[];
  progress: LeafProgress;
}

export interface SkillTreeBranch {
  id: string;
  label: string;
  description?: string;
  leaves: SkillTreeLeaf[];
}

export interface SkillTreeView {
  id: SkillTreeTrackId;
  label: string;
  segments: string[];
  root: { id: string; label: string };
  branches: SkillTreeBranch[];
  totalProblems: number;
  /** Unique problems on this tree with at least one scored session. */
  practicedProblems: number;
  leafCount: number;
  uncoveredProblems: PracticeProblem[];
}

/** @deprecated flat list — use branches.leaves */
export interface SkillTreeNode extends SkillTreeLeaf {
  order: number;
}

type RawLeaf = {
  id: string;
  label: string;
  fundamentals: string[];
  domains: string[];
};

type RawBranch = {
  id: string;
  label: string;
  description?: string;
  leaves: RawLeaf[];
};

const tree = skillTreeData as {
  tracks: Record<
    SkillTreeTrackId,
    {
      label: string;
      segments: string[];
      root: { id: string; label: string };
      branches: RawBranch[];
    }
  >;
};

function problemsForLeaf(
  track: SkillTreeTrackId,
  domains: string[],
  bank: PracticeProblem[],
  field: PracticeProblem[]
): { bank: PracticeProblem[]; field: PracticeProblem[] } {
  const domainSet = new Set(domains);
  return {
    bank: bank.filter((p) => p.track === track && domainSet.has(p.domain)),
    field: field.filter((p) => p.track === track && domainSet.has(p.domain)),
  };
}

type ScoredMap = Map<string, number>;

/** problemId -> best overall score, from scored sessions in localStorage. */
function loadScoredProblems(): ScoredMap {
  const map: ScoredMap = new Map();
  loadSessions().forEach((s) => {
    if (!s.scores) return;
    const prev = map.get(s.problemId);
    if (prev === undefined || s.scores.overall > prev) {
      map.set(s.problemId, s.scores.overall);
    }
  });
  return map;
}

function hydrateLeaf(
  track: SkillTreeTrackId,
  raw: RawLeaf,
  bank: PracticeProblem[],
  field: PracticeProblem[],
  scored: ScoredMap
): SkillTreeLeaf {
  const { bank: bankHits, field: fieldHits } = problemsForLeaf(track, raw.domains, bank, field);
  const all = [...bankHits, ...fieldHits];
  const practicedIds = new Set(all.filter((p) => scored.has(p.id)).map((p) => p.id));
  const scores = [...practicedIds].map((id) => scored.get(id) as number);
  return {
    id: raw.id,
    label: raw.label,
    fundamentals: raw.fundamentals,
    domains: raw.domains,
    problems: bankHits,
    fieldProblems: fieldHits,
    progress: {
      practicedIds,
      practicedCount: practicedIds.size,
      totalCount: all.length,
      bestScore: scores.length ? Math.max(...scores) : undefined,
    },
  };
}

export function getSkillTree(track: SkillTreeTrackId): SkillTreeView {
  const meta = tree.tracks[track];
  const bank = getProblemsByTrack(track);
  const fieldAll = loadFieldProblems();
  const scored = loadScoredProblems();

  const branches: SkillTreeBranch[] = meta.branches.map((branch) => ({
    id: branch.id,
    label: branch.label,
    description: branch.description,
    leaves: branch.leaves.map((leaf) => hydrateLeaf(track, leaf, bank, fieldAll, scored)),
  }));

  const coveredIds = new Set<string>();
  branches.forEach((b) =>
    b.leaves.forEach((leaf) => {
      leaf.problems.forEach((p) => coveredIds.add(p.id));
      leaf.fieldProblems.forEach((p) => coveredIds.add(p.id));
    })
  );

  const leafCount = branches.reduce((n, b) => n + b.leaves.length, 0);
  const practicedProblems = bank.filter((p) => scored.has(p.id)).length;

  return {
    id: track,
    label: meta.label,
    segments: meta.segments,
    root: meta.root,
    branches,
    totalProblems: bank.length,
    practicedProblems,
    leafCount,
    uncoveredProblems: bank.filter((p) => !coveredIds.has(p.id)),
  };
}

export const skillTreeTrackIds: SkillTreeTrackId[] = [
  'software',
  'ai-engineer',
  'quant',
  'cybersecurity',
  'market-engineering',
];

export function getAllSkillTrees(): SkillTreeView[] {
  return skillTreeTrackIds.map(getSkillTree);
}

export function getOrphanBankProblems(): PracticeProblem[] {
  const inTree = new Set(
    skillTreeTrackIds.flatMap((t) => getProblemsByTrack(t).map((p) => p.id))
  );
  return allPracticeProblems.filter((p) => !inTree.has(p.id));
}

/** Flatten all leaves (for coverage script parity). */
export function getFlatLeaves(track: SkillTreeTrackId): SkillTreeLeaf[] {
  return getSkillTree(track).branches.flatMap((b) => b.leaves);
}
