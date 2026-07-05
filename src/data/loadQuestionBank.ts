import type { PracticeProblem, PracticeTrack } from '../types/interview';
import softwareBank from '../../content/question-bank/software.json';
import aiBank from '../../content/question-bank/ai-engineer.json';
import quantBank from '../../content/question-bank/quant.json';
import cyberBank from '../../content/question-bank/cybersecurity.json';
import marketBank from '../../content/question-bank/market-engineering.json';
import scienceBank from '../../content/question-bank/ai-for-science.json';

const software = softwareBank as PracticeProblem[];
const aiEngineer = aiBank as PracticeProblem[];
const quant = quantBank as PracticeProblem[];
const cybersecurity = cyberBank as PracticeProblem[];
const marketEngineering = marketBank as PracticeProblem[];
const aiForScience = scienceBank as PracticeProblem[];

export const allPracticeProblems: PracticeProblem[] = [
  ...software,
  ...aiEngineer,
  ...quant,
  ...cybersecurity,
  ...marketEngineering,
  ...aiForScience,
];

export function getProblemsByTrack(track: PracticeTrack | 'all'): PracticeProblem[] {
  if (track === 'all') return allPracticeProblems;
  return allPracticeProblems.filter((p) => p.track === track);
}

export function getDailyProblem(dateKey?: string): PracticeProblem {
  const dailyPool = allPracticeProblems.filter((p) => p.estimatedMinutes <= 15);
  const key = dateKey ?? new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return dailyPool[hash % dailyPool.length] ?? allPracticeProblems[0];
}

export const getProblemById = (id: string) =>
  allPracticeProblems.find((p) => p.id === id);
