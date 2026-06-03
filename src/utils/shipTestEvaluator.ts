import type { ShipTestChallenge, ShipTestEnrollment } from '../types/interview';

export async function evaluateShipTest(
  challenge: ShipTestChallenge,
  enrollment: ShipTestEnrollment,
  deploymentUrl: string
): Promise<{ scores: ShipTestEnrollment['scores']; feedback: string }> {
  const res = await fetch('/.netlify/functions/ship-test-evaluator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge,
      deploymentUrl,
      events: enrollment.events,
      enrolledAt: enrollment.enrolledAt,
      endsAt: enrollment.endsAt,
    }),
  });
  const data = await res.json();
  return {
    scores: data.scores,
    feedback: data.feedback || data.scoreNotes || 'Evaluation complete.',
  };
}
