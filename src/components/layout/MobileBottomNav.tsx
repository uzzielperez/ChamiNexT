import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Brain, Briefcase, User } from 'lucide-react';

const tabs = [
  { to: '/daily', label: 'Daily', icon: Calendar },
  { to: '/practice', label: 'Practice', icon: Brain },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/practice', label: 'Profile', icon: User, state: { view: 'profile' } },
];

const MobileBottomNav: React.FC = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md safe-area-pb"
      aria-label="Mobile navigation"
    >
      <ul className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => (
          <li key={tab.label} className="flex-1">
            <NavLink
              to={tab.to}
              state={tab.state}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-accent-blue' : 'text-text-secondary'
                }`
              }
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
