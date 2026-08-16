import { useEffect, useState } from 'react';
import {
  Bot,
  Building2,
  CheckCircle2,
  FileCode2,
  MessageSquareText,
  Sparkles,
  TerminalSquare,
  ThumbsUp,
  User,
} from 'lucide-react';

type StepId =
  | 'ticket'
  | 'prompt1'
  | 'reply1'
  | 'code'
  | 'prompt2'
  | 'tests'
  | 'submit'
  | 'trail'
  | 'scores'
  | 'verdict';

const TIMELINE: { id: StepId; ms: number; caption: string }[] = [
  { id: 'ticket', ms: 2600, caption: 'Pulse assigns a scoped Work Ticket — 4h, AI allowed' },
  { id: 'prompt1', ms: 3000, caption: 'Candidate asks the coding agent — every prompt is logged' },
  { id: 'reply1', ms: 2600, caption: 'Agent advises; the candidate drives the design' },
  { id: 'code', ms: 3000, caption: 'Implementation lands in the editor' },
  { id: 'prompt2', ms: 2800, caption: 'Verification instinct shows up in the prompt trail' },
  { id: 'tests', ms: 2800, caption: 'Tests run in the sandbox — green' },
  { id: 'submit', ms: 2400, caption: 'Auto-packaged: code + terminal log + every prompt' },
  { id: 'trail', ms: 3400, caption: 'Employer sees the raw prompts — each one graded' },
  { id: 'scores', ms: 2600, caption: 'Composite scores support the read, not replace it' },
  { id: 'verdict', ms: 3800, caption: 'Clear recommendation: advance, probe live, or pass' },
];

const idx = (id: StepId) => TIMELINE.findIndex((s) => s.id === id);
const TRAIL_IDX = idx('trail');

const CODE_STUB = [
  { t: '/** PLAT-1842 · Token bucket — 10 req/min per IP */', c: 'text-emerald-400/70' },
  { t: 'const BUCKET_SIZE = 10;', c: 'text-sky-300/90' },
  { t: 'const WINDOW_MS = 60_000;', c: 'text-sky-300/90' },
  { t: '', c: '' },
  { t: 'export function checkRateLimit(key) {', c: 'text-violet-300/90' },
  { t: '  // TODO: implement', c: 'text-amber-300/60' },
  { t: '  return true;', c: 'text-text-secondary' },
  { t: '}', c: 'text-violet-300/90' },
];

const CODE_FULL = [
  { t: '/** PLAT-1842 · Token bucket — 10 req/min per IP */', c: 'text-emerald-400/70' },
  { t: 'const BUCKET_SIZE = 10;', c: 'text-sky-300/90' },
  { t: 'const WINDOW_MS = 60_000;', c: 'text-sky-300/90' },
  { t: 'const buckets = new Map();', c: 'text-sky-300/90' },
  { t: '', c: '' },
  { t: 'export function checkRateLimit(key) {', c: 'text-violet-300/90' },
  { t: '  const b = bucket(key);', c: 'text-text-primary/90' },
  { t: '  return b.tokens > 0;', c: 'text-text-primary/90' },
  { t: '}', c: 'text-violet-300/90' },
  { t: '', c: '' },
  { t: 'export function recordRequest(key) {', c: 'text-violet-300/90' },
  { t: '  const b = bucket(key);', c: 'text-text-primary/90' },
  { t: '  if (b.tokens > 0) b.tokens -= 1;', c: 'text-text-primary/90' },
  { t: '  return retryAfterSeconds(b);', c: 'text-text-primary/90' },
  { t: '}', c: 'text-violet-300/90' },
];

const TERMINAL_LINES = [
  { t: '$ npm test', c: 'text-text-secondary' },
  { t: '✓ allows first request', c: 'text-emerald-400' },
  { t: '✓ blocks after 10 req/min per IP', c: 'text-emerald-400' },
  { t: '✓ 429 includes Retry-After', c: 'text-emerald-400' },
  { t: 'PASS · 4 tests · 0.8s', c: 'text-emerald-300 font-semibold' },
];

const GRADED_TRAIL = [
  {
    text: 'Should I use a sliding window or token bucket for per-IP limits? We need Retry-After on 429.',
    grade: 82,
    verdict: 'Strong framing — constraints before code',
  },
  {
    text: 'agent What edge cases should I test for concurrent requests?',
    grade: 76,
    verdict: 'Verification-minded',
  },
  {
    text: 'I used AI for test scaffolding — how do I verify the bucket resets after 60s?',
    grade: 88,
    verdict: 'Discloses AI use + verifies output',
  },
];

function TypeText({ text, active, speed = 26 }: { text: string; active: boolean; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    setN(0);
    const iv = setInterval(
      () => setN((v) => (v >= text.length ? v : v + 1)),
      speed
    );
    return () => clearInterval(iv);
  }, [active, text, speed]);
  if (!active) return null;
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="animate-pulse">▍</span>}
    </span>
  );
}

