import React, { useState, useEffect } from 'react';
import ShaderBackground from './ShaderBackground';

interface AnimatedBackgroundProps {
  className?: string;
  opacity?: number;
  speed?: number;
  fallback?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  opacity = 0.3,
  speed = 1.0,
  fallback = false
}) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebglSupported(!!gl);
  }, []);

  // CSS-only fallback animation
  const CSSFallback: React.FC = () => (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Alpine Sky Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-full h-full"
          style={{
            background: `
              linear-gradient(to bottom, 
                rgba(20, 50, 87, 0.8) 0%, 
                rgba(51, 82, 128, 0.6) 30%, 
                rgba(32, 56, 89, 0.4) 70%, 
                rgba(8, 20, 34, 0.9) 100%
              )
            `
          }}
        />
        
        {/* Mountain Silhouettes with Glow */}
        <div 
          className="absolute bottom-0 w-full h-2/3"
          style={{
            background: `
              radial-gradient(ellipse 820px 320px at 20% 100%, rgba(178, 217, 255, 0.15) 0%, rgba(15, 23, 42, 0.9) 20%, transparent 60%),
              radial-gradient(ellipse 620px 220px at 60% 100%, rgba(178, 217, 255, 0.12) 0%, rgba(15, 23, 42, 0.8) 20%, transparent 60%),
              radial-gradient(ellipse 420px 170px at 85% 100%, rgba(178, 217, 255, 0.1) 0%, rgba(15, 23, 42, 0.7) 20%, transparent 60%)
            `,
            filter: 'drop-shadow(0 -2px 8px rgba(178, 217, 255, 0.3))'
          }}
        />
        
        {/* Additional Glow Layer */}
        <div 
          className="absolute bottom-0 w-full h-2/3 animate-pulse-slow"
          style={{
            background: `
              radial-gradient(ellipse 800px 40px at 20% 100%, rgba(178, 217, 255, 0.4) 0%, transparent 70%),
              radial-gradient(ellipse 600px 30px at 60% 100%, rgba(178, 217, 255, 0.3) 0%, transparent 70%),
              radial-gradient(ellipse 400px 25px at 85% 100%, rgba(178, 217, 255, 0.25) 0%, transparent 70%)
            `,
            mixBlendMode: 'soft-light'
          }}
        />
        
        {/* Alpine Light Beams */}
        <div 
          className="absolute w-full h-full animate-gradient-flow"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 30%, 
                rgba(153, 191, 243, 0.15) 40%, 
                rgba(243, 247, 253, 0.25) 50%, 
                rgba(153, 191, 243, 0.15) 60%, 
                transparent 70%
              )
            `,
            backgroundSize: '200% 200%',
            transform: 'rotate(25deg) scale(1.8)',
            mixBlendMode: 'soft-light'
          }}
        />
      </div>
      
      {/* Snow particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30 animate-float-particle"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`, // Keep particles in upper portion like snow
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>
    </div>
  );

  // Show loading state while checking WebGL support
  if (webglSupported === null) {
    return <CSSFallback />;
  }

  // Use WebGL shader if supported, otherwise fallback to CSS
  if (webglSupported && !fallback) {
    return (
      <ShaderBackground 
        className={className}
        opacity={opacity}
        speed={speed}
      />
    );
  }

  return <CSSFallback />;
};

export default AnimatedBackground;