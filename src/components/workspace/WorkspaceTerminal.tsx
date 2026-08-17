import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export type TerminalRunner = (command: string) => Promise<string | void>;

type WorkspaceTerminalProps = {
  onRun: TerminalRunner;
  className?: string;
  height?: number;
};

const PROMPT = '\r\n$ ';

export default function WorkspaceTerminal({ onRun, className = '', height = 140 }: WorkspaceTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const lineRef = useRef('');
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const writeln = useCallback((text: string) => {
    const term = termRef.current;
    if (!term) return;
    term.writeln(text.replace(/\n/g, '\r\n'));
  }, []);

  const processCommand = useCallback(
    async (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      if (trimmed === 'clear') {
        termRef.current?.clear();
        return;
      }

      try {
        const out = await onRunRef.current(trimmed);
        if (out) writeln(out);
      } catch (err) {
        writeln(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [writeln]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#3b82f6',
        selectionBackground: '#3b82f640',
        black: '#0d1117',
        brightBlack: '#6e7681',
        red: '#f85149',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#e6edf3',
      },
      fontFamily: 'Roboto Mono, ui-monospace, monospace',
      fontSize: 12,
      lineHeight: 1.35,
      cursorBlink: true,
      scrollback: 500,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();

    termRef.current = term;
    fitRef.current = fit;

    term.writeln('ChamiNexT studio terminal — AI-assisted coding sandbox');
    term.writeln('Commands: help · ls · cat <path> · run · npm test · agent <question>');
    term.write(PROMPT);

    term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        term.write('\r\n');
        const cmd = lineRef.current;
        lineRef.current = '';
        void processCommand(cmd);
        term.write(PROMPT);
        return;
      }

      if (code === 127) {
        if (lineRef.current.length > 0) {
          lineRef.current = lineRef.current.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      if (code < 32) return;

      lineRef.current += data;
      term.write(data);
    });

    const ro = new ResizeObserver(() => {
      try {
        fit.fit();
      } catch {
        /* ignore fit before layout */
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, [processCommand]);

  useEffect(() => {
    try {
      fitRef.current?.fit();
    } catch {
      /* ignore fit before layout */
    }
  }, [height]);

  return (
    <div
      className={`border-t border-[var(--border-color)] bg-[#0d1117] ${className}`}
      aria-label="Studio terminal"
    >
      <div className="px-3 py-1.5 border-b border-[var(--border-color)] flex items-center gap-2 text-xs text-text-secondary">
        <span className="font-mono">terminal</span>
        <span className="text-text-secondary/60">zsh · sandbox</span>
      </div>
      <div ref={containerRef} className="px-1 py-1" style={{ height }} />
    </div>
  );
}
