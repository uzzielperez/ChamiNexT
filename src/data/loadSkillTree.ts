import type { PracticeProblem, PracticeTrack } from '../types/interview';
import skillTreeData from '../../content/fundamentals/skill-tree.json';
import { allPracticeProblems, getProblemsByTrack } from './loadQuestionBank';
import { loadFieldProblems } from '../utils/fieldReportStorage';

export type SkillTreeTrackId = 'software' | 'ai-engineer' | 'quant';

export interface SkillTreeNode {
  id: string;
  label: string;
  order: number;
  fundamentals: string[];
  domains: string[];
  problems: PracticeProblem[];
  fieldProblems: PracticeProblem[];
}

export interface SkillTreeView {
  id: SkillTreeTrackId;
  label: string;
  segments: string[];
  nodes: SkillTreeNode[];
  totalProblems: number;
  uncoveredProblems: PracticeProblem[];
}

const tree = skillTreeData as {
  tracks: Record<
    SkillTreeTrackId,
    { label: string; segments: string[]; nodes: Omit<SkillTreeNode, 'problems' | 'fieldProblems' | 'order'> & { order?: number }[] }
  >;
};

function problemsForNode(
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

export function getSkillTree(track: SkillTreeTrackId): SkillTreeView {
  const meta = tree.tracks[track];
  const bank = getProblemsByTrack(track);
  const fieldAll = loadFieldProblems();

  const nodes: SkillTreeNode[] = meta.nodes
    .map((node, index) => {
      const { bank: bankHits, field: fieldHits } = problemsForNode(
        track,
        node.domains,
        bank,
        fieldAll
      );
      return {
        id: node.id,
        label: node.label,
        order: node.order ?? index + 1,
        fundamentals: node.fundamentals,
        domains: node.domains,
        problems: bankHits,
        fieldProblems: fieldHits,
      };
    })
    .sort((a, b) => a.order - b.order);

  const coveredIds = new Set<string>();
  nodes.forEach((n) => {
    n.problems.forEach((p) => coveredIds.add(p.id));
    n.fieldProblems.forEach((p) => coveredIds.add(p.id));
  });

  const uncoveredProblems = bank.filter((p) => !coveredIds.has(p.id));

  return {
    id: track,
    label: meta.label,
    segments: meta.segments,
    nodes,
    totalProblems: bank.length,
    uncoveredProblems,
  };
}

export const skillTreeTrackIds: SkillTreeTrackId[] = ['software', 'ai-engineer', 'quant'];

export function getAllSkillTrees(): SkillTreeView[] {
  return skillTreeTrackIds.map(getSkillTree);
}

/** Problems in bank not assigned to any tree track (sanity check). */
export function getOrphanBankProblems(): PracticeProblem[] {
  const inTree = new Set(
    skillTreeTrackIds.flatMap((t) => getProblemsByTrack(t).map((p) => p.id))
  );
  return allPracticeProblems.filter((p) => !inTree.has(p.id));
}
