import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  MapPin,
  MessageSquareText,
  Users,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  formatSalaryRange,
  getCompanyLoop,
} from '../data/loadCompanyLoops';
import { getSubmissionsForCompanyLoop } from '../utils/studioSubmissionStorage';
import { buildEmployerAssessment, RECOMMENDATION_LABELS } from '../utils/employerAssessment';
import { seedEmployerDemoData } from '../utils/seedDemo';
import type { CompanyLoopStageId } from '../types/companyLoop';

const STAGE_ORDER: CompanyLoopStageId[] = ['cv', 'quiz', 'work-ticket', 'ethics'];

export default function EmployerCompanyLoopPage() {
  const { loopId } = useParams<{ loopId: string }>();
  const loop = loopId ? getCompanyLoop(loopId) : undefined;
  const [demoRefresh, setDemoRefresh] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);
  const submissions = useMemo(
    () => (loopId ? getSubmissionsForCompanyLoop(loopId) : []),
    [loopId, demoRefresh]
  );

  const loadDemo = () => {
    setDemoLoading(true);
    try {
      seedEmployerDemoData();
      setDemoRefresh((n) => n + 1);
    } finally {
      setDemoLoading(false);
    }
  };

  if (!loop) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Loop not found.</p>
        <Link to="/employers" className="text-accent-blue mt-4 inline-block">Back to Studio</Link>
      </div>
    );
  }

  const salary = formatSalaryRange(loop.salaryMin, loop.salaryMax);
  const inviteUrl = `${window.location.origin}/challenge/${loop.id}`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
            style={{ background: loop.logoGradient }}
          >
            {loop.logoAbbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-accent-blue flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Employer view · company interview loop
            </p>
            <h1 className="text-2xl font-bold text-text-primary">{loop.placeholderName}</h1>
            <p className="text-lg text-text-primary mt-1">{loop.roleTitle}</p>
            <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {loop.region} · <span className="text-accent-bright font-semibold">{salary}</span>
            </p>
            <p className="text-sm text-text-secondary mt-2 max-w-2xl">{loop.tagline}</p>
          </div>
          <Link to="/employers">
            <PremiumButton variant="secondary" size="sm">Back to Studio</PremiumButton>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="font-bold text-text-primary flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-accent-blue" />
              Loop you assigned
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Four stages candidates see on the landing showcase — same pipeline you configured.
            </p>
            <ol className="space-y-3">
              {STAGE_ORDER.map((id, i) => {
                const stage = loop.stages.find((s) => s.id === id)!;
                return (
                  <li
                    key={id}
                    className="flex gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                  >
                    <span className="text-xs font-mono text-accent-blue shrink-0">Stage {i + 1}</span>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{stage.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{stage.summary}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="card p-6 border-accent-blue/30">
            <h2 className="font-bold text-text-primary mb-2">Candidate invite</h2>
            <p className="text-sm text-text-secondary mb-4">
              Share this link — candidates run the full loop (CV → quiz → Work Ticket studio → ethics).
              Work Ticket submissions auto-package code, terminal log, and every agent prompt.
            </p>
            <code className="block text-xs p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-accent-bright break-all">
              {inviteUrl}
            </code>
            <Link to={`/challenge/${loop.id}`} className="mt-4 inline-block">
              <PremiumButton variant="outline" size="sm">
                Preview as candidate
                <ArrowRight className="w-4 h-4 ml-1" />
              </PremiumButton>
            </Link>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-bold text-text-primary flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-blue" />
              Candidates on this loop
            </h2>
            <p className="text-sm text-text-secondary">
              {submissions.length} submission{submissions.length === 1 ? '' : 's'} · raw + graded prompts per candidate
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center text-text-secondary text-sm space-y-4">
              <p>No submissions yet for {loop.placeholderName}.</p>
              <p>
                Demo data lives in your browser — load it from Interview Studio, or use the button below.
              </p>
              <PremiumButton variant="primary" size="sm" loading={demoLoading} onClick={loadDemo}>
                Load employer demo data
              </PremiumButton>
              <Link to="/employers" className="block text-accent-blue hover:underline text-sm mt-2">
                Back to Interview Studio
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-text-secondary text-left">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Recommendation</th>
                  <th className="p-4">Quiz</th>
                  <th className="p-4">Stages</th>
                  <th className="p-4">Prompts</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => {
                  const assessment =
                    s.employerAssessment ?? buildEmployerAssessment(s);
                  const rec = RECOMMENDATION_LABELS[assessment.recommendation];
                  return (
                  <tr key={s.id} className="border-b border-[var(--border-color)]">
                    <td className="p-4">
                      <p className="font-medium text-text-primary">{s.candidateName}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {new Date(s.submittedAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent-bright">
                        {rec.badge}
                      </span>
                      <p className="text-xs text-text-secondary mt-1 max-w-[12rem] line-clamp-2">
                        {assessment.headline}
                      </p>
                    </td>
                    <td className="p-4">{s.loopQuizScore != null ? `${s.loopQuizScore}%` : '—'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {s.loopStagesCompleted ?? 4}/4
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-text-secondary">
                        <MessageSquareText className="w-3.5 h-3.5" />
                        {s.promptTrail.length}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/employers/review/${s.id}`}
                        className="text-accent-bright hover:underline font-medium"
                      >
                        Full assessment
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {submissions[0] && (
          <div className="card p-6 mt-6">
            <h3 className="font-bold text-text-primary mb-2">
              Latest assessment preview ({submissions[0].candidateName})
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Strengths, gaps, and live-round questions on the full review page.
            </p>
            {(() => {
              const assessment =
                submissions[0].employerAssessment ??
                buildEmployerAssessment(submissions[0]);
              return (
                <ul className="space-y-2 text-sm text-text-secondary mb-4">
                  {assessment.strengths.slice(0, 2).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-400">+</span>
                      {item}
                    </li>
                  ))}
                  {assessment.weaknesses.slice(0, 2).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-amber-400">−</span>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            })()}
            <Link to={`/employers/review/${submissions[0].id}`} className="inline-block">
              <PremiumButton variant="primary" size="sm">
                Open full recommendation
                <ArrowRight className="w-4 h-4 ml-1" />
              </PremiumButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
