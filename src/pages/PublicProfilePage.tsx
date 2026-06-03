import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import ScoreBreakdown from '../components/interview/ScoreBreakdown';
import ShipScoreBreakdown from '../components/ship-tests/ShipScoreBreakdown';
import { readPublicProfileSnapshot } from '../utils/profileSlug';
import { practiceProblems } from '../data/practiceProblems';
import { shipTestChallenges } from '../data/shipTests';

const PublicProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const snapshot = slug ? readPublicProfileSnapshot(slug) : null;

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Profile not found. Candidate must export from their Profile tab first.
      </div>
    );
  }

  const sessions = snapshot.data ? JSON.parse(snapshot.data) : [];
  const ship = snapshot.ship ? JSON.parse(snapshot.ship) : null;
  const profile = snapshot.profile ? JSON.parse(snapshot.profile) : { displayName: 'Engineer' };
  const scored = sessions.filter((s: { scores?: unknown }) => s.scores).slice(0, 3);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground opacity={0.4} speed={0.8} />
      <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
        <p className="text-sm text-accent-blue mb-2">ChamiNext Talent Profile</p>
        <h1 className="text-3xl font-bold mb-2">{profile.displayName}</h1>
        <p className="text-text-secondary mb-8">Hiring signal — thinking + shipping, not LeetCode greens.</p>

        {scored.map((s: { id: string; problemId: string; scores: import('../types/interview').InterviewScores; scoreNotes?: string }) => {
          const p = practiceProblems.find((x) => x.id === s.problemId);
          return (
            <div key={s.id} className="mb-6">
              <p className="font-medium mb-2">{p?.title ?? 'Interview'}</p>
              <ScoreBreakdown scores={s.scores} notes={s.scoreNotes} />
            </div>
          );
        })}

        {ship?.scores && (
          <div className="mb-8">
            <p className="font-medium mb-2">
              {shipTestChallenges.find((c) => c.id === ship.challengeId)?.title ?? 'Ship Test'}
            </p>
            <ShipScoreBreakdown scores={ship.scores} feedback={ship.feedback} />
            {ship.deploymentUrl && (
              <a href={ship.deploymentUrl} className="text-accent-blue text-sm mt-2 inline-block" target="_blank" rel="noreferrer">
                View shipped product →
              </a>
            )}
          </div>
        )}

        <PremiumButton variant="secondary" onClick={() => navigate('/employers')}>
          Back to Interview Studio
        </PremiumButton>
      </div>
    </div>
  );
};

export default PublicProfilePage;
