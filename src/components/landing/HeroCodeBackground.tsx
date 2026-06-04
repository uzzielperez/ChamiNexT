import React from 'react';

const CODE_TEXTURE = `async function shipTest(deadline) {
  const mvp = await buildWithAI(hints);
  return deploy(mvp.url);
// ChamiNext: reasoning > memorization`;

const HeroCodeBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
    <div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(180deg, transparent 0%, var(--bg-primary) 88%),
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.06) 0%, transparent 70%)
        `,
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `
          linear-gradient(var(--border-color) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
    <pre
      className="absolute inset-0 m-0 p-0 font-mono text-[10px] sm:text-xs leading-loose whitespace-pre-wrap break-all opacity-[0.08] select-none"
      style={{
        color: 'var(--text-secondary)',
        padding: '12% 8%',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
      }}
    >
      {CODE_TEXTURE}
    </pre>
    <div
      className="absolute bottom-0 left-0 right-0 h-[45%] opacity-[0.08]"
      style={{
        background: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 79px,
            rgba(59, 130, 246, 0.4) 80px
          )
        `,
        transform: 'perspective(400px) rotateX(52deg)',
        transformOrigin: 'bottom center',
      }}
    />
  </div>
);

export default HeroCodeBackground;
