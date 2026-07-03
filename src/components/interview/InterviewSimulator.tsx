import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Square, MessageSquare, Play } from 'lucide-react';
import { runCode } from '../../utils/codeRunner';
import PremiumButton from '../ui/PremiumButton';
import ScoreBreakdown from './ScoreBreakdown';
import type { InterviewMessage, InterviewSession, PracticeProblem } from '../../types/interview';
import { callInterviewAgent } from '../../utils/interviewAgent';
import { saveSession } from '../../utils/interviewStorage';

interface InterviewSimulatorProps {
  problem: PracticeProblem;
  onExit: () => void;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ problem, onExit }) => {
  const [code, setCode] = useState(problem.starterCode);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}`);
  const startedAt = useRef(new Date().toISOString());
  const hasStarted = useRef(false);
  const [runOutput, setRunOutput] = useState('');
  const [running, setRunning] = useState(false);

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
            {problem.track === 'ai-engineer'
              ? 'AI Engineer'
              : problem.track === 'quant'
                ? 'Quant'
                : problem.track === 'market-engineering'
                  ? 'Market Engineering'
                  : 'Software'}{' '}
            · {problem.domain} ·{' '}
            {problem.difficulty}
          </p>
        </div>
        <div className="flex gap-2">
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
          <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
            <span className="text-sm font-medium text-text-secondary">Your code</span>
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
            className="flex-1 w-full p-4 bg-bg-secondary text-text-primary font-mono text-sm resize-none focus:outline-none min-h-[200px]"
            spellCheck={false}
          />
          {runOutput && (
            <pre className="p-3 text-xs bg-black/40 border-t border-gray-700 text-green-400 overflow-auto max-h-24">
              {runOutput}
            </pre>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card flex flex-col min-h-[360px] max-h-[480px]">
          <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent-blue" />
            <span className="font-medium text-text-primary">AI Interviewer</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm rounded-lg px-3 py-2 max-w-[90%] ${
                  m.role === 'candidate'
                    ? 'ml-auto bg-accent-blue/20 text-text-primary'
                    : m.role === 'interviewer'
                      ? 'bg-gray-800 text-text-primary'
                      : 'bg-gray-800/50 text-text-secondary text-xs italic'
                }`}
              >
                {m.role !== 'system' && (
                  <span className="block text-xs text-text-secondary mb-1 capitalize">{m.role}</span>
                )}
                {m.content}
              </div>
            ))}
            {loading && <p className="text-text-secondary text-sm animate-pulse">Interviewer is thinking…</p>}
            <div ref={chatEndRef} />
          </div>
          {!sessionEnded && (
            <div className="p-3 border-t border-gray-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Explain your thinking…"
                className="flex-1 px-3 py-2 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary text-sm focus:outline-none focus:border-accent-blue"
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
            <h4 className="font-semibold text-text-primary mb-2">Hints</h4>
            <ul className="text-sm text-text-secondary space-y-2">
              {problem.hints.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
