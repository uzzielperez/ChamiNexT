import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../ui/PremiumButton';
import { buildTalentProfile, loadProfileName, saveProfileName, loadShipEnrollment } from '../../utils/interviewStorage';
import { loadSessions } from '../../utils/interviewStorage';
import { practiceProblems } from '../../data/practiceProblems';
import { getOrCreateProfileSlug, exportPublicProfile } from '../../utils/profileSlug';
import { loadRoles } from '../../utils/employerStorage';
import { addApplication } from '../../utils/employerStorage';
import ScoreBreakdown from './ScoreBreakdown';
import ShipScoreBreakdown from '../ship-tests/ShipScoreBreakdown';
import { Copy, ExternalLink } from 'lucide-react';
import { shipTestChallenges } from '../../data/shipTests';

const shipTitle = (challengeId?: string) =>
  shipTestChallenges.find((c) => c.id === challengeId)?.title ?? 'Ship Test';

interface TalentProfileProps {
  onBack: () => void;
}

const TalentProfile: React.FC<TalentProfileProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(loadProfileName());
  const [copied, setCopied] = useState(false);
  const profile = buildTalentProfile(name);
  const sessions = loadSessions().filter((s) => s.scores).slice(0, 5);
  const ship = loadShipEnrollment();
  const slug = getOrCreateProfileSlug();
  const profileUrl = `${window.location.origin}/profile/${slug}`;

  const saveName = () => saveProfileName(name);

  const copyLink = () => {
    exportPublicProfile(slug);
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyToFirstRole = () => {
    const role = loadRoles()[0];
    if (!role) {
      navigate('/employers');
      return;
    }
    exportPublicProfile(slug);
    addApplication({
      roleId: role.id,
      displayName: profile.displayName,
      profileSlug: slug,
      thinking: profile.thinkingScoreAvg || 70,
      shipping: ship?.scores?.overall ?? 0,
      shipTestTitle: ship?.scores ? shipTitle(ship.challengeId) : 'AI Interview',
      deploymentUrl: ship?.deploymentUrl,
      status: 'new',
    });
    navigate('/employers');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <PremiumButton variant="ghost" size="sm" onClick={onBack} className="mb-6">
        ← Back to practice
      </PremiumButton>

      <div className="card border-accent-blue/20 p-8 mb-8">
        <label className="text-sm text-text-secondary block mb-2">Display name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary mb-6"
        />
        <h1 className="text-3xl font-bold text-text-primary mb-2">{profile.displayName}</h1>
        <p className="text-text-secondary mb-6">{profile.summary}</p>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="text-2xl font-bold text-gradient">{profile.thinkingScoreAvg || '—'}</div>
            <div className="text-xs text-text-secondary">Avg thinking</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">{profile.interviewsCompleted}</div>
            <div className="text-xs text-text-secondary">Interviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">{profile.shipTestsCompleted}</div>
            <div className="text-xs text-text-secondary">Ship Tests</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <PremiumButton variant="primary" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? 'Copied!' : 'Copy profile link'}
          </PremiumButton>
          <PremiumButton variant="secondary" size="sm" onClick={() => window.open(profileUrl, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Preview
          </PremiumButton>
          <PremiumButton variant="outline" size="sm" onClick={applyToFirstRole}>
            Apply to demo role
          </PremiumButton>
        </div>
      </div>

      {ship?.scores && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Latest Ship Test</h2>
          <ShipScoreBreakdown scores={ship.scores} feedback={ship.feedback} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-bold mb-3">Strengths</h3>
          <p className="text-text-secondary text-sm capitalize">
            {profile.strengthDomains.length ? profile.strengthDomains.join(', ') : '—'}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-3">Focus areas</h3>
          <p className="text-text-secondary text-sm capitalize">
            {profile.weaknessDomains.length ? profile.weaknessDomains.join(', ') : '—'}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent interviews</h2>
      {sessions.length === 0 ? (
        <p className="text-text-secondary">No scored sessions yet.</p>
      ) : (
        <div className="space-y-6">
          {sessions.map((s) => {
            const p = practiceProblems.find((x) => x.id === s.problemId);
            return (
              <div key={s.id}>
                <p className="text-sm font-medium text-text-primary mb-2">
                  {p?.title ?? s.problemId} · {new Date(s.endedAt || s.startedAt).toLocaleDateString()}
                </p>
                {s.scores && <ScoreBreakdown scores={s.scores} notes={s.scoreNotes} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TalentProfile;
