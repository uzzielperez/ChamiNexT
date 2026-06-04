import React from 'react';

/** Icon only: C arc + forward ship chevron inside a framed mark */
export const ChamiNextMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <rect
      x="1.5"
      y="1.5"
      width="29"
      height="29"
      rx="7"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M11 9.5c-5 3-5 11 0 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M11 23.5 17.5 16 24 20.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="23" cy="11" r="2" fill="currentColor" />
  </svg>
);

type LogoSize = 'sm' | 'md' | 'lg';

const markPixels: Record<LogoSize, number> = { sm: 28, md: 32, lg: 40 };

interface ChamiNextLogoProps {
  showWordmark?: boolean;
  size?: LogoSize;
  className?: string;
  wordmarkClassName?: string;
}

const ChamiNextLogo: React.FC<ChamiNextLogoProps> = ({
  showWordmark = true,
  size = 'md',
  className = '',
  wordmarkClassName = '',
}) => {
  const px = markPixels[size];
  const box =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`${box} rounded-lg border-2 border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0 text-[var(--accent-primary)]`}
      >
        <ChamiNextMark size={px - 10} />
      </span>
      {showWordmark && (
        <span
          className={`font-bold tracking-tight ${textSize} ${wordmarkClassName}`}
        >
          <span className="text-[var(--text-primary)]">Chami</span>
          <span className="text-[var(--accent-bright)]">Next</span>
        </span>
      )}
    </span>
  );
};

export default ChamiNextLogo;
