const DEMO_KEY = 'chaminext_demo_mode';

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === '1';
}

export function setDemoMode(on: boolean): void {
  localStorage.setItem(DEMO_KEY, on ? '1' : '0');
}

/** Shorter timers for live presentations */
export function getShipDurationMs(format: string): number {
  if (!isDemoMode()) {
    const map: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '72h': 72 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    return map[format] ?? map['24h'];
  }
  const demoMap: Record<string, number> = {
    '24h': 30 * 60 * 1000,
    '72h': 45 * 60 * 1000,
    '7d': 60 * 60 * 1000,
  };
  return demoMap[format] ?? demoMap['24h'];
}

export function isShipFormatUnlocked(format: string): boolean {
  if (format === '24h') return true;
  return isDemoMode();
}
