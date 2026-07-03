import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { PracticeProblem } from '../../types/interview';
import type { FieldSourcedProblem } from '../../types/interview';
import { getSkillTree, skillTreeTrackIds, type SkillTreeTrackId } from '../../data/loadSkillTree';

interface SkillTreePanelProps {
  trackId: SkillTreeTrackId;
}

const ProblemRow: React.FC<{
  problem: PracticeProblem;
  field?: boolean;
  onStart: (p: PracticeProblem) => void;
}> = ({ problem, field, onStart }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-t border-[var(--border-color)] first:border-t-0">
    <div className="min-w-0">
      <p className="text-sm font-medium text-text-primary truncate">{problem.title}</p>
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

const SkillTreePanel: React.FC<SkillTreePanelProps> = ({ trackId }) => {
  const navigate = useNavigate();
  const tree = useMemo(() => getSkillTree(trackId), [trackId]);
  const [openNodes, setOpenNodes] = useState<Set<string>>(() => new Set([tree.nodes[0]?.id]));

  const toggle = (id: string) => {
    setOpenNodes((prev) => {
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
    <div className="space-y-3">
      <p className="text-sm text-text-secondary mb-6">
        {tree.segments.join(' · ')} — {tree.totalProblems} curated problems mapped to{' '}
        {tree.nodes.length} fundamentals nodes.
      </p>

      {tree.nodes.map((node) => {
        const count = node.problems.length + node.fieldProblems.length;
        const open = openNodes.has(node.id);
        return (
          <div
            key={node.id}
            className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden"
          >
            <button
              type="button"
              className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => toggle(node.id)}
              aria-expanded={open}
            >
              <span className="text-accent-blue font-mono text-sm font-bold w-6 shrink-0 pt-0.5">
                {String(node.order).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-text-primary">{node.label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-text-secondary">
                    {count} problem{count === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-xs text-accent-blue capitalize mt-1">{node.domains.join(' · ')}</p>
              </div>
              {open ? (
                <ChevronDown className="w-5 h-5 text-text-secondary shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" />
              )}
            </button>

            {open && (
              <div className="px-4 pb-4 pl-[3.25rem] border-t border-[var(--border-color)]">
                <ul className="text-sm text-text-secondary space-y-1 mb-4 list-disc pl-4">
                  {node.fundamentals.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {count === 0 ? (
                  <p className="text-xs text-text-secondary italic">
                    No problems yet — log a field report to grow this branch.
                  </p>
                ) : (
                  <div>
                    {node.problems.map((p) => (
                      <ProblemRow key={p.id} problem={p} onStart={startProblem} />
                    ))}
                    {node.fieldProblems.map((p) => (
                      <ProblemRow key={p.id} problem={p} field onStart={startProblem} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {tree.uncoveredProblems.length > 0 && (
        <p className="text-xs text-amber-400/90 mt-4">
          {tree.uncoveredProblems.length} bank problem(s) not mapped to a node — check skill-tree.json
          domains.
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
  };
  return (
    <div className="flex flex-wrap gap-2 mb-8">
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
