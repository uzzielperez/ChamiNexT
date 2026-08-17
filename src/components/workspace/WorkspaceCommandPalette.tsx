import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, FileCode, Play, TestTube2, Bot, MessageSquare } from 'lucide-react';
import { WORKSPACE_QUICK_PROMPTS } from '../../utils/workspaceAgent';

export type CommandPaletteAction = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon?: React.ReactNode;
  run: () => void;
};

type WorkspaceCommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  actions: CommandPaletteAction[];
};

export default function WorkspaceCommandPalette({
  open,
  onClose,
  actions,
}: WorkspaceCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint?.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].run();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  const groups = [...new Set(filtered.map((a) => a.group))];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[#161b22] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border-color)]">
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or file name…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-[var(--border-color)] text-text-secondary">
            esc
          </kbd>
        </div>

        <div className="max-h-[min(50vh,360px)] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-text-secondary text-center">No matching commands</p>
          )}
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-secondary">{group}</p>
              {filtered
                .filter((a) => a.group === group)
                .map((action) => {
                  const idx = filtered.indexOf(action);
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        action.run();
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm ${
                        active ? 'bg-accent-blue/20 text-text-primary' : 'text-text-secondary hover:bg-white/5'
                      }`}
                    >
                      <span className="w-4 h-4 shrink-0 text-accent-blue">{action.icon}</span>
                      <span className="flex-1 truncate">{action.label}</span>
                      {action.hint && (
                        <span className="text-[10px] text-text-secondary/70 truncate max-w-[40%]">
                          {action.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-[var(--border-color)] text-[10px] text-text-secondary flex gap-3">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>⌘K toggle</span>
        </div>
      </div>
    </div>
  );
}

export const paletteIcons = {
  file: <FileCode className="w-4 h-4" />,
  run: <Play className="w-4 h-4" />,
  test: <TestTube2 className="w-4 h-4" />,
  agent: <Bot className="w-4 h-4" />,
  prompt: <MessageSquare className="w-4 h-4" />,
};
