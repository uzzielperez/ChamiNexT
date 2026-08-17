import { useEffect, useMemo, useState, useRef } from 'react';
import { Send, Sparkles, Bot, ChevronDown } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { InterviewMessage } from '../../types/interview';
import {
  WORKSPACE_QUICK_PROMPTS,
  fetchStudioModels,
  loadStudioModelId,
  saveStudioModelId,
  STUDIO_MODELS,
  DEFAULT_STUDIO_MODEL_ID,
  getStudioModelLabel,
} from '../../utils/workspaceAgent';

type WorkspaceAgentPanelProps = {
  messages: InterviewMessage[];
  loading: boolean;
  modelId: string;
  onModelChange: (modelId: string) => void;
  onSend: (text: string) => void;
  onQuickSend: (text: string) => void;
  subtitle?: string;
};

export default function WorkspaceAgentPanel({
  messages,
  loading,
  modelId,
  onModelChange,
  onSend,
  onQuickSend,
  subtitle = 'Prompt-aware pair programmer — every prompt is logged for employers',
}: WorkspaceAgentPanelProps) {
  const [input, setInput] = useState('');
  const [liveProviders, setLiveProviders] = useState<{ groq: boolean; openrouter: boolean } | null>(
    null
  );
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetchStudioModels().then((data) => {
      if (data?.providers) setLiveProviders(data.providers);
    });
  }, []);

  const selectableModels = useMemo(() => {
    if (!liveProviders) return STUDIO_MODELS;
    return STUDIO_MODELS.filter((m) => {
      if (m.provider === 'groq') return liveProviders.groq;
      if (m.provider === 'openrouter') return liveProviders.openrouter;
      return false;
    });
  }, [liveProviders]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const submit = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleModelChange = (id: string) => {
    saveStudioModelId(id);
    onModelChange(id);
  };

  const providerHint =
    liveProviders === null
      ? ''
      : !liveProviders.groq && !liveProviders.openrouter
        ? ' · demo mode (add API keys on Netlify)'
        : '';

  return (
    <div className="flex flex-col h-full min-h-0 border-l border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="px-3 py-2.5 border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent-blue" aria-hidden />
          <span className="font-semibold text-sm text-text-primary">Coding agent</span>
          <Sparkles className="w-3.5 h-3.5 text-accent-bright ml-auto" aria-hidden />
        </div>
        <p className="text-[11px] text-text-secondary mt-1 leading-snug">
          {subtitle}
          {providerHint}
        </p>

        <div className="relative mt-2">
          <label htmlFor="studio-model" className="sr-only">
            Model
          </label>
          <select
            id="studio-model"
            value={selectableModels.some((m) => m.id === modelId) ? modelId : DEFAULT_STUDIO_MODEL_ID}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={loading}
            className="w-full appearance-none pl-2.5 pr-7 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-text-primary focus:outline-none focus:border-accent-blue"
          >
            {selectableModels.length === 0 ? (
              <option value={DEFAULT_STUDIO_MODEL_ID}>Demo (no API keys)</option>
            ) : (
              selectableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} · {m.badge}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <p className="text-[10px] text-text-secondary/80 mt-1 truncate">
          {getStudioModelLabel(modelId)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-xs text-text-secondary">
            Ask for reviews, test ideas, or pushback on your approach. Groq for speed; OpenRouter
            for DeepSeek, Qwen Coder, and Llama variants.
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
          <p className="text-xs text-text-secondary animate-pulse">
            {getStudioModelLabel(modelId)} thinking…
          </p>
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
