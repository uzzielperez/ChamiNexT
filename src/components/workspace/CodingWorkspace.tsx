import { useCallback, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import Editor from '@monaco-editor/react';
import {
  Files,
  Terminal as TerminalIcon,
  Play,
  Circle,
  Bot,
  ChevronRight,
  X,
} from 'lucide-react';
import type { WorkspaceTemplate } from './workspaceTypes';
import type { PromptRecord, PromptSource } from '../../types/studioSubmission';
import WorkspaceTerminal from './WorkspaceTerminal';
import WorkspaceAgentPanel from './WorkspaceAgentPanel';
import PremiumButton from '../ui/PremiumButton';
import { runCode } from '../../utils/codeRunner';
import type { InterviewMessage } from '../../types/interview';
import { callWorkspaceAgent, type WorkspaceAgentContext } from '../../utils/workspaceAgent';

type CodingWorkspaceProps = {
  template: WorkspaceTemplate;
  onExit?: () => void;
  headerExtra?: React.ReactNode;
  className?: string;
  onFilesChange?: (files: Record<string, string>, activePath: string) => void;
  onPromptRecorded?: (record: PromptRecord) => void;
  hideBriefFooter?: boolean;
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

  const appendLog = (line: string) => {
    setTerminalLog((prev) => `${prev}\n${line}`.slice(-4000));
  };

  const updateFile = (path: string, content: string) => {
    setFiles((prev) => {
      const next = { ...prev, [path]: content };
      onFilesChange?.(next, activePath);
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
        const out = (await runBundled('npm test')) ?? '';
        const passed = /PASS:|passed/i.test(out) && !/FAIL:/i.test(out);
        setLastTestOutput(out);
        setLastTestPassed(passed);
        return { output: out, passed };
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
        return await runBundled(cmd === 'npm' ? 'npm test' : 'run');
      }

      if (cmd === 'agent') {
        if (!arg) return 'Usage: agent <your question>';
        await handleAgentSend(arg, 'terminal');
        return 'Agent replied in the side panel →';
      }

      return `Unknown command: ${cmd}. Type help.`;
    },
    [activePath, files, handleAgentSend, runBundled]
  );

  const editorLanguage = MONACO_LANG[languageByPath[activePath] ?? 'plaintext'] ?? 'plaintext';

  return (
    <div
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shadow-2xl ${className}`}
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
        {headerExtra}
        {onExit && (
          <PremiumButton variant="ghost" size="sm" onClick={onExit}>
            Close
          </PremiumButton>
        )}
      </div>

      <div className="flex h-[min(72vh,640px)] min-h-[420px] relative">
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

          <WorkspaceTerminal onRun={handleTerminalCommand} />
        </div>

        {/* Agent panel — always visible on lg, toggle on small via sidebar */}
        <div className="hidden lg:block w-[min(100%,280px)] shrink-0">
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
    </div>
  );
});
