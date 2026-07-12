import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import ChamiNextLogo from '../brand/ChamiNextLogo';
import { SEEKER_NAV, EMPLOYER_NAV, isEmployerPath } from '../../config/navigation';
import { isAuthenticated, loadAuthUser } from '../../utils/authSession';
import { loadCoachProfile } from '../../utils/coachStorage';

const PremiumHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const employerMode = isEmployerPath(location.pathname);
  const navigation = employerMode ? EMPLOYER_NAV : SEEKER_NAV;

  const isLanding = location.pathname === '/';

  const isActiveLink = (href: string) => {
    const path = href.split('?')[0];
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinkClass = (href: string) => {
    const active = isActiveLink(href);
    return [
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
      'hover:bg-white/5 active:bg-white/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
      active ? '!text-[var(--accent-bright)] bg-[var(--accent-primary)]/15' : '',
    ].join(' ');
  };

  const headerSolid = !isLanding || isScrolled;
  const authed = isAuthenticated();
  const user = loadAuthUser();
  const coachDone = loadCoachProfile()?.onboardingComplete;
  const primaryCta = employerMode
    ? { label: 'Request pilot', href: '/pricing?for=companies' }
    : authed && !coachDone
      ? { label: 'Meet Coach', href: '/coach' }
      : { label: 'Start Daily', href: '/daily' };

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        headerSolid ? 'bg-[#0a0b0d]/95 backdrop-blur-md shadow-lg' : 'bg-transparent border-transparent'
      }`}
      style={{ borderColor: headerSolid ? 'var(--border-color)' : 'transparent' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="group transition-opacity duration-200 hover:opacity-90">
              <ChamiNextLogo size="md" />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className={navLinkClass(item.href)}>
                  {item.name}
                </Link>
              ))}
              {!employerMode && (
                <Link to="/employers" className={navLinkClass('/employers')}>
                  For Companies
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {authed ? (
              <>
                <Link to="/coach" className={navLinkClass('/coach')}>
                  Coach
                </Link>
                <Link to="/settings" className="text-sm text-text-secondary hover:text-text-primary px-2 truncate max-w-[140px]">
                  {user?.email}
                </Link>
              </>
            ) : (
              <Link to="/login">
                <button className="btn-secondary px-4 py-2 text-sm">Sign In</button>
              </Link>
            )}
            <Link to={primaryCta.href}>
              <button className="btn-primary px-4 py-2 text-sm">
                <ArrowRight className="w-4 h-4" />
                <span>{primaryCta.label}</span>
              </button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md rounded-lg mt-2 border border-white/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block ${navLinkClass(item.href)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!employerMode && (
                <Link
                  to="/employers"
                  className={`block ${navLinkClass('/employers')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Companies
                </Link>
              )}

              <div className="pt-4 pb-2 space-y-2">
                <Link to="/login" className="block">
                  <PremiumButton variant="ghost" size="sm" fullWidth>
                    Sign In
                  </PremiumButton>
                </Link>
                <Link to={primaryCta.href} className="block">
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {primaryCta.label}
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default PremiumHeader;
