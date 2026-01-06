import React from 'react';

export interface GradientBackgroundProps {
  variant?: 'hero' | 'section' | 'card' | 'subtle' | 'dark' | 'purple' | 'blue';
  animated?: boolean;
  overlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = 'hero',
  animated = false,
  overlay = false,
  className = '',
  children
}) => {
  const variants = {
    hero: `
      bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
      ${animated ? 'animate-gradient-xy' : ''}
    `,
    section: `
      bg-gradient-to-r from-blue-900/20 to-purple-900/20
      backdrop-blur-sm
      ${animated ? 'animate-gradient-x' : ''}
    `,
    card: `
      bg-gradient-to-br from-white/10 to-white/5
      backdrop-blur-md border border-white/20
      shadow-xl
      ${animated ? 'animate-gradient-xy' : ''}
    `,
    subtle: `
      bg-gradient-to-b from-transparent to-black/10
      ${animated ? 'animate-gradient-y' : ''}
    `,
    dark: `
      bg-gradient-to-br from-gray-900 via-black to-gray-900
      ${animated ? 'animate-gradient-xy' : ''}
    `,
    purple: `
      bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900
      ${animated ? 'animate-gradient-xy' : ''}
    `,
    blue: `
      bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900
      ${animated ? 'animate-gradient-xy' : ''}
    `
  };

  return (
    <div className={`relative overflow-hidden ${variants[variant]} ${className}`}>
      {/* Animated Background Layer */}
      {animated && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse" />
        </div>
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;