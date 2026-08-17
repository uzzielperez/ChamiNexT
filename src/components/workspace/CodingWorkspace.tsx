import { useCallback, useEffect, useMemo, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Files,
  Terminal as TerminalIcon,
  Play,
  Circle,
  Bot,
  ChevronRight,
  X,
  Command,
} from 'lucide-react';
import type { WorkspaceTemplate } from './workspaceTypes';
import type { PromptRecord, PromptSource } from '../../types/studioSubmission';
import WorkspaceTerminal from './WorkspaceTerminal';
import WorkspaceAgentPanel from './WorkspaceAgentPanel';
import WorkspaceCommandPalette, { paletteIcons, type CommandPaletteAction } from './WorkspaceCommandPalette';
import PremiumButton from '../ui/PremiumButton';
import { runCode } from '../../utils/codeRunner';
import type { InterviewMessage } from '../../types/interview';
import { callWorkspaceAgent, WORKSPACE_QUICK_PROMPTS, type WorkspaceAgentContext } from '../../utils/workspaceAgent';
import { runWorkspaceTests } from '../../utils/workspaceTestRunner';
import {
  loadWorkspace,
  scheduleWorkspaceSave,
  workspaceSyncStatus,
} from '../../utils/studioWorkspaceSync';

type CodingWorkspaceProps = {
  template: WorkspaceTemplate;
  onExit?: () => void;
  headerExtra?: React.ReactNode;
  className?: string;
  onFilesChange?: (files: Record<string, string>, activePath: string) => void;
  onPromptRecorded?: (record: PromptRecord) => void;
  hideBriefFooter?: boolean;
  /** Full-viewport studio layout — fills parent height, resizable terminal, status bar. */
  immersive?: boolean;
  /** Auto-save workspace files to cloud/local storage under this key (usually template.id). */
  persistKey?: string;
};

type SidebarTab = 'files' | 'agent';

export type WorkspaceSnapshot = {
  files: Record<string, string>;
  starterFiles: Record<string, string>;
  terminalLog: string;
  testOutput?: string;
  testPassed?: boolean;
};

export type CodingWorkspaceHandle = {
  getSnapshot: () => WorkspaceSnapshot;
  runTests: () => Promise<{ output: string; passed: boolean }>;
};

const MONACO_LANG: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  markdown: 'markdown',
  json: 'json',
  plaintext: 'plaintext',
};

