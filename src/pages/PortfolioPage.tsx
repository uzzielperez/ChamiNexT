import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, ArrowRight, Code, ExternalLink, Github, Globe, Database, Server, Zap } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects = [
    {
      id: 'chaminext',
      name: 'ChamiNexT Platform',
      description: 'Full-stack career and talent platform with AI-powered features, marketplace, and course system.',
      tech: ['React', 'TypeScript', 'Node.js', 'Netlify Functions', 'Groq AI', 'Stripe'],
      category: 'Full-Stack',
      status: 'Live',
      features: [
        'AI-powered CV optimization',
        'Talent pipeline management',
        'Digital marketplace',
        'Premium course system',
        'Payment integration',
        'Serverless architecture'
      ],
      metrics: {
        users: '10,000+',
        performance: '95 Lighthouse',
        uptime: '99.9%'
      }
    },
    {
      id: 'areuwell',
      name: 'areuwell.org',
      description: 'Augmented healthcare intelligence platform with AI-driven insights and patient advocacy tools.',
      tech: ['React', 'AI/ML', 'Healthcare APIs', 'Secure Data'],
      category: 'Health-Tech',
      status: 'Live',
      features: [
        'AI health insights',
        'Patient-provider communication',
        'Health journey tracking',
        'Secure data management'
      ],
      metrics: {
        users: '5,000+',
        accuracy: '94%',
        satisfaction: '4.7/5'
      }
    },
    {
      id: 'manifest',
      name: 'Manifest.ink',
      description: 'Meditation and mindfulness platform with guided sessions and wellness resources.',
      tech: ['React', 'Audio Streaming', 'Progress Tracking', 'Community Features'],
      category: 'Wellness',
      status: 'Live',
      features: [
        'Guided meditations',
        'Mindfulness exercises',
        'Progress tracking',
        'Community support'
      ],
      metrics: {
        sessions: '50,000+',
        retention: '78%',
        rating: '4.8/5'
      }
    },
    {
      id: 'polaris',
      name: 'Polaris Travel App',
      description: 'Comprehensive travel companion integrating flight/hotel bookings with local exploration and public transit.',
      tech: ['React', 'Travel APIs', 'Maps Integration', 'Real-time Data'],
      category: 'Travel',
      status: 'In Development',
      features: [
        'Unified booking system',
        'Local discovery',
        'Public transit routing',
        'Real-time updates'
      ],
      metrics: {
        routes: '1,000+',
        accuracy: '92%',
        coverage: '50+ cities'
      }
    },
    {
      id: 'crm',
      name: 'ChamiNexT CRM',
      description: 'White-label CRM system for tech companies with built-in talent pipeline features.',
      tech: ['React', 'Node.js', 'Database', 'API Integration'],
      category: 'CRM',
      status: 'Sample',
      features: [
        'Contact management',
        'Sales pipeline',
        'Talent tracking',
        'Analytics dashboard'
      ],
      metrics: {
        contacts: '10,000+',
        efficiency: '+45%',
        satisfaction: '4.6/5'
      }
    },
    {
      id: 'kapwa-response',
      name: 'Kapwa Response',
      description: 'Socially-responsible disaster response and mapping platform for the Philippines, with integrated support for sustainable eco villages.',
      tech: ['React', 'Maps API', 'Real-time Data', 'Community Platform'],
      category: 'Social Impact',
      status: 'Live',
      features: [
        'Disaster mapping and response',
        'Eco village support network',
        'Community resource sharing',
        'Real-time emergency coordination'
      ],
      metrics: {
        villages: '15+',
        disasters: '50+ tracked',
        communities: '100+'
      }
    }
  ];

  const categories = ['All', 'Full-Stack', 'Health-Tech', 'Wellness', 'Travel', 'CRM', 'Social Impact'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <PremiumButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </PremiumButton>

          <div className="card border-accent-blue/20 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  Full-Stack Development
                </h1>
                <p className="text-subheadline text-text-secondary">
                  End-to-end solutions from frontend to backend, databases, and deployment
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-accent-blue text-white'
                    : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card hover:border-accent-blue/50 transition-all cursor-pointer"
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">{project.name}</h3>
                  <p className="text-sm text-text-secondary mb-3">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Live' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : project.status === 'In Development'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 4).map((tech, index) => (
                    <span key={index} className="px-2 py-1 rounded text-xs bg-gray-800 text-text-secondary border border-gray-700">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-2 py-1 rounded text-xs bg-gray-800 text-text-secondary border border-gray-700">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-4 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-sm font-bold text-accent-blue">{value}</div>
                      <div className="text-xs text-text-secondary capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Details */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-accent-blue">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
            <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const project = projects.find(p => p.id === selectedProject);
                if (!project) return null;
                
                return (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-section-header font-bold text-text-primary mb-2">{project.name}</h2>
                        <p className="text-text-secondary">{project.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-text-secondary hover:text-text-primary"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, index) => (
                            <span key={index} className="px-3 py-1 rounded-lg text-sm bg-gray-800 text-text-primary border border-gray-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Key Features</h3>
                        <ul className="space-y-2">
                          {project.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-text-secondary">
                              <Zap className="w-4 h-4 text-accent-blue" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3">Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                            <div className="text-2xl font-bold text-accent-blue mb-1">{value}</div>
                            <div className="text-sm text-text-secondary capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
