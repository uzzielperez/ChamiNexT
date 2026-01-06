import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClasses = `
      premium-button
      inline-flex items-center justify-center
      font-medium rounded-xl
      transition-all duration-300 ease-out
      transform hover:scale-105 active:scale-95
      focus:outline-none focus:ring-4 focus:ring-opacity-50
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:transform-none disabled:hover:scale-100
      relative overflow-hidden
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantClasses = {
      primary: `
        bg-gradient-to-r from-blue-600 to-blue-700
        hover:from-blue-700 hover:to-blue-800
        text-white shadow-lg hover:shadow-xl
        focus:ring-blue-500
        border border-blue-600 hover:border-blue-700
      `,
      secondary: `
        bg-white/10 backdrop-blur-md
        border border-white/20 hover:border-white/30
        text-white hover:bg-white/20
        focus:ring-white/50
        shadow-lg hover:shadow-xl
      `,
      ghost: `
        bg-transparent hover:bg-white/10
        text-white/80 hover:text-white
        focus:ring-white/30
        border border-transparent hover:border-white/20
      `,
      gradient: `
        bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600
        hover:from-gold-500 hover:via-gold-600 hover:to-gold-700
        text-black font-semibold shadow-lg hover:shadow-xl
        focus:ring-gold-500
        border border-gold-500 hover:border-gold-600
      `,
      outline: `
        bg-transparent border-2 border-current
        text-white hover:bg-white hover:text-black
        focus:ring-white/50
        shadow-md hover:shadow-lg
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-700
        hover:from-red-700 hover:to-red-800
        text-white shadow-lg hover:shadow-xl
        focus:ring-red-500
        border border-red-600 hover:border-red-700
      `
    };

    const sizeClasses = {
      xs: 'px-2.5 py-1.5 text-xs min-h-[28px]',
      sm: 'px-3 py-2 text-sm min-h-[32px]',
      md: 'px-4 py-2.5 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
      xl: 'px-8 py-4 text-xl min-h-[56px]'
    };

    const iconSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };

    const isDisabled = disabled || loading;

    const renderIcon = (iconElement: React.ReactNode, position: 'left' | 'right') => {
      if (!iconElement && !loading) return null;
      
      const iconClasses = `${iconSizeClasses[size]} ${
        position === 'left' ? 'mr-2' : 'ml-2'
      }`;

      if (loading && position === 'left') {
        return <Loader2 className={`${iconClasses} animate-spin`} />;
      }

      if (iconElement) {
        return <span className={iconClasses}>{iconElement}</span>;
      }

      return null;
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full hover:translate-x-full" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {iconPosition === 'left' && renderIcon(icon, 'left')}
          {children}
          {iconPosition === 'right' && renderIcon(icon, 'right')}
        </span>
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;