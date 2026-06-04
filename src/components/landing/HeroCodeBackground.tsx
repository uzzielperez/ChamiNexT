import React from 'react';

const CODE_LINES = [
  'async function shipTest(deadline) {',
  '  const mvp = await buildWithAI(hints);',
  '  return deploy(mvp.url); // signal',
  '// ChamiNext: reasoning > memorization',
];

const HeroCodeBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
    <div
      className="absolute inset-0 opacity-40"
      style={{
        background: `
          linear-gradient(180deg, transparent 0%, var(--bg-primary) 85%),
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)
        `,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.14]"
      style={{
        backgroundImage: `
          linear-gradient(var(--border-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'linear-gradient(180deg, black 0%, transparent 75%)',
        WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 75%)',
      }}
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-[55%] opacity-20"
      style={{
        background: `
          linear-gradient(to bottom, transparent, var(--accent-primary) 120%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 79px,
            rgba(59, 130, 246, 0.15) 80px
          )
        `,
        transform: 'perspective(400px) rotateX(52deg)',
        transformOrigin: 'bottom center',
      }}
    />
    <div className="absolute left-[8%] top-[18%] max-w-md font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--text-secondary)] opacity-30 select-none">
      {CODE_LINES.map((line) => (
        <div key={line} className="whitespace-pre">
          {line}
        </div>
      ))}
    </div>
  </div>
);

export default HeroCodeBackground;
