import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { loadRoles, addApplication } from '../utils/employerStorage';
import { buildTalentProfile, loadShipEnrollment } from '../utils/interviewStorage';
import { getOrCreateProfileSlug, exportPublicProfile } from '../utils/profileSlug';
import { loadProfileName } from '../utils/interviewStorage';
import { shipTestChallenges } from '../data/shipTests';

const ApplyPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roleId = params.get('role');
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  const role = loadRoles().find((r) => r.id === roleId);

  useEffect(() => {
    if (!roleId || !role) setStatus('error');
  }, [roleId, role]);

  const apply = () => {
    if (!role) return;
    const slug = getOrCreateProfileSlug();
    exportPublicProfile(slug);
    const profile = buildTalentProfile(loadProfileName());
    const ship = loadShipEnrollment();
    const challenge = shipTestChallenges.find((c) => c.id === ship?.challengeId);

    addApplication({
      roleId: role.id,
      displayName: profile.displayName,
      profileSlug: slug,
      thinking: profile.thinkingScoreAvg || 70,
      shipping: ship?.scores?.overall ?? 0,
      shipTestTitle: challenge?.title ?? 'AI Interview',
      deploymentUrl: ship?.deploymentUrl,
      status: 'new',
    });
    setStatus('done');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground opacity={0.5} speed={0.9} />
      <div className="container mx-auto px-4 py-16 relative z-10 max-w-lg text-center">
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Invalid invite</h1>
            <p className="text-text-secondary mb-6">Ask the company for a valid role link.</p>
            <PremiumButton variant="primary" onClick={() => navigate('/employers')}>
              Interview Studio
            </PremiumButton>
          </>
        )}
        {status === 'idle' && role && (
          <>
            <h1 className="text-2xl font-bold mb-2">Apply to {role.title}</h1>
            <p className="text-text-secondary mb-8">
              Submit your ChamiNext talent profile (interviews + Ship Tests on this device).
            </p>
            <PremiumButton variant="primary" size="lg" onClick={apply}>
              Submit application
            </PremiumButton>
            <p className="text-xs text-text-secondary mt-4">
              Complete practice on this browser first for the strongest signal.
            </p>
          </>
        )}
        {status === 'done' && (
          <>
            <h1 className="text-2xl font-bold text-green-400 mb-4">Application sent</h1>
            <p className="text-text-secondary mb-6">The hiring team can review you in Interview Studio.</p>
            <PremiumButton variant="primary" onClick={() => navigate('/employers')}>
              View as employer (demo)
            </PremiumButton>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