function CountUp({ to, active, ms = 900 }: { to: number; active: boolean; ms?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) {
      setV(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, ms]);
  return <>{v}</>;
}

export default function InterviewLoopAnimation() {
  const [at, setAt] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAt((s) => (s + 1) % TIMELINE.length), TIMELINE[at].ms);
    return () => clearTimeout(t);
  }, [at]);

  const step = TIMELINE[at].id;
  const reached = (id: StepId) => at >= idx(id);
  const employerPhase = at >= TRAIL_IDX;

  const [codeN, setCodeN] = useState(0);
  useEffect(() => {
    if (!reached('code') || employerPhase) {
      setCodeN(0);
      return;
    }
    if (step !== 'code') {
      setCodeN(CODE_FULL.length);
      return;
    }
    setCodeN(0);
    const iv = setInterval(
      () => setCodeN((n) => (n >= CODE_FULL.length ? n : n + 1)),
      170
    );
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  const [termN, setTermN] = useState(0);
  useEffect(() => {
    if (!reached('tests') || employerPhase) {
      setTermN(0);
      return;
    }
    if (step !== 'tests') {
      setTermN(TERMINAL_LINES.length);
      return;
    }
    setTermN(0);
    const iv = setInterval(
      () => setTermN((n) => (n >= TERMINAL_LINES.length ? n : n + 1)),
      420
    );
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  const promptCount = reached('prompt2') ? 3 : reached('prompt1') ? 1 : 0;
  const codeLines = reached('code') ? CODE_FULL.slice(0, codeN) : CODE_STUB;

  return (
    <div>
      <style>{`@keyframes ilaFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

      <div
        className="rounded-xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 truncate">
            {employerPhase
              ? 'Interview Studio · submission review'
              : 'pulse-work-ticket — ChamiNext Studio'}
          </span>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
              employerPhase
                ? 'border-accent-blue/40 bg-accent-blue/10 text-accent-bright'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {employerPhase ? 'Employer view' : 'Candidate view'}
          </span>
        </div>

        {/* ---------------- Candidate (Cursor-style) ---------------- */}
        {!employerPhase && (
          <div key="candidate" style={{ animation: 'ilaFade .45s ease' }}>
            <div className="grid md:grid-cols-[150px_1fr_220px] min-h-[300px] text-xs">
              {/* File tree */}
              <div className="hidden md:block border-r border-[var(--border-color)] p-3 space-y-1.5 text-[var(--text-secondary)]">
                <p className="text-[10px] uppercase tracking-wide mb-2">Explorer</p>
                {['README.md', 'src/server.ts', 'src/rateLimiter.ts', 'tests/rateLimiter.test.ts'].map(
                  (f) => (
                    <p
                      key={f}
                      className={`truncate px-2 py-1 rounded ${
                        f === 'src/rateLimiter.ts'
                          ? 'bg-accent-blue/15 text-accent-bright'
                          : ''
                      }`}
                    >
                      <FileCode2 className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                      {f}
                    </p>
                  )
                )}
              </div>

              {/* Editor */}
              <div className="relative p-4 font-mono leading-6 overflow-hidden bg-[#0d1117]">
                <p className="text-[10px] text-[var(--text-secondary)] mb-2 font-sans">
                  src/rateLimiter.ts
                </p>
                {codeLines.map((l, i) => (
                  <p key={i} className={`whitespace-pre ${l.c}`}>
                    <span className="text-white/20 select-none mr-3">
                      {String(i + 1).padStart(2, ' ')}
                    </span>
                    {l.t || ' '}
                  </p>
                ))}

                {/* Ticket overlay */}
                {step === 'ticket' && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/60 p-4"
                    style={{ animation: 'ilaFade .4s ease' }}
                  >
                    <div className="card p-4 max-w-xs border-accent-blue/40 bg-[var(--bg-secondary)]">
                      <p className="text-[10px] uppercase tracking-wide text-accent-blue flex items-center gap-1.5 mb-2">
                        <Building2 className="w-3 h-3" />
                        Pulse · Work Ticket
                      </p>
                      <p className="font-semibold text-text-primary text-sm mb-1">
                        PLAT-1842 · Rate limiter
                      </p>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        10 req/min per IP · 429 + Retry-After · tests required. AI allowed —
                        prompts are part of your submission.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit overlay */}
                {step === 'submit' && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/60 p-4"
                    style={{ animation: 'ilaFade .4s ease' }}
                  >
                    <div className="card p-4 max-w-xs border-emerald-500/40 bg-[var(--bg-secondary)] text-center">
                      <Sparkles className="w-5 h-5 text-emerald-300 mx-auto mb-2" />
                      <p className="font-semibold text-text-primary text-sm mb-1">
                        Packaging submission
                      </p>
                      <p className="text-[var(--text-secondary)]">
                        Code · terminal log · 3 prompts + grades → sent to Pulse
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Agent panel */}
              <div className="border-t md:border-t-0 md:border-l border-[var(--border-color)] p-3 flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3 h-3" /> Coding agent
                  </span>
                  <span className="text-accent-bright normal-case">
                    {promptCount} logged
                  </span>
                </p>

                {reached('prompt1') && (
                  <div className="rounded-lg bg-accent-blue/10 border border-accent-blue/30 p-2 text-text-primary">
                    <p className="text-[9px] uppercase text-accent-bright mb-1 flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> You
                    </p>
                    {step === 'prompt1' ? (
                      <TypeText active text={GRADED_TRAIL[0].text} />
                    ) : (
                      GRADED_TRAIL[0].text
                    )}
                  </div>
                )}

                {reached('reply1') && (
                  <div className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-2 text-[var(--text-secondary)]">
                    <p className="text-[9px] uppercase mb-1 flex items-center gap-1">
                      <Bot className="w-2.5 h-2.5" /> Agent
                    </p>
                    {step === 'reply1' ? (
                      <TypeText
                        active
                        speed={16}
                        text="Token bucket — smoother bursts within the refill rate. Compute Retry-After from window start."
                      />
                    ) : (
                      'Token bucket — smoother bursts within the refill rate. Compute Retry-After from window start.'
                    )}
                  </div>
                )}

                {reached('prompt2') && (
                  <div className="rounded-lg bg-accent-blue/10 border border-accent-blue/30 p-2 text-text-primary">
                    <p className="text-[9px] uppercase text-accent-bright mb-1 flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> You
                    </p>
                    {step === 'prompt2' ? (
                      <TypeText active text={GRADED_TRAIL[2].text} />
                    ) : (
                      GRADED_TRAIL[2].text
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terminal */}
            <div className="border-t border-[var(--border-color)] bg-[#0d1117] p-3 font-mono text-xs min-h-[112px]">
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] mb-1.5 font-sans flex items-center gap-1.5">
                <TerminalSquare className="w-3 h-3" /> Terminal
              </p>
              {TERMINAL_LINES.slice(0, termN).map((l, i) => (
                <p key={i} className={l.c}>
                  {l.t}
                </p>
              ))}
              {termN === 0 && <p className="text-white/30">$</p>}
            </div>
          </div>
        )}

        {/* ---------------- Employer review ---------------- */}
        {employerPhase && (
          <div
            key="employer"
            className="p-4 md:p-6 min-h-[412px] flex flex-col gap-4"
            style={{ animation: 'ilaFade .45s ease' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Jordan K. — Backend Engineer @ Pulse
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  PLAT-1842 · submitted just now
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> tests passed
              </span>
            </div>

            {/* Graded prompt trail */}
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                <MessageSquareText className="w-3 h-3" /> Raw prompt trail · graded
              </p>
              <div className="space-y-2">
                {GRADED_TRAIL.map((p, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-2.5 text-xs flex items-start justify-between gap-3 transition-all duration-500 ${
                      reached('trail') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: `${i * 380}ms` }}
                  >
                    <div className="min-w-0">
                      <p className="text-text-primary truncate">{p.text}</p>
                      <p className="text-[var(--text-secondary)] text-[11px] mt-1">{p.verdict}</p>
                    </div>
                    <span className="shrink-0 font-bold text-accent-bright">{p.grade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
            <div
              className={`grid grid-cols-4 gap-2 transition-opacity duration-500 ${
                reached('scores') ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {[
                { label: 'Thinking', to: 84 },
                { label: 'Prompt trail', to: 78 },
                { label: 'Shipping', to: 82 },
                { label: 'Overall', to: 82 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-2.5 text-center"
                >
                  <p className="text-[10px] text-[var(--text-secondary)]">{s.label}</p>
                  <p className="text-lg font-bold text-text-primary">
                    <CountUp to={s.to} active={reached('scores')} />
                  </p>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div
              className={`rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 transition-all duration-500 ${
                reached('verdict') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="flex items-center gap-2 mb-1">
                <ThumbsUp className="w-4 h-4 text-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                  Strong advance
                </span>
              </p>
              <p className="text-sm font-semibold text-text-primary">
                Strong hire signal — advance to final round.
              </p>
              <div className="text-xs text-[var(--text-secondary)] mt-1.5 space-y-0.5">
                <p>
                  <span className="text-emerald-400">+</span> Shipped passing code; prompts show
                  decomposition and verification
                </p>
                <p>
                  <span className="text-amber-400">−</span> Probe live: how they verified
                  AI-generated tests
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase indicator + caption */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex gap-2 shrink-0">
          <span
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !employerPhase
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            1 · Candidate works the ticket
          </span>
          <span
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              employerPhase
                ? 'border-accent-blue/40 bg-accent-blue/10 text-accent-bright'
                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            2 · Employer reviews the trail
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]" aria-live="polite">
          {TIMELINE[at].caption}
        </p>
      </div>
    </div>
  );
}
