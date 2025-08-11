import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variantStyles = {
    primary: 'bg-gold-600/20 text-gold-400',
    secondary: 'bg-gold-700/20 text-gold-300',
    success: 'bg-gold-500/20 text-gold-400',
    warning: 'bg-gold-600/30 text-gold-300',
    error: 'bg-gold-800/20 text-gold-500',
    info: 'bg-gold-400/20 text-gold-300',
  };
  
  const sizeStyles = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;