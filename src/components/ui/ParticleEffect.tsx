import React, { useEffect, useRef } from 'react';

export interface ParticleEffectProps {
  count?: number;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  count = 50,
  color = '#3b82f6',
  size = 'md',
  speed = 'medium',
  direction = 'up',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const sizeMap = {
    xs: { min: 1, max: 2 },
    sm: { min: 1, max: 3 },
    md: { min: 2, max: 4 },
    lg: { min: 3, max: 6 }
  };

  const speedMap = {
    slow: { min: 0.2, max: 0.8 },
    medium: { min: 0.5, max: 1.5 },
    fast: { min: 1, max: 3 }
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const sizeRange = sizeMap[size];
    const speedRange = speedMap[speed];
    
    let x, y, vx, vy;
    
    switch (direction) {
      case 'up':
        x = Math.random() * canvas.width;
        y = canvas.height + 10;
        vx = (Math.random() - 0.5) * speedRange.max;
        vy = -Math.random() * speedRange.max - speedRange.min;
        break;
      case 'down':
        x = Math.random() * canvas.width;
        y = -10;
        vx = (Math.random() - 0.5) * speedRange.max;
        vy = Math.random() * speedRange.max + speedRange.min;
        break;
      case 'left':
        x = canvas.width + 10;
        y = Math.random() * canvas.height;
        vx = -Math.random() * speedRange.max - speedRange.min;
        vy = (Math.random() - 0.5) * speedRange.max;
        break;
      case 'right':
        x = -10;
        y = Math.random() * canvas.height;
        vx = Math.random() * speedRange.max + speedRange.min;
        vy = (Math.random() - 0.5) * speedRange.max;
        break;
      default: // random
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        vx = (Math.random() - 0.5) * speedRange.max * 2;
        vy = (Math.random() - 0.5) * speedRange.max * 2;
    }

    const maxLife = 300 + Math.random() * 200;
    
    return {
      id: Math.random(),
      x,
      y,
      vx,
      vy,
      size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
      opacity: Math.random() * 0.5 + 0.2,
      life: maxLife,
      maxLife
    };
  };

  const updateParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
      
      // Fade out as life decreases
      particle.opacity = (particle.life / particle.maxLife) * 0.7;
      
      // Remove particles that are out of bounds or dead
      return particle.life > 0 &&
             particle.x > -50 && particle.x < canvas.width + 50 &&
             particle.y > -50 && particle.y < canvas.height + 50;
    });

    // Add new particles to maintain count
    while (particlesRef.current.length < count) {
      particlesRef.current.push(createParticle(canvas));
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(canvas);
    drawParticles(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    
    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(canvas));
    }

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [count, color, size, speed, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleEffect;