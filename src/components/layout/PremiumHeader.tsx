import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import ChamiNextLogo from '../brand/ChamiNextLogo';

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

  const navigation = [
    { name: 'Practice', href: '/practice', hasDropdown: false },
    { name: 'Skill trees', href: '/skills', hasDropdown: false },
    { name: 'Intel', href: '/intel', hasDropdown: false },
    { name: 'For Companies', href: '/employers', hasDropdown: false },
    { name: 'Pricing', href: '/pricing', hasDropdown: false },
    {
      name: 'Learn',
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All courses', href: '/marketplace' },
        { name: 'Vibe Coding', href: '/courses/vibe-coding' },
        { name: 'Building RAGs', href: '/courses/building-rags' },
        { name: 'AI Agents', href: '/courses/ai-agents' },
        { name: 'Full-Stack AI', href: '/courses/fullstack-ai' },
      ],
    },
  ];

  const isLanding = location.pathname === '/';

  const isActiveLink = (href: string) => {
    if (href === '#' || href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const navLinkClass = (href: string) => {
    const active = isActiveLink(href);
    return [
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
      'hover:bg-white/5 active:bg-white/10',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
      active
        ? '!text-[var(--accent-bright)] bg-[var(--accent-primary)]/15'
        : '',
    ].join(' ');
  };

  const headerSolid = !isLanding || isScrolled;

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        headerSolid ? 'bg-[#0a0b0d]/95 backdrop-blur-md shadow-lg' : 'bg-transparent border-transparent'
      }`}
      style={{ borderColor: headerSolid ? 'var(--border-color)' : 'transparent' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group transition-opacity duration-200 hover:opacity-90">
              <ChamiNextLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <button type="button" className={`flex items-center ${navLinkClass('#')}`}>
                      {item.name}
                      <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  ) : (
                    <Link to={item.href} className={navLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-black/90 backdrop-blur-md rounded-lg border border-white/20 shadow-xl py-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <button className="btn-secondary px-4 py-2 text-sm">
                Sign In
              </button>
            </Link>
            <Link to="/practice">
              <button className="btn-primary px-4 py-2 text-sm">
                <ArrowRight className="w-4 h-4" />
                <span>Start practicing</span>
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md rounded-lg mt-2 border border-white/20">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <div className="text-white/60 px-3 py-2 text-sm font-medium">
                        {item.name}
                      </div>
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-6 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block ${navLinkClass(item.href)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 pb-2 space-y-2">
                <Link to="/login" className="block">
                  <PremiumButton variant="ghost" size="sm" fullWidth>
                    Sign In
                  </PremiumButton>
                </Link>
                <Link to="/practice" className="block">
                  <PremiumButton variant="primary" size="sm" fullWidth icon={<ArrowRight className="w-4 h-4" />}>
                    Start practicing
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