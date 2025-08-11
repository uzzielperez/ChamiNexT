import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  const hoverClass = hoverable
    ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
    : '';
    
  return (
    <div className={`bg-black-900/30 backdrop-blur-lg rounded-xl border border-gold-600/20 shadow-md overflow-hidden ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  action, 
  className = '' 
}) => (
  <div className={`p-5 border-b border-gold-600/20 ${className}`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold text-gold-400">{title}</h3>
        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  </div>
);

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`p-5 border-t border-gold-600/20 bg-black-800/30 ${className}`}>
    {children}
  </div>
);

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});