import type { StudioSubmission } from '../types/studioSubmission';

const KEY = 'chaminext_studio_submissions';

export function loadSubmissions(): StudioSubmission[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(list: StudioSubmission[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function saveSubmission(submission: StudioSubmission): void {
  saveSubmissions([submission, ...loadSubmissions().filter((s) => s.id !== submission.id)]);
}

export function getSubmission(id: string): StudioSubmission | undefined {
  return loadSubmissions().find((s) => s.id === id);
}

export function getLatestSubmissionForRole(roleId: string): StudioSubmission | undefined {
  return loadSubmissions().find((s) => s.roleId === roleId);
}
