import type { CandidateApplication, EmployerRole } from '../types/employer';

const ROLES_KEY = 'chaminext_employer_roles';
const APPS_KEY = 'chaminext_candidate_applications';

export function loadRoles(): EmployerRole[] {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRoles(roles: EmployerRole[]): void {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function addRole(role: Omit<EmployerRole, 'id' | 'createdAt'>): EmployerRole {
  const newRole: EmployerRole = {
    ...role,
    id: `role-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveRoles([newRole, ...loadRoles()]);
  return newRole;
}

export function loadApplications(): CandidateApplication[] {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplications(apps: CandidateApplication[]): void {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function addApplication(app: Omit<CandidateApplication, 'id' | 'appliedAt'>): CandidateApplication {
  const entry: CandidateApplication = {
    ...app,
    id: `app-${Date.now()}`,
    appliedAt: new Date().toISOString(),
  };
  saveApplications([entry, ...loadApplications()]);
  return entry;
}

export function updateApplicationStatus(id: string, status: CandidateApplication['status']): void {
  saveApplications(
    loadApplications().map((a) => (a.id === id ? { ...a, status } : a))
  );
}
