import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, Zap, CheckCircle, Clock, AlertCircle, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Brain, Megaphone, Search, LineChart } from 'lucide-react';

interface StartupStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  aiAgent: string;
  progress: number;
  metrics?: {
    label: string;
    value: string;
  }[];
}

const AIStartupTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'workflow' | 'agents' | 'analytics'>('dashboard');

  // Sample metrics
  const metrics = {
    mrr: { value: 12450, change: 12.5, trend: 'up' },
    arr: { value: 149400, change: 12.5, trend: 'up' },
    conversions: { value: 342, change: 8.3, trend: 'up' },
    cac: { value: 45.20, change: -5.2, trend: 'down' },
    ltv: { value: 1240, change: 15.8, trend: 'up' },
    churn: { value: 2.1, change: -0.8, trend: 'down' },
    activeUsers: { value: 2847, change: 18.2, trend: 'up' },
    revenue: { value: 45680, change: 22.4, trend: 'up' }
  };

  // Startup workflow steps
  const [workflowSteps] = useState<StartupStep[]>([
    {
      id: 1,
      title: 'Market Validation',
      description: 'AI agents analyzing market size, competition, and customer pain points',
      status: 'completed',
      aiAgent: 'Market Research Agent',
      progress: 100,
      metrics: [
        { label: 'Market Size', value: '$2.4B' },
        { label: 'Competitors Analyzed', value: '47' },
        { label: 'Customer Interviews', value: '23' }
      ]
    },
    {
      id: 2,
      title: 'Product-Market Fit Analysis',
      description: 'Validating product features against market demand',
      status: 'completed',
      aiAgent: 'PMF Analysis Agent',
      progress: 100,
      metrics: [
        { label: 'Fit Score', value: '87%' },
        { label: 'Feature Validation', value: '12/14' },
        { label: 'Beta Testers', value: '156' }
      ]
    },
    {
      id: 3,
      title: 'Marketing Campaign Setup',
      description: 'AI agents creating and optimizing marketing campaigns across channels',
      status: 'in-progress',
      aiAgent: 'Marketing Automation Agent',
      progress: 68,
      metrics: [
        { label: 'Active Campaigns', value: '8' },
        { label: 'Impressions', value: '124K' },
        { label: 'CTR', value: '3.2%' }
      ]
    },
    {
      id: 4,
      title: 'Conversion Optimization',
      description: 'A/B testing and optimizing conversion funnels',
      status: 'in-progress',
      aiAgent: 'Conversion Agent',
      progress: 45,
      metrics: [
        { label: 'A/B Tests Running', value: '5' },
        { label: 'Conversion Rate', value: '4.8%' },
        { label: 'Optimizations', value: '12' }
      ]
    },
    {
      id: 5,
      title: 'Revenue Tracking & Forecasting',
      description: 'Monitoring MRR, ARR, and predicting future growth',
      status: 'in-progress',
      aiAgent: 'Revenue Intelligence Agent',
      progress: 82,
      metrics: [
        { label: 'MRR Growth', value: '+12.5%' },
        { label: 'Forecast Accuracy', value: '94%' },
        { label: 'Revenue Predictions', value: '6 months' }
      ]
    },
    {
      id: 6,
      title: 'Customer Acquisition',
      description: 'Automating lead generation and nurturing pipelines',
      status: 'pending',
      aiAgent: 'Acquisition Agent',
      progress: 0,
      metrics: [
        { label: 'Leads Generated', value: '0' },
        { label: 'Pipeline Value', value: '$0' },
        { label: 'Conversion Rate', value: '0%' }
      ]
    },
    {
      id: 7,
      title: 'Retention & Churn Analysis',
      description: 'Identifying at-risk customers and improving retention',
      status: 'pending',
      aiAgent: 'Retention Agent',
      progress: 0,
      metrics: [
        { label: 'Churn Rate', value: '2.1%' },
        { label: 'Retention Score', value: 'N/A' },
        { label: 'At-Risk Customers', value: 'N/A' }
      ]
    }
  ]);

  // AI Agents status
  const aiAgents = [
    { name: 'Market Research Agent', status: 'active', tasks: 3, completed: 3, icon: Search },
    { name: 'Marketing Automation Agent', status: 'active', tasks: 8, completed: 5, icon: Megaphone },
    { name: 'Conversion Agent', status: 'active', tasks: 5, completed: 2, icon: Target },
    { name: 'Revenue Intelligence Agent', status: 'active', tasks: 4, completed: 3, icon: DollarSign },
    { name: 'Acquisition Agent', status: 'idle', tasks: 0, completed: 0, icon: Users },
    { name: 'Retention Agent', status: 'idle', tasks: 0, completed: 0, icon: Activity }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'pending': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'idle': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const MetricCard: React.FC<{ title: string; value: string | number; change: number; trend: 'up' | 'down'; icon: React.ReactNode }> = ({ title, value, value: val, change, trend, icon }) => (
    <div className="card border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
            {icon}
          </div>
          <span className="text-sm text-text-secondary font-medium">{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary">
        {typeof val === 'number' ? (val >= 1000 ? `$${(val / 1000).toFixed(1)}K` : `$${val.toLocaleString()}`) : val}
      </div>
    </div>
  );

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
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-hero-headline font-bold text-text-primary mb-4">
                  AI Startup Template — Sample Interface
                </h1>
                <p className="text-subheadline text-text-secondary mb-4">
                  Complete startup template powered by AI agents that automate market validation, marketing campaigns, conversion tracking, MRR/ARR monitoring, and all essential startup metrics.
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Sample Preview — Not Fully Functional
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">AI Agents Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'workflow', label: 'Workflow', icon: Zap },
              { id: 'agents', label: 'AI Agents', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: LineChart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeView === id
                    ? 'bg-accent-blue text-white'
                    : 'bg-gray-800/50 text-text-secondary hover:bg-gray-800 border border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Monthly Recurring Revenue"
                value={metrics.mrr.value}
                change={metrics.mrr.change}
                trend={metrics.mrr.trend}
                icon={<DollarSign className="w-5 h-5" />}
              />
              <MetricCard
                title="Annual Recurring Revenue"
                value={metrics.arr.value}
                change={metrics.arr.change}
                trend={metrics.arr.trend}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <MetricCard
                title="Conversions"
                value={metrics.conversions.value}
                change={metrics.conversions.change}
                trend={metrics.conversions.trend}
                icon={<Target className="w-5 h-5" />}
              />
              <MetricCard
                title="Active Users"
                value={metrics.activeUsers.value}
                change={metrics.activeUsers.change}
                trend={metrics.activeUsers.trend}
                icon={<Users className="w-5 h-5" />}
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Customer Acquisition Cost"
                value={metrics.cac.value}
                change={metrics.cac.change}
                trend={metrics.cac.trend}
                icon={<DollarSign className="w-5 h-5" />}
              />
              <MetricCard
                title="Lifetime Value"
                value={metrics.ltv.value}
                change={metrics.ltv.change}
                trend={metrics.ltv.trend}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <MetricCard
                title="Churn Rate"
                value={`${metrics.churn.value}%`}
                change={metrics.churn.change}
                trend={metrics.churn.trend}
                icon={<Activity className="w-5 h-5" />}
              />
              <MetricCard
                title="Total Revenue"
                value={metrics.revenue.value}
                change={metrics.revenue.change}
                trend={metrics.revenue.trend}
                icon={<DollarSign className="w-5 h-5" />}
              />
            </div>

            {/* Quick Stats */}
            <div className="card border-accent-blue/20 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Quick Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-text-secondary mb-1">Workflow Progress</div>
                  <div className="text-2xl font-bold text-text-primary">57%</div>
                  <div className="text-xs text-text-secondary mt-1">3 of 7 steps completed</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-text-secondary mb-1">AI Agents Working</div>
                  <div className="text-2xl font-bold text-text-primary">4</div>
                  <div className="text-xs text-text-secondary mt-1">2 agents idle</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-sm text-text-secondary mb-1">Tasks Completed Today</div>
                  <div className="text-2xl font-bold text-text-primary">13</div>
                  <div className="text-xs text-text-secondary mt-1">8 tasks in progress</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow View */}
        {activeView === 'workflow' && (
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="card border-accent-blue/20 p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    step.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    step.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : step.id}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                        {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{step.description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Brain className="w-4 h-4 text-accent-blue" />
                        <span>{step.aiAgent}</span>
                      </div>
                      {step.status === 'in-progress' && (
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                            <span>Progress</span>
                            <span>{step.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-accent-blue h-2 rounded-full transition-all duration-500"
                              style={{ width: `${step.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {step.metrics && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                        {step.metrics.map((metric, idx) => (
                          <div key={idx}>
                            <div className="text-xs text-text-secondary mb-1">{metric.label}</div>
                            <div className="text-lg font-bold text-text-primary">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Agents View */}
        {activeView === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAgents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div key={index} className="card border-accent-blue/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary">{agent.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(agent.status)}`}>
                          {agent.status === 'active' ? 'Active' : 'Idle'}
                        </span>
                      </div>
                    </div>
                    {agent.status === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Tasks</span>
                      <span className="text-text-primary font-medium">{agent.completed} / {agent.tasks}</span>
                    </div>
                    {agent.tasks > 0 && (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent-blue h-2 rounded-full"
                          style={{ width: `${(agent.completed / agent.tasks) * 100}%` }}
                        ></div>
                      </div>
                    )}
                    {agent.status === 'idle' && (
                      <div className="text-xs text-text-secondary mt-2">Waiting for workflow step...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <div className="card border-accent-blue/20 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Revenue Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-center text-text-secondary">
                  <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Revenue chart visualization would appear here</p>
                  <p className="text-xs mt-2">MRR, ARR, and growth trends over time</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card border-accent-blue/20 p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4">Conversion Funnel</h3>
                <div className="space-y-3">
                  {[
                    { stage: 'Visitors', value: 12450, percentage: 100 },
                    { stage: 'Sign-ups', value: 1245, percentage: 10 },
                    { stage: 'Trials', value: 498, percentage: 4 },
                    { stage: 'Paid', value: 342, percentage: 2.75 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.stage}</span>
                        <span className="text-text-primary font-medium">{item.value.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent-blue h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border-accent-blue/20 p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4">Customer Health Score</h3>
                <div className="space-y-3">
                  {[
                    { segment: 'Healthy', count: 2456, percentage: 86, color: 'green' },
                    { segment: 'At Risk', count: 284, percentage: 10, color: 'yellow' },
                    { segment: 'Churned', count: 107, percentage: 4, color: 'red' }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.segment}</span>
                        <span className="text-text-primary font-medium">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.color === 'green' ? 'bg-green-400' :
                            item.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStartupTemplatePage;
