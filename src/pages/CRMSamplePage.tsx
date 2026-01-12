import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Users, Briefcase, Building2, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

const CRMSamplePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contacts' | 'candidates'>('dashboard');

  // Sample data
  const stats = {
    contacts: 127,
    candidates: 43,
    companies: 28
  };

  const contacts = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Inc.', phone: '+1 (555) 123-4567', status: 'Active' },
    { id: 2, name: 'Michael Chen', email: 'mchen@startup.io', company: 'Startup.io', phone: '+1 (555) 234-5678', status: 'Active' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily@innovate.com', company: 'Innovate Labs', phone: '+1 (555) 345-6789', status: 'Lead' },
    { id: 4, name: 'David Kim', email: 'david@scaleup.com', company: 'ScaleUp Solutions', phone: '+1 (555) 456-7890', status: 'Active' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@venture.com', company: 'Venture Capital', phone: '+1 (555) 567-8901', status: 'Lead' }
  ];

  const candidates = [
    { id: 1, name: 'Alex Thompson', role: 'Senior Developer', experience: '5 years', skills: 'React, Node.js, TypeScript', status: 'Interview Scheduled' },
    { id: 2, name: 'Jordan Martinez', role: 'Product Manager', experience: '7 years', skills: 'Agile, Product Strategy', status: 'Screening' },
    { id: 3, name: 'Taylor Brown', role: 'UX Designer', experience: '4 years', skills: 'Figma, User Research', status: 'Application Review' },
    { id: 4, name: 'Casey Wilson', role: 'DevOps Engineer', experience: '6 years', skills: 'AWS, Kubernetes, Docker', status: 'Technical Assessment' },
    { id: 5, name: 'Morgan Lee', role: 'Data Scientist', experience: '5 years', skills: 'Python, ML, SQL', status: 'Interview Scheduled' }
  ];

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <h1 className="text-hero-headline font-bold text-text-primary mb-4">
              ChamiNexT CRM — Sample Interface
            </h1>
            <p className="text-subheadline text-text-secondary mb-4">
              White-label customer relationship management system tailored for tech companies and startups, with built-in talent pipeline features.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Sample Preview — Not Fully Functional
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'contacts'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'candidates'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Candidates
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="card">
            <h2 className="text-section-header font-bold text-text-primary mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-lg p-6 border border-accent-blue/30">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-accent-blue" />
                  <span className="text-sm text-text-secondary">Total</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{stats.contacts}</div>
                <div className="text-sm text-text-secondary">Active Contacts</div>
              </div>

              <div className="bg-gradient-to-br from-accent-purple/20 to-pink-500/20 rounded-lg p-6 border border-accent-purple/30">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="w-8 h-8 text-accent-purple" />
                  <span className="text-sm text-text-secondary">Total</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{stats.candidates}</div>
                <div className="text-sm text-text-secondary">Candidates</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="w-8 h-8 text-green-400" />
                  <span className="text-sm text-text-secondary">Total</span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{stats.companies}</div>
                <div className="text-sm text-text-secondary">Companies</div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
              <div className="space-y-3 text-text-secondary text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
                  <span>New contact added: Sarah Johnson from TechCorp Inc.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                  <span>Candidate interview scheduled: Alex Thompson</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>New company added: Innovate Labs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-section-header font-bold text-text-primary">Contacts</h2>
              <PremiumButton variant="primary" size="sm">
                + Add Contact
              </PremiumButton>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Company</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-text-primary">{contact.name}</div>
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{contact.company}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'Active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-section-header font-bold text-text-primary">Candidates</h2>
              <PremiumButton variant="primary" size="sm">
                + Add Candidate
              </PremiumButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-accent-blue/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{candidate.name}</h3>
                      <p className="text-sm text-accent-blue font-medium">{candidate.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-text-secondary">
                      <span className="font-medium">Experience:</span> {candidate.experience}
                    </div>
                    <div className="text-sm text-text-secondary">
                      <span className="font-medium">Skills:</span> {candidate.skills}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRMSamplePage;
