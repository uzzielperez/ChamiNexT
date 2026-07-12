import type { AuthUser } from '../types/coach';

const SESSION_KEY = 'chaminext_auth_token';
const USER_KEY = 'chaminext_auth_user';

export function loadSessionToken(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AuthUser): void {
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(loadSessionToken() && loadAuthUser());
}

export async function requestMagicLink(email: string): Promise<{
  ok: boolean;
  demoMode?: boolean;
  verifyUrl?: string;
  message?: string;
}> {
  const res = await fetch('/.netlify/functions/auth-magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, redirectOrigin: window.location.origin }),
  });
  return res.json();
}

export async function verifyMagicToken(token: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch('/.netlify/functions/auth-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Verification failed');
  saveSession(data.token, data.user);
  return data;
}

export function authHeaders(): Record<string, string> {
  const token = loadSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
