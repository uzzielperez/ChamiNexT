import type { CompanyLoopProgress, CompanyLoopStageId } from '../types/companyLoop';

const KEY = 'chaminext_company_loop_progress';

export function loadAllLoopProgress(): Record<string, CompanyLoopProgress> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function loadLoopProgress(loopId: string): CompanyLoopProgress {
  const all = loadAllLoopProgress();
  return all[loopId] ?? {
    loopId,
    completedStages: [],
    updatedAt: new Date().toISOString(),
  };
}

export function saveLoopProgress(progress: CompanyLoopProgress): void {
  const all = loadAllLoopProgress();
  all[progress.loopId] = { ...progress, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function markStageComplete(loopId: string, stageId: CompanyLoopStageId): CompanyLoopProgress {
  const current = loadLoopProgress(loopId);
  const completed = current.completedStages.includes(stageId)
    ? current.completedStages
    : [...current.completedStages, stageId];
  const next = { ...current, completedStages: completed };
  saveLoopProgress(next);
  return next;
}

export function loopProgressPercent(completed: CompanyLoopStageId[], total = 4): number {
  return Math.round((completed.length / total) * 100);
}

export function nextStageId(
  stages: CompanyLoopStageId[],
  completed: CompanyLoopStageId[]
): CompanyLoopStageId | null {
  for (const id of stages) {
    if (!completed.includes(id)) return id;
  }
  return null;
}
