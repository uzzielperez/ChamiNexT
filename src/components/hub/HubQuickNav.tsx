import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutGrid, Sparkles } from 'lucide-react';

const LINKS = [
  {
    href: '/learn',
    label: 'Learn',
    icon: BookOpen,
    active: (p: string) => p === '/learn' || p.startsWith('/courses/'),
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    icon: LayoutGrid,
    active: (p: string) => p === '/marketplace' || p.startsWith('/products/'),
  },
  {
    href: '/practice',
    label: 'Interview prep',
    icon: Sparkles,
    active: (p: string) =>
      p === '/practice' ||
      p.startsWith('/loop') ||
      p.startsWith('/drill') ||
      p.startsWith('/skills'),
  },
];

const HubQuickNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="hub-quick-nav" aria-label="Product areas">
      {LINKS.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={href}
          to={href}
          className={`hub-quick-link${active(pathname) ? ' is-active' : ''}`}
        >
          <Icon className="w-4 h-4" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default HubQuickNav;
