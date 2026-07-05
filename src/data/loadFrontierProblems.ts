import type { FrontierProblemTest, MissionArea } from '../types/interview';
import testsData from '../../content/frontier-problems/tests.json';

export const frontierTests = testsData as {
  version: number;
  tests: FrontierProblemTest[];
};

export const MISSION_LABELS: Record<MissionArea, string> = {
  climate: 'Climate',
  health: 'Health & drug discovery',
  poverty: 'Poverty & impact',
  science: 'Frontier science',
  ethics: 'Ethics & safety',
};

export function getFrontierTests(filter?: { mission?: MissionArea | 'all' }): FrontierProblemTest[] {
  const m = filter?.mission;
  if (!m || m === 'all') return frontierTests.tests;
  return frontierTests.tests.filter((t) => t.mission === m);
}

export function getFrontierTestById(id: string): FrontierProblemTest | undefined {
  return frontierTests.tests.find((t) => t.id === id);
}
