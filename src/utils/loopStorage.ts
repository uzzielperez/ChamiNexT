import type { LoopRun } from '../data/interviewLoop';

const LOOP_RUNS_KEY = 'chaminext_loop_runs';

export function loadLoopRuns(): LoopRun[] {
  try {
    const raw = localStorage.getItem(LOOP_RUNS_KEY);
    return raw ? (JSON.parse(raw) as LoopRun[]) : [];
  } catch {
    return [];
  }
}

export function saveLoopRun(run: LoopRun): void {
  const runs = loadLoopRuns().filter((r) => r.id !== run.id);
  runs.unshift(run);
  localStorage.setItem(LOOP_RUNS_KEY, JSON.stringify(runs.slice(0, 30)));
}
