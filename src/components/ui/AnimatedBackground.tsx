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
      {/* Animated gradient beams */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-full h-full animate-gradient-x"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 30%, 
                rgba(59, 130, 246, 0.1) 40%, 
                rgba(59, 130, 246, 0.3) 50%, 
                rgba(59, 130, 246, 0.1) 60%, 
                transparent 70%
              )
            `,
            backgroundSize: '200% 200%',
            transform: 'rotate(15deg) scale(1.5)',
            animation: 'gradient-flow 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-full h-full animate-gradient-y"
          style={{
            background: `
              linear-gradient(135deg, 
                transparent 20%, 
                rgba(139, 92, 246, 0.1) 30%, 
                rgba(139, 92, 246, 0.2) 50%, 
                rgba(139, 92, 246, 0.1) 70%, 
                transparent 80%
              )
            `,
            backgroundSize: '200% 200%',
            transform: 'rotate(-15deg) scale(1.5)',
            animation: 'gradient-flow-reverse 12s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
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