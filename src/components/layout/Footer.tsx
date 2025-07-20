import React from 'react';
import { Code, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
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
                          <p className="mt-4 text-gray-400 text-sm">
                Empowering the next generation of software engineers through mentorship, growth, and meaningful professional connections.
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">For Developers</h3>
                          <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Find Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sell Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Skills Assessment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Learning Resources</a></li>
            </ul>
          </div>
          
          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">For Employers</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Find Developers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Verify Skills</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Company Profile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Hiring Solutions</a></li>
            </ul>
          </div>
          
          {/* Resources & Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
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
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} ChamiNexT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;