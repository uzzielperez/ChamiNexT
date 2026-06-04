import React from 'react';

/** Static mock of practice UI — answers "what is this?" below the hero fold */
const HeroProductPreview: React.FC = () => (
  <div className="container relative z-10 max-w-4xl mx-auto mt-16 md:mt-20 px-4 pb-8">
    <div
      className="rounded-xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2">ChamiNext · AI Interview</span>
      </div>
      <div className="grid md:grid-cols-2 gap-0 min-h-[200px]">
        <div className="p-4 border-b md:border-b-0 md:border-r border-[var(--border-color)]">
          <p className="text-[10px] uppercase tracking-wide text-[var(--accent-bright)] mb-2">
            Problem
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            RAG chunking for legal docs
          </p>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
            Design chunking and retrieval. Cite failure modes and evaluation strategy.
          </p>
        </div>
        <div className="p-4 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] mb-2">
              Interviewer
            </p>
            <p className="text-xs text-[var(--text-primary)] rounded-lg bg-[var(--bg-tertiary)] p-2.5">
              Walk me through your approach before we optimize latency.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
            <p className="text-[10px] font-mono text-[var(--text-secondary)]">
              # Architecture notes
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroProductPreview;
