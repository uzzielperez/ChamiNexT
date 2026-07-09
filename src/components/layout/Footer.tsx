import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import ChamiNextLogo from '../brand/ChamiNextLogo';
import { SEEKER_MORE } from '../../config/navigation';

const Footer: React.FC = () => {
  return (
    <footer
      className="border-t py-12"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <ChamiNextLogo size="sm" />
            <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Interview prep and ship tests for the AI era.
              </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* For Developers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Practice</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/daily" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Daily loop
                </Link>
              </li>
              <li>
                <Link to="/practice" className="text-gray-400 hover:text-white text-sm transition-colors">
                  AI Interviews &amp; Ship Tests
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Jobs board
                </Link>
              </li>
              {SEEKER_MORE.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Hiring</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/employers" className="text-gray-400 hover:text-white text-sm transition-colors">Interview Studio</a></li>
              <li><a href="/employers" className="text-gray-400 hover:text-white text-sm transition-colors">Assign Ship Tests</a></li>
              <li><a href="/employers" className="text-gray-400 hover:text-white text-sm transition-colors">Rank candidates</a></li>
            </ul>
          </div>
          
          {/* Resources & Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gold-600/20">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} ChamiNext. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;