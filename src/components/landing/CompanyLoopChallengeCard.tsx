import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import type { CompanyInterviewLoop } from '../../types/companyLoop';
import { formatSalaryRange } from '../../data/loadCompanyLoops';
import {
  loadLoopProgress,
  loopProgressPercent,
} from '../../utils/companyLoopProgress';

type Props = {
  loop: CompanyInterviewLoop;
};

export default function CompanyLoopChallengeCard({ loop }: Props) {
  const progress = loadLoopProgress(loop.id);
  const pct = loopProgressPercent(progress.completedStages);
  const salary = formatSalaryRange(loop.salaryMin, loop.salaryMax);

  return (
    <Link
      to={`/challenge/${loop.id}`}
      className="group block rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden hover:border-accent-blue/50 transition-all hover:shadow-lg hover:shadow-accent-blue/5"
    >
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-inner"
            style={{ background: loop.logoGradient }}
            aria-hidden
          >
            {loop.logoAbbr}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {loop.placeholderName}
            </p>
            <h3 className="font-bold text-text-primary text-lg leading-tight group-hover:text-accent-bright transition-colors">
              {loop.roleTitle}
            </h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {loop.region}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">
              {loop.salaryLabel}
            </p>
            <p className="text-lg font-bold text-accent-bright tabular-nums">{salary}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">{loop.tagline}</p>

        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wide text-text-secondary">
          <span>Interview loop</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden flex gap-0.5 mb-3">
          {loop.stages.map((stage) => {
            const done = progress.completedStages.includes(stage.id);
            return (
              <div
                key={stage.id}
                className={`flex-1 h-full transition-colors ${
                  done ? 'bg-accent-blue' : 'bg-[var(--bg-tertiary)]'
                }`}
                title={stage.title}
              />
            );
          })}
        </div>
        <ol className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-text-secondary mb-4">
          {loop.stages.map((s, i) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  progress.completedStages.includes(s.id)
                    ? 'bg-accent-blue text-white'
                    : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                {i + 1}
              </span>
              <span className="truncate">{s.title}</span>
            </li>
          ))}
        </ol>

        <span className="text-sm font-medium text-accent-blue inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          {pct > 0 ? 'Continue loop' : 'Start loop'}
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
