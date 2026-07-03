import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Sparkles,
  TrendingUp,
  Building2,
  MessageSquareQuote,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import type {
  FieldSourcedProblem,
  InterviewOutcome,
  InterviewReport,
  InterviewStage,
  PracticeTrack,
} from '../types/interview';
import {
  addFieldProblems,
  deriveInsights,
  downloadSignalsExport,
  loadFieldProblems,
  loadReports,
  saveReport,
} from '../utils/fieldReportStorage';
import { generateProblemsFromReport } from '../utils/fieldReportGenerator';

const STAGES: { id: InterviewStage; label: string }[] = [
  { id: 'recruiter-screen', label: 'Recruiter screen' },
  { id: 'technical-screen', label: 'Technical screen' },
  { id: 'take-home', label: 'Take-home' },
  { id: 'onsite', label: 'Onsite loop' },
  { id: 'system-design', label: 'System design' },
  { id: 'other', label: 'Other' },
];

const TRACKS: { id: PracticeTrack; label: string }[] = [
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Eng' },
];

const OUTCOMES: { id: InterviewOutcome; label: string }[] = [
  { id: 'pending', label: 'Waiting to hear' },
  { id: 'passed-round', label: 'Passed round' },
  { id: 'offer', label: 'Got offer' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'unknown', label: 'Not sure' },
];

