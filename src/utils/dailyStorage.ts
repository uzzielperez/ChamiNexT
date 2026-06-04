const DAILY_KEY = 'chaminext_daily';

export interface DailySteps {
  warm: boolean;
  problem: boolean;
  ship: boolean;
}

export interface DailyState {
  dateKey: string;
  steps: DailySteps;
  streak: number;
  lastCompletedDate: string | null;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): DailyState {
  return {
    dateKey: todayKey(),
    steps: { warm: false, problem: false, ship: false },
    streak: 0,
    lastCompletedDate: null,
  };
}

export function loadDailyState(): DailyState {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as DailyState;
    if (parsed.dateKey !== todayKey()) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      const streakContinues = parsed.lastCompletedDate === yKey;
      return {
        dateKey: todayKey(),
        steps: { warm: false, problem: false, ship: false },
        streak: streakContinues ? parsed.streak : parsed.lastCompletedDate === todayKey() ? parsed.streak : 0,
        lastCompletedDate: parsed.lastCompletedDate,
      };
    }
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveDailyState(state: DailyState): void {
  localStorage.setItem(DAILY_KEY, JSON.stringify(state));
}

export function completeDailyStep(step: keyof DailySteps): DailyState {
  const state = loadDailyState();
  state.steps[step] = true;
  const allDone = state.steps.warm && state.steps.problem && state.steps.ship;
  const today = todayKey();
  if (allDone && state.lastCompletedDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    state.streak = state.lastCompletedDate === yKey ? state.streak + 1 : 1;
    state.lastCompletedDate = today;
  }
  saveDailyState(state);
  return state;
}

export function dailyProgressPercent(steps: DailySteps): number {
  const done = [steps.warm, steps.problem, steps.ship].filter(Boolean).length;
  return Math.round((done / 3) * 100);
}
