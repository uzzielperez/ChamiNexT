import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Search, Moon, Sun, User } from 'lucide-react';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle a dark mode class on the body or update context
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Code className="h-8 w-8 text-purple-500" />
            <span className="ml-2 text-xl font-bold text-white">ChamiNexT</span>
            {/* Alternative logo image (kept as reserve):
            <img 
              src="/chaminext-logo.png" 
              alt="ChamiNexT Logo" 
              className="h-8 w-auto"
            />
            */}
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">For Developers</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">For Employers</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} className="text-gray-300" /> : <Moon size={20} className="text-gray-300" />}
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Search size={20} className="text-gray-300" />
            </button>
            <Button variant="outline" size="sm">Log in</Button>
            <Button size="sm">Sign up</Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} className="text-gray-300" /> : <Moon size={20} className="text-gray-300" />}
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10">
          <div className="px-4 py-3 space-y-3">
            <a href="#" className="block py-2 text-gray-300 hover:text-white transition-colors">For Developers</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white transition-colors">For Employers</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white transition-colors">Pricing</a>
            <div className="pt-3 flex flex-col space-y-3">
              <Button variant="outline" fullWidth>Log in</Button>
              <Button fullWidth>Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;