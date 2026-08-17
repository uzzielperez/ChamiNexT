import type { ReactNode } from 'react';

type StudioShellProps = {
  children: ReactNode;
};

/** Full-viewport wrapper for the browser coding studio (Cursor-style). */
export default function StudioShell({ children }: StudioShellProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {children}
    </div>
  );
}
