import { authHeaders, isAuthenticated } from './authSession';

const SESSION_KEY = 'chaminext_studio_session';
const LOCAL_PREFIX = 'chaminext_workspace_';

export type PersistedWorkspace = {
  templateId: string;
  files: Record<string, string>;
  activePath: string;
  terminalLog?: string;
  updatedAt: string;
};

function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `sess-anon-${Date.now()}`;
  }
}

function localKey(templateId: string): string {
  return `${LOCAL_PREFIX}${templateId}`;
}

export function loadWorkspaceLocal(templateId: string): PersistedWorkspace | null {
  try {
    const raw = localStorage.getItem(localKey(templateId));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedWorkspace;
  } catch {
    return null;
  }
}

export function saveWorkspaceLocal(state: PersistedWorkspace): void {
  try {
    localStorage.setItem(localKey(state.templateId), JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export async function fetchWorkspaceRemote(templateId: string): Promise<PersistedWorkspace | null> {
  try {
    const sessionId = getOrCreateSessionId();
    const res = await fetch(
      `/.netlify/functions/studio-workspace?templateId=${encodeURIComponent(templateId)}`,
      {
        headers: {
          ...authHeaders(),
          'X-Studio-Session': sessionId,
        },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { workspace?: PersistedWorkspace | null };
    return data.workspace ?? null;
  } catch {
    return null;
  }
}

export async function saveWorkspaceRemote(state: PersistedWorkspace): Promise<boolean> {
  try {
    const sessionId = getOrCreateSessionId();
    const res = await fetch('/.netlify/functions/studio-workspace', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        'X-Studio-Session': sessionId,
      },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Load remote first (if authed or remote exists), else local. */
export async function loadWorkspace(templateId: string): Promise<PersistedWorkspace | null> {
  const remote = await fetchWorkspaceRemote(templateId);
  if (remote) {
    saveWorkspaceLocal(remote);
    return remote;
  }
  return loadWorkspaceLocal(templateId);
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleWorkspaceSave(state: PersistedWorkspace, delayMs = 1500): void {
  saveWorkspaceLocal(state);
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void saveWorkspaceRemote(state);
  }, delayMs);
}

export function workspaceSyncStatus(): 'cloud' | 'local' {
  return isAuthenticated() ? 'cloud' : 'local';
}
