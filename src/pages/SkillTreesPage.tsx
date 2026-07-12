import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Radio, Zap, Sparkles } from 'lucide-react';
import SkillTreePanel, { SkillTreeTabs } from '../components/skills/SkillTreePanel';
import type { SkillTreeTrackId } from '../data/loadSkillTree';
import { getAllSkillTrees } from '../data/loadSkillTree';
import { loadCoachProfile } from '../utils/coachStorage';
import { fundamentalsProgress } from '../utils/skillProgress';

const SkillTreesPage: React.FC = () => {
  const profile = loadCoachProfile();
  const [track, setTrack] = useState<SkillTreeTrackId>(
    () => (profile?.targetTrack as SkillTreeTrackId) || 'software'
  );
  const fund = fundamentalsProgress();
  const summary = getAllSkillTrees();

  const totals = summary.reduce(
    (acc, t) => {
      acc.problems += t.totalProblems;
      acc.practiced += t.practicedProblems;
      acc.leaves += t.leafCount;
      acc.branches += t.branches.length;
      return acc;
    },
    { problems: 0, practiced: 0, leaves: 0, branches: 0 }
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <GitBranch className="w-4 h-4" /> Skill trees
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          First-principles prep paths
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Every problem in the bank maps to a leaf on the tree — reasoning, not recall. Practice
          from a branch or grow it with{' '}
          <Link to="/field-reports" className="text-accent-blue hover:underline">
            field reports
          </Link>
          .
        </p>
        <p className="text-xs text-text-secondary mt-4">
          {totals.branches} branches · {totals.leaves} skills · {totals.problems} curated problems
          {totals.practiced > 0 && ` · ${totals.practiced} practiced`}
        </p>
      </div>

      {profile?.onboardingComplete ? (
        <div className="card p-4 mb-6 border-accent-blue/30 flex flex-wrap items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary flex-1">
            <span className="font-semibold text-text-primary">Coach picked your path:</span>{' '}
            {profile.targetTrack.replace('-', ' ')} · White belt {fund.done}/{fund.total}
            {fund.done < fund.total && ' — complete fundamentals on the Software tree first'}
          </p>
        </div>
      ) : (
        <Link
          to="/coach"
          className="block card p-4 mb-6 border-accent-blue/30 text-sm text-accent-blue hover:bg-accent-blue/5"
        >
          Talk to Coach first to unlock your role branch →
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/drill"
          className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
        >
          <Zap className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">Test these fundamentals:</span> a
            5-minute rapid-fire drill built from the bullets on this tree.
          </p>
        </Link>
        <Link
          to="/field-reports"
          className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 transition-colors"
        >
          <Radio className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">Self-improving loop:</span> real
            interview questions you log appear under matching leaves as field-sourced practice.
          </p>
        </Link>
      </div>

      <SkillTreeTabs active={track} onChange={setTrack} />
      <SkillTreePanel trackId={track} />
    </div>
  );
};

export default SkillTreesPage;
