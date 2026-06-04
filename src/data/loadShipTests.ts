import type { ShipTestChallenge } from '../types/interview';
import challenges from '../../content/ship-tests/challenges.json';

export const shipTestChallenges = challenges as ShipTestChallenge[];

export const getShipChallengeById = (id: string) =>
  shipTestChallenges.find((c) => c.id === id);
