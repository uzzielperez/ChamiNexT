import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalShelfProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const HorizontalShelf: React.FC<HorizontalShelfProps> = ({ title, subtitle, children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between gap-4 mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
    </section>
  );
};

export default HorizontalShelf;
