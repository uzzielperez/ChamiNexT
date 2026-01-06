import React, { useState } from 'react';
import CandidateCard from '../components/employers/CandidateCard';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { Users, Search, Star, Filter } from 'lucide-react';

const sampleCandidates = [
  {
    name: 'Lian Reyes',
    role: 'Frontend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    skills: ['React', 'TypeScript', 'Vue.js', 'Tailwind CSS'],
    portfolioUrl: '#',
  },
  {
    name: 'Mateo Santos',
    role: 'Backend Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    skills: ['Node.js', 'Python', 'Go', 'PostgreSQL'],
    portfolioUrl: '#',
  },
  {
    name: 'Sofia Cruz',
    role: 'Full Stack Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    skills: ['React', 'Node.js', 'GraphQL', 'AWS'],
    portfolioUrl: '#',
  },
  {
    name: 'Jose Garcia',
    role: 'Mobile Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    portfolioUrl: '#',
  },
  {
    name: 'Isabella Reyes',
    role: 'UI/UX Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
    portfolioUrl: '#',
  },
  {
    name: 'Juan dela Cruz',
    role: 'DevOps Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    portfolioUrl: '#',
  },
];

type ViewMode = 'browse' | 'saved' | 'analytics';

const EmployersPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('browse');

  const tabs = [
    { id: 'browse', label: 'Browse Talent', icon: <Search className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Candidates', icon: <Star className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Users className="w-4 h-4" /> }
  ];

  const renderBrowse = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-hero-headline font-bold mb-lg leading-tight text-text-primary">
          Discover Top Talent
        </h1>
        <p className="text-subheadline text-text-secondary mb-xl max-w-3xl mx-auto">
          Browse verified candidate profiles and connect with the best developers, designers, and tech professionals.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by skills, role, or location..."
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-lg 
                  text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue"
              />
            </div>
            <PremiumButton variant="primary" size="md" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </PremiumButton>
            <PremiumButton variant="secondary" size="md">
              Search
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleCandidates.map((candidate) => (
          <CandidateCard key={candidate.name} candidate={candidate} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <PremiumButton variant="outline" size="lg">
          Load More Candidates
        </PremiumButton>
      </div>
    </div>
  );

  const renderSaved = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-section-header font-bold text-text-primary mb-4">Saved Candidates</h1>
        <p className="text-subheadline text-text-secondary">Your talent pipeline and shortlisted candidates</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-16">
          <Star className="w-16 h-16 text-accent-blue mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-text-primary mb-4">No Saved Candidates Yet</h3>
          <p className="text-text-secondary mb-8">
            Start browsing talent and save candidates to build your talent pipeline.
          </p>
          <PremiumButton 
            variant="primary" 
            size="lg"
            onClick={() => setCurrentView('browse')}
          >
            Browse Talent
          </PremiumButton>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-section-header font-bold text-text-primary mb-4">Hiring Analytics</h1>
        <p className="text-subheadline text-text-secondary">Track your recruitment performance and insights</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="text-4xl font-bold text-accent-blue mb-2">24</div>
          <div className="text-text-secondary">Profiles Viewed</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-accent-blue mb-2">8</div>
          <div className="text-text-secondary">Candidates Contacted</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-accent-blue mb-2">3</div>
          <div className="text-text-secondary">Interviews Scheduled</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h3 className="text-xl font-bold text-text-primary mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border-color">
              <div>
                <p className="text-text-primary font-medium">Viewed Sofia Cruz's profile</p>
                <p className="text-text-secondary text-sm">Full Stack Developer</p>
              </div>
              <span className="text-text-secondary text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border-color">
              <div>
                <p className="text-text-primary font-medium">Saved Mateo Santos</p>
                <p className="text-text-secondary text-sm">Backend Developer</p>
              </div>
              <span className="text-text-secondary text-sm">1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-text-primary font-medium">Contacted Lian Reyes</p>
                <p className="text-text-secondary text-sm">Frontend Developer</p>
              </div>
              <span className="text-text-secondary text-sm">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 pt-8">
          <PremiumTabs
            tabs={tabs}
            activeTab={currentView}
            onTabChange={(tabId) => setCurrentView(tabId as ViewMode)}
          />
        </div>
        
        {currentView === 'browse' && renderBrowse()}
        {currentView === 'saved' && renderSaved()}
        {currentView === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default EmployersPage;
