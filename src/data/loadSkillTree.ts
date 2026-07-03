import type { PracticeProblem } from '../types/interview';
import skillTreeData from '../../content/fundamentals/skill-tree.json';
import { allPracticeProblems, getProblemsByTrack } from './loadQuestionBank';
import { loadFieldProblems } from '../utils/fieldReportStorage';

export type SkillTreeTrackId = 'software' | 'ai-engineer' | 'quant';

export interface SkillTreeLeaf {
  id: string;
  label: string;
  fundamentals: string[];
  domains: string[];
  problems: PracticeProblem[];
  fieldProblems: PracticeProblem[];
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

function hydrateLeaf(track: SkillTreeTrackId, raw: RawLeaf, bank: PracticeProblem[], field: PracticeProblem[]): SkillTreeLeaf {
  const { bank: bankHits, field: fieldHits } = problemsForLeaf(track, raw.domains, bank, field);
  return {
    id: raw.id,
    label: raw.label,
    fundamentals: raw.fundamentals,
    domains: raw.domains,
    problems: bankHits,
    fieldProblems: fieldHits,
  };
}

export function getSkillTree(track: SkillTreeTrackId): SkillTreeView {
  const meta = tree.tracks[track];
  const bank = getProblemsByTrack(track);
  const fieldAll = loadFieldProblems();

  const branches: SkillTreeBranch[] = meta.branches.map((branch) => ({
    id: branch.id,
    label: branch.label,
    description: branch.description,
    leaves: branch.leaves.map((leaf) => hydrateLeaf(track, leaf, bank, fieldAll)),
  }));

  const coveredIds = new Set<string>();
  branches.forEach((b) =>
    b.leaves.forEach((leaf) => {
      leaf.problems.forEach((p) => coveredIds.add(p.id));
      leaf.fieldProblems.forEach((p) => coveredIds.add(p.id));
    })
  );

  const leafCount = branches.reduce((n, b) => n + b.leaves.length, 0);

  return {
    id: track,
    label: meta.label,
    segments: meta.segments,
    root: meta.root,
    branches,
    totalProblems: bank.length,
    leafCount,
    uncoveredProblems: bank.filter((p) => !coveredIds.has(p.id)),
  };
}

export const skillTreeTrackIds: SkillTreeTrackId[] = ['software', 'ai-engineer', 'quant'];

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
