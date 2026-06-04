export { shipTestChallenges, getShipChallengeById } from './loadShipTests';

/** @deprecated use getShipDurationMs from demoMode */
export const formatDurationMs: Record<string, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '72h': 72 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};
