import type { DrillRun } from '../data/rapidFireDrill';

const DRILL_RUNS_KEY = 'chaminext_drill_runs';

export function loadDrillRuns(): DrillRun[] {
  try {
    const raw = localStorage.getItem(DRILL_RUNS_KEY);
    return raw ? (JSON.parse(raw) as DrillRun[]) : [];
  } catch {
    return [];
  }
}

export function saveDrillRun(run: DrillRun): void {
  const runs = loadDrillRuns().filter((r) => r.id !== run.id);
  runs.unshift(run);
  localStorage.setItem(DRILL_RUNS_KEY, JSON.stringify(runs.slice(0, 30)));
}
