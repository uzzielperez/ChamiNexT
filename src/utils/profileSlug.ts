const SLUG_KEY = 'chaminext_profile_slug';

export function getOrCreateProfileSlug(): string {
  try {
    const existing = localStorage.getItem(SLUG_KEY);
    if (existing) return existing;
  } catch {
    /* ignore */
  }
  const slug = `eng-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(SLUG_KEY, slug);
  return slug;
}

export function exportPublicProfile(slug: string): void {
  const payload = {
    slug,
    exportedAt: new Date().toISOString(),
    data: localStorage.getItem('chaminext_interview_sessions'),
    ship: localStorage.getItem('chaminext_ship_enrollment'),
    profile: localStorage.getItem('chaminext_talent_profile'),
  };
  localStorage.setItem(`chaminext_public_${slug}`, JSON.stringify(payload));
}

export function importPublicProfile(slug: string): boolean {
  try {
    const raw = localStorage.getItem(`chaminext_public_${slug}`);
    if (!raw) return false;
    const payload = JSON.parse(raw);
    if (payload.data) localStorage.setItem('chaminext_interview_sessions', payload.data);
    if (payload.ship) localStorage.setItem('chaminext_ship_enrollment', payload.ship);
    if (payload.profile) localStorage.setItem('chaminext_talent_profile', payload.profile);
    return true;
  } catch {
    return false;
  }
}

export function readPublicProfileSnapshot(slug: string) {
  try {
    const raw = localStorage.getItem(`chaminext_public_${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
