import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Bug,
  BookOpen,
  Code2,
  FileText,
  FlaskConical,
  GitBranch,
  HeartHandshake,
  HelpCircle,
  LayoutGrid,
  LineChart,
  MessageSquareWarning,
  Network,
  Rocket,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Type,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'code-2': Code2,
  brain: Brain,
  bug: Bug,
  'book-open': BookOpen,
  'file-text': FileText,
  'flask-conical': FlaskConical,
  'git-branch': GitBranch,
  'heart-handshake': HeartHandshake,
  'help-circle': HelpCircle,
  'layout-grid': LayoutGrid,
  'line-chart': LineChart,
  'message-square-warning': MessageSquareWarning,
  network: Network,
  rocket: Rocket,
  scale: Scale,
  server: Server,
  shield: Shield,
  'shield-heart': ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  'trending-up': TrendingUp,
  type: Type,
  users: Users,
  'users-round': UsersRound,
};

export function CoverIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}

export interface CoverCardProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  gradient: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  badge?: string;
  duration?: string;
}

const SIZE = {
  sm: { art: 'w-[140px] h-[140px]', title: 'text-sm', pad: 'p-3' },
  md: { art: 'w-[168px] h-[168px]', title: 'text-base', pad: 'p-3' },
  lg: { art: 'w-[200px] h-[200px]', title: 'text-lg', pad: 'p-4' },
};

const CoverCard: React.FC<CoverCardProps> = ({
  title,
  subtitle,
  tagline,
  gradient,
  icon,
  href,
  onClick,
  size = 'md',
  badge,
  duration,
}) => {
  const s = SIZE[size];
  const inner = (
    <article
      className={`group shrink-0 ${s.pad} rounded-xl transition-transform duration-200 hover:scale-[1.02] focus-within:scale-[1.02] ${href || onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={href || onClick ? 'button' : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={`relative ${s.art} rounded-lg shadow-[var(--shadow-card)] overflow-hidden mb-3`}
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CoverIcon name={icon} className="w-12 h-12 text-white/90 drop-shadow-md" />
        </div>
        {badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {badge}
          </span>
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 text-[10px] font-medium bg-black/50 text-white/90 px-2 py-0.5 rounded backdrop-blur-sm">
            {duration}
          </span>
        )}
      </div>
      <h3 className={`font-bold text-text-primary ${s.title} line-clamp-2 leading-snug`}>{title}</h3>
      {tagline && (
        <p className="text-xs text-accent-bright mt-1 line-clamp-2 font-medium">{tagline}</p>
      )}
      {subtitle && <p className="text-xs text-text-secondary mt-1 line-clamp-2">{subtitle}</p>}
    </article>
  );

  if (href) {
    return (
      <Link to={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-xl">
        {inner}
      </Link>
    );
  }
  return inner;
};

export default CoverCard;
