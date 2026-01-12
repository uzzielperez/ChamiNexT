import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import CVIterator from '../components/jobseekers/CVIterator';
import { ArrowLeft, Zap, Brain, TrendingUp, CheckCircle2, Code, BarChart3 } from 'lucide-react';

const AIShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<'cv-optimizer' | 'overview'>('overview');

  const aiFeatures = [
    {
      title: 'AI-Powered CV Optimization',
      description: 'Intelligent CV tailoring based on job descriptions using advanced NLP',
      status: 'Live',
      metrics: { accuracy: '92%', users: '10,000+', satisfaction: '4.8/5' }
    },
    {
      title: 'Smart Job Matching',
      description: 'AI algorithms match candidates with relevant opportunities',
      status: 'Live',
      metrics: { accuracy: '87%', matches: '50,000+', satisfaction: '4.6/5' }
    },
    {
      title: 'Natural Language Processing',
      description: 'Advanced NLP for understanding job requirements and CV content',
      status: 'Live',
      metrics: { processing: '<2s', accuracy: '89%', languages: '5+' }
    }
  ];

  const techStack = [
    { name: 'Groq AI', description: 'Ultra-fast inference engine', icon: <Zap className="w-6 h-6" /> },
    { name: 'OpenAI GPT', description: 'Advanced language understanding', icon: <Brain className="w-6 h-6" /> },
    { name: 'Custom Models', description: 'Fine-tuned for recruitment', icon: <Code className="w-6 h-6" /> }
  ];

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
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary">
                  AI/ML Integration
                </h1>
                <p className="text-subheadline text-text-secondary">
                  Cutting-edge artificial intelligence and machine learning implementations
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border-accent-blue/30">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-accent-blue" />
                <span className="text-sm text-text-secondary">Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">92%</div>
              <div className="text-sm text-text-secondary mt-1">Average AI accuracy</div>
            </div>
            <div className="card bg-gradient-to-br from-accent-purple/20 to-pink-500/20 border-accent-purple/30">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-6 h-6 text-accent-purple" />
                <span className="text-sm text-text-secondary">Response Time</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">&lt;2s</div>
              <div className="text-sm text-text-secondary mt-1">Average processing time</div>
            </div>
            <div className="card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <span className="text-sm text-text-secondary">Users Served</span>
              </div>
              <div className="text-3xl font-bold text-text-primary">10K+</div>
              <div className="text-sm text-text-secondary mt-1">CVs optimized</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveDemo('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeDemo === 'overview'
                ? 'bg-accent-blue text-white'
                : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveDemo('cv-optimizer')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeDemo === 'cv-optimizer'
                ? 'bg-accent-blue text-white'
                : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
            }`}
          >
            Try CV Optimizer
          </button>
        </div>

        {/* Content */}
        {activeDemo === 'overview' && (
          <div className="space-y-6">
            {/* AI Features */}
            <div className="card">
              <h2 className="text-section-header font-bold text-text-primary mb-6">AI Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-accent-blue/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                        <p className="text-sm text-text-secondary">{feature.description}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        {feature.status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-700 space-y-2">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-text-secondary capitalize">{key}:</span>
                          <span className="text-text-primary font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="card">
              <h2 className="text-section-header font-bold text-text-primary mb-6">AI Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
                      {tech.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{tech.name}</h3>
                    <p className="text-sm text-text-secondary">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Details */}
            <div className="card">
              <h2 className="text-section-header font-bold text-text-primary mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Input Processing</h3>
                    <p className="text-text-secondary">Job descriptions and CVs are analyzed using advanced NLP to extract key requirements and skills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">AI Analysis</h3>
                    <p className="text-text-secondary">Groq AI processes the content with ultra-fast inference, identifying gaps and optimization opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Smart Recommendations</h3>
                    <p className="text-text-secondary">Personalized suggestions are generated to improve CV alignment with job requirements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Real-Time Feedback</h3>
                    <p className="text-text-secondary">Users receive instant, actionable feedback with before/after comparisons.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border-accent-blue/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Try It?</h3>
                <p className="text-text-secondary mb-6">Experience our AI-powered CV optimizer in action</p>
                <PremiumButton variant="primary" onClick={() => setActiveDemo('cv-optimizer')}>
                  Try CV Optimizer Now
                </PremiumButton>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'cv-optimizer' && (
          <div className="card">
            <div className="mb-6">
              <h2 className="text-section-header font-bold text-text-primary mb-2">AI CV Optimizer - Live Demo</h2>
              <p className="text-text-secondary">Paste a job description and your CV to get AI-powered optimization suggestions</p>
            </div>
            <CVIterator />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIShowcasePage;
