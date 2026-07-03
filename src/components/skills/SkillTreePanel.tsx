import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { PracticeProblem } from '../../types/interview';
import type { FieldSourcedProblem } from '../../types/interview';
import {
  getSkillTree,
  skillTreeTrackIds,
  type SkillTreeBranch,
  type SkillTreeLeaf,
  type SkillTreeTrackId,
} from '../../data/loadSkillTree';

interface SkillTreePanelProps {
  trackId: SkillTreeTrackId;
}

const DIFFICULTY_CLASS: Record<PracticeProblem['difficulty'], string> = {
  easy: 'skill-difficulty-easy',
  medium: 'skill-difficulty-medium',
  hard: 'skill-difficulty-hard',
};

const ProblemRow: React.FC<{
  problem: PracticeProblem;
  field?: boolean;
  practiced: boolean;
  onStart: (p: PracticeProblem) => void;
}> = ({ problem, field, practiced, onStart }) => (
  <div className="skill-tree-problem-row">
    <span
      className={`skill-difficulty-dot ${DIFFICULTY_CLASS[problem.difficulty]}`}
      title={problem.difficulty}
      aria-hidden
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
        <span className="truncate">{problem.title}</span>
        {practiced && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="Practiced" />}
      </p>
      <p className="text-xs text-text-secondary capitalize">
        {problem.difficulty} · ~{problem.estimatedMinutes}m
        {field && (
          <span className="skill-field-tag">
            <Sparkles className="w-3 h-3" aria-hidden /> field-sourced
          </span>
        )}
      </p>
    </div>
    <PremiumButton variant="outline" size="sm" onClick={() => onStart(problem)}>
      {practiced ? 'Retry' : 'Start'}
    </PremiumButton>
  </div>
);

const LeafStatusDot: React.FC<{ leaf: SkillTreeLeaf }> = ({ leaf }) => {
  const { practicedCount, totalCount } = leaf.progress;
  const state =
    totalCount === 0
      ? 'empty'
      : practicedCount === 0
        ? 'todo'
        : practicedCount >= totalCount
          ? 'done'
          : 'partial';
  if (state === 'done') {
    return (
      <span className="skill-tree-leaf-dot is-done" aria-hidden>
        <Check className="w-2.5 h-2.5" strokeWidth={3} />
      </span>
    );
  }
  return <span className={`skill-tree-leaf-dot is-${state}`} aria-hidden />;
};

const SkillTreeLeafCard: React.FC<{
  leaf: SkillTreeLeaf;
  open: boolean;
  onToggle: () => void;
  onStart: (p: PracticeProblem) => void;
}> = ({ leaf, open, onToggle, onStart }) => {
  const { practicedCount, totalCount, practicedIds } = leaf.progress;
  return (
    <li className="skill-tree-leaf">
      <button type="button" className="skill-tree-leaf-btn" onClick={onToggle} aria-expanded={open}>
        <LeafStatusDot leaf={leaf} />
        <span className="flex-1 min-w-0 text-left">
          <span className="font-semibold text-text-primary text-sm block">{leaf.label}</span>
          <span className="text-xs text-text-secondary capitalize">{leaf.domains.join(' · ')}</span>
        </span>
        <span className={`skill-tree-count ${practicedCount > 0 ? 'has-progress' : ''}`}>
          {totalCount === 0 ? '0' : `${practicedCount}/${totalCount}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="skill-tree-leaf-body">
          <p className="skill-fundamentals-title">What interviewers look for</p>
          <ul className="skill-fundamentals mb-4">
            {leaf.fundamentals.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {totalCount === 0 ? (
            <p className="text-xs text-text-secondary italic">
              No problems yet on this branch. Log a real interview in field reports to grow it.
            </p>
          ) : (
            <div>
              {leaf.problems.map((p) => (
                <ProblemRow key={p.id} problem={p} practiced={practicedIds.has(p.id)} onStart={onStart} />
              ))}
              {leaf.fieldProblems.map((p) => (
                <ProblemRow key={p.id} problem={p} field practiced={practicedIds.has(p.id)} onStart={onStart} />
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

const branchProgress = (branch: SkillTreeBranch) =>
  branch.leaves.reduce(
    (acc, leaf) => {
      acc.practiced += leaf.progress.practicedCount;
      acc.total += leaf.progress.totalCount;
      return acc;
    },
    { practiced: 0, total: 0 }
  );

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

  const pct =
    tree.totalProblems > 0 ? Math.round((tree.practicedProblems / tree.totalProblems) * 100) : 0;

  return (
    <div className="skill-tree-canvas">
      {/* Root */}
      <div className="skill-tree-root-wrap">
        <div className="skill-tree-root">
          <span className="text-xs uppercase tracking-wider text-accent-bright font-semibold">
            {tree.label}
          </span>
          <span className="font-bold text-text-primary text-lg">{tree.root.label}</span>
          <span className="text-xs text-text-secondary">{tree.segments.join(' · ')}</span>
          <span className="skill-tree-root-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </span>
          <span className="text-xs text-text-secondary">
            {tree.practicedProblems} of {tree.totalProblems} problems practiced
          </span>
        </div>
        <div className="skill-tree-trunk" aria-hidden />
      </div>

      {/* Branches fan */}
      <div className="skill-tree-branches">
        {tree.branches.map((branch) => {
          const prog = branchProgress(branch);
          return (
            <div key={branch.id} className="skill-tree-branch">
              <div className="skill-tree-branch-head">
                <div className="skill-tree-branch-connector" aria-hidden />
                <div className="skill-tree-branch-label">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-text-primary text-sm">{branch.label}</h3>
                    {prog.total > 0 && (
                      <span className="text-[11px] font-semibold text-text-secondary tabular-nums">
                        {prog.practiced}/{prog.total}
                      </span>
                    )}
                  </div>
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
          );
        })}
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
    'market-engineering': 'Market Engineering',
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
