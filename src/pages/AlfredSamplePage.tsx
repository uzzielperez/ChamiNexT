import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, Bot, Calendar, MessageSquare, LayoutKanban, Sync, BarChart3, Mic, Sparkles } from 'lucide-react';

const AlfredSamplePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'preview'>('overview');

  // Sample data
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Chat',
      description: 'Intelligent conversational interface with voice recognition capabilities for natural interaction.',
      color: 'text-cyan-400'
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Seamlessly sync with Google Calendar and iCloud for unified event management.',
      color: 'text-blue-400'
    },
    {
      icon: LayoutKanban,
      title: 'Task Management',
      description: 'Organize projects across multiple categories with visual Kanban boards.',
      color: 'text-purple-400'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track spending, monitor calendar density, and analyze productivity metrics.',
      color: 'text-green-400'
    },
    {
      icon: Sync,
      title: 'Sync Portal',
      description: 'Real-time synchronization with external calendar services and data sources.',
      color: 'text-orange-400'
    },
    {
      icon: Mic,
      title: 'Voice Recognition',
      description: 'Hands-free interaction using advanced speech-to-text technology.',
      color: 'text-pink-400'
    }
  ];

  const sampleTasks = [
    { id: '1', title: 'Quantum Field Simulation Analysis', category: 'PHYSICS', status: 'active', priority: 'high' },
    { id: '2', title: 'Quarterly Portfolio Rebalancing', category: 'FINANCE', status: 'pending', priority: 'medium' },
    { id: '3', title: 'Morning Heart Rate Variability Sync', category: 'HEALTH/LOVE', status: 'active', priority: 'medium' },
    { id: '4', title: 'Route Optimization for Supply Run', category: 'LOGISTICS', status: 'completed', priority: 'low' },
    { id: '5', title: 'Holographic Interface Sketching', category: 'CREATIVE PROJECTS', status: 'active', priority: 'high' }
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
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-hero-headline font-bold text-text-primary mb-2">
                  Alfred — AI Executive Assistant
                </h1>
                <p className="text-subheadline text-text-secondary mb-4">
                  Your intelligent executive assistant powered by AI. Manage your calendar, track spending, organize tasks with Kanban boards, and sync seamlessly with Google Calendar and iCloud.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Sample Preview — Not Fully Functional
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI-Powered
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800 text-text-secondary hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-800 text-text-secondary hover:bg-gray-700'
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="card border-accent-blue/20 hover:border-accent-blue/40 transition-colors">
                    <div className={`p-3 bg-gradient-to-br ${feature.color.replace('text-', 'from-')}/20 to-transparent rounded-lg w-fit mb-4 border ${feature.color.replace('text-', 'border-')}/30`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-text-secondary text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Sample Task Management */}
            <div className="card border-accent-blue/20 mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <LayoutKanban className="w-6 h-6 text-accent-blue" />
                Task Management Preview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['active', 'pending', 'completed'].map((status) => (
                  <div key={status} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                      {status}
                    </h3>
                    <div className="space-y-2">
                      {sampleTasks
                        .filter(task => task.status === status)
                        .map(task => (
                          <div
                            key={task.id}
                            className="bg-gray-900/50 p-3 rounded border border-gray-700 hover:border-accent-blue/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {task.category}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-text-primary">{task.title}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="card border-accent-blue/20">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Key Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    AI Chat Interface
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Natural language processing for intuitive communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Voice recognition for hands-free operation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Context-aware responses and suggestions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Calendar Management
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Google Calendar synchronization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>iCloud calendar integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Real-time event tracking and notifications</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Analytics & Insights
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Spending tracking and categorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Calendar density visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Productivity metrics and trends</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Sync className="w-5 h-5 text-orange-400" />
                    Data Synchronization
                  </h3>
                  <ul className="space-y-2 text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Multi-source data aggregation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Secure API connections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-blue mt-1">•</span>
                      <span>Automatic background sync</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'preview' && (
          <div className="card border-accent-blue/20">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Live Application Preview</h2>
              <p className="text-text-secondary">
                The Alfred AI Executive Assistant application is available as a standalone application.
                To view the full application, please navigate to the Alfred directory or deploy it separately.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700 text-center">
              <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-text-secondary mb-4">
                To run the Alfred application locally:
              </p>
              <div className="bg-black/50 rounded p-4 font-mono text-sm text-green-400 text-left max-w-2xl mx-auto">
                <div className="mb-2">cd /Users/uzzielperez/Desktop/alfred</div>
                <div>npm run dev</div>
              </div>
              <p className="text-text-secondary mt-6 text-sm">
                Or build and serve the production version:
              </p>
              <div className="bg-black/50 rounded p-4 font-mono text-sm text-green-400 text-left max-w-2xl mx-auto">
                <div className="mb-2">cd /Users/uzzielperez/Desktop/alfred</div>
                <div className="mb-2">npm run build</div>
                <div>npm run preview</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlfredSamplePage;
