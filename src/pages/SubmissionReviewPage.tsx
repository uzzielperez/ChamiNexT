import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  Building2,
  FileCode2,
  MessageSquareText,
  Sparkles,
  Terminal,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import { getSubmission } from '../utils/studioSubmissionStorage';

type Tab = 'package' | 'raw' | 'graded' | 'summary';

export default function SubmissionReviewPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = submissionId ? getSubmission(submissionId) : undefined;
  const [tab, setTab] = useState<Tab>('summary');

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary mb-4">No submission to review.</p>
        <Link to="/demo" className="text-accent-blue">Start the demo →</Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Scores', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'raw', label: 'Raw prompts', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'graded', label: 'Graded prompts', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'package', label: 'Submission package', icon: <FileCode2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-accent-blue flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Interview Studio · submission review
            </p>
            <h1 className="text-2xl font-bold text-text-primary mt-1">{submission.candidateName}</h1>
            <p className="text-text-secondary text-sm">
              {submission.companyName} · {submission.taskTitle} ·{' '}
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <Link to="/employers">
            <PremiumButton variant="secondary" size="sm">Back to Studio</PremiumButton>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                tab === t.id
                  ? 'border-accent-blue bg-accent-blue/15 text-accent-bright'
                  : 'border-[var(--border-color)] text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'summary' && (
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-text-primary mb-4">Auto-grade summary</h2>
              <p className="text-text-secondary text-sm mb-6">{submission.summary}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Thinking', value: submission.overallScores.thinking },
                  { label: 'Prompt trail', value: submission.overallScores.promptTrail },
                  { label: 'Shipping', value: submission.overallScores.shipping },
                  { label: 'Overall', value: submission.overallScores.overall },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                    <p className="text-xs text-text-secondary">{s.label}</p>
                    <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-4">
                Tests: {submission.testPassed ? 'passed sandbox' : 'did not pass'} ·{' '}
                {submission.promptTrail.length} prompts in trail
              </p>
            </div>
          </div>
        )}

        {tab === 'raw' && (
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-text-primary">Raw prompt trail</h2>
            <p className="text-sm text-text-secondary">
              Exactly what the candidate typed to the coding agent — unedited.
            </p>
            {submission.promptTrail.length === 0 ? (
              <p className="text-text-secondary text-sm">No prompts recorded.</p>
            ) : (
              submission.promptTrail.map((p, i) => (
                <div
                  key={p.id}
                  className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                >
                  <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-2">
                    <span className="font-mono text-accent-blue">#{i + 1}</span>
                    <span>{new Date(p.at).toLocaleTimeString()}</span>
                    <span className="uppercase">{p.source}</span>
                    <span className="font-mono">{p.activeFile}</span>
                  </div>
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{p.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'graded' && (
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-text-primary">Graded prompts</h2>
            <p className="text-sm text-text-secondary">
              Per-prompt rubric: decomposition, verification, iteration, AI disclosure.
            </p>
            {submission.gradedPrompts.map((g) => (
              <div
                key={g.promptId}
                className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <p className="text-sm text-text-primary mb-3 whitespace-pre-wrap">{g.text}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs mb-2">
                  <span>Decomp {g.scores.decomposition}</span>
                  <span>Verify {g.scores.verification}</span>
                  <span>Iterate {g.scores.iteration}</span>
                  <span>Disclosure {g.scores.aiDisclosure}</span>
                  <span className="font-bold text-accent-blue">→ {g.overall}</span>
                </div>
                <p className="text-sm text-text-secondary">{g.verdict}</p>
                {g.flags.length > 0 && (
                  <ul className="mt-2 text-xs text-amber-300/90 list-disc pl-4">
                    {g.flags.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'package' && (
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-text-primary flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-accent-blue" />
                Terminal log
              </h2>
              <pre className="text-xs font-mono text-text-secondary bg-[#0d1117] p-4 rounded-lg overflow-auto max-h-40">
                {submission.terminalLog || '(empty)'}
              </pre>
              {submission.testOutput && (
                <pre className="text-xs font-mono text-green-400/90 mt-3 bg-[#0d1117] p-4 rounded-lg overflow-auto max-h-32">
                  {submission.testOutput}
                </pre>
              )}
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-text-primary mb-3">Submitted files</h2>
              {Object.entries(submission.files).map(([path, content]) => {
                const changed = submission.starterFiles[path] !== content;
                return (
                  <details key={path} className="mb-3 border border-[var(--border-color)] rounded-lg">
                    <summary className="px-4 py-2 text-sm font-mono cursor-pointer flex items-center gap-2">
                      {path}
                      {changed && (
                        <span className="text-xs text-accent-bright uppercase">modified</span>
                      )}
                    </summary>
                    <pre className="px-4 py-3 text-xs font-mono text-text-secondary overflow-auto max-h-64">
                      {content}
                    </pre>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