export default forwardRef<CodingWorkspaceHandle, CodingWorkspaceProps>(function CodingWorkspace({
  template,
  onExit,
  headerExtra,
  className = '',
  onFilesChange,
  onPromptRecorded,
  hideBriefFooter = false,
  immersive = false,
  persistKey,
}, ref) {
  const starterFiles = useMemo(
    () => Object.fromEntries(template.files.map((f) => [f.path, f.content])),
    [template.files]
  );
  const languageByPath = useMemo(
    () => Object.fromEntries(template.files.map((f) => [f.path, f.language])),
    [template.files]
  );

  const [files, setFiles] = useState<Record<string, string>>(() =>
    Object.fromEntries(template.files.map((f) => [f.path, f.content]))
  );
  const [activePath, setActivePath] = useState(template.entryPath);
  const [openTabs, setOpenTabs] = useState<string[]>([template.entryPath]);
  const [sidebar, setSidebar] = useState<SidebarTab>('files');
  const [agentMessages, setAgentMessages] = useState<InterviewMessage[]>([]);
  const [agentLoading, setAgentLoading] = useState(false);
  const [terminalLog, setTerminalLog] = useState('');
  const [running, setRunning] = useState(false);
  const [lastTestOutput, setLastTestOutput] = useState<string | undefined>();
  const [lastTestPassed, setLastTestPassed] = useState<boolean | undefined>();
  const [promptCount, setPromptCount] = useState(0);
  const [terminalHeight, setTerminalHeight] = useState(immersive ? 180 : 140);
  const resizeRef = useRef<{ startY: number; startH: number } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saved' | 'loading'>(() =>
    persistKey ? 'loading' : 'idle'
  );
  const hydratedRef = useRef(false);

  const appendLog = (line: string) => {
    setTerminalLog((prev) => `${prev}\n${line}`.slice(-4000));
  };

  const updateFile = (path: string, content: string) => {
    setFiles((prev) => {
      const next = { ...prev, [path]: content };
      onFilesChange?.(next, activePath);
      if (persistKey && hydratedRef.current) {
        scheduleWorkspaceSave({
          templateId: persistKey,
          files: next,
          activePath,
          terminalLog,
          updatedAt: new Date().toISOString(),
        });
        setSyncStatus('saved');
      }
      return next;
    });
  };

  const openFile = (path: string) => {
    setActivePath(path);
    if (!openTabs.includes(path)) setOpenTabs((t) => [...t, path]);
    setSidebar('files');
  };

  const closeTab = (path: string) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== path);
      if (activePath === path && next.length) setActivePath(next[next.length - 1]);
      return next.length ? next : [template.entryPath];
    });
  };

  const runBundled = useCallback(
    async (label: string) => {
      setRunning(true);
      appendLog(`> ${label}`);
      try {
        const bundled = template.bundleForRun(files);
        const lang = template.runLanguage ?? 'javascript';
        const result = await runCode(bundled, lang);
        const out = result.success
          ? result.stdout || '(no output)'
          : `${result.stderr}\nexit ${result.exitCode}`;
        appendLog(out);
        return out;
      } finally {
        setRunning(false);
      }
    },
    [files, template]
  );

  useImperativeHandle(
    ref,
    () => ({
      getSnapshot: () => ({
        files,
        starterFiles,
        terminalLog,
        testOutput: lastTestOutput,
        testPassed: lastTestPassed,
      }),
      runTests: async () => {
        appendLog('> npm test');
        setRunning(true);
        try {
          const result = await runWorkspaceTests(files, template.bundleForRun);
          appendLog(result.output);
          setLastTestOutput(result.output);
          setLastTestPassed(result.passed);
          return { output: result.output, passed: result.passed };
        } finally {
          setRunning(false);
        }
      },
    }),
    [files, lastTestOutput, lastTestPassed, runBundled, starterFiles, terminalLog]
  );

  const handleAgentSend = useCallback(
    async (text: string, source: PromptSource = 'panel') => {
      const promptId = `p-${Date.now()}`;
      onPromptRecorded?.({
        id: promptId,
        at: new Date().toISOString(),
        source,
        text,
        activeFile: activePath,
      });
      setPromptCount((n) => n + 1);

      const userMsg: InterviewMessage = {
        id: `u-${Date.now()}`,
        role: 'candidate',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setAgentMessages((prev) => [...prev, userMsg]);
      setAgentLoading(true);
      setSidebar('agent');

      const ctx: WorkspaceAgentContext = {
        title: template.title,
        brief: template.ticketBrief ?? template.pmBrief ?? template.subtitle ?? '',
        activePath,
        files,
        terminalLog,
      };

      try {
        const res = await callWorkspaceAgent(ctx, agentMessages, text);
        setAgentMessages(res.messages);
        appendLog(`agent: ${res.reply.slice(0, 120)}…`);
      } finally {
        setAgentLoading(false);
      }
    },
    [activePath, agentMessages, files, onPromptRecorded, template, terminalLog]
  );

  const handleTerminalCommand = useCallback(
    async (command: string): Promise<string | void> => {
      const parts = command.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (cmd === 'help') {
        return [
          'help          — this message',
          'ls            — list workspace files',
          'cat <path>    — print a file',
          'run           — execute sandbox bundle',
          'npm test      — run limiter smoke tests',
          'agent <text>  — ask coding agent',
          'clear         — clear terminal screen',
        ].join('\n');
      }

      if (cmd === 'ls') {
        return Object.keys(files)
          .sort()
          .map((p) => (p === activePath ? `${p}  (active)` : p))
          .join('\n');
      }

      if (cmd === 'cat' && arg) {
        const content = files[arg];
        if (!content) return `ENOENT: ${arg}`;
        return content;
      }

      if (cmd === 'run' || cmd === 'npm') {
        if (cmd === 'npm' && parts[1] !== 'test') {
          return 'Only npm test is wired in the browser sandbox.';
        }
        if (cmd === 'npm') {
          appendLog('> npm test');
          setRunning(true);
          try {
            const result = await runWorkspaceTests(files, template.bundleForRun);
            setLastTestOutput(result.output);
            setLastTestPassed(result.passed);
            return result.output;
          } finally {
            setRunning(false);
          }
        }
        return await runBundled('run');
      }

      if (cmd === 'agent') {
        if (!arg) return 'Usage: agent <your question>';
        await handleAgentSend(arg, 'terminal');
        return 'Agent replied in the side panel →';
      }

      return `Unknown command: ${cmd}. Type help.`;
    },
    [activePath, files, handleAgentSend, runBundled, template]
  );

  useEffect(() => {
    if (!persistKey) return;
    let cancelled = false;
    void loadWorkspace(persistKey).then((saved) => {
      if (cancelled || !saved?.files) {
        hydratedRef.current = true;
        setSyncStatus('idle');
        return;
      }
      setFiles(saved.files);
      if (saved.activePath && saved.files[saved.activePath] !== undefined) {
        setActivePath(saved.activePath);
        setOpenTabs([saved.activePath]);
      }
      if (saved.terminalLog) setTerminalLog(saved.terminalLog);
      hydratedRef.current = true;
      setSyncStatus('saved');
    });
    return () => {
      cancelled = true;
    };
  }, [persistKey, template.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const paletteActions = useMemo((): CommandPaletteAction[] => {
    const fileActions = Object.keys(files)
      .sort()
      .map((path) => ({
        id: `file-${path}`,
        label: path.split('/').pop() ?? path,
        hint: path,
        group: 'Files',
        icon: paletteIcons.file,
        run: () => openFile(path),
      }));

    const promptActions = WORKSPACE_QUICK_PROMPTS.map((q, i) => ({
      id: `prompt-${i}`,
      label: q,
      group: 'Agent prompts',
      icon: paletteIcons.prompt,
      run: () => void handleAgentSend(q, 'quick'),
    }));

    return [
      ...fileActions,
      {
        id: 'run',
        label: 'Run sandbox',
        hint: 'run',
        group: 'Terminal',
        icon: paletteIcons.run,
        run: () => void runBundled('run'),
      },
      {
        id: 'test',
        label: 'Run tests',
        hint: 'npm test',
        group: 'Terminal',
        icon: paletteIcons.test,
        run: () => {
          void (async () => {
            appendLog('> npm test');
            setRunning(true);
            try {
              const result = await runWorkspaceTests(files, template.bundleForRun);
              appendLog(result.output);
              setLastTestOutput(result.output);
              setLastTestPassed(result.passed);
            } finally {
              setRunning(false);
            }
          })();
        },
      },
      {
        id: 'agent-panel',
        label: 'Focus coding agent',
        group: 'View',
        icon: paletteIcons.agent,
        run: () => setSidebar('agent'),
      },
      ...promptActions,
    ];
  }, [files, handleAgentSend, runBundled, template]);

  const editorLanguage = MONACO_LANG[languageByPath[activePath] ?? 'plaintext'] ?? 'plaintext';

  const startTerminalResize = (clientY: number) => {
    resizeRef.current = { startY: clientY, startH: terminalHeight };
  };

  const onTerminalResizeMove = useCallback((clientY: number) => {
    if (!resizeRef.current) return;
    const delta = resizeRef.current.startY - clientY;
    const next = Math.min(420, Math.max(100, resizeRef.current.startH + delta));
    setTerminalHeight(next);
  }, []);

  const endTerminalResize = useCallback(() => {
    resizeRef.current = null;
  }, []);

  const workspaceHeightClass = immersive
    ? 'flex-1 min-h-0 h-full'
    : 'h-[min(72vh,640px)] min-h-[420px]';

  return (
    <div
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-2xl ${
        immersive ? 'flex flex-col h-full' : ''
      } ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
        <div className="flex gap-1.5 mr-2" aria-hidden>
          <Circle className="w-3 h-3 text-red-400 fill-red-400/80" />
          <Circle className="w-3 h-3 text-amber-400 fill-amber-400/80" />
          <Circle className="w-3 h-3 text-green-400 fill-green-400/80" />
        </div>
        <span className="text-xs font-mono text-text-secondary truncate flex-1">
          {template.title} — ChamiNexT Studio
        </span>
        {immersive && (
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[var(--border-color)] text-[10px] text-text-secondary hover:text-text-primary"
          >
            <Command className="w-3 h-3" />
            ⌘K
          </button>
        )}
        {headerExtra}
        {onExit && (
          <PremiumButton variant="ghost" size="sm" onClick={onExit}>
            Close
          </PremiumButton>
        )}
      </div>

      <div className={`flex ${workspaceHeightClass} relative`}>
        {/* Activity bar */}
        <div className="w-11 shrink-0 flex flex-col items-center py-3 gap-3 border-r border-[var(--border-color)] bg-[#0d1117]">
          <button
            type="button"
            onClick={() => setSidebar('files')}
            className={`p-2 rounded-lg ${sidebar === 'files' ? 'text-accent-bright bg-accent-blue/15' : 'text-text-secondary hover:text-text-primary'}`}
            title="Explorer"
          >
            <Files className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSidebar('agent')}
            className={`p-2 rounded-lg ${sidebar === 'agent' ? 'text-accent-bright bg-accent-blue/15' : 'text-text-secondary hover:text-text-primary'}`}
            title="Coding agent"
          >
            <Bot className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <TerminalIcon className="w-4 h-4 text-text-secondary/40" aria-hidden />
        </div>

        {/* Sidebar */}
        {sidebar === 'files' && (
          <div className="w-52 shrink-0 border-r border-[var(--border-color)] bg-[#161b22] overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider text-text-secondary px-3 py-2">
              Explorer
            </p>
            {Object.keys(files)
              .sort()
              .map((path) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => openFile(path)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center gap-1 truncate ${
                    path === activePath
                      ? 'bg-accent-blue/20 text-accent-bright'
                      : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                  {path}
                </button>
              ))}
          </div>
        )}

        {/* Editor + terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-1 px-2 py-1 border-b border-[var(--border-color)] bg-[#1c2128] overflow-x-auto">
            {openTabs.map((tab) => (
              <div
                key={tab}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-t text-xs font-mono shrink-0 ${
                  tab === activePath
                    ? 'bg-[#0d1117] text-text-primary border-t border-x border-[var(--border-color)]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <button type="button" onClick={() => setActivePath(tab)} className="truncate max-w-[140px]">
                  {tab.split('/').pop()}
                </button>
                {openTabs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => closeTab(tab)}
                    className="text-text-secondary hover:text-text-primary"
                    aria-label={`Close ${tab}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <div className="ml-auto flex items-center gap-1 shrink-0">
              <PremiumButton
                variant="ghost"
                size="sm"
                onClick={() => void runBundled('run')}
                loading={running}
              >
                <Play className="w-3 h-3 mr-1" />
                Run
              </PremiumButton>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={editorLanguage}
              value={files[activePath] ?? ''}
              onChange={(v) => updateFile(activePath, v ?? '')}
              theme="vs-dark"
              options={{
                fontFamily: 'Roboto Mono, ui-monospace, monospace',
                fontSize: 13,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {immersive && (
            <div
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize terminal"
              className="h-1.5 cursor-row-resize bg-[var(--bg-tertiary)] hover:bg-accent-blue/40 active:bg-accent-blue/60 transition-colors shrink-0"
              onMouseDown={(e) => {
                startTerminalResize(e.clientY);
                const onMove = (ev: MouseEvent) => onTerminalResizeMove(ev.clientY);
                const onUp = () => {
                  endTerminalResize();
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            />
          )}

          <WorkspaceTerminal onRun={handleTerminalCommand} height={terminalHeight} />
        </div>

        {/* Agent panel — always visible on lg, toggle on small via sidebar */}
        <div className={`hidden lg:block shrink-0 ${immersive ? 'w-[min(100%,320px)]' : 'w-[min(100%,280px)]'}`}>
          <WorkspaceAgentPanel
            messages={agentMessages}
            loading={agentLoading}
            onSend={(text) => handleAgentSend(text, 'panel')}
            onQuickSend={(text) => handleAgentSend(text, 'quick')}
          />
        </div>
        {sidebar === 'agent' && (
          <div className="lg:hidden w-full max-w-sm shrink-0 absolute right-0 top-0 bottom-0 z-10 shadow-xl">
            <WorkspaceAgentPanel
              messages={agentMessages}
              loading={agentLoading}
              onSend={handleAgentSend}
            />
          </div>
        )}
      </div>

      {(template.ticketBrief || template.pmBrief) && !hideBriefFooter && (
        <div className="px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)] text-xs text-text-secondary max-h-24 overflow-y-auto">
          {template.pmBrief && <p className="mb-1"><span className="text-accent-blue font-semibold">PM:</span> {template.pmBrief}</p>}
          {template.ticketBrief && <p><span className="text-accent-blue font-semibold">Ticket:</span> {template.ticketBrief}</p>}
        </div>
      )}

      {immersive && (
        <div className="flex items-center gap-4 px-3 py-1 border-t border-[var(--border-color)] bg-[#0d1117] text-[11px] text-text-secondary shrink-0">
          <span className="font-mono truncate">{activePath}</span>
          <span className="hidden sm:inline">{editorLanguage}</span>
          {persistKey && (
            <span className="hidden md:inline text-text-secondary/70">
              {syncStatus === 'loading'
                ? 'Restoring…'
                : syncStatus === 'saved'
                  ? `${workspaceSyncStatus()} saved`
                  : 'Ready'}
            </span>
          )}
          <span className="ml-auto tabular-nums">{promptCount} prompts logged</span>
          {lastTestPassed !== undefined && (
            <span className={lastTestPassed ? 'text-green-400' : 'text-amber-400'}>
              tests {lastTestPassed ? 'passing' : 'failing'}
            </span>
          )}
        </div>
      )}

      <WorkspaceCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        actions={paletteActions}
      />
    </div>
  );
});
