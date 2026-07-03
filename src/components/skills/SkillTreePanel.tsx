import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumButton from '../ui/PremiumButton';
import type { PracticeProblem } from '../../types/interview';
import type { FieldSourcedProblem } from '../../types/interview';
import {
  getSkillTree,
  skillTreeTrackIds,
  type SkillTreeLeaf,
  type SkillTreeTrackId,
} from '../../data/loadSkillTree';

interface SkillTreePanelProps {
  trackId: SkillTreeTrackId;
}

const ProblemRow: React.FC<{
  problem: PracticeProblem;
  field?: boolean;
  onStart: (p: PracticeProblem) => void;
}> = ({ problem, field, onStart }) => (
  <div className="skill-tree-problem-row">
    <div className="min-w-0">
      <p className="text-sm font-medium text-text-primary">{problem.title}</p>
      <p className="text-xs text-text-secondary capitalize">
        {problem.difficulty} · ~{problem.estimatedMinutes}m
        {field ? ' · field-sourced' : ''}
      </p>
    </div>
    <PremiumButton variant="outline" size="sm" onClick={() => onStart(problem)}>
      Start
    </PremiumButton>
  </div>
);

const SkillTreeLeafCard: React.FC<{
  leaf: SkillTreeLeaf;
  open: boolean;
  onToggle: () => void;
  onStart: (p: PracticeProblem) => void;
}> = ({ leaf, open, onToggle, onStart }) => {
  const count = leaf.problems.length + leaf.fieldProblems.length;
  return (
    <li className="skill-tree-leaf">
      <button type="button" className="skill-tree-leaf-btn" onClick={onToggle} aria-expanded={open}>
        <span className="skill-tree-leaf-dot" aria-hidden />
        <span className="flex-1 min-w-0 text-left">
          <span className="font-semibold text-text-primary text-sm block">{leaf.label}</span>
          <span className="text-xs text-text-secondary capitalize">{leaf.domains.join(' · ')}</span>
        </span>
        <span className="skill-tree-count">{count}</span>
      </button>
      {open && (
        <div className="skill-tree-leaf-body">
          <ul className="text-xs text-text-secondary space-y-1 mb-3 list-disc pl-4">
            {leaf.fundamentals.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {count === 0 ? (
            <p className="text-xs text-text-secondary italic">No problems yet on this branch.</p>
          ) : (
            <div className="space-y-0">
              {leaf.problems.map((p) => (
                <ProblemRow key={p.id} problem={p} onStart={onStart} />
              ))}
              {leaf.fieldProblems.map((p) => (
                <ProblemRow key={p.id} problem={p} field onStart={onStart} />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

const SkillTreePanel: React.FC<SkillTreePanelProps> = ({ trackId }) => {
  const navigate = useNavigate();
  const tree = useMemo(() => getSkillTree(trackId), [trackId]);
  const [openLeaves, setOpenLeaves] = useState<Set<string>>(
    () => new Set([tree.branches[0]?.leaves[0]?.id].filter(Boolean) as string[])
  );

  const toggleLeaf = (id: string) => {
    setOpenLeaves((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startProblem = (problem: PracticeProblem) => {
    const isField = (problem as FieldSourcedProblem).originReportId;
    if (isField) {
      navigate('/practice', { state: { fieldProblem: problem } });
    } else {
      navigate('/practice', { state: { problemId: problem.id } });
    }
  };

  return (
    <div className="skill-tree-canvas">
      <p className="text-sm text-text-secondary mb-8 text-center">
        {tree.segments.join(' · ')} — {tree.leafCount} skills · {tree.totalProblems} problems
      </p>

      {/* Root */}
      <div className="skill-tree-root-wrap">
        <div className="skill-tree-root">
          <span className="text-xs uppercase tracking-wider text-accent-blue font-medium">Root</span>
          <span className="font-bold text-text-primary text-lg">{tree.root.label}</span>
          <span className="text-xs text-text-secondary">{tree.label}</span>
        </div>
        <div className="skill-tree-trunk" aria-hidden />
      </div>

      {/* Branches fan */}
      <div className="skill-tree-branches">
        {tree.branches.map((branch) => (
          <div key={branch.id} className="skill-tree-branch">
            <div className="skill-tree-branch-head">
              <div className="skill-tree-branch-connector" aria-hidden />
              <div className="skill-tree-branch-label">
                <h3 className="font-bold text-text-primary">{branch.label}</h3>
                {branch.description && (
                  <p className="text-xs text-text-secondary mt-0.5">{branch.description}</p>
                )}
              </div>
            </div>
            <ul className="skill-tree-leaves">
              {branch.leaves.map((leaf) => (
                <SkillTreeLeafCard
                  key={leaf.id}
                  leaf={leaf}
                  open={openLeaves.has(leaf.id)}
                  onToggle={() => toggleLeaf(leaf.id)}
                  onStart={startProblem}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {tree.uncoveredProblems.length > 0 && (
        <p className="text-xs text-amber-400/90 mt-8 text-center">
          {tree.uncoveredProblems.length} problem(s) not on any branch.
        </p>
      )}
    </div>
  );
};

export default SkillTreePanel;

export const SkillTreeTabs: React.FC<{
  active: SkillTreeTrackId;
  onChange: (t: SkillTreeTrackId) => void;
}> = ({ active, onChange }) => {
  const labels: Record<SkillTreeTrackId, string> = {
    software: 'Software',
    'ai-engineer': 'AI Engineering',
    quant: 'Quant',
    cybersecurity: 'Cybersecurity',
  };
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {skillTreeTrackIds.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
            active === id ? 'filter-pill-active' : ''
          }`}
        >
          {labels[id]}
        </button>
      ))}
    </div>
  );
};
