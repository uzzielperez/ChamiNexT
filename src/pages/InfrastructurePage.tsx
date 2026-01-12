import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Shield, Server, Cloud, Zap, Lock, Globe, Database, Activity } from 'lucide-react';

const InfrastructurePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const architectureLayers = [
    {
      id: 'cdn',
      name: 'CDN & Edge',
      description: 'Global content delivery network for fast, low-latency access',
      icon: <Globe className="w-6 h-6" />,
      services: ['Netlify CDN', 'Edge Functions', 'Global Distribution'],
      metrics: { latency: '<50ms', coverage: '200+ locations', uptime: '99.99%' }
    },
    {
      id: 'frontend',
      name: 'Frontend Layer',
      description: 'React-based SPA with server-side rendering capabilities',
      icon: <Zap className="w-6 h-6" />,
      services: ['React', 'TypeScript', 'Vite', 'SSR'],
      metrics: { bundle: '250KB', load: '<2s', score: '95 Lighthouse' }
    },
    {
      id: 'serverless',
      name: 'Serverless Functions',
      description: 'Scalable, event-driven serverless architecture',
      icon: <Server className="w-6 h-6" />,
      services: ['Netlify Functions', 'API Routes', 'Background Jobs'],
      metrics: { functions: '10+', coldStart: '<200ms', scale: 'Auto' }
    },
    {
      id: 'database',
      name: 'Data Layer',
      description: 'Secure, scalable data storage and management',
      icon: <Database className="w-6 h-6" />,
      services: ['JSON Storage', 'Vector DB', 'Cache Layer'],
      metrics: { queries: '<100ms', size: '50GB+', backup: 'Daily' }
    },
    {
      id: 'security',
      name: 'Security Layer',
      description: 'Multi-layered security with encryption and monitoring',
      icon: <Lock className="w-6 h-6" />,
      services: ['HTTPS/SSL', 'API Keys', 'Rate Limiting', 'Monitoring'],
      metrics: { ssl: 'A+ Rating', incidents: '0', compliance: 'SOC 2' }
    },
    {
      id: 'monitoring',
      name: 'Monitoring & Analytics',
      description: 'Real-time monitoring and performance analytics',
      icon: <Activity className="w-6 h-6" />,
      services: ['Uptime Monitoring', 'Error Tracking', 'Performance Metrics'],
      metrics: { uptime: '99.9%', alerts: 'Real-time', logs: '7 days' }
    }
  ];

  const infrastructureStats = {
    uptime: '99.9%',
    responseTime: '<200ms',
    regions: '5',
    cdnLocations: '200+',
    sslRating: 'A+',
    incidents: '0'
  };

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
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  Cloud Architecture
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Scalable, secure, and reliable cloud-native applications
                </p>
              </div>
            </div>
          </div>

          {/* Infrastructure Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(infrastructureStats).map(([key, value]) => (
              <div key={key} className="card bg-gray-800/50 text-center">
                <div className="text-2xl font-bold text-accent-blue mb-1">{value}</div>
                <div className="text-xs text-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="card mb-6">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Architecture Overview</h2>
          
          <div className="relative">
            {/* Visual Architecture Flow */}
            <div className="space-y-4">
              {architectureLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`bg-gray-800/50 rounded-lg p-6 border-2 transition-all cursor-pointer ${
                    selectedLayer === layer.id
                      ? 'border-accent-blue bg-accent-blue/10'
                      : 'border-gray-700 hover:border-accent-blue/50'
                  }`}
                  onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue flex-shrink-0">
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{layer.name}</h3>
                        <p className="text-text-secondary mb-4">{layer.description}</p>
                        
                        {selectedLayer === layer.id && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Services</h4>
                                <div className="flex flex-wrap gap-2">
                                  {layer.services.map((service, i) => (
                                    <span key={i} className="px-3 py-1 rounded-lg text-sm bg-gray-900 text-text-primary border border-gray-700">
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-text-primary mb-3">Metrics</h4>
                                <div className="space-y-2">
                                  {Object.entries(layer.metrics).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="text-text-secondary capitalize">{key}:</span>
                                      <span className="text-text-primary font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-accent-blue ml-4">
                      {selectedLayer === layer.id ? '−' : '+'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-accent-blue" />
              <h3 className="text-xl font-bold text-text-primary">Security</h3>
            </div>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-accent-blue">✓</span>
                End-to-end encryption (HTTPS/SSL)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-blue">✓</span>
                API key authentication
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-blue">✓</span>
                Rate limiting and DDoS protection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-blue">✓</span>
                Regular security audits
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-accent-purple" />
              <h3 className="text-xl font-bold text-text-primary">Scalability</h3>
            </div>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-accent-purple">✓</span>
                Auto-scaling serverless functions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-purple">✓</span>
                Global CDN distribution
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-purple">✓</span>
                Load balancing and failover
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-purple">✓</span>
                Database optimization
              </li>
            </ul>
          </div>
        </div>

        {/* Deployment Pipeline */}
        <div className="card">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Deployment Pipeline</h2>
          <div className="space-y-4">
            {[
              { step: '1', name: 'Code Push', description: 'Git push triggers automated pipeline' },
              { step: '2', name: 'Build', description: 'Vite builds optimized production bundle' },
              { step: '3', name: 'Test', description: 'Automated tests run (unit, integration)' },
              { step: '4', name: 'Deploy', description: 'Deployed to Netlify with zero downtime' },
              { step: '5', name: 'Verify', description: 'Health checks and smoke tests' }
            ].map((stage) => (
              <div key={stage.step} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold">
                  {stage.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary">{stage.name}</h4>
                  <p className="text-sm text-text-secondary">{stage.description}</p>
                </div>
                <div className="text-green-400">✓</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructurePage;
