import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  Radar,
  Radio,
  Repeat,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  getIntelCompanies,
  getIntelStats,
  intelProblemFromQuestion,
  intelQuestionKinds,
  interviewIntel,
  INTEL_KIND_LABELS,
  INTEL_STAGE_LABELS,
} from '../data/loadInterviewIntel';
import type {
  CompanyIntel,
  IntelQuestion,
  IntelQuestionKind,
  PracticeTrack,
} from '../types/interview';

type TrackFilter = PracticeTrack | 'all';
type KindFilter = IntelQuestionKind | 'all';

const TRACK_TABS: { id: TrackFilter; label: string }[] = [
  { id: 'all', label: 'All tracks' },
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Eng' },
];

const KIND_TONE: Record<IntelQuestionKind, string> = {
  coding: 'text-accent-bright bg-accent-blue/10',
  'system-design': 'text-violet-300 bg-violet-400/10',
  behavioral: 'text-emerald-300 bg-emerald-400/10',
  recruiter: 'text-amber-300 bg-amber-400/10',
  'take-home': 'text-cyan-300 bg-cyan-400/10',
  'domain-knowledge': 'text-text-secondary bg-white/5',
};

const QuestionRow: React.FC<{
  question: IntelQuestion;
  company?: string;
  onPractice: (q: IntelQuestion, company?: string) => void;
}> = ({ question, company, onPractice }) => (
  <div className="flex items-start gap-3 py-3 border-t border-[var(--border-color)] first:border-t-0">
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${KIND_TONE[question.kind]}`}
    >
      {INTEL_KIND_LABELS[question.kind]}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-text-primary">{question.text}</p>
      <p className="text-xs text-text-secondary mt-1">
        {INTEL_STAGE_LABELS[question.stage] ?? question.stage}
        {' · '}
        <a
          href={question.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:text-accent-bright transition-colors"
        >
          source: {question.sourceType}
          <ExternalLink className="w-3 h-3" aria-hidden />
        </a>
      </p>
    </div>
    <PremiumButton
      variant="outline"
      size="sm"
      onClick={() => onPractice(question, company)}
      className="shrink-0"
    >
      Practice
    </PremiumButton>
  </div>
);

const CompanyCard: React.FC<{
  company: CompanyIntel;
  visibleQuestions: IntelQuestion[];
  onPractice: (q: IntelQuestion, company?: string) => void;
}> = ({ company, visibleQuestions, onPractice }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <Building2 className="w-5 h-5 text-accent-blue shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-text-primary">{company.company}</h3>
          <p className="text-xs text-text-secondary">
            {company.roles.length > 0 && `${company.roles.slice(0, 2).join(', ')} · `}
            {visibleQuestions.length} question{visibleQuestions.length === 1 ? '' : 's'}
            {company.stages.length > 0 && ` · ${company.stages.length}-stage process`}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          {company.stages.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary mb-2">
                Process
              </p>
              <ol className="space-y-2">
                {company.stages.map((s, i) => (
                  <li key={s.stage} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent-blue/15 text-accent-bright text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="text-text-primary font-medium">
                        {INTEL_STAGE_LABELS[s.stage] ?? s.stage}
                      </span>
                      {s.notes && <span className="text-text-secondary"> — {s.notes}</span>}
                    </span>
                  </li>
                ))}
              </ol>
              {company.processNotes.length > 0 && (
                <p className="text-xs text-text-secondary mt-2 italic">
                  {company.processNotes[0]}
                </p>
              )}
            </div>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary mb-1">
            Questions asked
          </p>
          {visibleQuestions.map((q) => (
            <QuestionRow key={q.id} question={q} company={company.company} onPractice={onPractice} />
          ))}
        </div>
      )}
    </div>
  );
};

const InterviewIntelPage: React.FC = () => {
  const navigate = useNavigate();
  const [track, setTrack] = useState<TrackFilter>('all');
  const [kind, setKind] = useState<KindFilter>('all');
  const stats = getIntelStats();

  const companies = useMemo(() => {
    return getIntelCompanies()
      .map((c) => ({
        company: c,
        visible: c.questions.filter(
          (q) => (track === 'all' || q.track === track) && (kind === 'all' || q.kind === kind)
        ),
      }))
      .filter(({ company: c, visible }) => visible.length > 0 || (kind === 'all' && c.stages.length > 0));
  }, [track, kind]);

  const generalQuestions = useMemo(
    () =>
      interviewIntel.generalQuestions.filter(
        (q) => (track === 'all' || q.track === track) && (kind === 'all' || q.kind === kind)
      ),
    [track, kind]
  );

  const practice = (q: IntelQuestion, company?: string) => {
    navigate('/practice', { state: { fieldProblem: intelProblemFromQuestion(q, company) } });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <Radar className="w-4 h-4" /> Interview intel
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Real processes. Exact questions.
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Scraped from public interview reports on Reddit, Hacker News, blogs, and YouTube —
          including the behavioral and recruiter questions most prep skips. Practice any of them
          against the AI interviewer.
        </p>
        <p className="text-xs text-text-secondary mt-4">
          {stats.companies} companies · {stats.questions} questions ({stats.behavioral} behavioral
          or recruiter) · {stats.sources} sources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/loop"
          className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
        >
          <Repeat className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">Rehearse the full loop:</span>{' '}
            recruiter, technical, and behavioral stages, scored end to end.
          </p>
        </Link>
        <Link
          to="/field-reports"
          className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 transition-colors"
        >
          <Radio className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">Been in one of these loops?</span>{' '}
            Log it as a field report — it sharpens the intel for everyone.
          </p>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {TRACK_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTrack(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
              track === t.id ? 'filter-pill-active' : ''
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setKind('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors filter-pill ${
            kind === 'all' ? 'filter-pill-active' : ''
          }`}
        >
          All kinds
        </button>
        {intelQuestionKinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors filter-pill ${
              kind === k ? 'filter-pill-active' : ''
            }`}
          >
            {INTEL_KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {stats.questions === 0 ? (
        <div className="text-center py-16 rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)]">
          <MessageCircle className="w-8 h-8 text-text-secondary mx-auto mb-3" aria-hidden />
          <p className="text-text-primary font-medium mb-1">No intel loaded yet</p>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Run the pipeline to populate this page:{' '}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              node scripts/interview-intel/scrape.mjs
            </code>{' '}
            then{' '}
            <code className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              node scripts/interview-intel/extract.mjs
            </code>
          </p>
        </div>
      ) : (
        <>
          {companies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">
                By company <span className="count-badge">{companies.length}</span>
              </h2>
              <div className="space-y-3">
                {companies.map(({ company: c, visible }) => (
                  <CompanyCard
                    key={c.id}
                    company={c}
                    visibleQuestions={visible}
                    onPractice={practice}
                  />
                ))}
              </div>
            </section>
          )}

          {generalQuestions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-1">
                From the field <span className="count-badge">{generalQuestions.length}</span>
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                Real questions where the company wasn&apos;t named. Behavioral and recruiter
                questions transfer across companies.
              </p>
              <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-1">
                {generalQuestions.map((q) => (
                  <QuestionRow key={q.id} question={q} onPractice={practice} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewIntelPage;
