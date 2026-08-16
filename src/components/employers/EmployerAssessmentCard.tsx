import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  MinusCircle,
  ThumbsUp,
} from 'lucide-react';
import type { EmployerAssessment } from '../../types/studioSubmission';
import { RECOMMENDATION_LABELS } from '../../utils/employerAssessment';

type Tone = 'emerald' | 'blue' | 'amber' | 'red' | 'slate';

const TONE_STYLES: Record<Tone, { border: string; bg: string; text: string }> = {
  emerald: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
  },
  blue: {
    border: 'border-accent-blue/40',
    bg: 'bg-accent-blue/10',
    text: 'text-accent-bright',
  },
  amber: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-200',
  },
  red: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    text: 'text-red-300',
  },
  slate: {
    border: 'border-[var(--border-color)]',
    bg: 'bg-[var(--bg-secondary)]',
    text: 'text-text-secondary',
  },
};

const ICON: Record<EmployerAssessment['recommendation'], React.ReactNode> = {
  strong_yes: <ThumbsUp className="w-5 h-5" />,
  proceed: <CheckCircle2 className="w-5 h-5" />,
  mixed: <HelpCircle className="w-5 h-5" />,
  no: <MinusCircle className="w-5 h-5" />,
  insufficient: <AlertTriangle className="w-5 h-5" />,
};

type Props = {
  assessment: EmployerAssessment;
  scores?: {
    thinking: number;
    promptTrail: number;
    shipping: number;
    overall: number;
  };
  variant?: 'full' | 'banner' | 'sections';
};

export default function EmployerAssessmentCard({ assessment, scores, variant = 'full' }: Props) {
  const meta = RECOMMENDATION_LABELS[assessment.recommendation];
  const tone = TONE_STYLES[meta.tone];
  const showBanner = variant === 'full' || variant === 'banner';
  const showSections = variant === 'full' || variant === 'sections';

  return (
    <div className="space-y-4">
      {showBanner && (
        <div className={`card p-6 border ${tone.border} ${tone.bg}`}>
          <div className="flex flex-wrap items-start gap-4">
            <div className={`p-2 rounded-lg ${tone.text}`}>{ICON[assessment.recommendation]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${tone.bg} ${tone.text} border ${tone.border}`}
                >
                  {meta.badge}
                </span>
                <span className="text-xs text-text-secondary">
                  Confidence: {assessment.confidence}
                </span>
              </div>
              <h2 className="text-xl font-bold text-text-primary">{assessment.headline}</h2>
              {variant === 'full' && (
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                  {assessment.summaryParagraph}
                </p>
              )}
            </div>
          </div>
          {variant === 'banner' && (
            <p className="text-sm text-text-secondary mt-4 leading-relaxed border-t border-[var(--border-color)] pt-4">
              {assessment.summaryParagraph}
            </p>
          )}
        </div>
      )}

      {showSections && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Strengths
              </h3>
              {assessment.strengths.length === 0 ? (
                <p className="text-sm text-text-secondary">No clear strengths surfaced on this package.</p>
              ) : (
                <ul className="space-y-2 text-sm text-text-secondary">
                  {assessment.strengths.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="text-emerald-400 shrink-0">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Weaknesses & gaps
              </h3>
              {assessment.weaknesses.length === 0 ? (
                <p className="text-sm text-text-secondary">No major gaps flagged — still probe live.</p>
              ) : (
                <ul className="space-y-2 text-sm text-text-secondary">
                  {assessment.weaknesses.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span className="text-amber-400 shrink-0">−</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {assessment.probeInInterview.length > 0 && (
            <div className="card p-5 border-accent-blue/30">
              <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-accent-blue" />
                Ask in the live round
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                {assessment.probeInInterview.map((q) => (
                  <li key={q} className="pl-4 border-l-2 border-accent-blue/40">{q}</li>
                ))}
              </ul>
            </div>
          )}

          {scores && (
            <details className="card p-5">
              <summary className="text-sm font-medium text-text-secondary cursor-pointer">
                Score breakdown (supporting detail)
              </summary>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Thinking', value: scores.thinking },
                  { label: 'Prompt trail', value: scores.promptTrail },
                  { label: 'Shipping', value: scores.shipping },
                  { label: 'Overall', value: scores.overall },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <p className="text-xs text-text-secondary">{s.label}</p>
                    <p className="text-xl font-bold text-text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-3">
                Numbers support the recommendation above — they are not the recommendation itself.
              </p>
            </details>
          )}
        </>
      )}
    </div>
  );
}
