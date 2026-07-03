import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Square, MessageSquare, Play, Clock, Lightbulb } from 'lucide-react';
import { runCode } from '../../utils/codeRunner';
import PremiumButton from '../ui/PremiumButton';
import ScoreBreakdown from './ScoreBreakdown';
import type { InterviewMessage, InterviewSession, PracticeProblem, PracticeTrack } from '../../types/interview';
import { callInterviewAgent } from '../../utils/interviewAgent';
import { saveSession } from '../../utils/interviewStorage';

interface InterviewSimulatorProps {
  problem: PracticeProblem;
  onExit: () => void;
}

const TRACK_LABELS: Record<PracticeTrack, string> = {
  software: 'Software',
  'ai-engineer': 'AI Engineer',
  quant: 'Quant',
  cybersecurity: 'Cybersecurity',
  'market-engineering': 'Market Engineering',
};

const formatElapsed = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ problem, onExit }) => {
  const [code, setCode] = useState(problem.starterCode);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}`);
  const startedAt = useRef(new Date().toISOString());
  const hasStarted = useRef(false);
  const [runOutput, setRunOutput] = useState('');
  const [running, setRunning] = useState(false);

  const budgetSeconds = problem.estimatedMinutes * 60;
  const overBudget = elapsed > budgetSeconds;

  useEffect(() => {
    if (sessionEnded) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [sessionEnded]);

  const appendMessage = (role: InterviewMessage['role'], content: string) => {
    const msg: InterviewMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const startInterview = useCallback(async () => {
    setLoading(true);
    const opening = appendMessage('system', `Interview started: ${problem.title}`);
    try {
      const res = await callInterviewAgent({
        problem,
        code,
        messages: [opening],
        action: 'chat',
      });
      if (res.reply) appendMessage('interviewer', res.reply);
      if (res.followUp) appendMessage('interviewer', res.followUp);
    } finally {
      setLoading(false);
    }
  }, [problem, code]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCode = async () => {
    if (!problem.runLanguage) {
      setRunOutput('// Run not available for design/debugging prompts — explain in chat.');
      return;
    }
    setRunning(true);
    const result = await runCode(code, problem.runLanguage);
    setRunOutput(
      result.success
        ? result.stdout || '(no output)'
        : `${result.stderr}\nExit: ${result.exitCode}`
    );
    setRunning(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || sessionEnded) return;
    const text = input.trim();
    setInput('');
    const candidateMsg = appendMessage('candidate', text);
    setLoading(true);
    try {
      const res = await callInterviewAgent({
        problem,
        code,
        messages: [...messages, candidateMsg],
        action: 'chat',
        candidateMessage: text,
      });
      if (res.reply) appendMessage('interviewer', res.reply);
      if (res.followUp) appendMessage('interviewer', res.followUp);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      const res = await callInterviewAgent({
        problem,
        code,
        messages,
        action: 'score',
      });
      const ended: InterviewSession = {
        id: sessionId.current,
        problemId: problem.id,
        startedAt: startedAt.current,
        endedAt: new Date().toISOString(),
        messages,
        code,
        scores: res.scores,
        scoreNotes: res.scoreNotes,
      };
      saveSession(ended);
      setSession(ended);
      setSessionEnded(true);
      appendMessage('system', 'Interview ended. Scores saved to your talent profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{problem.title}</h2>
          <p className="text-sm text-text-secondary capitalize">
            {TRACK_LABELS[problem.track] ?? 'Software'} · {problem.domain} · {problem.difficulty}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium tabular-nums border ${
              overBudget
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-text-secondary'
            }`}
            title={`Target: ${problem.estimatedMinutes} minutes`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden />
            {formatElapsed(elapsed)} / {problem.estimatedMinutes}:00
          </span>
          {!sessionEnded && (
            <PremiumButton variant="secondary" size="sm" onClick={endInterview} disabled={loading}>
              <Square className="w-4 h-4 mr-1" />
              End & score
            </PremiumButton>
          )}
          <PremiumButton variant="ghost" size="sm" onClick={onExit}>
            Back
          </PremiumButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-4">
          <h3 className="font-semibold text-text-primary mb-3">Problem</h3>
          <p className="text-text-secondary text-sm whitespace-pre-wrap">{problem.prompt}</p>
        </div>
        <div className="card p-0 overflow-hidden flex flex-col min-h-[280px]">
          <div className="px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center">
            <span className="text-sm font-medium text-text-secondary">
              Your code{problem.runLanguage ? ` · ${problem.runLanguage}` : ''}
            </span>
            {problem.runLanguage && (
              <PremiumButton variant="ghost" size="sm" onClick={handleRunCode} loading={running}>
                <Play className="w-3 h-3 mr-1" />
                Run
              </PremiumButton>
            )}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={sessionEnded}
            className="flex-1 w-full p-4 bg-[var(--bg-secondary)] text-text-primary font-mono text-sm resize-none focus:outline-none min-h-[200px] leading-relaxed"
            spellCheck={false}
            aria-label="Code editor"
          />
          {runOutput && (
            <pre className="p-3 text-xs bg-black/40 border-t border-[var(--border-color)] text-green-400 overflow-auto max-h-24">
              {runOutput}
            </pre>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card flex flex-col min-h-[360px] max-h-[480px]">
          <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent-blue" />
            <span className="font-medium text-text-primary">AI Interviewer</span>
            <span className="text-xs text-text-secondary ml-auto">
              Think out loud — your reasoning is scored, not just the code.
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm rounded-lg px-3 py-2 max-w-[90%] ${
                  m.role === 'candidate'
                    ? 'ml-auto bg-accent-blue/20 text-text-primary'
                    : m.role === 'interviewer'
                      ? 'bg-[var(--bg-tertiary)] text-text-primary'
                      : 'bg-[var(--bg-tertiary)]/60 text-text-secondary text-xs italic'
                }`}
              >
                {m.role !== 'system' && (
                  <span className="block text-xs text-text-secondary mb-1">
                    {m.role === 'candidate' ? 'You' : 'Interviewer'}
                  </span>
                )}
                {m.content}
              </div>
            ))}
            {loading && <p className="text-text-secondary text-sm animate-pulse">Interviewer is thinking…</p>}
            <div ref={chatEndRef} />
          </div>
          {!sessionEnded && (
            <div className="p-3 border-t border-[var(--border-color)] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Explain your thinking…"
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary text-sm focus:outline-none focus:border-accent-blue"
                disabled={loading}
              />
              <PremiumButton variant="primary" size="sm" onClick={sendMessage} disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </PremiumButton>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {session?.scores && <ScoreBreakdown scores={session.scores} notes={session.scoreNotes} />}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-text-primary flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-accent-blue" aria-hidden />
                Hints
              </h4>
              <span className="text-xs text-text-secondary tabular-nums">
                {revealedHints}/{problem.hints.length} used
              </span>
            </div>
            {revealedHints === 0 && (
              <p className="text-xs text-text-secondary mb-3">
                Try without hints first — real interviews reward independent reasoning.
              </p>
            )}
            {revealedHints > 0 && (
              <ol className="text-sm text-text-secondary space-y-2 mb-3 list-decimal pl-5">
                {problem.hints.slice(0, revealedHints).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            )}
            {revealedHints < problem.hints.length && (
              <button
                type="button"
                onClick={() => setRevealedHints((n) => n + 1)}
                className="text-accent-blue text-sm font-medium hover:underline"
              >
                Reveal {revealedHints === 0 ? 'first' : 'next'} hint
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
