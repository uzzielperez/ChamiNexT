import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Radio } from 'lucide-react';
import SkillTreePanel, { SkillTreeTabs } from '../components/skills/SkillTreePanel';
import type { SkillTreeTrackId } from '../data/loadSkillTree';
import { getAllSkillTrees } from '../data/loadSkillTree';

const SkillTreesPage: React.FC = () => {
  const [track, setTrack] = useState<SkillTreeTrackId>('software');
  const summary = getAllSkillTrees();

  const totals = summary.reduce(
    (acc, t) => {
      acc.problems += t.totalProblems;
      acc.leaves += t.leafCount;
      acc.branches += t.branches.length;
      return acc;
    },
    { problems: 0, leaves: 0, branches: 0 }
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
        </p>
      </div>

      <Link
        to="/field-reports"
        className="flex items-center gap-3 p-4 mb-8 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
      >
        <Radio className="w-5 h-5 text-accent-blue shrink-0" />
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Self-improving loop:</span> real
          interview questions you log appear under matching leaves as field-sourced practice.
        </p>
      </Link>

      <SkillTreeTabs active={track} onChange={setTrack} />
      <SkillTreePanel trackId={track} />
    </div>
  );
};

export default SkillTreesPage;
