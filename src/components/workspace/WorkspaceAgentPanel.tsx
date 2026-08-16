import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { InterviewMessage } from '../../types/interview';
import { WORKSPACE_QUICK_PROMPTS } from '../../utils/workspaceAgent';

type WorkspaceAgentPanelProps = {
  messages: InterviewMessage[];
  loading: boolean;
  onSend: (text: string) => void;
  onQuickSend: (text: string) => void;
  subtitle?: string;
};

export default function WorkspaceAgentPanel({
  messages,
  loading,
  onSend,
  onQuickSend,
  subtitle = 'Prompt-aware pair programmer — every prompt is logged for employers',
}: WorkspaceAgentPanelProps) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full min-h-0 border-l border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="px-3 py-2.5 border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent-blue" aria-hidden />
          <span className="font-semibold text-sm text-text-primary">Coding agent</span>
          <Sparkles className="w-3.5 h-3.5 text-accent-bright ml-auto" aria-hidden />
        </div>
        <p className="text-[11px] text-text-secondary mt-1 leading-snug">{subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-xs text-text-secondary">
            Ask for reviews, test ideas, or pushback on your approach. The agent reads your open
            files and recent terminal output.
          </p>
        )}
        {messages
          .filter((m) => m.role !== 'system')
          .map((m) => (
            <div
              key={m.id}
              className={`text-sm rounded-lg px-3 py-2 ${
                m.role === 'candidate'
                  ? 'ml-2 bg-accent-blue/15 text-text-primary'
                  : 'mr-2 bg-[var(--bg-tertiary)] text-text-primary'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wide text-text-secondary mb-0.5">
                {m.role === 'candidate' ? 'You' : 'Agent'}
              </span>
              {m.content}
            </div>
          ))}
        {loading && (
          <p className="text-xs text-text-secondary animate-pulse">Agent reasoning…</p>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-2 border-t border-[var(--border-color)] shrink-0 space-y-2">
        <div className="flex flex-wrap gap-1">
          {WORKSPACE_QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQuickSend(q)}
              disabled={loading}
              className="text-[10px] px-2 py-1 rounded-md border border-[var(--border-color)] text-text-secondary hover:border-accent-blue/50 hover:text-accent-bright transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submit())}
            placeholder="Prompt the agent…"
            disabled={loading}
            className="flex-1 min-w-0 px-2.5 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary text-sm focus:outline-none focus:border-accent-blue"
          />
          <PremiumButton variant="primary" size="sm" onClick={submit} disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