function uid(): string {
  return `report_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const StatCard: React.FC<{ icon: React.ReactNode; value: number | string; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <div className="p-5 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
    <div className="text-accent-blue mb-2">{icon}</div>
    <div className="text-2xl font-bold text-text-primary">{value}</div>
    <div className="text-xs text-text-secondary mt-1">{label}</div>
  </div>
);

const FieldReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [track, setTrack] = useState<PracticeTrack>('software');
  const [stage, setStage] = useState<InterviewStage>('technical-screen');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionsText, setQuestionsText] = useState('');
  const [whatStruggled, setWhatStruggled] = useState('');
  const [outcome, setOutcome] = useState<InterviewOutcome>('pending');
  const [usedAI, setUsedAI] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{ count: number; usedAI: boolean } | null>(null);
  const [version, setVersion] = useState(0);

  const insights = useMemo(() => deriveInsights(), [version]);
  const reports = useMemo(() => loadReports(), [version]);
  const fieldProblems = useMemo(() => loadFieldProblems(), [version]);

  const canSubmit = company.trim() && role.trim() && questionsText.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setLastResult(null);

    const report: InterviewReport = {
      id: uid(),
      company: company.trim(),
      role: role.trim(),
      track,
      stage,
      difficulty,
      questionsAsked: questionsText
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean),
      whatStruggled: whatStruggled.trim() || undefined,
      outcome,
      usedAI,
      reportedAt: new Date().toISOString(),
    };

    saveReport(report);
    const { problems, usedAI: aiUsed } = await generateProblemsFromReport(report);
    addFieldProblems(problems);

    setLastResult({ count: problems.length, usedAI: aiUsed });
    setCompany('');
    setRole('');
    setQuestionsText('');
    setWhatStruggled('');
    setOutcome('pending');
    setUsedAI(false);
    setVersion((v) => v + 1);
    setSubmitting(false);
  };

  const practice = (problem: FieldSourcedProblem) => {
    navigate('/practice', { state: { fieldProblem: problem } });
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-text-primary text-sm focus:outline-none focus:border-accent-blue';

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <Radio className="w-4 h-4" /> Field Reports
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          The self-improving prep loop
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Log a real interview you went through. ChamiNext turns the actual questions into fresh
          practice problems — so every interview anyone reports makes prep sharper for the next
          person.
        </p>
      </div>

      {/* The loop, made visible */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-secondary mb-10">
        <span className="px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">Real interview</span>
        <ArrowRight className="w-4 h-4" />
        <span className="px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">Questions captured</span>
        <ArrowRight className="w-4 h-4" />
        <span className="px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">New practice generated</span>
        <ArrowRight className="w-4 h-4" />
        <span className="px-3 py-1.5 rounded-full bg-accent-blue/15 text-accent-blue font-medium">
          Sharper prep for everyone
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-xs text-text-secondary">
          Export JSON for the weekly <code className="text-accent-blue">interview-signals</code> agent
          skill.
        </p>
        <PremiumButton variant="outline" size="sm" onClick={downloadSignalsExport}>
          Export for signals loop
        </PremiumButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon={<MessageSquareQuote className="w-6 h-6" />} value={insights.totalReports} label="Interviews logged" />
        <StatCard icon={<Sparkles className="w-6 h-6" />} value={insights.totalQuestions} label="Real questions captured" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} value={insights.problemsGenerated} label="Practice problems generated" />
        <StatCard icon={<Building2 className="w-6 h-6" />} value={insights.companies.length} label="Companies covered" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Log form */}
        <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h2 className="text-xl font-bold mb-4">Log a real interview</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Company</label>
                <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Jane Street" />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Role</label>
                <input className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Quant Researcher" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Track</label>
                <select className={inputClass} value={track} onChange={(e) => setTrack(e.target.value as PracticeTrack)}>
                  {TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Stage</label>
                <select className={inputClass} value={stage} onChange={(e) => setStage(e.target.value as InterviewStage)}>
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-text-secondary mb-1 block">
                Questions you were asked <span className="text-text-secondary/60">(one per line)</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                placeholder={'Design a rate limiter for a trading API\nExplain look-ahead bias and how you avoid it\nImplement attention from scratch'}
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary mb-1 block">What did you struggle with? (optional)</label>
              <input className={inputClass} value={whatStruggled} onChange={(e) => setWhatStruggled(e.target.value)} placeholder="e.g. Explaining trade-offs under time pressure" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Difficulty</label>
                <select className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Outcome</label>
                <select className={inputClass} value={outcome} onChange={(e) => setOutcome(e.target.value as InterviewOutcome)}>
                  {OUTCOMES.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" checked={usedAI} onChange={(e) => setUsedAI(e.target.checked)} />
              AI tools were allowed / used in this interview
            </label>

            <PremiumButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating practice…</span>
              ) : (
                'Log interview & generate practice'
              )}
            </PremiumButton>

            {lastResult && (
              <div className="flex items-start gap-2 text-sm text-accent-blue bg-accent-blue/10 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Added <strong>{lastResult.count}</strong> new practice problem
                  {lastResult.count === 1 ? '' : 's'} to the field-sourced bank
                  {lastResult.usedAI ? ' (AI-generated).' : ' (offline mode).'} The loop just got
                  smarter.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: field-sourced bank + recent reports */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">
              Field-sourced practice bank{' '}
              <span className="count-badge">{fieldProblems.length}</span>
            </h2>
            {fieldProblems.length === 0 ? (
              <div className="p-6 rounded-[var(--radius-card)] border border-dashed border-[var(--border-color)] text-text-secondary text-sm">
                No field-sourced problems yet. Log a real interview to generate the first ones.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {fieldProblems.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary text-sm">{p.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-text-secondary capitalize shrink-0">
                        {p.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-accent-blue capitalize mb-2">
                      {p.domain} · {p.track} · from {p.originCompany}
                    </p>
                    <PremiumButton variant="outline" size="sm" className="w-full" onClick={() => practice(p)}>
                      Start AI interview
                    </PremiumButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {reports.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Recent reports</h2>
              <div className="space-y-2">
                {reports.slice(0, 6).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm flex justify-between items-center gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {r.company} · {r.role}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {r.stage.replace('-', ' ')} · {r.questionsAsked.length} question
                        {r.questionsAsked.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-text-secondary capitalize shrink-0">
                      {r.outcome.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldReportsPage;
