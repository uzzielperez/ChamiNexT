import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, GitBranch, CheckCircle2, XCircle, Clock, Activity, Shield, Zap } from 'lucide-react';

const DevOpsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);

  const deployments = [
    {
      id: '1',
      commit: 'bc955fb',
      message: 'feat: Phase 1 - Capability showcases',
      branch: 'main',
      status: 'success',
      time: '2 minutes ago',
      duration: '1m 23s',
      author: 'ChamiNexT Team'
    },
    {
      id: '2',
      commit: '7c38f40',
      message: 'docs: Add comprehensive strategy',
      branch: 'main',
      status: 'success',
      time: '1 hour ago',
      duration: '1m 15s',
      author: 'ChamiNexT Team'
    },
    {
      id: '3',
      commit: '99ef840',
      message: 'feat: Integrate CRM and Polaris samples',
      branch: 'main',
      status: 'success',
      time: '3 hours ago',
      duration: '1m 30s',
      author: 'ChamiNexT Team'
    },
    {
      id: '4',
      commit: '9ea95b8',
      message: 'feat: Integrate Full-Stack AI course',
      branch: 'main',
      status: 'success',
      time: '5 hours ago',
      duration: '1m 18s',
      author: 'ChamiNexT Team'
    }
  ];

  const pipelineStages = [
    {
      name: 'Source',
      description: 'Git push triggers pipeline',
      icon: <GitBranch className="w-5 h-5" />,
      status: 'success'
    },
    {
      name: 'Build',
      description: 'Vite builds production bundle',
      icon: <Zap className="w-5 h-5" />,
      status: 'success'
    },
    {
      name: 'Test',
      description: 'Run automated tests',
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: 'success'
    },
    {
      name: 'Deploy',
      description: 'Deploy to Netlify',
      icon: <Activity className="w-5 h-5" />,
      status: 'success'
    },
    {
      name: 'Verify',
      description: 'Health checks and smoke tests',
      icon: <Shield className="w-5 h-5" />,
      status: 'success'
    }
  ];

  const metrics = {
    deployments: '150+',
    successRate: '99.3%',
    avgDeployTime: '1m 25s',
    uptime: '99.9%',
    incidents: '0',
    lastDeploy: '2 min ago'
  };

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
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
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  DevOps & CI/CD
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Automated deployment pipelines and infrastructure management
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="card bg-gray-800/50 text-center">
                <div className="text-2xl font-bold text-accent-blue mb-1">{value}</div>
                <div className="text-xs text-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="card mb-6">
          <h2 className="text-section-header font-bold text-text-primary mb-6">CI/CD Pipeline</h2>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {pipelineStages.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <div className="flex flex-col items-center flex-1 min-w-[120px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                    stage.status === 'success' 
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30'
                      : 'bg-gray-800 text-gray-600 border-2 border-gray-700'
                  }`}>
                    {stage.status === 'success' ? stage.icon : <Clock className="w-5 h-5" />}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{stage.name}</h3>
                  <p className="text-xs text-text-secondary text-center">{stage.description}</p>
                </div>
                {index < pipelineStages.length - 1 && (
                  <div className="w-8 h-0.5 bg-accent-blue flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Deployment History */}
        <div className="card mb-6">
          <h2 className="text-section-header font-bold text-text-primary mb-6">Recent Deployments</h2>
          <div className="space-y-3">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className={`bg-gray-800/50 rounded-lg p-4 border transition-all cursor-pointer ${
                  selectedDeployment === deployment.id
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-gray-700 hover:border-accent-blue/50'
                }`}
                onClick={() => setSelectedDeployment(selectedDeployment === deployment.id ? null : deployment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(deployment.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <code className="text-sm text-accent-blue">{deployment.commit}</code>
                        <span className="text-sm text-text-primary font-medium">{deployment.message}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {deployment.branch}
                        </span>
                        <span>{deployment.author}</span>
                        <span>{deployment.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-text-primary">{deployment.duration}</div>
                      <div className="text-xs text-text-secondary">Duration</div>
                    </div>
                  </div>
                </div>

                {selectedDeployment === deployment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-text-secondary mb-1">Commit Hash</div>
                        <code className="text-accent-blue">{deployment.commit}</code>
                      </div>
                      <div>
                        <div className="text-text-secondary mb-1">Branch</div>
                        <div className="text-text-primary">{deployment.branch}</div>
                      </div>
                      <div>
                        <div className="text-text-secondary mb-1">Status</div>
                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          Success
                        </span>
                      </div>
                      <div>
                        <div className="text-text-secondary mb-1">Deploy Time</div>
                        <div className="text-text-primary">{deployment.duration}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold text-text-primary mb-4">Automated Testing</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Unit tests run on every commit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Integration tests before deployment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                E2E tests for critical paths
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Automated code quality checks
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-text-primary mb-4">Deployment Strategy</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Zero-downtime deployments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Automatic rollback on failure
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Blue-green deployment strategy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Health checks and monitoring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsPage;
